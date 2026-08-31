package br.com.easyschool.service.response;

import br.com.easyschool.domain.entities.Teacher;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

public class TeacherResponse {

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
    private Double compensation;

    @Getter @Setter
    @JsonProperty("start_date")
    private OffsetDateTime startDate;

    @Getter @Setter
    private Boolean status;

    public TeacherResponse(){}

    public TeacherResponse(Teacher teacher){
        this.id = teacher.getId();
        this.compensation = teacher.getCompensation();
        this.email  = teacher.getUser().getUsername();
        this.name = teacher.getUser().getName();
        this.phoneNumber = teacher.getUser().getPhoneNumber();
        this.startDate = teacher.getUser().getCreatedAt();
        this.status = teacher.getUser().isStatus();
    }
}
