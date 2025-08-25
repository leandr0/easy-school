package br.com.easyschool.service.gateways.security;

import br.com.easyschool.domain.entities.security.Role;
import br.com.easyschool.domain.entities.security.User;
import br.com.easyschool.domain.repositories.security.UserRepository;
import br.com.easyschool.domain.repositories.security.UserRolesRepository;
import br.com.easyschool.service.requests.security.UserCreationRequest;
import br.com.easyschool.service.response.security.UserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/security/users")
@Slf4j
@RequiredArgsConstructor
public class UserGateway {

    private final UserRepository repository;

    private final UserRolesRepository userRolesRepository;

    @PostMapping
    public ResponseEntity<UserResponse> create(@RequestBody UserCreationRequest request) {
        try{

            User entity = new User();
            entity.setUsername(request.getUsername());
            entity.setPasswordHash(request.getPasswordHash());
            entity.setStatus(true);

            Role role = new Role();
            role.setId(request.getRoleId());
            entity.setRole(role);
            entity = repository.save(entity);

            return ResponseEntity.ok(new UserResponse(entity));

        }catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


    @PutMapping
    public ResponseEntity<UserResponse> update(@RequestBody UserCreationRequest request) {
        try{

            User entity = repository.findById(request.getId()).orElseThrow();

            entity.setId(request.getId());
            entity.setUsername(request.getUsername());

            if(request.getPasswordHash() != null && !request.getPasswordHash().isEmpty())
                entity.setPasswordHash(request.getPasswordHash());

            entity.setStatus(request.getStatus());

            Role role = new Role();
            role.setId(request.getRoleId());
            entity.setRole(role);
            entity = repository.save(entity);

            return ResponseEntity.ok(new UserResponse(entity));

        }catch (NoSuchElementException n){
            log.warn(n.getMessage());
            return ResponseEntity.notFound().build();
        }
        catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> fetchAll() {
        try{

            Sort sort = Sort.by(Sort.Direction.ASC,"username");



            return ResponseEntity.ok(repository.findAll(sort)
                                                    .stream()
                                                    .map(UserResponse::new)
                                                    .toList());

        }catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> fetchAById(@PathVariable("id") UUID userId) {
        try{
            UserResponse result = new UserResponse(repository.findById(userId).orElseThrow());

            return ResponseEntity.ok(result);

        }catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }

    }
}
