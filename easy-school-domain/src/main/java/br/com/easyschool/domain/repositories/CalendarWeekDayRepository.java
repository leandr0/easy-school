package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.CalendarWeekDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CalendarWeekDayRepository extends JpaRepository<CalendarWeekDay, Integer> {

    @Query(value =  """ 
                select cwd.* from calendar_week_day cwd
                inner join course_class_calendar ccc
                on cwd.id = ccc.calendar_week_day_id
                where ccc.course_class_id = :course_class_id
                """, nativeQuery = true)
    List<CalendarWeekDay> findBydCourseClassId(@Param("course_class_id") Integer courseClassId);
}
