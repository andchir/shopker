<?php

namespace App\Controller\Admin;

use App\MainBundle\Document\Order;
use App\MainBundle\Document\Setting;
use App\Service\SettingsService;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class StatisticsController
 * @package App\Controller
 * @Route("/admin/statistics")
 */
class StatisticsController extends Controller
{

    /**
     * @Route("/orders/{type}", methods={"GET"})
     * @param string $type
     * @return JsonResponse
     */
    public function getStatisticsOrdersAction($type)
    {
        switch ($type) {
            case 'year':
                $output = $this->getStatisticsYear();
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
     * @return array
     */
    public function getStatisticsYear()
    {
        $output = [
            'labels' => [],
            'datasets' => []
        ];

        /** @var SettingsService $settingsService */
        $settingsService = $this->get('app.settings');

        /** @var Setting $settingDelivery */
        $settingStatuses = $settingsService->getSettingsGroup(Setting::GROUP_ORDER_STATUSES);
        $monthsNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $builder = $dm->createAggregationBuilder(Order::class);

        $builder
            ->group()
            ->field('id')->expression(
                [
                    'year' => ['$year' => '$createdDate'],
                    'month' => ['$month' => '$createdDate']
                ]
            )
            ->field('statuses')->push('$status');

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
            $output['datasets'][] = [
                'label' => $settingStatus->getName(),
                'data' => [],
                'fill' => false,
                'borderColor' => $settingStatus->getOption('color')
            ];
        }

        $builder->sort(['id.year' => 1, 'id.month' => 1]);

        $result = $builder->execute()->toArray();

        $output['labels'] = array_map(function($item) use ($monthsNames) {
            return $monthsNames[$item['_id']['month'] - 1] . ' ' . $item['_id']['year'];
        }, $result);

        foreach ($output['datasets'] as $index => &$dataset) {
            $dataset['data'] = array_map(function($data) use ($index) {
                return $data['status']['value_' . ($index + 1)];
            }, $result);
        }

        return $output;
    }

}
