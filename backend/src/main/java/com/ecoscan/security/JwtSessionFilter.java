package com.ecoscan.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class JwtSessionFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        if (request instanceof HttpServletRequest httpRequest) {
            String token = extractToken(httpRequest);
            if (token != null) {
                Map<String, Object> claims = JwtUtil.validateTokenAndGetClaims(token);
                if (claims != null) {
                    JwtSession customSession = new JwtSession(token, claims, httpRequest.getServletContext());
                    JwtSessionRequestWrapper wrappedRequest = new JwtSessionRequestWrapper(httpRequest, customSession);
                    chain.doFilter(wrappedRequest, response);
                    return;
                }
            }
        }
        
        chain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7).trim();
        }
        
        String tokenHeader = request.getHeader("X-Auth-Token");
        if (tokenHeader != null && !tokenHeader.isBlank()) {
            return tokenHeader.trim();
        }
        
        return null;
    }
}
