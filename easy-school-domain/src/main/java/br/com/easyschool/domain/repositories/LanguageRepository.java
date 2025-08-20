package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.dto.DashBoardStudentLanguageDTO;
import br.com.easyschool.domain.entities.Language;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;

import java.util.List;
public interface LanguageRepository extends JpaRepository<Language, Integer> {

    @Override
    @NonNull
    default List<Language> findAll() {
        return findAll(Sort.by(Sort.Direction.ASC, "name"));
    }

    @Query(value = """
               SELECT count(*)
               FROM language
               WHERE status = true
            """,nativeQuery = true)
    Integer totalLanguageAvailable();


    @Query(value = """
               SELECT
                   l.name AS name,
                   l.image_url,
                   CAST(COUNT(DISTINCT s.id) AS int) AS total_students
               FROM student s
               INNER JOIN course_class_students ccs ON s.id = ccs.student_id
               INNER JOIN course_class cc ON cc.id = ccs.course_class_id
               INNER JOIN course c ON c.id = cc.course_id
               INNER JOIN language l ON l.id = c.language_id
               WHERE s.status = true
               GROUP BY l.id, l.name
               ORDER BY l.name;
            """,nativeQuery = true)
    List<DashBoardStudentLanguageDTO> totalStudentsLanguage();
}
