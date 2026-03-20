package com.zmaisz.automator.util.frotaflex;

import java.util.List;

import org.springframework.scheduling.annotation.Async;

import com.zmaisz.automator.dto.coupon.CouponUploadDTO;

import com.zmaisz.automator.model.user.usergroup.UserGroup;

public interface FrotaFlexService {

    @Async("taskVaadinAutomatorExecutor")
    void uploadCoupons(List<CouponUploadDTO> coupons, UserGroup group);

}
