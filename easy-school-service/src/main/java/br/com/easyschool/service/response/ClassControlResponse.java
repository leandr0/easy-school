package br.com.easyschool.service.response;

import br.com.easyschool.domain.entities.ClassControl;
import br.com.easyschool.domain.entities.Student;
import br.com.easyschool.domain.entities.Teacher;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
public class ClassControlResponse {

    @Getter @Setter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("class_control")
    private ClassControl classControl;

    @Getter @Setter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<Student> students;

    @Getter @Setter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Teacher teacher;
}
