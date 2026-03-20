package com.zmaisz.automator.controller.admin;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zmaisz.automator.service.admin.ValidateTokenUseCase;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ValidateTokenUseCase validateTokenUseCase;

    public AdminController(ValidateTokenUseCase validateTokenUseCase) {
        this.validateTokenUseCase = validateTokenUseCase;
    }

    @PostMapping("validate-token")
    public ResponseEntity<Void> validateToken(@RequestHeader("Authorization") String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authorization.substring(7);
        boolean isValid = validateTokenUseCase.execute(token);

        if (isValid) {
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
