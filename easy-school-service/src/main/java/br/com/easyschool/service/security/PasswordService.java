package br.com.easyschool.service.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@Slf4j
public class PasswordService {
    private final Argon2PasswordEncoder argon2 =
            new Argon2PasswordEncoder(16, 32, 1, 1<<16, 3);
    private final BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder(12);

    public boolean matches(String raw, String stored) {
        if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
            return bcrypt.matches(raw, stored);        // bcrypt
        } else if (stored.startsWith("$argon2")) {
            return argon2.matches(raw, stored);        // argon2
        } else {
            throw new IllegalArgumentException("Unknown hash format");
        }
    }

    public String upgradeToArgon2(String raw, String stored) {
        if (stored.startsWith("$argon2")) return null;
        if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
            if (bcrypt.matches(raw, stored)) return argon2.encode(raw);
        }
        return null;
    }
}
