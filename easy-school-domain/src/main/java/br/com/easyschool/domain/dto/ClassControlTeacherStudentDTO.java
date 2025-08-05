package br.com.easyschool.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class ClassControlTeacherStudentDTO {

    private Integer id;

    private Integer day;

    private Integer month;

    private Integer year;

    @JsonProperty("teacher_id")
    private Integer teacherId;

    private List<Integer> students;

    private String content;

    private boolean replacement;

    @JsonProperty("course_class_id")
    private Integer courseClass;

    public ClassControlTeacherStudentDTO(){}
    public ClassControlTeacherStudentDTO(Integer id, Integer day, Integer month, Integer year, Integer teacherId, List<Integer> students, String content, boolean replacement, Integer courseClass) {
        this.id = id;
        this.day = day;
        this.month = month;
        this.year = year;
        this.teacherId = teacherId;
        this.students = students;
        this.content = content;
        this.replacement = replacement;
        this.courseClass = courseClass;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getDay() {
        return day;
    }

    public void setDay(Integer day) {
        this.day = day;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
    }

    public List<Integer> getStudents() {
        return students;
    }

    public void setStudents(List<Integer> students) {
        this.students = students;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isReplacement() {
        return replacement;
    }

    public void setReplacement(boolean replacement) {
        this.replacement = replacement;
    }

    public Integer getCourseClass() {
        return courseClass;
    }

    public void setCourseClass(Integer courseClass) {
        this.courseClass = courseClass;
    }
}
