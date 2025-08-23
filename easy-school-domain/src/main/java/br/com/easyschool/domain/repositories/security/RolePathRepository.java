package br.com.easyschool.domain.repositories.security;

import br.com.easyschool.domain.entities.security.RolePath;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RolePathRepository extends JpaRepository<RolePath, Integer> {
}
