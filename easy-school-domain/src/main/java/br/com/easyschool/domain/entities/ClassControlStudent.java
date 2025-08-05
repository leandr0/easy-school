package br.com.easyschool.domain.dto;

import br.com.easyschool.domain.entities.ClassControl;
import br.com.easyschool.domain.entities.EntityBase;
import br.com.easyschool.domain.entities.Student;
import jakarta.persistence.*;

/**
@Entity
@Table(name = "class_control_student",
        uniqueConstraints = {@UniqueConstraint( columnNames = {"class_control_id","student_id"})})*/
public class ClassControlStudent implements EntityBase {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "class_control_id", nullable = false)
    private ClassControl classControl;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Override
    public Integer getId() {
        return id;
    }

    @Override
    public void setId(Integer id) {
        this.id = id;
    }

    public ClassControl getClassControl() {
        return classControl;
    }

    public void setClassControl(ClassControl classControl) {
        this.classControl = classControl;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
}
