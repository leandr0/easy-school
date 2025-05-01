package br.com.easyschool.service.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CreateCourseClassSudentListRequest {

    @JsonProperty("course_class_id")
    private Integer courseClassId;

    @JsonProperty("student_ids")
    private Integer[] studentIds;

    public Integer getCourseClassId() {
        return courseClassId;
    }

    public void setCouuseClassId(Integer courseClassId) {
        this.courseClassId = courseClassId;
    }

    public Integer[] getStudentIds() {
        return studentIds;
    }

    public void setStudentIds(Integer[] studentIds) {
        this.studentIds = studentIds;
    }
}