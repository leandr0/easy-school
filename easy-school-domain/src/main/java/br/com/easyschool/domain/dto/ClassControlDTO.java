package br.com.easyschool.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ClassControlDTO {

    private Integer id;

    private String date;

    @JsonProperty("teacher_id")
    private Integer teacherId;

    private Integer[] students;

    private String content;

    private boolean replacement;

    @JsonProperty("course_class_id")
    private Integer courseClass;

    public ClassControlDTO(){}

    public ClassControlDTO(Integer id, String date, Integer teacherId, Integer[] students, String content, boolean replacement, Integer courseClass) {
        this.id = id;
        this.date = date;
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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Integer getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
    }

    public Integer[] getStudents() {
        return students;
    }

    public void setStudents(Integer[] students) {
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
