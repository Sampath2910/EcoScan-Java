package com.ecoscan.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpSession;

public class JwtSessionRequestWrapper extends HttpServletRequestWrapper {
    private final HttpSession customSession;

    public JwtSessionRequestWrapper(HttpServletRequest request, HttpSession customSession) {
        super(request);
        this.customSession = customSession;
    }

    @Override
    public HttpSession getSession(boolean create) {
        if (customSession != null) {
            return customSession;
        }
        return super.getSession(create);
    }

    @Override
    public HttpSession getSession() {
        if (customSession != null) {
            return customSession;
        }
        return super.getSession();
    }
}
