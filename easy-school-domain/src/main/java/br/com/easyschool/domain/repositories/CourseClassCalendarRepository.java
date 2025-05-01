package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.CourseClassCalendar;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseClassCalendarRepository extends JpaRepository<CourseClassCalendar, Integer> {
}
