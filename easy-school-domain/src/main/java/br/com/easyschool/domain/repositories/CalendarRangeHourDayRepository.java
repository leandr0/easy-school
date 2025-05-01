package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.CalendarRangeHourDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CalendarRangeHourDayRepository extends JpaRepository<CalendarRangeHourDay, Integer> {


    @Query("""
               SELECT crhd
               FROM CalendarRangeHourDay crhd
               JOIN Teacher t ON crhd.teacher.id = t.id
               JOIN CalendarWeekDay cwd ON crhd.calendarWeekDay.id = cwd.id
               JOIN TeacherSkill ts ON ts.teacher.id = t.id
               WHERE cwd.id in ( :calendar_week_day_ids )
               AND ts.language.id = :language_id
               AND (
                        crhd.startHour <= :start_hour
                        AND
                        crhd.startMinute <= :start_minute
                    )
               AND (
                         crhd.endHour > :end_hour
                         OR (
                                crhd.endHour = :end_hour
                                AND
                                crhd.endMinute >= :end_minute
                            )
                    )
            """)
    List<CalendarRangeHourDay> findAllTeachersAvailableByClassCalendar(@Param("calendar_week_day_ids") List<Integer> calendarWeekDayIds,
                                                                       @Param("language_id") Integer languageId,
                                                                       @Param("start_hour") Integer startHour,
                                                                       @Param("start_minute") Integer startMinute,
                                                                       @Param("end_hour") Integer endHour,
                                                                       @Param("end_minute") Integer endMinute);
}
