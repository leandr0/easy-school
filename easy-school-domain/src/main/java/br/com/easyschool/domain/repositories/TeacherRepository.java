package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TeacherRepository extends JpaRepository<Teacher, Integer> {

    @Query("""
            SELECT t FROM Teacher t
            JOIN User u
            ON t.user.id = user.id
            WHERE u.status = true
            """)
    List<Teacher> findAllTeachersAvailable();


    @Query("""
                SELECT t
                FROM Teacher t
                JOIN User u ON t.user.id = u.id
                JOIN TeacherSkill ts ON ts.teacher.id = t.id
                JOIN Language l ON ts.language.id = l.id
                WHERE u.status = true
                  AND l.id = :language_id
            """)
    List<Teacher> findAllTeachersAvailableByLanguage(@Param("language_id") Integer languageId);



    @Query("""
               SELECT t
               FROM CourseClass cc
               JOIN Course c ON cc.course.id = c.id
               JOIN Language l ON c.language.id = l.id
               JOIN TeacherSkill ts ON ts.language.id = l.id
               JOIN Teacher t ON ts.teacher.id = t.id
               WHERE cc.id = :course_class_id
            """)
    List<Teacher> findAllTeachersAvailableByLanguageFromCourseClass(@Param("course_class_id") Integer courseClassId);


    @Query(value = """
               SELECT count(*)
               FROM teacher t
               INNER JOIN users u
               ON t.user_id = u.id
               WHERE u.status = true
            """,nativeQuery = true)
    Integer totalTeacherAvailable();

}
