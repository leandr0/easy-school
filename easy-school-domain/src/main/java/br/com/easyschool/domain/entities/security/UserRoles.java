package br.com.easyschool.domain.entities.security;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_roles",
        uniqueConstraints = {@UniqueConstraint( columnNames = {"role_id","user_id"})})
public class UserRoles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Setter
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "role_id",nullable = false)
    @Getter @Setter
    private Role role;

    @ManyToOne
    @JoinColumn(name = "user_id",nullable = false)
    @Getter @Setter
    private User user;
}
