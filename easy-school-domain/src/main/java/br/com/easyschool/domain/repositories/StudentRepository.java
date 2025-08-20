package br.com.easyschool.domain.repositories;


import br.com.easyschool.domain.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Integer> {

    @Query("SELECT s FROM Student s WHERE s.startDate = :startDate")
    List<Student> findByStartDateEquals(@Param("startDate") LocalDateTime startDate);

    @Query("""
        SELECT s
        FROM Student s
        WHERE s.id NOT IN (
                SELECT ccs.student.id
                FROM CourseClassStudent ccs
                WHERE ccs.courseClass.id = :course_class_id
        ) 
        AND s.status = true       
          """)
    List<Student> findStudentsNotInCourseClass(@Param("course_class_id") Integer courseClassId);

    @Query("""
            SELECT s
            FROM Student s
            JOIN CourseClassStudent ccs
            ON s.id = ccs.student.id
            JOIN CourseClass cs
            ON cs.id = ccs.courseClass.id
            WHERE cs.id = :course_class_id
            """)
    List<Student> findStudentsInCourseClass(@Param("course_class_id") Integer courseClassId);

    @Query(value = """
               SELECT count(*)
               FROM student
               WHERE status = true
            """,nativeQuery = true)
    Integer totalStudentAvailable();

}
