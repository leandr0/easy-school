package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.CourseClassStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;

public interface CourseClassStudentRepository extends JpaRepository<CourseClassStudent, Integer> {

    @Modifying
    @Transactional
    @Query("""
            DELETE FROM CourseClassStudent ccs
            WHERE ccs.courseClass.id = :course_class_id
            AND ccs.student.id = :student_id
            """)
   public void deleteByStudentIdAndCourseClassId(@Param("student_id") Integer studentId,@Param("course_class_id") Integer courseClassId);
}
