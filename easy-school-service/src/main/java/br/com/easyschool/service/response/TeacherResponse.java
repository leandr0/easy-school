package br.com.easyschool.service.response;

import br.com.easyschool.domain.entities.Teacher;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public class TeacherResponse {

    private Integer id;
    private String name;

    @JsonProperty("phone_number")
    private String phoneNumber;

    private String email;

    private Double compensation;

    @JsonProperty("start_date")
    private LocalDateTime startDate;

    public TeacherResponse(){}

    public TeacherResponse(Teacher teacher){
        this.id = teacher.getId();
        this.compensation = teacher.getCompensation();
        this.email  = teacher.getEmail();
        this.name = teacher.getName();
        this.phoneNumber = teacher.getPhoneNumber();
        this.startDate = teacher.getStartDate();
    }

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

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getCompensation() {
        return compensation;
    }

    public void setCompensation(Double compensation) {
        this.compensation = compensation;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

}
