package br.com.easyschool.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CourseClassTeacherDTO {

    @JsonProperty("course_class_id")
    private Integer courseClassId;

    @JsonProperty("course_class_name")
    private String courseClassName;
    @JsonProperty("teacher_id")
    private Integer teacherId;
    @JsonProperty("start_hour")
    private Integer startHour;
    @JsonProperty("start_minute")
    private Integer startMinute;
    @JsonProperty("end_hour")
    private Integer endHour;
    @JsonProperty("end_minute")
    private Integer endMinute;
    @JsonProperty("calendar_week_day_id")
    private Integer calendarWeekDayId;
    @JsonProperty("week_day")
    private String weekDay;

    public CourseClassTeacherDTO(Integer courseClassId, String courseClassName, Integer teacherId, Integer startHour, Integer startMinute, Integer endHour, Integer endMinute, Integer calendarWeekDayId, String weekDay) {
        this.courseClassId = courseClassId;
        this.courseClassName = courseClassName;
        this.teacherId = teacherId;
        this.startHour = startHour;
        this.startMinute = startMinute;
        this.endHour = endHour;
        this.endMinute = endMinute;
        this.calendarWeekDayId = calendarWeekDayId;
        this.weekDay = weekDay;
    }

    public Integer getCourseClassId() {
        return courseClassId;
    }

    public void setCourseClassId(Integer courseClassId) {
        this.courseClassId = courseClassId;
    }

    public String getCourseClassName() {
        return courseClassName;
    }

    public void setCourseClassName(String courseClassName) {
        this.courseClassName = courseClassName;
    }

    public Integer getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
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

    public Integer getCalendarWeekDayId() {
        return calendarWeekDayId;
    }

    public void setCalendarWeekDayId(Integer calendarWeekDayId) {
        this.calendarWeekDayId = calendarWeekDayId;
    }

    public String getWeekDay() {
        return weekDay;
    }

    public void setWeekDay(String weekDay) {
        this.weekDay = weekDay;
    }
}
