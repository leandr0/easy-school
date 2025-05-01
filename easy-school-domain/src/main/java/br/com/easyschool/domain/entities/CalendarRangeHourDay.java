package br.com.easyschool.domain.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "calendar_range_hour_day")
public class CalendarRangeHourDay implements EntityBase {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "start_hour", nullable = false)
    @JsonProperty("start_hour")
    private Integer startHour;
    @Column(name = "start_minute", nullable = false)
    @JsonProperty("start_minute")
    private Integer startMinute;
    @Column(name = "end_hour", nullable = false)
    @JsonProperty("end_hour")
    private Integer endHour;
    @Column(name = "end_minute", nullable = false)
    @JsonProperty("end_minute")
    private Integer endMinute;

    @ManyToOne
    @JoinColumn(name = "calendar_week_day_id" , nullable = false)
    @JsonProperty("week_day")
    private CalendarWeekDay calendarWeekDay;

    @ManyToOne
    @JoinColumn(name = "teacher_id" , nullable = false)
    @JsonProperty("teacher")
    private Teacher teacher;

    @Override
    public Integer getId() {
        return id;
    }

    @Override
    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getStartHour() {
        return startHour;
    }

    public void setStartHour(Integer startHour) {
        this.startHour = startHour;
    }

    public Integer getStartMinute() {
        return startMinute;
    }

    public void setStartMinute(Integer startMinute) {
        this.startMinute = startMinute;
    }

    public Integer getEndHour() {
        return endHour;
    }

    public void setEndHour(Integer endHour) {
        this.endHour = endHour;
    }

    public Integer getEndMinute() {
        return endMinute;
    }

    public void setEndMinute(Integer endMinute) {
        this.endMinute = endMinute;
    }

    public CalendarWeekDay getCalendarWeekDay() {
        return calendarWeekDay;
    }

    public void setCalendarWeekDay(CalendarWeekDay calendarWeekDay) {
        this.calendarWeekDay = calendarWeekDay;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }
}
