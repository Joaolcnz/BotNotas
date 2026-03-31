package com.zmaisz.automator.controller.coupon;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import com.zmaisz.automator.model.coupon.dto.CouponFilterDTO;
import com.zmaisz.automator.service.coupon.CouponQueryService;
import com.zmaisz.automator.service.coupon.DeleteCouponUseCase;
import com.zmaisz.automator.service.coupon.GetExecutorStatusUseCase;
import com.zmaisz.automator.service.coupon.PauseExecutorUseCase;
import com.zmaisz.automator.service.coupon.ResumeExecutorUseCase;
import com.zmaisz.automator.service.coupon.UploadCouponUseCase;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final UploadCouponUseCase uploadCouponUseCase;
    private final DeleteCouponUseCase deleteCouponUseCase;
    private final CouponQueryService couponQueryService;
    private final PauseExecutorUseCase pauseExecutorUseCase;
    private final ResumeExecutorUseCase resumeExecutorUseCase;
    private final GetExecutorStatusUseCase getExecutorStatusUseCase;

    public CouponController(UploadCouponUseCase uploadCouponUseCase,
            DeleteCouponUseCase deleteCouponUseCase,
            CouponQueryService couponQueryService,
            PauseExecutorUseCase pauseExecutorUseCase,
            ResumeExecutorUseCase resumeExecutorUseCase,
            GetExecutorStatusUseCase getExecutorStatusUseCase) {
        this.uploadCouponUseCase = uploadCouponUseCase;
        this.deleteCouponUseCase = deleteCouponUseCase;
        this.couponQueryService = couponQueryService;
        this.pauseExecutorUseCase = pauseExecutorUseCase;
        this.resumeExecutorUseCase = resumeExecutorUseCase;
        this.getExecutorStatusUseCase = getExecutorStatusUseCase;
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
    public ResponseEntity<Page<Coupon>> getAllCoupons(CouponFilterDTO filter, Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(couponQueryService.findAll(filter, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Coupon> getCouponById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(couponQueryService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Coupon> deleteCoupon(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(deleteCouponUseCase.execute(id));
    }

    @PostMapping("/executor/pause")
    public ResponseEntity<Void> pauseExecutor() {
        pauseExecutorUseCase.execute();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/executor/resume")
    public ResponseEntity<Void> resumeExecutor() {
        resumeExecutorUseCase.execute();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/executor/status")
    public ResponseEntity<Map<String, String>> getExecutorStatus() {
        String status = getExecutorStatusUseCase.execute();
        return ResponseEntity.ok(Map.of("status", status));
    }

}
