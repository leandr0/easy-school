package br.com.easyschool.service.requests;

import br.com.easyschool.domain.entities.CalendarRangeHourDay;
import br.com.easyschool.domain.entities.Teacher;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Collection;

public class CreateAllCalendarRangeHourDayRequest {

    @JsonProperty("teacher")
    private Teacher teacher;

    @JsonProperty("calendar_range_hour_days")
    Collection<CalendarRangeHourDay> calendarRangeHourDays;

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    public Collection<CalendarRangeHourDay> getCalendarRangeHourDays() {
        return calendarRangeHourDays;
    }

    public void setCalendarRangeHourDays(Collection<CalendarRangeHourDay> calendarRangeHourDays) {
        this.calendarRangeHourDays = calendarRangeHourDays;
    }
}
