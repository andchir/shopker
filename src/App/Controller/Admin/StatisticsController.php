<?php

namespace App\Controller\Admin;

use App\MainBundle\Document\Order;
use App\MainBundle\Document\Setting;
use App\Repository\OrderRepository;
use App\Service\SettingsService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * Class StatisticsController
 * @package App\Controller
 * @Route("/admin/statistics")
 */
class StatisticsController extends BaseController
{
    
    /** @var SettingsService */
    protected $settingsService;

    public function __construct(
        ParameterBagInterface $params,
        DocumentManager $dm,
        TranslatorInterface $translator,
        SettingsService $settingsService
    )
    {
        parent::__construct($params, $dm, $translator);
        $this->settingsService = $settingsService;
    }
    
    /**
     * @Route("/orders", methods={"GET"})
     * @param Request $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function getStatisticsOrdersAction(Request $request)
    {
        $type = 'year';
        $date_timezone = date_default_timezone_get();
        $where = [];
        $dateFrom = $request->get('dateFrom');
        $dateTo = $request->get('dateTo');
        $datePattern = "/\d{4}-\d{2}-\d{2}/";
        if ($dateFrom && preg_match($datePattern, $dateFrom)) {
            $where['createdDate'] = [
                '$gte' => new \DateTime($dateFrom, new \DateTimeZone($date_timezone))
            ];
        }
        if ($dateTo && preg_match($datePattern, $dateTo)) {
            if (!isset($where['createdDate'])) {
                $where['createdDate'] = [];
            }
            $dateTime = new \DateTime($dateTo, new \DateTimeZone($date_timezone));
            $dateTime->modify('+1 day');
            $where['createdDate']['$lt'] = $dateTime;
        }

        if (isset($where['createdDate'])
            && !empty($where['createdDate']['$gte'])
            && !empty($where['createdDate']['$lt'])) {
                $diffDays = $where['createdDate']['$gte']->diff($where['createdDate']['$lt'])->days;
                if ($diffDays <= 60) {
                    $type = 'month';
                }
        }

        switch ($type) {
            case 'year':
                $output = $this->getStatisticsYear($where);
                break;
            case 'month':
                $output = $this->getStatisticsMonth($where);
                break;
            default:
                $output = [
                    'labels' => [],
                    'datasets' => []
                ];
        }
        return $this->json($output);
    }

    /**
     * @param array $where
     * @return array
     */
    public function getStatisticsYear($where = [])
    {
        $output = [
            'labels' => [],
            'datasets' => []
        ];
        
        $monthsNames = explode(',', $this->translator->trans('months_short'));
        $settingStatuses = $this->getSettingsStatuses();

        $builder = $this->createAggregationBuilder($where);

        $builder
            ->group()
            ->field('id')->expression(
                [
                    'year' => ['$year' => '$createdDate'],
                    'month' => ['$month' => '$createdDate']
                ]
            )
            ->field('statuses')->push('$status');

        $this->projectAggregateStatus($builder, $settingStatuses);
        $builder->sort(['id.year' => 1, 'id.month' => 1]);

        $result = $builder->execute()->toArray();

        $output['labels'] = array_map(function($item) use ($monthsNames) {
            return $monthsNames[$item['_id']['month'] - 1] . ' ' . $item['_id']['year'];
        }, $result);

        /** @var Setting $settingStatus */
        foreach ($settingStatuses as $index => $settingStatus) {
            $output['datasets'][] = [
                'label' => $settingStatus->getName(),
                'data' => array_map(function($data) use ($index) {
                    return $data['status']['value_' . ($index + 1)];
                }, $result),
                'fill' => false,
                'borderColor' => $settingStatus->getOption('color')
            ];
        }

        return $output;
    }

    /**
     * @param array $where
     * @return array
     */
    public function getStatisticsMonth($where = [])
    {
        $output = [
            'labels' => [],
            'datasets' => []
        ];
        
        $monthsNames = explode(',', $this->translator->trans('months_short'));
        $settingStatuses = $this->getSettingsStatuses();

        $builder = $this->createAggregationBuilder($where);

        $builder
            ->group()
            ->field('id')->expression(
                [
                    'month' => ['$month' => '$createdDate'],
                    'dayOfMonth' => ['$dayOfMonth' => '$createdDate']
                ]
            )
            ->field('statuses')->push('$status');

        $this->projectAggregateStatus($builder, $settingStatuses);
        $builder->sort(['id.month' => 1, 'id.dayOfMonth' => 1]);

        $result = $builder->execute()->toArray();

        $output['labels'] = array_map(function($item) use ($monthsNames) {
            return $monthsNames[$item['_id']['month'] - 1] . ', ' . $item['_id']['dayOfMonth'];
        }, $result);

        /** @var Setting $settingStatus */
        foreach ($settingStatuses as $index => $settingStatus) {
            $output['datasets'][] = [
                'label' => $settingStatus->getName(),
                'data' => array_map(function($data) use ($index) {
                    return $data['status']['value_' . ($index + 1)];
                }, $result),
                'fill' => false,
                'borderColor' => $settingStatus->getOption('color')
            ];
        }

        return $output;
    }

    /**
     * @param array $where
     * @return \Doctrine\ODM\MongoDB\Aggregation\Builder
     */
    public function createAggregationBuilder($where = [])
    {
        /** @var OrderRepository $repository */
        $repository = $this->dm->getRepository(Order::class);
        $builder = $this->dm->createAggregationBuilder(Order::class);

        if (!empty($where)) {
            $match = $builder->match();
            $repository->applyQueryWhere($match, $where);
        }
        return $builder;
    }

    /**
     * @param \Doctrine\ODM\MongoDB\Aggregation\Builder $builder
     * @param Setting[] $settingStatuses
     */
    public function projectAggregateStatus(&$builder, $settingStatuses)
    {
        $project = $builder->project();

        /** @var Setting $settingStatus */
        foreach ($settingStatuses as $index => $settingStatus) {
            $project
                ->field('status.value_' . ($index + 1))
                ->expression(
                    [
                        '$size' => ['$filter' => [
                            'input' => '$statuses',
                            'as' => 's',
                            'cond' => [
                                '$eq' => ['$$s', $settingStatus->getName()]
                            ]
                        ]]
                    ]
                );
        }
    }

    /**
     * @return Setting[]
     */
    public function getSettingsStatuses()
    {
        return $this->settingsService->getSettingsGroup(Setting::GROUP_ORDER_STATUSES);
    }
}
