<?php

namespace App\Repository;

use Andchir\OmnipayBundle\Repository\PaymentRepositoryInterface;
use Doctrine\ODM\MongoDB\Repository\DocumentRepository;

/**
 * PaymentRepository
 */
class PaymentRepository extends DocumentRepository implements PaymentRepositoryInterface
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
            ->field('createdDate')->gt((new \DateTime())->setTimestamp(time() - $seconds)->setTimezone(new \DateTimeZone($date_timezone)))
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
            ->field('createdDate')->gt((new \DateTime())->setTimestamp(time() - $seconds)->setTimezone(new \DateTimeZone($date_timezone)))
            ->getQuery()
            ->execute();
    }

}
