package br.com.easyschool.domain.dto;

import br.com.easyschool.domain.entities.Student;
import br.com.easyschool.domain.entities.security.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.List;

public class StudentDTO {

    @Getter @Setter
    private Integer id;

    @Getter @Setter
    private String name;

    @Getter @Setter
    @JsonProperty("phone_number")
    private String phoneNumber;

    @Getter @Setter
    private String email;

    @Getter @Setter
    private Boolean status;

    @Getter @Setter
    @JsonProperty("due_date")
    private Integer dueDate;

    @Getter @Setter
    @JsonProperty("start_date")
    private OffsetDateTime startDate;

    @Getter @Setter
    @JsonProperty("courses")
    private List<CoursePriceDTO> coursePrice;

    @Getter @Setter
    private User user;

    public StudentDTO setStudent(final Student student){

        this.id = student.getId();
        this.dueDate = student.getDueDate();
        this.user = student.getUser();
        this.user.setStudent(null);
        this.user.setTeacher(null);
        return this;
    }
}
