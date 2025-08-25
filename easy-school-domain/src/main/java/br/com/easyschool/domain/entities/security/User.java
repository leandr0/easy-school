package br.com.easyschool.domain.entities.security;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;
@Entity
@Table(name = "users",
        uniqueConstraints = {@UniqueConstraint( columnNames = {"username"})})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Getter @Setter
    private  UUID id;

    @Column(nullable = false)
    @Getter @Setter
    private  String username;

    @Column(name = "password_hash",nullable = false)
    @JsonProperty("password_hash")
    @Getter @Setter
    private  String passwordHash;

    @Column(nullable = false,insertable = false)
    @Getter @Setter
    private  boolean status;

    @Column(name = "created_at",nullable = false,insertable = false,updatable = false)
    @JsonProperty("created_at")
    @Getter @Setter
    private  OffsetDateTime createdAt;

    @Column(name = "updated_at",nullable = false,insertable = false)
    @JsonProperty("updated_at")
    @Getter @Setter
    private  OffsetDateTime updatedAt;

    @Column(name = "last_login_at",insertable = false)
    @JsonProperty("last_login_at")
    @Getter @Setter
    private  OffsetDateTime lastLoginAt;

    @Column(name = "failed_attempts",nullable = false,insertable = false)
    @JsonProperty("failed_attempts")
    @Getter @Setter
    private  int failedAttempts;

    @Column(name = "locked_until",insertable = false)
    @JsonProperty("locked_until")
    @Getter @Setter
    private  OffsetDateTime lockedUntil;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    @Getter @Setter
    private Role role;
}
