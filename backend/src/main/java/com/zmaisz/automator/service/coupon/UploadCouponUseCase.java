package com.zmaisz.automator.service.coupon;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zmaisz.automator.dto.coupon.CouponUploadDTO;
import com.zmaisz.automator.exception.user.usergrop.UserGroupDisabledException;
import com.zmaisz.automator.model.coupon.Coupon;
import com.zmaisz.automator.model.coupon.CouponAttachmentStatus;
import com.zmaisz.automator.model.user.User;
import com.zmaisz.automator.model.user.UserContext;
import com.zmaisz.automator.model.user.usergroup.UserGroup;
import com.zmaisz.automator.repository.coupon.CouponRepository;
import com.zmaisz.automator.util.frotaflex.FrotaFlexService;

@Service
public class UploadCouponUseCase {

    private final String baseStorageDir;
    private final CouponRepository couponRepository;
    private final FrotaFlexService frotaFlexService;

    public UploadCouponUseCase(
            @Value("${coupons.storage.base-dir}") String baseStorageDir,
            CouponRepository couponRepository,
            FrotaFlexService frotaFlexService) {
        this.baseStorageDir = baseStorageDir;
        this.couponRepository = couponRepository;
        this.frotaFlexService = frotaFlexService;
    }

    public List<Coupon> execute(List<MultipartFile> couponsFiles) throws Exception {
        List<CouponUploadDTO> couponsToUpload = new ArrayList<>();
        User user = UserContext.getUser();
        UserGroup group = user.getGroup();

        if (!group.isActive()) {
            throw new UserGroupDisabledException("O grupo " + group.getName() + " está desabilitado.");
        }

        Path groupDir = Path.of(baseStorageDir, String.valueOf(group.getId()));
        if (!Files.exists(groupDir)) {
            Files.createDirectories(groupDir);
        }

        for (MultipartFile multipartFile : couponsFiles) {
            String originalFilename = multipartFile.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                continue;
            }

            String code = extractCode(originalFilename);
            String extension = originalFilename.contains(".") ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String uniqueFilename = code + "__" + System.currentTimeMillis() + extension;

            Path filePath = groupDir.resolve(uniqueFilename);
            multipartFile.transferTo(filePath.toFile());

            Coupon coupon = new Coupon();
            coupon.setCode(code);
            coupon.setStatus(CouponAttachmentStatus.PENDING);
            coupon.setGroup(user.getGroup());

            CouponUploadDTO couponUploadDTO = new CouponUploadDTO(coupon, filePath.toFile());

            couponsToUpload.add(couponUploadDTO);
        }

        List<Coupon> savedCoupons = couponRepository
                .saveAll(couponsToUpload.stream().map(CouponUploadDTO::getCoupon).toList());

        for (CouponUploadDTO dto : couponsToUpload) {
            frotaFlexService.enqueueFile(group, dto.getFile().toPath(), dto.getCoupon().getId());
        }

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
