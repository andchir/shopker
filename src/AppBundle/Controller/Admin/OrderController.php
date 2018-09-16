<?php

namespace AppBundle\Controller\Admin;

use AppBundle\Controller\ProductController as BaseProductController;
use AppBundle\Document\Order;
use AppBundle\Document\OrderContent;
use AppBundle\Document\Setting;
use AppBundle\Service\SettingsService;
use AppBundle\Service\UtilsService;
use Doctrine\ORM\Query\Expr\Base;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * Class OrderController
 * @package AppBundle\Controller
 * @Route("/admin/orders")
 */
class OrderController extends StorageControllerAbstract
{
    /**
     * Create or update item
     * @param $data
     * @param string $itemId
     * @return JsonResponse
     */
    public function createUpdate($data, $itemId = null)
    {
        /** @var Order $item */
        $item = $this->getRepository()->find($itemId);
        if (!$item) {
            return $this->setError('Item not found.');
        }
        $deliveryPrice = !empty($data['deliveryPrice']) ? floatval($data['deliveryPrice']) : 0;
        /** @var SettingsService $settingsService */
        $settingsService = $this->get('app.settings');
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        /** @var Setting $settingDelivery */
        $settingDelivery = $settingsService->getSetting($data['deliveryName'], Setting::GROUP_DELIVERY);
        if ($settingDelivery) {
            $deliveryPrice = $settingDelivery->getOption('price');
            if (!is_null($item->getCurrencyRate())) {
                $deliveryPrice = round($deliveryPrice / $item->getCurrencyRate(), 2);
            }
        }

        $content = isset($data['_content']) ? $data['_content'] : [];

        $item
            ->setEmail($data['email'])
            ->setFullName($data['fullName'])
            ->setPhone($data['phone'])
            ->setDeliveryName($data['deliveryName'])
            ->setDeliveryPrice($deliveryPrice)
            ->setPaymentName($data['paymentName'])
            ->setComment($data['comment'])
            ->setOptions($data['options']);

        /** @var OrderContent $orderContent */
        foreach ($item->getContent() as $orderContent) {
            $index = array_search($orderContent->getUniqId(), array_column($content, 'uniqId'));
            if ($index === false) {
                $dm->remove($orderContent);
            } else {
                $orderContent
                    ->setPrice($content[$index]['price'])
                    ->setCount($content[$index]['count']);
            }
        }

        $dm->flush();

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
        if(empty($data['deliveryName'])){
            return ['success' => false, 'msg' => 'Delivery is empty.'];
        }
        if(empty($data['paymentName'])){
            return ['success' => false, 'msg' => 'Payment method is empty.'];
        }
        return ['success' => true];
    }

    /**
     * @Route("/update/{fieldName}/{itemId}")
     * @Method({"PATCH"})
     * @param Request $request
     * @param $fieldName
     * @param $itemId
     * @return JsonResponse
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
     */
    public function updateItemProperty($itemId, $fieldName, $value)
    {
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
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

            /** @var SettingsService $settingsService */
            $settingsService = $this->container->get('app.settings');

            $paymentStatusNumber = (int) $this->getParameter('payment_status_number');
            $paymentStatusAfterNumber = (int) $this->getParameter('payment_status_after_number');
            $currentOrderStatusNumber = $settingsService->getOrderStatusNumber(
                $order->getStatus()
            );
            if ($currentOrderStatusNumber === $paymentStatusAfterNumber) {
                $order->setIsPaid(true);
            }
            if ($currentOrderStatusNumber === $paymentStatusNumber) {
                $order->setIsPaid(false);
            }

            /** @var UtilsService $utilsService */
            $utilsService = $this->get('app.utils');
            /** @var TranslatorInterface $translator */
            $translator = $this->get('translator');
            $utilsService->orderSendMail(
                $this->getParameter('app_name') . ' - '
                    . $translator->trans('mail_subject.order_status_change'),
                $order
            );
        }

        $dm->flush();

        return true;
    }

    /**
     * @Route("/print/{itemId}")
     * @Method({"GET"})
     * @param Request $request
     * @param $itemId
     * @return Response
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
     * @return \AppBundle\Repository\ContentTypeRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Order::class);
    }
}