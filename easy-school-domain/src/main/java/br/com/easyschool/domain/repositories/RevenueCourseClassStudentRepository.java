package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.RevenueCourseClassStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RevenueCourseClassStudentRepository extends JpaRepository<RevenueCourseClassStudent, Integer> {

    @Query(value = """
               SELECT *
               FROM revenue_course_class_students
               WHERE revenue_id = :revenue_id
               AND student_id = :student_id
            """,nativeQuery = true)
    List<RevenueCourseClassStudent> fetchByStudentAndRevenue(@Param("revenue_id") Integer revenueId,@Param("student_id") Integer studentId);
}
