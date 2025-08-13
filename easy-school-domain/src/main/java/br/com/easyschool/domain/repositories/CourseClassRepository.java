package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.dto.CourseClassTeacherDTO;
import br.com.easyschool.domain.dto.CoursePriceDTO;
import br.com.easyschool.domain.entities.CourseClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseClassRepository extends JpaRepository<CourseClass, Integer> {

    @Query(value = """
            SELECT ccs.id, cc.name,ccs.course_price
            FROM student s
            INNER JOIN course_class_students ccs
            on s.id = student_id
            INNER JOIN course_class cc
            on cc.id = course_class_id
            WHERE cc.status = true
            AND s.id = :student_id;
            """, nativeQuery = true)
    List<CoursePriceDTO> findStudentsCourseClassPrice(@Param("student_id") Integer studentId);

    @Query("SELECT cc FROM CourseClass cc WHERE cc.status = true")
    List<CourseClass> findAllCourseClassesAvailable();


    @Query(value = """
            SELECT
            cc.id as course_class_id,
            cc.name as course_class_name,
            cc.teacher_id,
            cc.start_hour,
            cc.start_minute,
            cc.end_hour,
            cc.end_minute,
            cwd.id as calendar_week_day_id,
            cwd.week_day
            FROM course_class cc
            INNER JOIN course_class_calendar ccc
            ON cc.id = ccc.course_class_id
            INNER JOIN calendar_week_day cwd
            ON cwd.id = ccc.calendar_week_day_id
            WHERE cc.teacher_id = :teacher_id
            AND cc.status = 1;
            """, nativeQuery = true)
    List<CourseClassTeacherDTO> fetchCourseClassByTeacher(@Param("teacher_id") Integer teacherId);
}
