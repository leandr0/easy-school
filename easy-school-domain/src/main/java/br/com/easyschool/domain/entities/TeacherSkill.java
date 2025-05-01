package br.com.easyschool.domain.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "teacher_skill" ,
        uniqueConstraints = { @UniqueConstraint( columnNames = {"teacher_id","language_id"})})
public class TeacherSkill implements EntityBase{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;
    @ManyToOne
    @JoinColumn(name = "language_id", nullable = false)
    private Language language;

    @Override
    public Integer getId() {
        return id;
    }

    @Override
    public void setId(Integer id) {
        this.id = id;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }
}
