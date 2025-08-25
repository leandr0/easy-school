package br.com.easyschool.service.gateways.security;

import br.com.easyschool.domain.entities.security.Role;
import br.com.easyschool.domain.repositories.security.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/security/roles")
@Slf4j
@RequiredArgsConstructor
public class RoleGateway {

    private final RoleRepository repository;

    @GetMapping
    public ResponseEntity<List<Role>> findTeacherById() {

        try {
            return ResponseEntity.ok(repository.findAll());
        } catch (Throwable t) {
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


}
