package com.example.backend.auth;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MeController {

    // Protected: reachable only if the JwtAuthenticationFilter authenticated the request.
    // 'authentication' is populated by Spring Security from the SecurityContext.
    @GetMapping("/me")
    public MeResponse me(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return new MeResponse(email);
    }
}
