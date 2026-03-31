package com.zmaisz.automator.repository.coupon;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.zmaisz.automator.model.coupon.Coupon;
import com.zmaisz.automator.model.coupon.CouponAttachmentStatus;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long>, JpaSpecificationExecutor<Coupon> {

    List<Coupon> findByGroupIdAndStatus(Long groupId, CouponAttachmentStatus status);

}
