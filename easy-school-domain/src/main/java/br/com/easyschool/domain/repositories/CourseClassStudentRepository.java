package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.CourseClassStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseClassStudentRepository extends JpaRepository<CourseClassStudent, Integer> {

    @Modifying
    @Transactional
    @Query("""
            DELETE FROM CourseClassStudent ccs
            WHERE ccs.courseClass.id = :course_class_id
            AND ccs.student.id = :student_id
            """)
    public void deleteByStudentIdAndCourseClassId(@Param("student_id") Integer studentId,@Param("course_class_id") Integer courseClassId);

    @Query("""
            SELECT ccs, cs FROM CourseClassStudent ccs
            JOIN CourseClass cs ON ccs.courseClass.id = cs.id
            WHERE ccs.student.id = :student_id
            AND cs.status = true
            """)
    public List<CourseClassStudent> fetchCourseClassByStudentId(@Param("student_id") Integer studentId);


    @Modifying
    @Transactional
    @Query(value = """
            UPDATE course_class_students
            SET course_price = :course_price
            WHERE id = :id
            """, nativeQuery = true)
    public void updateCoursePriceById(@Param("id") Integer id,@Param("course_price") Double coursePrice);
}
