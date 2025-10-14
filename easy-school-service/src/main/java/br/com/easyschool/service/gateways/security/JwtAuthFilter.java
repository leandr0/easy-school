package br.com.easyschool.service.gateways.security;


import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;
import java.util.stream.Collectors;


@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String auth = req.getHeader("Authorization");
        try {
            JwtUser user = jwtUtils.parseBearer(auth);
            Set<GrantedAuthority> auths = user.roles().stream()
                    .map(r -> new SimpleGrantedAuthority("ROLE_" + r)) // or without ROLE_ prefix if you prefer
                    .collect(Collectors.toSet());

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(user, null, auths);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (Exception ignored) {
            // leave unauthenticated; your HttpSecurity can decide what to permit
        }
        chain.doFilter(req, res);
    }
}

