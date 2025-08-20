package br.com.easyschool.domain.entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;


@Entity
@Table(name = "class_control",
        uniqueConstraints = {@UniqueConstraint( columnNames = {"day","month","year","course_class_id"})})
public class ClassControl implements EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "day",nullable = false)
    private Integer day;
    @Column(name = "year",nullable = false)
    private Integer year;

    @Column(name = "month",nullable = false)
    private Integer month;

    @Column(name = "replacement",nullable = false)
    private Boolean replacement;

    @Column(name = "content",nullable = false)
    private String content;


    @ManyToOne
    @JoinColumn(name = "course_class_id", nullable = false)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("course_class")
    private CourseClass courseClass;

    @Override
    public Integer getId() {
        return id;
    }

    @Override
    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getDay() {
        return day;
    }

    public void setDay(Integer day) {
        this.day = day;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Boolean getReplacement() {
        return replacement;
    }

    public void setReplacement(Boolean replacement) {
        this.replacement = replacement;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public CourseClass getCourseClass() {
        return courseClass;
    }

    public void setCourseClass(CourseClass courseClass) {
        this.courseClass = courseClass;
    }
}
