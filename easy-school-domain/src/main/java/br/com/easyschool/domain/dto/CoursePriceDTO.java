package br.com.easyschool.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CoursePriceDTO {


    private Integer id;

    private String name;

    @JsonProperty("course_price")
    private Float coursePrice;


    public CoursePriceDTO(Integer id,String name, Float coursePrice) {
        this.id = id;
        this.name = name;
        this.coursePrice = coursePrice;
    }

    // Default constructor
    public CoursePriceDTO() {}

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

    public Float getCoursePrice() {
        return coursePrice;
    }

    public void setCoursePrice(Float coursePrice) {
        this.coursePrice = coursePrice;
    }
}
