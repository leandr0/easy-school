package br.com.easyschool.service.requests;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

public class CourseClassStudentRequest {

    @JsonProperty("course_class_id")
    @Getter @Setter
    private Integer courseClassId;

    @JsonProperty("student_id")
    @Getter @Setter
    private Integer studentId;

    @JsonProperty("course_price")
    @Getter @Setter
    private Double coursePrice;

}
