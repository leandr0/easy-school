package br.com.easyschool.service.response.security;

import br.com.easyschool.domain.entities.Student;
import br.com.easyschool.domain.entities.Teacher;
import br.com.easyschool.domain.entities.security.Role;
import br.com.easyschool.domain.entities.security.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
public class UserResponse {

    @Getter @Setter
    private UUID id;

    @Getter @Setter
    private  String username;

    @Getter @Setter
    private  boolean status;

    @JsonProperty("failed_attempts")
    @Getter @Setter
    private  int failedAttempts;

    @JsonProperty("locked_until")
    @Getter @Setter
    private  OffsetDateTime lockedUntil;

    @Getter @Setter
    private List<Role> roles;

    @JsonProperty("created_at")
    @Getter @Setter
    private  OffsetDateTime createdAt;

    @Getter @Setter
    private String name;

    @Getter @Setter
    @JsonProperty("phone_number")
    private String phoneNumber;

    @Getter @Setter
    private Student student;

    @Getter @Setter
    private Teacher teacher;

    public UserResponse(final User entity){

        this.id = entity.getId();
        this.roles = entity.getRoles();
        this.failedAttempts = entity.getFailedAttempts();
        this.lockedUntil = entity.getLockedUntil();
        this.status = entity.isStatus();
        this.username = entity.getUsername();
        this.createdAt = entity.getCreatedAt();
        this.name = entity.getName();
        this.phoneNumber = entity.getPhoneNumber();
        this.student = buildStudent(entity.getStudent());
        this.teacher = buildTeacher(entity.getTeacher());
    }

    private Teacher buildTeacher(Teacher teacher){

        if(teacher != null) {
            teacher.setLanguages(null);
            teacher.setUser(null);
        }

        return teacher;

    }

    private Student buildStudent(Student student){

        if(student != null) {
           student.setUser(null);
           student.setCourseClasses(null);
        }

        return student;

    }

}
