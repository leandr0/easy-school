package br.com.easyschool.service.response.security;

import br.com.easyschool.domain.entities.security.Role;
import br.com.easyschool.domain.entities.security.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
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
    private Role role;

    @JsonProperty("created_at")
    @Getter @Setter
    private  OffsetDateTime createdAt;

    public UserResponse(final User entity){

        this.id = entity.getId();
        this.role = entity.getRole();
        this.failedAttempts = entity.getFailedAttempts();
        this.lockedUntil = entity.getLockedUntil();
        this.status = entity.isStatus();
        this.username = entity.getUsername();
        this.createdAt = entity.getCreatedAt();
    }

}
