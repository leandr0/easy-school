package br.com.easyschool.domain.repositories;


import br.com.easyschool.domain.entities.Revenue;
import br.com.easyschool.domain.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface RevenueRepository extends JpaRepository<Revenue, Integer> {

    @Query("SELECT r FROM Revenue r WHERE r.student.id = :student_id")
    List<Revenue> findByStudentId(@Param("student_id") Integer studentId);

}
