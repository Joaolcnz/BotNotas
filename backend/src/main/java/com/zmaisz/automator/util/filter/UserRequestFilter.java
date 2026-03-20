package com.zmaisz.automator.util.filter;

import java.io.IOException;

import org.hibernate.Session;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.zmaisz.automator.model.user.User;
import com.zmaisz.automator.model.user.UserContext;
import com.zmaisz.automator.repository.user.UserRepository;

import jakarta.persistence.EntityManager;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class UserRequestFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final EntityManager entityManager;

    public UserRequestFilter(UserRepository userRepository, EntityManager entityManager) {
        this.userRepository = userRepository;
        this.entityManager = entityManager;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws IOException, ServletException {

        try {
            String userIdHeader = request.getHeader("X-USER-ID");
            if (userIdHeader == null || userIdHeader.isEmpty()) {
                throw new ServletException("User ID is missing");
            }

            Long userId = Long.parseLong(userIdHeader);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ServletException("User not found"));

            UserContext.setUser(user);

            Session session = entityManager.unwrap(Session.class);
            session.enableFilter("groupFilter")
                    .setParameter("group", user.getGroup().getId());

            filterChain.doFilter(request, response);
        } finally {
            UserContext.clear();
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return "OPTIONS".equalsIgnoreCase(request.getMethod())
                || !path.startsWith("/api")
                || path.startsWith("/api/group")
                || path.startsWith("/api/user")
                || path.startsWith("/api/admin");
    }
}
