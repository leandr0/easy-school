package br.com.easyschool.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
public class CoursePriceDTO {

    @Setter @Getter
    private Integer id;

    @Setter @Getter
    private String name;

    @Setter @Getter
    @JsonProperty("course_price")
    private Double coursePrice;

}
