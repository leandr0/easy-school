package br.com.easyschool.domain.entities.security;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "roles",
        uniqueConstraints = {@UniqueConstraint( columnNames = {"role"}),
                                @UniqueConstraint(columnNames = {"code"})})
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter @Setter
    private Integer id;

    @Column(name = "role",nullable = false)
    @Getter @Setter
    private String role;

    @Column(name = "code",nullable = false)
    @Getter @Setter
    private Integer code;

    /**
    @ManyToMany
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Getter @Setter
    private List<User> users;
    */

}
