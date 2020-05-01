<?php

namespace App\Controller\Admin;

use App\Events;
use App\MainBundle\Document\Order;
use App\MainBundle\Document\OrderContent;
use App\MainBundle\Document\Setting;
use App\Service\SettingsService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ORM\Query\Expr\Base;
use Doctrine\Persistence\ObjectRepository;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\Translation\TranslatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

/**
 * Class OrderController
 * @package App\Controller
 * @Route("/admin/orders")
 */
class OrderController extends StorageControllerAbstract
{

    /** @var EventDispatcherInterface */
    protected $eventDispatcher;
    /** @var SettingsService */
    protected $settingsService;

    public function __construct(
        ParameterBagInterface $params,
        DocumentManager $dm,
        TranslatorInterface $translator,
        EventDispatcherInterface $eventDispatcher,
        SettingsService $settingsService
    )
    {
        parent::__construct($params, $dm, $translator);
        $this->eventDispatcher = $eventDispatcher;
        $this->settingsService = $settingsService;
    }
    
    /**
     * Create or update item
     * @param $data
     * @param string $itemId
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function createUpdate($data, $itemId = null)
    {
        /** @var Order $item */
        $item = $this->getRepository()->find($itemId);
        if (!$item) {
            return $this->setError('Item not found.');
        }
        $deliveryPrice = !empty($data['deliveryPrice']) ? floatval($data['deliveryPrice']) : 0;
        /** @var Setting $settingDelivery */
        $settingDelivery = $this->settingsService->getSetting($data['deliveryName'], Setting::GROUP_DELIVERY);
        if ($settingDelivery) {
            $deliveryPrice = $settingDelivery->getOption('price');
            if (!is_null($item->getCurrencyRate())) {
                $deliveryPrice = round($deliveryPrice / $item->getCurrencyRate(), 2);
            }
        }
        $paymentValue = '';
        $settingPayment = $this->settingsService->getSetting($data['paymentName'], Setting::GROUP_PAYMENT);
        if ($settingPayment) {
            /** @var Setting $settingPayment */
            $paymentValue = $settingPayment->getOption('value');
        }

        $content = isset($data['content']) ? $data['content'] : [];

        $item
            ->setEmail($data['email'])
            ->setFullName($data['fullName'])
            ->setPhone($data['phone'])
            ->setDeliveryName($data['deliveryName'])
            ->setDeliveryPrice($deliveryPrice)
            ->setPaymentName($data['paymentName'])
            ->setPaymentValue($paymentValue)
            ->setComment($data['comment'])
            ->setOptions($data['options']);

        /** @var OrderContent $orderContent */
        foreach ($item->getContent() as $orderContent) {
            $index = array_search($orderContent->getUniqId(), array_column($content, 'uniqId'));
            if ($index === false) {
                $this->dm->remove($orderContent);
            } else {
                $orderContent
                    ->setPrice($content[$index]['price'])
                    ->setCount($content[$index]['count']);
            }
        }

        $this->dm->flush();

        return new JsonResponse([
            'success' => true
        ]);
    }

    /**
     * @param $data
     * @param int $itemId
     * @return array
     */
    public function validateData($data, $itemId = null)
    {
        if(empty($data)){
            return ['success' => false, 'msg' => 'Data is empty.'];
        }
        return ['success' => true];
    }

    /**
     * @Route("/update/{fieldName}/{itemId}", methods={"PATCH"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @param $fieldName
     * @param $itemId
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function updateItemPropertyAction(Request $request, $fieldName, $itemId)
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];
        $value = isset($data['value']) ? $data['value'] : null;

        if (!$this->updateItemProperty($itemId, $fieldName, $value)) {
            return $this->setError('Item not found.');
        }

        return new JsonResponse([
            'success' => true
        ]);
    }

    /**
     * @param $itemId
     * @param $fieldName
     * @param $value
     * @return bool
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function updateItemProperty($itemId, $fieldName, $value)
    {
        $repository = $this->getRepository();
        /** @var Order $order */
        $order = $repository->find($itemId);
        if(!$order){
            return false;
        }
        $previousValue = '';

        if (method_exists($order, 'set' . $fieldName)) {
            $previousValue = call_user_func(array($order, 'get' . $fieldName), $value);
            call_user_func(array($order, 'set' . $fieldName), $value);
        }

        // Send email for change order status
        if ($fieldName == 'status') {

            $paymentStatusNumber = (int) $this->params->get('app.payment_status_number');
            $paymentStatusAfterNumber = (int) $this->params->get('app.payment_status_after_number');
            $currentOrderStatusNumber = $this->settingsService->getOrderStatusNumber(
                $order->getStatus()
            );
            if ($currentOrderStatusNumber === $paymentStatusAfterNumber) {
                $order->setIsPaid(true);
            }
            if ($currentOrderStatusNumber === $paymentStatusNumber) {
                $order->setIsPaid(false);
            }

            $this->dm->flush();
            
            $event = new GenericEvent($order);
            $this->eventDispatcher->dispatch($event, Events::ORDER_STATUS_UPDATED);
        }

        return true;
    }

    /**
     * @Route("/print/{itemId}", methods={"GET"})
     * @param Request $request
     * @param $itemId
     * @return Response
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     */
    public function printPageAction(Request $request, $itemId)
    {
        $repository = $this->getRepository();
        $item = $repository->find($itemId);
        if(!$item){
            throw $this->createNotFoundException('Page not found.');
        }

        return $this->render('admin/order_print.html.twig', [
            'order' => $item
        ]);
    }

    /**
     * @return \App\Repository\ContentTypeRepository|ObjectRepository
     */
    public function getRepository()
    {
        return $this->dm->getRepository(Order::class);
    }
}