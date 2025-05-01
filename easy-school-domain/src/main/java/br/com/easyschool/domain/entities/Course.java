package br.com.easyschool.domain.entities;


import jakarta.persistence.*;

@Entity
@Table(name = "course",
        uniqueConstraints = {@UniqueConstraint( columnNames = {"name"})})
public class Course implements EntityBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private Boolean status;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }
}
