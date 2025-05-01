package br.com.easyschool.domain.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "language" ,
        uniqueConstraints = { @UniqueConstraint( columnNames = {"name"})})
public class Language implements EntityBase{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

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
}