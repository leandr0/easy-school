package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.dto.CoursePriceDTO;
import br.com.easyschool.domain.entities.CourseClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseClassRepository extends JpaRepository<CourseClass, Integer> {

    @Query(value = """
            SELECT cc.name,ccs.course_price
            FROM student s
            INNER JOIN course_class_students ccs
            on s.id = student_id
            INNER JOIN course_class cc
            on cc.id = course_class_id
            WHERE cc.status = true
            AND s.id = :student_id;
            """, nativeQuery = true)
    List<CoursePriceDTO> findStudentsCourseClassPrice(@Param("student_id") Integer studentId);
}
