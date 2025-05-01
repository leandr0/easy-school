package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.CalendarWeekDay;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CalendarWeekDayRepository extends JpaRepository<CalendarWeekDay, Integer> {

}
