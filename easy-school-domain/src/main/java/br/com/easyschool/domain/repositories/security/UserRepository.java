package br.com.easyschool.domain.repositories.security;

import br.com.easyschool.domain.dto.LoginDTO;
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

    @Query(value = """
  SELECT
    u.id,
    u.username,
    u.name,
    COALESCE(s.id, t.id)                          AS profile_id,
    CASE
      WHEN s.user_id IS NOT NULL THEN 'student'
      WHEN t.user_id IS NOT NULL THEN 'teacher'
      ELSE 'admin'
    END                                           AS profile_type,
    ARRAY_REMOVE(ARRAY_AGG(DISTINCT r.role), NULL) AS roles
  FROM users u
  LEFT JOIN user_roles ur ON ur.user_id = u.id
  LEFT JOIN roles r       ON r.id = ur.role_id
  LEFT JOIN student s     ON s.user_id = u.id
  LEFT JOIN teacher t     ON t.user_id = u.id
  WHERE
    u.status = TRUE
    AND u.username = :login
  GROUP BY
    u.id, u.username, u.name,
    COALESCE(s.id, t.id),
    CASE
      WHEN s.user_id IS NOT NULL THEN 'student'
      WHEN t.user_id IS NOT NULL THEN 'teacher'
      ELSE 'admin'
    END
  ORDER BY u.username
""", nativeQuery = true)
    LoginDTO login(@Param("login") String login);

}
