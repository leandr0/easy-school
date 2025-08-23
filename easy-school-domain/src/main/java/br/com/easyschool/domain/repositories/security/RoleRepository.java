package br.com.easyschool.domain.repositories.security;

import br.com.easyschool.domain.entities.security.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository  extends JpaRepository<Role, Integer> {
}
