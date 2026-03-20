package com.zmaisz.automator.dto.coupon;

import java.io.File;

import com.zmaisz.automator.model.coupon.Coupon;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponUploadDTO {

    private Coupon coupon;
    private File file;

}
