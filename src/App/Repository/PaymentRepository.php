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
     * @param float|int $seconds
     * @param null $date_timezone
     * @return \Doctrine\ODM\MongoDB\Query\Query
     * @throws \Exception
     */
    public function findLastById($paymentId, $seconds = 30 * 60, $date_timezone = null)
    {
        if (!$date_timezone) {
            $date_timezone = date_default_timezone_get();
        }
        return $this->createQueryBuilder()
            ->field('id')->equals($paymentId)
            ->field('createdDate')->gt((new \DateTime())->setTimestamp(time() - $seconds)->setTimezone(new \DateTimeZone($date_timezone)))
            ->getQuery();
    }

    /**
     * @param $email
     * @param float|int $seconds
     * @param null $date_timezone
     * @return mixed
     * @throws \Exception
     */
    public function findLastByEmail($email, $seconds = 30 * 60, $date_timezone = null)
    {
        if (!$date_timezone) {
            $date_timezone = date_default_timezone_get();
        }
        return $this->createQueryBuilder()
            ->field('email')->equals($email)
            ->field('createdDate')->gt((new \DateTime())->setTimestamp(time() - $seconds)->setTimezone(new \DateTimeZone($date_timezone)))
            ->getQuery();
    }

}
