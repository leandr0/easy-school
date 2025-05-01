package br.com.easyschool.service.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CreateCourseClassRequest {

    private Integer id;

    private String name;

    @JsonProperty("course_id")
    private Integer courseId;

    @JsonProperty("teacher_id")
    private Integer teacherId;


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

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}
