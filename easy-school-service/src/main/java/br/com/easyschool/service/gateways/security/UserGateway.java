package br.com.easyschool.service.gateways.security;

import br.com.easyschool.domain.entities.security.User;
import br.com.easyschool.domain.entities.security.Role; // ← ensure you have this entity (or adjust import)
import br.com.easyschool.domain.repositories.security.RoleRepository;
import br.com.easyschool.domain.repositories.security.UserRepository;
import br.com.easyschool.domain.repositories.security.UserRolesRepository;
import br.com.easyschool.service.requests.security.UserCreationRequest;
import br.com.easyschool.service.response.security.UserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/security/users")
@Slf4j
@RequiredArgsConstructor
public class UserGateway {

    private final UserRepository repository;
    private final UserRolesRepository userRolesRepository;
    private final RoleRepository roleRepository;

    // ---------- Conflict rules (by role CODE, uppercase) ----------
    // TEACHER ↔ STUDENT; STUDENT ↔ ADMIN
    private static final Map<String, Set<String>> CONFLICTS_BY_CODE;
    static {
        Map<String, Set<String>> m = new HashMap<>();
        putConflict(m, "TEACHER", "STUDENT");
        putConflict(m, "STUDENT", "TEACHER");
        putConflict(m, "STUDENT", "ADMIN");
        putConflict(m, "ADMIN",   "STUDENT");
        CONFLICTS_BY_CODE = Collections.unmodifiableMap(m);
    }
    private static void putConflict(Map<String, Set<String>> m, String a, String b) {
        m.computeIfAbsent(a, k -> new HashSet<>()).add(b);
    }
    private static String norm(String s) {
        return s == null ? "" : s.trim().toUpperCase(Locale.ROOT);
    }

    /** Minimal API error payload */
    private record ApiError(String message) {}

    // ---------- Helpers to load/validate roles ----------
    /**
     * Extract requested role IDs from the request object.
     * Adjust this method if your request contains roles in a different shape.
     */
    private List<Integer> extractRoleIds(UserCreationRequest request) {
        // Assumes request.getRoles() returns a collection whose items carry an ID.
        // If it's already a list of IDs, just return it.
        return request.getRoles().stream()
                .map(role -> {
                    // Adjust if your request role item carries ID as String
                    Object idObj;
                    try {
                        // Common shapes: getId(), id, or a plain UUID
                        idObj = role.getId();
                    } catch (Exception ignore) {
                        idObj = null;
                    }
                    if (idObj == null) {
                        // Try field named "id" via map-like accessor or adapt as needed
                        throw new IllegalArgumentException("Role item missing id");
                    }
                    return Integer.valueOf(idObj.toString());
                })
                .toList();
    }

    /**
     * Given role IDs, fetch their codes/names, normalize, and validate conflicts.
     * Returns null if valid; otherwise an error message.
     */
    private String validateRoleConflictsByIds(Collection<Integer> roleIds) {
        if (roleIds == null || roleIds.isEmpty()) return null;

        // Load roles from DB; adjust method name if your repository differs
        List<Role> roles = roleRepository.findAllById(roleIds);

        // Map to normalized "codeLike" = (code != null ? code : name)
        Set<Role> codeLikes = roles.stream()
                .map(role -> {
                    // Adjust getters per your Role entity fields
                    Integer code = null;
                    try { code = role.getCode(); } catch (Exception ignore) {}
                    String name = null;
                    try { name = role.getRole(); } catch (Exception ignore) {}

                    if (code == null || code <= 0 ) {
                        // If a role has neither code nor name, this is an inconsistent DB state
                        throw new IllegalStateException("Role has no code or name: " + role.getId());
                    }
                    return role;
                })
                .collect(Collectors.toCollection(LinkedHashSet::new));

        // Check conflicts: if any selected code's conflict set intersects selected codes, block
        for (Role role : codeLikes) {
            Set<String> conflicts = CONFLICTS_BY_CODE.getOrDefault(role.getRole(), Collections.emptySet());
            for (String roleName : conflicts) {
                if (codeLikes.contains(roleName)) {
                    return "Invalid combination of roles.";
                }
            }
        }
        return null;
    }

    // ================================================================
    //                            CREATE
    // ================================================================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody UserCreationRequest request) {
        try {
            // 1) Validate conflicts by the role IDs included in request
            List<Integer> roleIds = extractRoleIds(request);

            // Optional: verify all role IDs exist
            long count = roleRepository.countAllByIdIn(roleIds); // implement if you like; else skip
            if (count != roleIds.size()) {
                return ResponseEntity.unprocessableEntity().body(new ApiError("One or more selected roles no longer exist."));
            }

            String error = validateRoleConflictsByIds(roleIds);
            if (error != null) {
                return ResponseEntity.unprocessableEntity().body(new ApiError(error));
            }

            // 2) Persist
            User entity = new User();
            entity.setUsername(request.getUsername());
            entity.setPasswordHash(request.getPasswordHash());
            entity.setStatus(true);
            entity.setRoles(request.getRoles());

            entity = repository.save(entity);
            return ResponseEntity.ok(new UserResponse(entity));

        } catch (IllegalArgumentException iae) {
            log.warn("Bad request: {}", iae.getMessage());
            return ResponseEntity.badRequest().body(new ApiError(iae.getMessage()));
        } catch (Throwable t) {
            log.error("Create user error", t);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError("Internal error"));
        }
    }

    // ================================================================
    //                            UPDATE
    // ================================================================
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping
    public ResponseEntity<?> update(@RequestBody UserCreationRequest request) {
        try {
            User entity = repository.findById(request.getId()).orElseThrow();

            // 1) Validate conflicts (by IDs from request)
            List<Integer> roleIds = extractRoleIds(request);

            // Optional: verify all role IDs exist
            long count = roleRepository.countAllByIdIn(roleIds); // implement if desired
            if (count != roleIds.size()) {
                return ResponseEntity.unprocessableEntity().body(new ApiError("One or more selected roles no longer exist."));
            }

            String error = validateRoleConflictsByIds(roleIds);
            if (error != null) {
                return ResponseEntity.unprocessableEntity().body(new ApiError(error));
            }

            // 2) Apply updates
            entity.setUsername(request.getUsername());

            if (request.getPasswordHash() != null && !request.getPasswordHash().isEmpty()) {
                entity.setPasswordHash(request.getPasswordHash());
                entity.setFailedAttempts(0);
                entity.setLockedUntil(null);
            }

            entity.setStatus(request.getStatus());
            entity.setRoles(request.getRoles());

            entity = repository.save(entity);
            return ResponseEntity.ok(new UserResponse(entity));

        } catch (NoSuchElementException n) {
            log.warn("User not found: {}", n.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError("User not found"));
        } catch (IllegalArgumentException iae) {
            log.warn("Bad request: {}", iae.getMessage());
            return ResponseEntity.badRequest().body(new ApiError(iae.getMessage()));
        } catch (Throwable t) {
            log.error("Update user error", t);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError("Internal error"));
        }
    }

    // ================================================================
    //                            READ
    // ================================================================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UserResponse>> fetchAll() {
        try {
            Sort sort = Sort.by(Sort.Direction.ASC, "username");
            return ResponseEntity.ok(
                    repository.findAll(sort).stream()
                            .map(UserResponse::new)
                            .toList()
            );
        } catch (Throwable t) {
            log.error("Fetch all users error", t);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> fetchAById(@PathVariable("id") UUID userId) {
        try {
            UserResponse result = new UserResponse(repository.findById(userId).orElseThrow());
            return ResponseEntity.ok(result);
        } catch (Throwable t) {
            log.error("Fetch user by id error", t);
            return ResponseEntity.internalServerError().build();
        }
    }
}