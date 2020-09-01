<?php

namespace App\Controller;

use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\Setting;
use App\Service\CatalogService;
use App\Service\SettingsService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Environment as TwigEnvironment;

/**
 * @Route("/export")
 * Class CatalogExportController
 * @package App\Controller
 */
class CatalogExportController extends BaseController
{

    /** @var CatalogService */
    protected $catalogService;

    public function __construct(
        ParameterBagInterface $params,
        DocumentManager $dm,
        TranslatorInterface $translator,
        SettingsService $settingsService,
        CatalogService $catalogService
    )
    {
        parent::__construct($params, $dm, $translator);
        $this->settingsService = $settingsService;
        $this->catalogService = $catalogService;
    }

    /**
     * @Route("/{_locale}/{format}", methods={"GET"}, requirements={"_locale": "^[a-z]{2}$"}, name="catalog_export")
     * @param Request $request
     * @param TwigEnvironment $twig
     * @param $format
     * @return Response
     */
    public function catalogExportAction(Request $request, TwigEnvironment $twig, $format)
    {
        $localeDefault = $this->params->get('locale');
        $locale = $request->getLocale();

        $response = new Response();
        $response->headers->set('Content-Type', 'text/xml');

        $categories = $this->dm->getRepository(Category::class)->findActiveAll()->toArray();
        $deliverySettings = $this->dm->getRepository(Setting::class)->findBy([
            'groupName' => 'SETTINGS_DELIVERY'
        ], ['id' => 'asc']);

        $categories = array_map(function($category) use ($locale) {
            /** @var Category $category */
            return [
                'id' => $category->getId(),
                'title' => ContentType::getValueByLocale($category->toArray(), $locale, 'title'),
                'parentId' => $category->getParentId(),
                'uri' => $category->getUri()
            ];
        }, $categories);

        return $this->render($this->getTemplateName($twig, 'export', 'yandex-market', 'catalog/', $format), [
            'categories' => $categories,
            'deliverySettings' => $deliverySettings
        ], $response);
    }
}
