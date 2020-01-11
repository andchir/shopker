<?php

namespace App\EventSubscriber;

use App\Service\UtilsService;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class LocaleSubscriber implements EventSubscriberInterface
{
    private $defaultLocale;
    private $localeList;

    public function __construct($defaultLocale = 'en', $localeList = '')
    {
        $this->defaultLocale = is_string($defaultLocale) ? $defaultLocale : 'en';
        $this->localeList = is_string($localeList) ? $localeList : '';
    }

    public function onKernelRequest(RequestEvent $event)
    {
        $request = $event->getRequest();
        $requestUri = $request->getRequestUri();
        if ($locale = $request->attributes->get('_locale')) {
            if ($request->isMethod('GET')) {
                $localeList = UtilsService::stringToArray($this->localeList);
                if (!empty($localeList) && ($locale === $this->defaultLocale) || !in_array($locale, $localeList)) {
                    if (substr($requestUri, 3, 1) === '/') {
                        $newUri = substr($requestUri, 3);
                        $response = new RedirectResponse($newUri, RedirectResponse::HTTP_MOVED_PERMANENTLY);
                        $response->send();
                        exit;
                    }
                }
            }
        } else {
            $locale = $this->defaultLocale;
        }
        if ($locale === $this->defaultLocale) {
            $localeUrlPrefix = '/';
            $currentUri = substr($requestUri, 1);
        } else {
            $localeUrlPrefix = "/{$locale}/";
            $currentUri = str_replace($localeUrlPrefix, '', $requestUri);
        }
        $request->attributes->set('locale_url_prefix', $localeUrlPrefix);
        $request->attributes->set('current_uri', $currentUri);
    }

    public static function getSubscribedEvents()
    {
        return array(
            // must be registered before (i.e. with a higher priority than) the default Locale listener
            KernelEvents::REQUEST => array(array('onKernelRequest', 20)),
        );
    }
}
