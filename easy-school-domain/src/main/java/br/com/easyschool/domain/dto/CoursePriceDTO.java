package br.com.easyschool.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CoursePriceDTO {

    private String name;

    @JsonProperty("course_price")
    private Float coursePrice;


    public CoursePriceDTO(String name, Float coursePrice) {
        this.name = name;
        this.coursePrice = coursePrice;
    }

    // Default constructor
    public CoursePriceDTO() {}

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
