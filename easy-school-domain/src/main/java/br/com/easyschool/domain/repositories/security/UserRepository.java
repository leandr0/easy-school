package br.com.easyschool.domain.repositories.security;

import br.com.easyschool.domain.entities.security.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {


    @Query(value = """
            SELECT *
            FROM users
            WHERE status = true
            AND username = :username
            """, nativeQuery = true)
    User findByUsername(@Param("username") String username);

}
