package com.zmaisz.automator.util.filter;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.zmaisz.automator.exception.admin.InvalidTokenException;
import com.zmaisz.automator.exception.admin.TokenNotFoundException;
import com.zmaisz.automator.service.admin.ValidateTokenUseCase;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Component
public class AuthRequestFilter extends OncePerRequestFilter {

    private final ValidateTokenUseCase validateTokenUseCase;

    @Autowired
    @Qualifier("handlerExceptionResolver")
    private HandlerExceptionResolver resolver;

    public AuthRequestFilter(ValidateTokenUseCase validateTokenUseCase) {
        this.validateTokenUseCase = validateTokenUseCase;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {
        try {
            String authorization = request.getHeader("Authorization");

            if (authorization == null || !authorization.startsWith("Bearer ")) {
                throw new TokenNotFoundException("Token de autenticação não fornecido");
            }

            String token = authorization.substring(7);
            boolean isValid = validateTokenUseCase.execute(token);

            if (!isValid) {
                throw new InvalidTokenException("Token de autenticação inválido ou expirado");
            }

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            resolver.resolveException(request, response, null, e);
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        if ("OPTIONS".equalsIgnoreCase(method)) {
            return true;
        }

        if (path.startsWith("/api/coupons") && ("GET".equalsIgnoreCase(method) || "POST".equalsIgnoreCase(method))) {
            return true;
        }

        if (path.equals("/api/user/login") && "POST".equalsIgnoreCase(method)) {
            return true;
        }

        return false;
    }
}
