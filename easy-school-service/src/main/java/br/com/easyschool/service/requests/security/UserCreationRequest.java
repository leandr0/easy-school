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

    @Getter @Setter
    @JsonProperty("password_hash")
    private String passwordHash;

    @Getter @Setter
    private List<Role> roles;

    @Getter @Setter
    private Boolean status;
}
