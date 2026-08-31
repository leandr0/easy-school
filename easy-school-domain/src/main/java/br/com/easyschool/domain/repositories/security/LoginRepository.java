package br.com.easyschool.domain.repositories.security;

import br.com.easyschool.domain.dto.LoginDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LoginRepository {

    @Query(value = """
              SELECT
                u.id,
                u.password_hash,
                u.locked_until,
                u.username,
                u.name,
                COALESCE(s.id, t.id) AS profile_id,
                CASE
                  WHEN s.user_id IS NOT NULL THEN 'student'
                  WHEN t.user_id IS NOT NULL THEN 'teacher'
                END AS profile_type,
                COALESCE(s.email, t.email) AS email,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT r.role), NULL) AS roles
              FROM users u
              LEFT JOIN user_roles ur ON ur.user_id = u.id
              LEFT JOIN roles r       ON r.id = ur.role_id
              LEFT JOIN student s     ON s.user_id = u.id
              LEFT JOIN teacher t     ON t.user_id = u.id
              WHERE
                (s.user_id IS NOT NULL OR t.user_id IS NOT NULL)
                AND u.status = TRUE
                AND (
                     (s.user_id IS NOT NULL AND s.status = TRUE)
                  OR (t.user_id IS NOT NULL AND t.status = TRUE)
                )
                AND (   
                     s.email = :login
                  OR t.email = :login
                )
              GROUP BY
                u.id, u.username, u.name,
                COALESCE(s.id, t.id),
                CASE
                  WHEN s.user_id IS NOT NULL THEN 'student'
                  WHEN t.user_id IS NOT NULL THEN 'teacher'
                END,
                COALESCE(s.email, t.email)
              ORDER BY u.username
            """,nativeQuery = true)
    LoginDTO login (@Param("login")final String login);
}
