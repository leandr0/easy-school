package br.com.easyschool.domain.repositories.security;

import br.com.easyschool.domain.entities.security.UserRoles;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRolesRepository extends JpaRepository<UserRoles, Integer> {
}
