<?php

namespace AppBundle\Service;

class UtilsService
{
    public function __construct()
    {

    }

    /**
     * @param $uri
     * @return array
     */
    public static function getUriArray($uri)
    {
        $output = [$uri];
        while (!empty($uri)) {
            $index = strrpos(trim($uri, '/'), '/');
            if ($index === false) {
                array_push($output, $uri);
                $uri = '';
            } else {
                $uri = substr($uri, 0, $index + 1);
                array_push($output, $uri);
            }
        }
        return array_unique($output);
    }
}
