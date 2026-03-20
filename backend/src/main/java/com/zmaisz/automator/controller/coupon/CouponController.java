package com.zmaisz.automator.controller.coupon;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zmaisz.automator.model.coupon.Coupon;
import com.zmaisz.automator.service.coupon.CouponQueryService;
import com.zmaisz.automator.service.coupon.DeleteCouponUseCase;
import com.zmaisz.automator.service.coupon.UploadCouponUseCase;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final UploadCouponUseCase uploadCouponUseCase;
    private final DeleteCouponUseCase deleteCouponUseCase;
    private final CouponQueryService couponQueryService;

    public CouponController(UploadCouponUseCase uploadCouponUseCase,
            DeleteCouponUseCase deleteCouponUseCase,
            CouponQueryService couponQueryService) {
        this.uploadCouponUseCase = uploadCouponUseCase;
        this.deleteCouponUseCase = deleteCouponUseCase;
        this.couponQueryService = couponQueryService;
    }

    @PostMapping
    public ResponseEntity<Void> uploadCoupon(@RequestPart("file") List<MultipartFile> files) {
        try {
            uploadCouponUseCase.execute(files);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            throw new RuntimeException("Erro Inesperado", e);
        }
    }

    @GetMapping
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.status(HttpStatus.OK).body(couponQueryService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Coupon> getCouponById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(couponQueryService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Coupon> deleteCoupon(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(deleteCouponUseCase.execute(id));
    }

}
