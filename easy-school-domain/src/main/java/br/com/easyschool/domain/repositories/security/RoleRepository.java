package br.com.easyschool.domain.repositories.security;

import br.com.easyschool.domain.entities.security.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;

public interface RoleRepository  extends JpaRepository<Role, Integer> {

    @Query(value = """
               SELECT COUNT(*) FROM roles
            """,nativeQuery = true)
    long countAllByIdIn(Collection<Integer> ids);
}
