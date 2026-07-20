package com.example.backend.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs) {
        // Build the signing key from the secret. HS256 needs at least 256 bits (32 bytes).
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    /** Create a signed JWT whose subject is the user's email. */
    public String generateToken(String email) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .subject(email)          // "sub" claim
                .issuedAt(now)           // "iat" claim
                .expiration(expiry)      // "exp" claim
                .signWith(key)           // sign with HS256 (inferred from key size)
                .compact();              // -> header.payload.signature string
    }

    /** Verify the signature + expiry and return the email inside. Throws if invalid/expired. */
    public String extractEmail(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)   // fails if signature is wrong or token expired
                .getPayload();
        return claims.getSubject();
    }
}
