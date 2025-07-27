package br.com.easyschool.domain.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "course_class_students" ,
        uniqueConstraints = {@UniqueConstraint( columnNames = {"course_class_id","student_id"})})
public class CourseClassStudent implements EntityBase{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "course_class_id")
    @JsonProperty("course_class")
    private CourseClass courseClass;


    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonProperty("student")
    private Student student;

    @Column(name = "course_price",nullable = false)
    @JsonProperty("course_price")
    private Double coursePrice;

    @Override
    public void setId(Integer id) {
        this.id = id;
    }

    @Override
    public Integer getId() {
        return this.id;
    }

    public CourseClass getCourseClass() {
        return courseClass;
    }

    public void setCourseClass(CourseClass courseClass) {
        this.courseClass = courseClass;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Double getCoursePrice() {
        return coursePrice;
    }

    public void setCoursePrice(Double coursePrice) {
        this.coursePrice = coursePrice;
    }
}