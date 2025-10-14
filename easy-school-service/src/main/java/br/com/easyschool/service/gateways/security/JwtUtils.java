package br.com.easyschool.service.gateways.security;

import br.com.easyschool.service.config.ConfigReader;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.time.Instant;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public final class JwtUtils {
    private static final String ISS = "easy-school";
    private static final String AUD = "web";

    // custom claim keys
    private static final String C_USERNAME     = "username";
    private static final String C_ROLES        = "roles";
    private static final String C_PROFILE_ID   = "profile_id";
    private static final String C_PROFILE_TYPE = "profile_type";
    private static final String C_VER          = "ver";

    private final ConfigReader configReader;

    private byte[] secret() {
        String value = configReader.getPropertyValue("JWT_SECRET");
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("JWT_SECRET not configured");
        }
        return value.getBytes(StandardCharsets.UTF_8);
    }

    public JwtUser parseBearer(String authorization) throws ParseException, JOSEException {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new SecurityException("Missing/invalid Authorization header");
        }
        String token = authorization.substring("Bearer ".length()).trim();

        SignedJWT jwt = SignedJWT.parse(token);
        if (!jwt.verify(new MACVerifier(secret()))) {
            throw new SecurityException("Invalid JWT signature");
        }

        JWTClaimsSet c = jwt.getJWTClaimsSet();

        // Standard validations
        if (c.getExpirationTime() == null || c.getExpirationTime().toInstant().isBefore(Instant.now())) {
            throw new SecurityException("Token expired");
        }
        if (!ISS.equals(c.getIssuer())) {
            throw new SecurityException("Bad issuer");
        }
        if (c.getAudience() == null || !c.getAudience().contains(AUD)) {
            throw new SecurityException("Bad audience");
        }

        // Required / core fields
        UUID id = UUID.fromString(String.valueOf(c.getSubject()));
        String username = Optional.ofNullable(c.getStringClaim(C_USERNAME)).orElse("");

        // roles as Set<String> (uppercased for normalization)
        List<String> rolesList = Optional.ofNullable(c.getStringListClaim(C_ROLES)).orElseGet(List::of);
        Set<String> roles = new HashSet<>();
        rolesList.forEach(r -> {
            if (r != null) roles.add(r.toUpperCase(Locale.ROOT));
        });

        // Optional custom fields
        Integer profileId = Optional.ofNullable(c.getIntegerClaim(C_PROFILE_ID)).orElse(-1);
        String profileType = Optional.ofNullable(c.getStringClaim(C_PROFILE_TYPE)).orElse("none");

        Integer ver = null;
        Object verObj = c.getClaim(C_VER);
        if (verObj instanceof Number n) ver = n.intValue();
        else if (verObj instanceof String s) {
            try { ver = Integer.valueOf(s); } catch (NumberFormatException ignored) {}
        }

        return new JwtUser(id, username, roles, profileId, profileType, ver);
    }
}
