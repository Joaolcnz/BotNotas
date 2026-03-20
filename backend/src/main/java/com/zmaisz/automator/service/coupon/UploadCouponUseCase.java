package com.zmaisz.automator.service.coupon;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zmaisz.automator.dto.coupon.CouponUploadDTO;
import com.zmaisz.automator.model.coupon.Coupon;
import com.zmaisz.automator.model.coupon.CouponAttachmentStatus;
import com.zmaisz.automator.model.user.User;
import com.zmaisz.automator.model.user.UserContext;
import com.zmaisz.automator.repository.coupon.CouponRepository;
import com.zmaisz.automator.util.frotaflex.FrotaFlexService;

@Service
public class UploadCouponUseCase {

    private final CouponRepository couponRepository;
    private final FrotaFlexService frotaFlexService;

    public UploadCouponUseCase(CouponRepository couponRepository, FrotaFlexService frotaFlexService) {
        this.couponRepository = couponRepository;
        this.frotaFlexService = frotaFlexService;
    }

    public List<Coupon> execute(List<MultipartFile> couponsFiles) throws Exception {
        List<CouponUploadDTO> couponsToUpload = new ArrayList<>();
        User user = UserContext.getUser();

        Path tempDir = Files.createTempDirectory("coupons-upload-");

        for (MultipartFile multipartFile : couponsFiles) {
            String originalFilename = multipartFile.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                continue;
            }

            Path filePath = tempDir.resolve(originalFilename);
            multipartFile.transferTo(filePath.toFile());

            String code = extractCode(originalFilename);

            Coupon coupon = new Coupon();
            coupon.setCode(code);
            coupon.setStatus(CouponAttachmentStatus.PENDING);
            coupon.setGroup(user.getGroup());

            CouponUploadDTO couponUploadDTO = new CouponUploadDTO(coupon, filePath.toFile());

            couponsToUpload.add(couponUploadDTO);
        }

        List<Coupon> savedCoupons = couponRepository
                .saveAll(couponsToUpload.stream().map(CouponUploadDTO::getCoupon).toList());

        frotaFlexService.uploadCoupons(couponsToUpload, user.getGroup());

        return savedCoupons;
    }

    private String extractCode(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            return filename;
        }
        return filename.substring(0, lastDotIndex);
    }

}
