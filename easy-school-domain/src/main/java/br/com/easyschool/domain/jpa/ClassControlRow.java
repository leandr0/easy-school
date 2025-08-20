package br.com.easyschool.domain.jpa;

import com.fasterxml.jackson.annotation.JsonProperty;

public interface ClassControlRow {
    @JsonProperty("id")
    Integer getClassControlId();
    @JsonProperty("day")
    Integer getDay();
    @JsonProperty("month")
    Integer getMonth();
    @JsonProperty("year")
    Integer getYear();
    @JsonProperty("content")
    String  getContent();
    @JsonProperty("replacement")
    Boolean getReplacement();

    @JsonProperty("course_class_id")
    Integer getCourseClassId();
    @JsonProperty("course_class_name")
    String  getCourseClassName();
    @JsonProperty("course_class_status")
    Boolean getCourseClassStatus();
    @JsonProperty("course_class_start_hour")
    Integer getCourseClassStartHour();
    @JsonProperty("course_class_start_minute")
    Integer getCourseClassStartMinute();
    @JsonProperty("course_class_end_hour")
    Integer getCourseClassEndHour();
    @JsonProperty("course_class_end_minute")
    Integer getCourseClassEndMinute();

    @JsonProperty("teacher_id")
    Integer getTeacherId();  // from cct.teacher_id
    @JsonProperty("teacher_name")
    String getTeacherName();
    @JsonProperty("student_id")
    Integer getStudentId();  // from ccs.student_id

    @JsonProperty("student_name")
    String getStudentName();
}
