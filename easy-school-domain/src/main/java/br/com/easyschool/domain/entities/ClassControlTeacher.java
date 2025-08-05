package br.com.easyschool.domain.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "class_control_teacher",
        uniqueConstraints = {@UniqueConstraint( columnNames = {"class_control_id","teacher_id"})})
public class CouseControlTeacher implements EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "class_control_id", nullable = false)
    private ClassControl classControl;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

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

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }
}
