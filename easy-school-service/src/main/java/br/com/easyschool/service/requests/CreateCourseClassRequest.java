package br.com.easyschool.service.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CreateCourseClassRequest {

    private Integer id;

    private String name;

    @JsonProperty("course_id")
    private Integer courseId;

    @JsonProperty("teacher_id")
    private Integer teacherId;

    @JsonProperty("week_day_ids")
    private int[] weekDays;

    @JsonProperty("duration_hour")
    private Integer durationHour;

    @JsonProperty("duration_minute")
    private Integer durationMinute;

    @JsonProperty("start_hour")
    private Integer startHour;

    @JsonProperty("start_minute")
    private Integer startMinute;



    private Boolean status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public Integer getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
    }

    public int[] getWeekDays() {
        return weekDays;
    }

    public void setWeekDays(int[] weekDays) {
        this.weekDays = weekDays;
    }

    public Integer getDurationHour() {
        return durationHour;
    }

    public void setDurationHour(Integer durationHour) {
        this.durationHour = durationHour;
    }

    public Integer getDurationMinute() {
        return durationMinute;
    }

    public void setDurationMinute(Integer durationMinute) {
        this.durationMinute = durationMinute;
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

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}
