<?php

namespace AppBundle\Controller\Admin;

use AppBundle\Controller\ProductController as BaseProductController;
use AppBundle\Document\Order;
use AppBundle\Document\Setting;
use AppBundle\Service\SettingsService;
use Doctrine\ORM\Query\Expr\Base;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

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
        /** @var Setting $settingDelivery */
        $settingDelivery = $settingsService->getSetting($data['deliveryName'], Setting::GROUP_DELIVERY);
        if ($settingDelivery) {
            $deliveryPrice = $settingDelivery->getOption('price');
        }

        $item
            ->setEmail($data['email'])
            ->setFullName($data['fullName'])
            ->setPhone($data['phone'])
            ->setDeliveryName($data['deliveryName'])
            ->setDeliveryPrice($deliveryPrice)
            ->setPaymentName($data['paymentName'])
            ->setComment($data['comment'])
            ->setOptions($data['options'])
            ->setContent($data['content']);

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
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
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];
        $value = isset($data['value']) ? $data['value'] : null;

        $repository = $this->getRepository();
        $item = $repository->find($itemId);
        if(!$item){
            return $this->setError('Item not found.');
        }

        if (method_exists($item, 'set' . $fieldName)) {
            call_user_func(array($item, 'set' . $fieldName), $value);
        }

        $dm->flush();

        return new JsonResponse([
            'success' => true
        ]);
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