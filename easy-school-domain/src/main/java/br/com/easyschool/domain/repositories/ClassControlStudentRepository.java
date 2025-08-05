package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.ClassControlStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClassControlStudentRepository extends JpaRepository<ClassControlStudent, Integer> {

    @Query(value = """
            SELECT student_id FROM class_control_student
            WHERE class_control_id = :class_control_id;
            """,nativeQuery = true)
    public List<Integer> fetchStudentIdsByClassControlId(@Param("class_control_id") Integer classControlId);

}
