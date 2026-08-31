package br.com.easyschool.service.gateways.security;

import br.com.easyschool.domain.entities.Student;
import br.com.easyschool.domain.entities.Teacher;
import br.com.easyschool.domain.entities.security.User;
import br.com.easyschool.domain.entities.security.Role; // ← ensure you have this entity (or adjust import)
import br.com.easyschool.domain.repositories.StudentRepository;
import br.com.easyschool.domain.repositories.TeacherRepository;
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
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final JwtUtils jwtUtils;

    private static final String TEACHER_ROLE = "TEACHER";
    private static final String STUDENT_ROLE = "STUDENT";

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

    /** Parses a BRL-formatted amount (e.g. "1234,56" or "1.234,56") into a Double. */
    private static Double parseBrlCompensation(String raw) {
        if (raw == null || raw.isBlank()) return null;
        String normalized = raw.trim()
                .replaceAll("[^0-9,.-]", "")
                .replace(".", "")
                .replace(",", ".");
        try {
            return Double.valueOf(normalized);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid compensation value.");
        }
    }

    private static Integer parseDueDate(String raw) {
        if (raw == null || raw.isBlank()) return null;
        try {
            return Integer.valueOf(raw.trim());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid due date value.");
        }
    }

    // ================================================================
    //                            CREATE
    // ================================================================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody UserCreationRequest request) {
        try {
            // 1) Validate the role IDs included in the request
            List<Integer> roleIds = extractRoleIds(request);

            List<Role> roles = roleRepository.findAllById(roleIds);
            if (roles.size() != roleIds.size()) {
                return ResponseEntity.unprocessableEntity().body(new ApiError("One or more selected roles no longer exist."));
            }

            String error = validateRoleConflictsByIds(roleIds);
            if (error != null) {
                return ResponseEntity.unprocessableEntity().body(new ApiError(error));
            }

            boolean isTeacher = roles.stream().anyMatch(r -> TEACHER_ROLE.equalsIgnoreCase(r.getRole()));
            boolean isStudent = roles.stream().anyMatch(r -> STUDENT_ROLE.equalsIgnoreCase(r.getRole()));

            // 1b) Resolve teacher/student specific fields up-front so we fail fast,
            // before writing anything to the database.
            Double compensation = null;
            if (isTeacher) {
                compensation = request.getTeacher() != null
                        ? parseBrlCompensation(request.getTeacher().getCompensation())
                        : null;
                if (compensation == null) {
                    return ResponseEntity.unprocessableEntity().body(new ApiError("Compensation is required for teachers."));
                }
            }

            Integer dueDate = null;
            if (isStudent) {
                dueDate = request.getStudent() != null
                        ? parseDueDate(request.getStudent().getDueDate())
                        : null;
                if (dueDate == null) {
                    return ResponseEntity.unprocessableEntity().body(new ApiError("Due date is required for students."));
                }
            }

            // 2) Persist the user
            User entity = new User();
            entity.setUsername(request.getUsername());
            entity.setPasswordHash(request.getPasswordHash());
            entity.setStatus(true);
            entity.setRoles(roles);
            entity.setName(request.getName());
            entity.setPhoneNumber(request.getPhoneNumber());

            entity = repository.save(entity);

            // 3) Create the matching profile row for the selected role
            if (isTeacher) {
                Teacher teacher = new Teacher();
                teacher.setUser(entity);
                teacher.setCompensation(compensation);
                teacher = teacherRepository.save(teacher);
                entity.setTeacher(teacher);
                repository.save(entity);
            }

            if (isStudent) {
                Student student = new Student();
                student.setUser(entity);
                student.setDueDate(dueDate);
                student = studentRepository.save(student);
                entity.setStudent(student);
                repository.save(entity);
            }

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
    //                       SELF-SERVICE (any role)
    // ================================================================
    // A non-admin only ever acts on their own record here - the id always comes
    // from the JWT subject, never from client input, so there is no way to read
    // or edit someone else's account through these two endpoints. Roles and
    // status are intentionally never touched by updateMe: self-service users
    // cannot grant themselves roles or (de)activate their own account.

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> fetchMe(@RequestHeader(value = "Authorization", required = false) String auth) {
        try {
            JwtUser caller = jwtUtils.parseBearer(auth);
            UserResponse result = new UserResponse(repository.findById(caller.id()).orElseThrow());
            return ResponseEntity.ok(result);
        } catch (Throwable t) {
            log.error("Fetch me error", t);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@RequestBody UserCreationRequest request,
                                       @RequestHeader(value = "Authorization", required = false) String auth) {
        try {
            JwtUser caller = jwtUtils.parseBearer(auth);
            User entity = repository.findById(caller.id()).orElseThrow();

            if (request.getUsername() != null && !request.getUsername().isBlank()) {
                entity.setUsername(request.getUsername());
            }
            if (request.getPasswordHash() != null && !request.getPasswordHash().isEmpty()) {
                entity.setPasswordHash(request.getPasswordHash());
                entity.setFailedAttempts(0);
                entity.setLockedUntil(null);
            }

            entity = repository.save(entity);
            return ResponseEntity.ok(new UserResponse(entity));

        } catch (NoSuchElementException n) {
            log.warn("User not found: {}", n.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError("User not found"));
        } catch (IllegalArgumentException iae) {
            log.warn("Bad request: {}", iae.getMessage());
            return ResponseEntity.badRequest().body(new ApiError(iae.getMessage()));
        } catch (Throwable t) {
            log.error("Update me error", t);
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
