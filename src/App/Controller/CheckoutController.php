<?php

namespace App\Controller;

use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\FileDocument;
use App\MainBundle\Document\Order;
use App\MainBundle\Document\OrderContent;
use App\MainBundle\Document\Setting;
use App\MainBundle\Document\User;
use App\Events;
use App\Repository\CategoryRepository;
use App\Service\CatalogService;
use App\Service\SettingsService;
use App\Service\ShopCartService;
use App\Service\UtilsService;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use App\Form\Type\OrderType;
use Symfony\Contracts\Translation\TranslatorInterface;

class CheckoutController extends BaseController
{
    protected $catalogService;
    protected $shopCartService;
    protected $dm;

    public function __construct(ShopCartService $shopCartService, DocumentManager $dm, CatalogService $catalogService)
    {
        $this->shopCartService = $shopCartService;
        $this->dm = $dm;
        $this->catalogService = $catalogService;
    }

    /**
     * @Route(
     *     "/{_locale}/checkout",
     *     name="page_checkout_localized",
     *     methods={"GET", "POST"},
     *     requirements={"_locale": "^[a-z]{2}$"}
     * )
     * @Route("/checkout", name="page_checkout")
     * @param Request $request
     * @param UtilsService $utilsService
     * @param TranslatorInterface $translator
     * @param EventDispatcherInterface $eventDispatcher
     * @return RedirectResponse|Response
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function checkoutAction(Request $request,
        UtilsService $utilsService,
        TranslatorInterface $translator,
        EventDispatcherInterface $eventDispatcher
    )
    {
        /** @var User $user */
        $user = $this->getUser();
        /** @var SettingsService $settingsService */
        $settingsService = $this->get('app.settings');
        $settings = $settingsService->getAll();
        $checkoutFields = $this->container->hasParameter('app.checkout_fields')
            ? $this->getParameter('app.checkout_fields')
            : '';
        $paymentStatusAfterNumber = (int) $this->getParameter('app.payment_status_after_number');
        $checkoutFields = $checkoutFields ? explode(',', $checkoutFields) : [];
        $checkoutFields = array_map('trim', $checkoutFields);

        // Get currency
        $currency = $settingsService->getCurrency();

        $order = new Order();
        if ($user) {
            $order
                ->setEmail($user->getEmail())
                ->setFullName($user->getFullName())
                ->setPhone($user->getPhone())
                ->setOptions($user->getOptions());
        }

        $form = $this->createForm(OrderType::class, $order, [
            'choiceDelivery' => isset($settings[Setting::GROUP_DELIVERY])
                ? $settings[Setting::GROUP_DELIVERY]
                : [],
            'choicePayment' => isset($settings[Setting::GROUP_PAYMENT])
                ? $settings[Setting::GROUP_PAYMENT]
                : [],
            'currency' => $currency,
            'noDeliveryFirst' => true,
            'checkoutFields' => $checkoutFields
        ]);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $currencyRate = $settingsService->getCurrencyRate($currency);
            $paidStatusName = $settingsService->getOrderStatusByNumber($paymentStatusAfterNumber, true);

            /** @var Setting $delivery */
            $delivery = $form->has('deliveryName') ? $form->get('deliveryName')->getNormData() : '';
            $deliveryPrice = $delivery ? $delivery->getOption('price') : 0;

            /** @var Setting $payment */
            $payment = $form->has('paymentName') ? $form->get('paymentName')->getNormData() : '';
            $paymentName = $payment ? $payment->getOption('value') : '';

            $shoppingCart = $this->shopCartService->getShoppingCartByType();
            $shopCartContent = $shoppingCart ? $shoppingCart->getContent() : [];
            if (empty($shopCartContent)) {
                $form->addError(new FormError($translator->trans('Your cart is empty.', [], 'validators')));
            }
            $notAvailable = $this->getNotAvailableInStock();
            if (!empty($notAvailable)) {
                $form->addError(new FormError($translator->trans('These products are not available in the quantity you need in stock: %list%.', [
                    '%list%' => implode(', ', $notAvailable)
                ], 'validators')));
            }
            if ($form->isValid()) {

                $statusName = !empty($settings[Setting::GROUP_ORDER_STATUSES])
                    ? $settings[Setting::GROUP_ORDER_STATUSES][0]->getName()
                    : '';

                $order
                    ->setDeliveryPrice($deliveryPrice, $currencyRate)
                    ->setPaymentValue($paymentName)
                    ->setContentFromCart($shopCartContent, $currencyRate)
                    ->setCurrency($currency)
                    ->setCurrencyRate($currencyRate);

                // Filter options by public data keys
                $publicUserData = $form->has('options') ? array_keys($form->get('options')->all()) : [];
                $order->filterOptionsByPublic($publicUserData);
                
                // If the price is zero, then the order has already been paid.
                $order->updatePriceTotal();
                if ((float) $order->getPrice() === (float) 0 && $paidStatusName) {
                    $statusName = $paidStatusName;
                }
                
                $order->setStatus($statusName, $paidStatusName);
                
                // Save user data
                if ($user) {
                    $order->setUserId($user->getId());
                    if (!$user->getFullName()) {
                        $user->setFullName($order->getFullName());
                    }
                    if (!$user->getPhone()) {
                        $user->setPhone($order->getPhone());
                    }

                    $orderOptions = $order->getOptions();
                    $userOptions = $user->getOptions();

                    if (empty($userOptions)) {
                        $userOptions = [];
                    }
                    foreach ($orderOptions as $option) {
                        if (!$option['value']) {
                            continue;
                        }
                        $index = array_search($option['name'], array_column($userOptions, 'name'));
                        if ($index === false) {
                            $userOptions[] = $option;
                        } else {
                            $userOptions[$index]['value'] = $option['value'];
                        }
                    }
                    $user->setOptions($userOptions);
                } else {
                    $order->setUserId(0);
                }

                // Dispatch event before create
                $event = new GenericEvent($order);
                $order = $eventDispatcher->dispatch($event, Events::ORDER_BEFORE_CREATE)->getSubject();

                $this->dm->persist($order);
                $this->dm->flush();

                $this->updateFilesOwner($order);
                $this->shopCartService->clearContent($shoppingCart->getType(), true);

                // Delete temporary files
                $this->deleteTemporaryFiles(FileDocument::OWNER_ORDER_TEMPORARY);

                $request->getSession()
                    ->getFlashBag()
                    ->add('messages', 'Thanks for your order!');

                // Dispatch events
                $eventDispatcher->dispatch($event, Events::ORDER_CREATED);
                $eventDispatcher->dispatch($event, Events::ORDER_STATUS_UPDATED);

                return $this->redirectToRoute('page_checkout_success_localized', [
                    '_locale' => $request->getLocale()
                ]);
            }
        }

        return $this->render('page_checkout.html.twig', [
            'form' => $form->createView(),
            'checkoutFields' => $checkoutFields,
            'currentUri' => 'checkout'
        ]);
    }

    /**
     * @return array
     */
    public function getNotAvailableInStock()
    {
        $notAvailable = [];
        $shoppingCart = $this->shopCartService->getShoppingCartByType();
        $shopCartContent = $shoppingCart ? $shoppingCart->getContent() : [];
        /** @var ContentType $contentType */
        $contentType = null;
        $contentTypeRepository = $this->dm->getRepository(ContentType::class);

        /** @var OrderContent $content */
        foreach ($shopCartContent as $content) {
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
                $notAvailable[] = $content->getTitle();
                continue;
            }
            $stockValue = $productDocument[$stockFieldName] ?? null;
            if (is_null($stockValue)) {
                continue;
            }
            if ($content->getCount() > $stockValue) {
                $notAvailable[] = $content->getTitle();
            }
        }
        return array_unique($notAvailable);
    }

    /**
     * @param Order $order
     * @param $publicUserDataKeys
     */
    public function filterOrderOptionsUserData(Order &$order, $publicUserDataKeys)
    {
        $orderOptions = $order->getOptions();
        $orderOptions = array_filter($orderOptions, function($value) use ($publicUserDataKeys) {
            return in_array($value['name'], $publicUserDataKeys);
        });
        $order->setOptions($orderOptions);
    }

    /**
     * @param Order|null $order
     */
    public function updateFilesOwner($order)
    {
        if (!$order || !$order->getId()) {
            return;
        }
        $fileDocumentRepository = $this->getFileRepository();
        $shopCartContent = $order->getContent();
        /** @var OrderContent $content */
        foreach ($shopCartContent as $content) {
            if (empty($files = $content->getFiles())) {
                continue;
            }
            foreach ($files as $fileData) {
                /** @var FileDocument $fileDocument */
                $fileDocument = $fileDocumentRepository->find($fileData['fileId']);
                if ($fileDocument) {
                    $fileDocument
                        ->setOwnerType(FileDocument::OWNER_ORDER_PRODUCT)
                        ->setOwnerId($order->getId())
                        ->setOrder($order);
                }
            }
        }
        $this->dm->flush();
    }

    /**
     * @param ArrayCollection $shopCartContent
     * @return ArrayCollection
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     */
    public function getOrderFilesCollection($shopCartContent)
    {
        $fileDocumentRepository = $this->getFileRepository();
        $collection = new ArrayCollection();
        /** @var OrderContent $content */
        foreach ($shopCartContent as $content) {
            if (empty($files = $content->getFiles())) {
                continue;
            }
            foreach ($files as $fileData) {
                $fileDocument = $fileDocumentRepository->find($fileData['fileId']);
                if ($fileDocument) {
                    $collection->add($fileDocument);
                }
            }
        }
        return $collection;
    }

    /**
     * Delete temporary files
     * @param string|null $ownerType
     * @return bool
     */
    public function deleteTemporaryFiles($ownerType = null)
    {
        if (!$ownerType) {
            $ownerType = FileDocument::OWNER_TEMPORARY;
        }
        $fileDocumentRepository = $this->getFileRepository();

        $max_temp_files_keep_minutes = (int) $this->getParameter('app.max_temp_files_keep_minutes');
        $fileDocuments = $fileDocumentRepository->findTemporaryByTime($ownerType, $max_temp_files_keep_minutes * 60);
        /** @var FileDocument $fileDocument */
        foreach ($fileDocuments as $fileDocument) {
            $this->dm->remove($fileDocument);// File will delete by event
        }

        $this->dm->flush();

        return true;
    }

    /**
     * @return \App\Repository\FileDocumentRepository
     */
    public function getFileRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(FileDocument::class);
    }

    /**
     * @Route(
     *     "/{_locale}/checkout/success",
     *     name="page_checkout_success_localized",
     *     methods={"GET"},
     *     requirements={"_locale": "^[a-z]{2}$"}
     * )
     * @Route("/checkout/success", name="page_checkout_success", methods={"GET"})
     * @param Request $request
     * @return Response
     */
    public function checkoutSuccessAction(Request $request)
    {
        return $this->render('page_checkout_success.html.twig', [

        ]);
    }
}
