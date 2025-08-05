package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.ClassControlTeacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClassControlTeacherRepository extends JpaRepository<ClassControlTeacher, Integer> {

    @Query(value = """
            SELECT teacher_id FROM class_control_teacher
            WHERE class_control_id = :class_control_id;
            """,nativeQuery = true)
    public Integer fetchTeacherIdByClassControlId(@Param("class_control_id") Integer classControlId);
}
