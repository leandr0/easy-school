package br.com.easyschool.service.requests.security;

import br.com.easyschool.domain.entities.security.Role;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

public class UserCreationRequest {


    @Getter
    @Setter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private UUID id;

    @Getter
    @Setter
    private String username;

    @Getter
    @Setter
    private String name;

    @Getter
    @Setter
    @JsonProperty("phone_number")
    private String phoneNumber;

    @Getter @Setter
    @JsonProperty("password_hash")
    private String passwordHash;

    @Getter @Setter
    private List<Role> roles;

    @Getter @Setter
    private Boolean status;

    /** Present only when the ADMIN is creating/editing a user with the TEACHER role. */
    @Getter @Setter
    private TeacherPayload teacher;

    /** Present only when the ADMIN is creating/editing a user with the STUDENT role. */
    @Getter @Setter
    private StudentPayload student;

    public static class TeacherPayload {
        /** Raw BRL-formatted value from the UI (e.g. "1234,56"). */
        @Getter @Setter
        private String compensation;
    }

    public static class StudentPayload {
        @Getter @Setter
        @JsonProperty("due_date")
        private String dueDate;
    }
}
