package br.com.easyschool.domain.entities.security;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "role_paths",
        uniqueConstraints = {@UniqueConstraint( columnNames = {"role_id","path"})})
public class RolePath {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter @Setter
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    @Getter @Setter
    private Role role;

    @Column(nullable = false)
    @Getter @Setter
    private String path;
}
