package br.com.easyschool.domain.entities.security;

import br.com.easyschool.domain.dto.UserDTO;
import br.com.easyschool.domain.entities.Student;
import br.com.easyschool.domain.entities.Teacher;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

    //@ManyToMany(mappedBy = "users")
    @ManyToMany
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Getter @Setter
    private List<Role> roles;

    @Getter @Setter
    private String name;

    @Getter @Setter
    @JsonProperty("phone_number")
    private String phoneNumber;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    @Getter @Setter
    private Student student;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    @Getter @Setter
    private Teacher teacher;



    public static UserDTO toDto(User u) {
        return new UserDTO(
                u.getId(),
                u.getUsername(),
                u.getName(),
                u.getStudent() != null ? u.getStudent().getId() : (u.getTeacher() != null ? u.getTeacher().getId() : -1),
                u.getStudent() != null ? "student" :  (u.getTeacher() != null ? "teacher" : "admin"),
                u.getRoles().stream().map(Role::getRole).collect(Collectors.toSet())
        );
    }
}
