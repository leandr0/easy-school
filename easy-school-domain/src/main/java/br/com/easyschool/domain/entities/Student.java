package br.com.easyschool.domain.entities;


import br.com.easyschool.domain.entities.security.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
@Entity
@Table(name = "student")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter @Setter
    private Integer id;
/**
    @Getter @Setter
    private String name;

    @Column(name = "phone_number")
    @JsonProperty("phone_number")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter @Setter
    private String phoneNumber;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter @Setter
    private String email;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter @Setter
    private Boolean status;
*/
    @Column(name = "due_date")
    @JsonProperty("due_date")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter @Setter
    private Integer dueDate;
/**
    @Column(name = "start_date")
    @JsonProperty("start_date")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter @Setter
    private LocalDateTime startDate;
*/
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "course_class_students",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "course_class_id"))
    @JsonProperty("course_class")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter @Setter
    private Set<CourseClass> courseClasses;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @Getter @Setter
    private User user;

    public Student(){}

    public Student(Integer id){
        this.id = id;
    }

}