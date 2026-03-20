package com.zmaisz.automator.service.coupon;

import org.springframework.stereotype.Service;

import com.zmaisz.automator.exception.coupon.CouponNotFoundException;
import com.zmaisz.automator.model.coupon.Coupon;
import com.zmaisz.automator.repository.coupon.CouponRepository;

@Service
public class DeleteCouponUseCase {

    private final CouponRepository couponRepository;

    public DeleteCouponUseCase(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    public Coupon execute(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new CouponNotFoundException("Coupon not found"));
        couponRepository.delete(coupon);
        return coupon;
    }
}
