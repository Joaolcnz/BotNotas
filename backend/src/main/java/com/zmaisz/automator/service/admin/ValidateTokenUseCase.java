package com.zmaisz.automator.service.admin;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ValidateTokenUseCase {

    private final String token;

    public ValidateTokenUseCase(@Value("${admin.token}") String token) {
        this.token = token;
    }

    public boolean execute(String requestToken) {
        return token.equals(requestToken);
    }

}
