package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    @Query("SELECT c FROM Course c WHERE c.status = true")
    List<Course> findAllCoursesAvailable();


    @Query(value = """
            
            SELECT c.* FROM course c
            INNER JOIN course_class cc
            ON c.id = cc.course_id
            WHERE cc.teacher_id = :teacher_id
            AND c.status = true
            """, nativeQuery = true)
    List<Course> findAllCoursesByTeacher(@Param("teacher_id") Integer teacherId);

}
