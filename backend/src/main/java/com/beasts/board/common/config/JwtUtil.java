package com.beasts.board.common.config;

import com.beasts.board.admin.entity.Admin;
import io.jsonwebtoken.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Log4j2
@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long tokenValidityInMs;

    public JwtUtil(
            @Value("${jwt.expiration_time}") long tokenValidityInMs
    ){
        this.secretKey = new SecretKeySpec(
                System.getenv("JWT_SECRET").getBytes(StandardCharsets.UTF_8),
                Jwts.SIG.HS256.key().build().getAlgorithm()
        );
        this.tokenValidityInMs = tokenValidityInMs;
    }

    public String createToken(Admin admin){
        return Jwts.builder()
                .claim("id", admin.getId())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + tokenValidityInMs))
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    public Long getId(String token){
        return parseClaims(token).get("id", Long.class);
    }

    public boolean validateToken(String token){
        try {
            getJwtParser().parseSignedClaims(token).getPayload();
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.warn("Invalid JWT Token", e);
        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT Token", e);
        } catch (UnsupportedJwtException e) {
            log.warn("Unsupported JWT Token", e);
        } catch (IllegalArgumentException e) {
            log.warn("JWT Claims String is Empty", e);
        }
        return false;
    }

    public Claims parseClaims(String token){
        try {
            String parsedToken = token.startsWith("Bearer ")? token.substring(7) : token;
            return getJwtParser()
                    .parseSignedClaims(parsedToken)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    private JwtParser getJwtParser() {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build();
    }
}
