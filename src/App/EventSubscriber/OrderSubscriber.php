<?php

namespace App\EventSubscriber;

use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\Order;
use App\Events;
use App\MainBundle\Document\OrderContent;
use App\Service\CatalogService;
use App\Service\SettingsService;
use App\Service\UtilsService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Contracts\Translation\TranslatorInterface;

class OrderSubscriber implements EventSubscriberInterface
{
    
    /** @var CatalogService */
    protected $catalogService;
    /** @var SettingsService */
    protected $settingsService;
    /** @var UtilsService */
    protected $utilsService;
    /** @var TranslatorInterface */
    protected $translator;
    /** @var ParameterBagInterface */
    protected $params;
    /** @var DocumentManager */
    protected $dm;

    public function __construct(
        ContainerInterface $container,
        CatalogService $catalogService,
        SettingsService $settingsService,
        UtilsService $utilsService,
        TranslatorInterface $translator,
        ParameterBagInterface $params,
        DocumentManager $dm
    ) {
        $this->catalogService = $catalogService;
        $this->settingsService = $settingsService;
        $this->utilsService = $utilsService;
        $this->translator = $translator;
        $this->params = $params;
        $this->dm = $dm;
    }

    public static function getSubscribedEvents()
    {
        return [
            Events::ORDER_BEFORE_CREATE => 'onOrderBeforeCreate',
            Events::ORDER_CREATED => 'onOrderCreated',
            Events::ORDER_STATUS_UPDATED => 'onOrderStatusUpdated'
        ];
    }

    public function onOrderBeforeCreate(GenericEvent $event)
    {
        /** @var Order $order */
        $order = $event->getSubject();

        // Do something...

    }

    public function onOrderCreated(GenericEvent $event)
    {
        /** @var Order $order */
        $order = $event->getSubject();

        // Do something...

    }

    /**
     * @param GenericEvent $event
     * @throws \Twig\Error\RuntimeError
     * @throws \Twig\Error\SyntaxError
     */
    public function onOrderStatusUpdated(GenericEvent $event)
    {
        /** @var Order $order */
        $order = $event->getSubject();

        $isOrderNew = $order->getCreatedDate()->getTimestamp() === $order->getUpdatedDate()->getTimestamp();
        $emailSubject = $isOrderNew
            ? $this->params->get('app.name') . ' - ' . $this->translator->trans('mail_subject.new_order')
            : $this->params->get('app.name') . ' - ' . $this->translator->trans('mail_subject.order_status_change');

        $this->utilsService->orderSendMail(
            $emailSubject,
            $order
        );

        // Sending a notification to the admin
        if ($isOrderNew || $order->getIsPaid()) {
            $this->utilsService->orderSendMail(
                $emailSubject,
                $order,
                'adminNotify',
                $this->params->get('app.admin_email')
            );
        }

        // Update products stock value
        $this->updateProductsStock($order);
    }

    /**
     * @param Order $order
     */
    public function updateProductsStock(Order $order)
    {
        $statusNumberNew = (int) $this->params->get('app.payment_status_number');
        $statusNumberCanceled = (int) $this->params->get('app.order_status_canceled_number');
        $currentOrderStatusNumber = $this->settingsService->getOrderStatusNumber(
            $order->getStatus()
        );
        if (!in_array($currentOrderStatusNumber, [$statusNumberNew, $statusNumberCanceled])) {
            return;
        }

        $isReduce = true;// Reduce stock
        if ($currentOrderStatusNumber === $statusNumberCanceled) {
            $isReduce = false;
        }

        /** @var ContentType $contentType */
        $contentType = null;
        $contentTypeRepository = $this->dm->getRepository(ContentType::class);
        $orderContent = $order->getContent();

        /** @var OrderContent $content */
        foreach ($orderContent as $content) {
            if (!$contentType || $contentType->getName() !== $content->getContentTypeName()) {
                $contentType = $contentTypeRepository->findOneBy(['name' => $content->getContentTypeName()]);
            }
            $stockFieldName = $contentType->getFieldByChunkName('stock');
            if (!$stockFieldName || !($collection = $this->catalogService->getCollection($contentType->getCollection()))) {
                continue;
            }
            $productDocument = $collection->findOne([
                '_id' => $content->getId(),
                'isActive' => true
            ]);
            if (!$productDocument) {
                continue;
            }
            $stockValue = $productDocument[$stockFieldName] ?? null;
            if (is_null($stockValue)) {
                continue;
            }
            $newValue = $isReduce
                ? $stockValue - $content->getCount()
                : $stockValue + $content->getCount();
            $collection->updateOne(
                [
                    '_id' => $productDocument['_id']
                ],
                [
                    '$set' => [$stockFieldName => max(0, $newValue)]
                ]
            );
        }
    }
}

