package com.zmaisz.automator.repository.coupon;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.zmaisz.automator.model.coupon.Coupon;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

}
