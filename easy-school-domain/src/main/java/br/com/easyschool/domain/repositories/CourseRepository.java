package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.Course;
import br.com.easyschool.domain.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    @Query("SELECT c FROM Course c WHERE c.status = true")
    List<Course> findAllCoursesAvailable();

}
