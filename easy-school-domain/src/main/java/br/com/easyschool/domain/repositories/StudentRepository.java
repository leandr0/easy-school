package br.com.easyschool.domain.repositories;


import br.com.easyschool.domain.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Integer> {

    @Query("""
            SELECT s FROM Student s
            INNER JOIN User u
            ON s.user.id = u.id 
            WHERE u.createdAt = :startDate
    """)
    List<Student> findByStartDateEquals(@Param("startDate") LocalDateTime startDate);

    @Query("""
        SELECT s
        FROM Student s
        INNER JOIN User u 
        ON s.user.id = u.id
        WHERE s.id NOT IN (
                SELECT ccs.student.id
                FROM CourseClassStudent ccs
                WHERE ccs.courseClass.id = :course_class_id
        ) 
        AND u.status = true       
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
               FROM student s
               INNER JOIN users u ON s.user_id = u.id
               WHERE status = true
            """,nativeQuery = true)
    Integer totalStudentAvailable();

    @Query(value = """
            SELECT s.* FROM student s
            INNER JOIN users u
            ON u.id = s.user_id
            INNER JOIN course_class_students ccs
            ON s.id = ccs.student_id
            INNER JOIN course_class cc
            ON ccs.course_class_id = cc.id
            WHERE cc.teacher_id = :teacher_id
            ORDER BY u.name ASC
            """,nativeQuery = true)
    List<Student> fetchStudentsByTeacher(@Param("teacher_id") Integer teacherId);

}
