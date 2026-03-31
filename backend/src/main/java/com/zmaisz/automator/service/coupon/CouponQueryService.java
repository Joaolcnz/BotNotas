package com.zmaisz.automator.service.coupon;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.Predicate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.zmaisz.automator.exception.coupon.CouponNotFoundException;
import com.zmaisz.automator.model.coupon.Coupon;
import com.zmaisz.automator.model.coupon.dto.CouponFilterDTO;
import com.zmaisz.automator.repository.coupon.CouponRepository;
import com.zmaisz.automator.model.user.User;
import com.zmaisz.automator.model.user.UserContext;

@Service
public class CouponQueryService {

    private final CouponRepository couponRepository;

    public CouponQueryService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    public Page<Coupon> findAll(CouponFilterDTO filter, Pageable pageable) {
        User currentUser = UserContext.getUser();
        
        Specification<Coupon> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Filtro obrigatório por grupo para isolamento de dados
            if (currentUser != null && currentUser.getGroup() != null) {
                predicates.add(cb.equal(root.get("group").get("id"), currentUser.getGroup().getId()));
            }

            if (filter != null) {
                if (filter.uploadedAtStart() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("uploadedAt"), filter.uploadedAtStart()));
                }
                if (filter.uploadedAtEnd() != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("uploadedAt"), filter.uploadedAtEnd()));
                }
                if (filter.processedAtStart() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("processedAt"), filter.processedAtStart()));
                }
                if (filter.processedAtEnd() != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("processedAt"), filter.processedAtEnd()));
                }
                if (filter.status() != null) {
                    predicates.add(cb.equal(root.get("status"), filter.status()));
                }
                if (filter.code() != null && !filter.code().isBlank()) {
                    predicates.add(cb.like(cb.lower(root.get("code")), "%" + filter.code().toLowerCase() + "%"));
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return couponRepository.findAll(spec, pageable);
    }

    public Coupon findById(Long id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new CouponNotFoundException("Coupon not found"));
    }

}
