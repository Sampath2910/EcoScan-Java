package com.ecoscan.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class JwtUtil {
    private static final String SECRET;
    private static final ObjectMapper objectMapper = new ObjectMapper();

    static {
        String envSecret = System.getenv("JWT_SECRET");
        if (envSecret != null && envSecret.trim().length() >= 32) {
            SECRET = envSecret.trim();
        } else {
            // A long secure fallback key
            SECRET = "ecoscan-fallback-secret-key-must-be-very-long-and-secure-at-least-256-bits!";
        }
    }

    /**
     * Generates a signed JWT token containing the provided claims.
     * The token is valid for 7 days.
     */
    public static String generateToken(Map<String, Object> claims) {
        try {
            Map<String, Object> tokenClaims = new HashMap<>(claims);
            // Add expiration claim (7 days from now)
            long exp = System.currentTimeMillis() + (7L * 24 * 60 * 60 * 1000);
            tokenClaims.put("exp", exp);

            String headerJson = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
            String header = Base64.getUrlEncoder().withoutPadding().encodeToString(
                    headerJson.getBytes(StandardCharsets.UTF_8)
            );
            String payload = Base64.getUrlEncoder().withoutPadding().encodeToString(
                    objectMapper.writeValueAsString(tokenClaims).getBytes(StandardCharsets.UTF_8)
            );
            
            String data = header + "." + payload;
            String signature = hmacSha256(data, SECRET);
            
            return data + "." + signature;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate JWT token", e);
        }
    }

    /**
     * Validates the JWT token signature and expiration, returning parsed claims.
     * Returns null if token is invalid or expired.
     */
    @SuppressWarnings("unchecked")
    public static Map<String, Object> validateTokenAndGetClaims(String token) {
        try {
            if (token == null) return null;
            
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return null;
            }
            
            String data = parts[0] + "." + parts[1];
            String signature = parts[2];
            
            String expectedSignature = hmacSha256(data, SECRET);
            if (!signature.equals(expectedSignature)) {
                return null;
            }
            
            String payloadJson = new String(
                    Base64.getUrlDecoder().decode(parts[1]),
                    StandardCharsets.UTF_8
            );
            
            Map<String, Object> claims = objectMapper.readValue(payloadJson, Map.class);
            
            // Check expiration
            if (claims.containsKey("exp")) {
                long exp = ((Number) claims.get("exp")).longValue();
                if (System.currentTimeMillis() > exp) {
                    return null; // Expired
                }
            }
            
            return claims;
        } catch (Exception e) {
            return null;
        }
    }

    private static String hmacSha256(String data, String secret) throws Exception {
        Mac sha256HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256HMAC.init(secretKey);
        byte[] hash = sha256HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
    }
}
