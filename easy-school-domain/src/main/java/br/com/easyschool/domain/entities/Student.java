package br.com.easyschool.domain.entities;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Set;
@Entity
@Table(name = "student")
public class Student implements EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @Column(name = "phone_number")
    @JsonProperty("phone_number")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String phoneNumber;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String email;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Boolean status;

    @Column(name = "due_date")
    @JsonProperty("due_date")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer dueDate;

    @Column(name = "start_date")
    @JsonProperty("start_date")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private LocalDateTime startDate;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "course_class_students",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "course_class_id"))
    @JsonProperty("course_class")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Set<CourseClass> courseClasses;

    public Student(){}

    public Student(Integer id){
        this.id = id;
    }
    @Override
    public void setId(Integer id) {
        this.id = id;
    }

    @Override
    public Integer getId() {
        return id;
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

    public Set<CourseClass> getCourseClasses() {
        return courseClasses;
    }

    public void setCourseClasses(Set<CourseClass> courseClasses) {
        this.courseClasses = courseClasses;
    }
}