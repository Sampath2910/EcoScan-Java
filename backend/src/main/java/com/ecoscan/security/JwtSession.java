package com.ecoscan.security;

import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpSession;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

public class JwtSession implements HttpSession {
    private final String id;
    private final Map<String, Object> attributes = new HashMap<>();
    private final ServletContext servletContext;
    private boolean invalidated = false;

    public JwtSession(String id, Map<String, Object> claims, ServletContext servletContext) {
        this.id = id;
        if (claims != null) {
            this.attributes.putAll(claims);
        }
        this.servletContext = servletContext;
    }

    @Override
    public long getCreationTime() {
        return 0;
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public long getLastAccessedTime() {
        return 0;
    }

    @Override
    public ServletContext getServletContext() {
        return servletContext;
    }

    @Override
    public void setMaxInactiveInterval(int interval) {
        // No-op for JWT stateless session
    }

    @Override
    public int getMaxInactiveInterval() {
        return 0;
    }

    @Override
    public Object getAttribute(String name) {
        if (invalidated) {
            throw new IllegalStateException("Session already invalidated");
        }
        return attributes.get(name);
    }

    @Override
    public Enumeration<String> getAttributeNames() {
        if (invalidated) {
            throw new IllegalStateException("Session already invalidated");
        }
        return Collections.enumeration(attributes.keySet());
    }

    @Override
    public void setAttribute(String name, Object value) {
        if (invalidated) {
            throw new IllegalStateException("Session already invalidated");
        }
        attributes.put(name, value);
    }

    @Override
    public void removeAttribute(String name) {
        if (invalidated) {
            throw new IllegalStateException("Session already invalidated");
        }
        attributes.remove(name);
    }

    @Override
    public void invalidate() {
        invalidated = true;
        attributes.clear();
    }

    @Override
    public boolean isNew() {
        return false;
    }
}
