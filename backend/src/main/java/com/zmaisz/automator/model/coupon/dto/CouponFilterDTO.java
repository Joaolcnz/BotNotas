package com.zmaisz.automator.model.coupon.dto;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import com.zmaisz.automator.model.coupon.CouponAttachmentStatus;

public record CouponFilterDTO(
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime uploadedAtStart,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime uploadedAtEnd,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime processedAtStart,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime processedAtEnd,
        CouponAttachmentStatus status,
        String code
) {
}
