package br.com.easyschool.domain.dto;

import br.com.easyschool.domain.entities.Student;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

public class StudentDTO {
    private Integer id;

    private String name;

    @JsonProperty("phone_number")
    private String phoneNumber;

    private String email;

    private Boolean status;
    @JsonProperty("due_date")
    private Integer dueDate;

    @JsonProperty("start_date")
    private LocalDateTime startDate;

    @JsonProperty("courses")
    private List<CoursePriceDTO> coursePrice;


    public StudentDTO setStudent(final Student student){

        this.id = student.getId();
        this.name = student.getName();
        this.status = student.getStatus();
        this.dueDate = student.getDueDate();
        this.email = student.getEmail();
        this.phoneNumber = student.getPhoneNumber();
        this.startDate = student.getStartDate();

        return this;
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

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public Integer getDueDate() {
        return dueDate;
    }

    public void setDueDate(Integer dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public List<CoursePriceDTO> getCoursePrice() {
        return coursePrice;
    }

    public void setCoursePrice(List<CoursePriceDTO> coursePrice) {
        this.coursePrice = coursePrice;
    }
}
