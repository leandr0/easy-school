package br.com.easyschool.domain.entities;

import br.com.easyschool.domain.entities.security.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "teacher",
        uniqueConstraints = {@UniqueConstraint( columnNames = {"phone_number","email"})})
public class Teacher implements EntityBase{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter @Setter
    private Integer id;

    @Column(nullable = false)
    @Getter @Setter
    private String name;

    @Column(name = "phone_number",nullable = false)
    @JsonProperty("phone_number")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter @Setter
    private String phoneNumber;
    @Column(nullable = false)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter @Setter
    private String email;

    @Column(nullable = false)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter @Setter
    private Double compensation;

    @Column(nullable = false)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter @Setter
    private Boolean status;

    @Column(name = "start_date")
    @JsonProperty("start_date")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter @Setter
    private LocalDateTime startDate;

    @ManyToMany
    @JoinTable(
            name = "teacher_skill",
            joinColumns = @JoinColumn(name = "teacher_id"),
            inverseJoinColumns = @JoinColumn(name = "language_id")
    )
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter @Setter
    private List<Language> languages;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @Getter @Setter
    private User user;

    public Teacher(){}
    public Teacher(Integer id){
        this.id = id;
    }
}
