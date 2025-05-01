package br.com.easyschool.domain.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "course_class_calendar")
public class CourseClassCalendar implements EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "course_class_id")
    @JsonProperty("course_class_id")
    private CourseClass courseClass;

    @ManyToOne
    @JoinColumn(name = "calendar_week_day_id")
    @JsonProperty("calendar_week_day_id")
    private CalendarWeekDay calendarWeekDay;

    @Override
    public Integer getId() {
        return id;
    }

    @Override
    public void setId(Integer id) {
        this.id = id;
    }

    public CourseClass getCourseClass() {
        return courseClass;
    }

    public void setCourseClass(CourseClass courseClass) {
        this.courseClass = courseClass;
    }

    public CalendarWeekDay getCalendarWeekDay() {
        return calendarWeekDay;
    }

    public void setCalendarWeekDay(CalendarWeekDay calendarWeekDay) {
        this.calendarWeekDay = calendarWeekDay;
    }
}