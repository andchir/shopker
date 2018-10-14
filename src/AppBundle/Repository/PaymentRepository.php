<?php

namespace AppBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * PaymentRepository
 */
class PaymentRepository extends DocumentRepository
{

    /**
     * @param $paymentId
     * @param int $seconds
     * @param null $date_timezone
     * @return mixed
     */
    public function findLastById($paymentId, $seconds = 30 * 60, $date_timezone = null)
    {
        if (!$date_timezone) {
            $date_timezone = date_default_timezone_get();
        }
        return $this->createQueryBuilder()
            ->field('id')->equals($paymentId)
            ->field('createdDate')->gt((new \MongoDate(time() - $seconds))->toDateTime()->setTimezone(new \DateTimeZone($date_timezone)))
            ->getQuery()
            ->execute();
    }

    /**
     * @param $email
     * @param int $seconds
     * @param null $date_timezone
     * @return mixed
     */
    public function findLastByEmail($email, $seconds = 30 * 60, $date_timezone = null)
    {
        if (!$date_timezone) {
            $date_timezone = date_default_timezone_get();
        }
        return $this->createQueryBuilder()
            ->field('email')->equals($email)
            ->field('createdDate')->gt((new \MongoDate(time() - $seconds))->toDateTime()->setTimezone(new \DateTimeZone($date_timezone)))
            ->getQuery()
            ->execute();
    }

}
