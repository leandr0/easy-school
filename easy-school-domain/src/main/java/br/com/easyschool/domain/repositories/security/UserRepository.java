package br.com.easyschool.domain.repositories.security;

import br.com.easyschool.domain.entities.security.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {


    @Query(value = """
            SELECT u.* FROM users u
            LEFT JOIN student s
            ON u.id = s.user_id
            LEFT JOIN teacher t
            ON u.id = t.user_id
            WHERE u.username = :username
            """, nativeQuery = true)
    User findByUsername(@Param("username") String username);


}
