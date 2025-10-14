// src/main/java/.../security/SecurityConfig.java
package br.com.easyschool.service.config.security;

import br.com.easyschool.service.config.ConfigReader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Configuration
@EnableMethodSecurity // enables @PreAuthorize, etc.
@Slf4j
@RequiredArgsConstructor
public class SecurityConfig {

    private final ConfigReader configReader;

    @Bean
    JwtDecoder jwtDecoder() {
        String secret = configReader.getPropertyValue("JWT_SECRET");
        SecretKey key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");

        NimbusJwtDecoder decoder = NimbusJwtDecoder
                .withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();

        // Validate exp/nbf + issuer + audience
        OAuth2TokenValidator<Jwt> withDefaults = JwtValidators.createDefault(); // exp/nbf
        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer("easy-school");
        OAuth2TokenValidator<Jwt> withAudience =
                new JwtClaimValidator<List<String>>("aud", aud -> aud != null && aud.contains("web"));

        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(withDefaults, withIssuer, withAudience));
        return decoder;
    }

    @Bean
    JwtAuthenticationConverter jwtAuthConverter() {
        // Map "roles" claim -> SimpleGrantedAuthority("ROLE_<role>")
        var roles = new JwtGrantedAuthoritiesConverter();
        roles.setAuthoritiesClaimName("roles"); // your claim
        roles.setAuthorityPrefix("ROLE_");      // so hasRole('ADMIN') works

        var converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(roles);
        // Optional: choose which claim becomes Principal#getName()
        converter.setPrincipalClaimName("sub"); // or "username"
        return converter;
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationConverter jwtAuthConverter) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults()) // keep @CrossOrigin or define CorsConfigurationSource
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/security/login").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // CORS preflight
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth -> oauth
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter))
                );

        return http.build();
    }
}
