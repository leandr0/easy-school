package br.com.easyschool.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
public class ClassControlCreateDTO {

    @Getter @Setter
    private Integer id;

    @Getter @Setter
    private String date;

    @Getter @Setter
    @JsonProperty("teacher_id")
    private Integer teacherId;

    @Getter @Setter
    private Integer[] students;

    @Getter @Setter
    private String content;

    @Getter @Setter
    private boolean replacement;

    @Getter @Setter
    @JsonProperty("course_class_id")
    private Integer courseClassId;
}
