<?php

namespace App\Controller;

use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\Setting;
use App\Service\CatalogService;
use App\Service\SettingsService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
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
     * @throws \Exception
     */
    public function catalogExportAction(Request $request, TwigEnvironment $twig, FilesystemAdapter $fileCache, $format)
    {
        $localeDefault = $this->params->get('locale');
        $locale = $request->getLocale();
        $templatePath = $this->getTemplateName($twig, 'export', '', 'catalog/', $format);
        $login = $this->params->has('app.catalog_export_login')
            ? $this->params->get('app.catalog_export_login')
            : '';
        $password = $this->params->has('app.catalog_export_password')
            ? $this->params->get('app.catalog_export_password')
            : '';
        $productsCollectionName = $this->params->has('app.catalog_export_collection')
            ? $this->params->get('app.catalog_export_collection')
            : '';
        $productsLimit = $this->params->has('app.catalog_export_limit')
            ? $this->params->get('app.catalog_export_limit')
            : 0;
        $productsOrderBy = $this->params->has('app.catalog_export_orderby')
            ? $this->params->get('app.catalog_export_orderby')
            : '_id';
        $deliveryDays = $this->params->has('app.catalog_export_delivery_days')
            ? $this->params->get('app.catalog_export_delivery_days')
            : 5;
        if (!$twig->getLoader()->exists($templatePath)) {
            throw $this->createNotFoundException('Page not found.');
        }
        if ($login && $password
            && (
                !isset($_SERVER['PHP_AUTH_USER'])
                || $_SERVER['PHP_AUTH_USER'] !== $login
                || $_SERVER['PHP_AUTH_PW'] !== $password
            )
            && !$this->isGranted('ROLE_ADMIN')) {
                throw $this->createAccessDeniedException();
        }

        // Get from cache if exists
        $cacheKey = "catalog_export_{$locale}_{$format}";
        $cacheItem = $fileCache->getItem($cacheKey);
        if ($cacheItem && $cacheItem->isHit()) {
            return $this->getResponse($format, $cacheItem->get());
        }

        // Get delivery options
        $deliverySettings = $this->dm->getRepository(Setting::class)->findBy([
            'groupName' => 'SETTINGS_DELIVERY'
        ], ['id' => 'asc']);

        // Get categories
        $categories = $this->dm->getRepository(Category::class)->findActiveAll()->toArray();
        $categories = array_map(function($category) use ($locale) {
            /** @var Category $category */
            return [
                'id' => $category->getId(),
                'title' => ContentType::getValueByLocale($category->toArray(), $locale, 'title'),
                'parentId' => $category->getParentId(),
                'contentTypeName' => $category->getContentTypeName(),
                'uri' => $category->getUri()
            ];
        }, $categories);

        // Get products
        if ($productsCollectionName) {
            $collection = $this->catalogService->getCollection($productsCollectionName);
            $criteria = [
                'isActive' => true
            ];
            $queryOptions = [
                'sort' => [$productsOrderBy => 1],
                'skip' => 0,
                'cursor' => []
            ];
            if ($productsLimit) {
                $queryOptions['limit'] = $productsLimit;
            }
            $items = $collection->find($criteria, $queryOptions)->toArray();
        } else {
            $items = [];
        }

        // Render output
        $pageContent = $this->renderView($templatePath, [
            'categories' => $categories,
            'deliverySettings' => $deliverySettings,
            'deliveryDays' => $deliveryDays,
            'items' => $items
        ]);

        // Caching
        $cacheItem->set($pageContent);
        $cacheItem->expiresAt(new \DateTime('+12 hours'));
        $fileCache->save($cacheItem);

        return $this->getResponse($format, $pageContent);
    }

    /**
     * @param string $format
     * @param string $pageContent
     * @return Response
     */
    public function getResponse($format, $pageContent)
    {
        $response = new Response();
        if ($format === 'xml') {
            $response->headers->set('Content-Type', 'text/xml');
        }
        else if ($format === 'json') {
            $response->headers->set('Content-Type', 'application/json');
        }
        $response->setContent($pageContent);
        return $response;
    }
}
