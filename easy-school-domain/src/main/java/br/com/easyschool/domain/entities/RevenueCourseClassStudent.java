package br.com.easyschool.domain.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "revenue_course_class_students" ,
        uniqueConstraints = {@UniqueConstraint( columnNames = {"course_class_id","student_id","revenue_id"})})
public class RevenueCourseClassStudent {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter @Getter
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "revenue_id")
    @JsonProperty("revenue_id")
    @Setter @Getter
    private Revenue revenue;


    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonProperty("student")
    @Setter @Getter
    private Student student;

    @ManyToOne
    @JoinColumn(name = "course_class_id")
    @JsonProperty("course_class")
    @Setter @Getter
    private CourseClass courseClass;


    @Column(name = "course_price",nullable = false)
    @JsonProperty("course_price")
    @Setter @Getter
    private Double coursePrice;

}
