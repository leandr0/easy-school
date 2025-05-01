package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.CourseClass;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseClassRepository extends JpaRepository<CourseClass, Integer> {

}
