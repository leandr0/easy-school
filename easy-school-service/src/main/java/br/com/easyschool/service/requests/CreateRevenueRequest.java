package br.com.easyschool.service.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CreateRevenueRequest {

    @JsonProperty("student_id")
    private Integer studentId;

    private Integer month;

    private Integer year;

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
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
}