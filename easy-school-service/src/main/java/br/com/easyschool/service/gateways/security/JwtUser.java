package br.com.easyschool.service.gateways.security;

import java.util.Collections;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

public record JwtUser(
        UUID id,                // sub
        String username,        // username/email
        Set<String> roles,      // role names
        Integer profileId,       // profile_id (student/teacher)
        String profileType,     // profile_type ("student" | "teacher" | "none")
        Integer ver             // optional version
) {
    public JwtUser {
        // Ensure roles is never null and immutable
        roles = roles == null ? Collections.emptySet() : Set.copyOf(roles);
        profileId = profileId == null ? -1 : profileId;
        profileType = profileType == null ? "none" : profileType;
    }

    public boolean hasRole(String r) {
        Objects.requireNonNull(r, "role must not be null");
        return roles.stream().anyMatch(role -> role.equalsIgnoreCase(r));
    }

    public boolean isStudent() {
        return "student".equalsIgnoreCase(profileType);
    }

    public boolean isTeacher() {
        return "teacher".equalsIgnoreCase(profileType);
    }
}
