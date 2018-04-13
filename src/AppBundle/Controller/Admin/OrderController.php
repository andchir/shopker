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
        /** @var Order $order */
        $order = $this->getRepository()->find($itemId);
        if (!$order) {
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

        $order
            ->setEmail($data['email'])
            ->setFullName($data['fullName'])
            ->setAddress($data['address'])
            ->setPhone($data['phone'])
            ->setDeliveryName($data['deliveryName'])
            ->setDeliveryPrice($deliveryPrice)
            ->setPaymentName($data['paymentName'])
            ->setComment($data['comment'])
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
     * @return \AppBundle\Repository\ContentTypeRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Order::class);
    }
}