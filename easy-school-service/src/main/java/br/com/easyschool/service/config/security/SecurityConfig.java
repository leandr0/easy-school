// src/main/java/.../security/SecurityConfig.java
package br.com.easyschool.service.config.security;

import br.com.easyschool.service.config.ConfigReader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
@EnableMethodSecurity
@Slf4j// enables @PreAuthorize, @Secured, etc.
@RequiredArgsConstructor
public class SecurityConfig {


    private final ConfigReader configReader;
    // HS256 shared secret (matches what issues your JWTs)
    @Bean
    JwtDecoder jwtDecoder() {
        String secret = configReader.getPropertyValue("JWT_SECRET"); // plain text
        SecretKey key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        log.info("JWT_SECRET : " + key);
        return NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();

    }

    // Map "roles" claim -> GrantedAuthorities with ROLE_ prefix
    @Bean
    JwtAuthenticationConverter jwtAuthConverter() {
        var roles = new JwtGrantedAuthoritiesConverter();
        roles.setAuthoritiesClaimName("roles");      // your claim name
        roles.setAuthorityPrefix("ROLE_");           // hasRole('ADMIN') expects ROLE_ADMIN

        var converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(roles);
        return converter;
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationConverter jwtAuthConverter) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // BFF-to-API typically not using browser cookies
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/security/login").permitAll()
                        //.requestMatchers("/public/**").permitAll(
                        //.requestMatchers("/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth -> oauth
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter))
                );

        return http.build();
    }
}
