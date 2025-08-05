package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.ClassControl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClassControlRepository extends JpaRepository<ClassControl, Integer> {


    @Query(value = """
            SELECT *
            FROM class_control
            WHERE DATE(year || '-' || printf('%02d', month) || '-' || printf('%02d', day))
            BETWEEN :start_date AND :end_date
            AND course_class_id = :course_class_id
            """, nativeQuery = true)
    public List<ClassControl> fetchByDateRange(@Param("start_date") String startDate, @Param("end_date") String endDate, @Param("course_class_id") Integer courseClassId);
}
