package com.zmaisz.automator.service.coupon;

import java.util.List;

import org.springframework.stereotype.Service;

import com.zmaisz.automator.exception.coupon.CouponNotFoundException;
import com.zmaisz.automator.model.coupon.Coupon;
import com.zmaisz.automator.repository.coupon.CouponRepository;

@Service
public class CouponQueryService {

    private final CouponRepository couponRepository;

    public CouponQueryService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    public List<Coupon> findAll() {
        return couponRepository.findAll();
    }

    public Coupon findById(Long id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new CouponNotFoundException("Coupon not found"));
    }

}
