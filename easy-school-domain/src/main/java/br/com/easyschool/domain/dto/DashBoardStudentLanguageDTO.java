package br.com.easyschool.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
public class DashBoardStudentLanguageDTO {

    @Getter @Setter
    private String name;

    @Getter @Setter
    @JsonProperty("image_url")
    private String imageURL;

    @Getter @Setter
    @JsonProperty("total_students")
    private Integer totalStudents;
}
