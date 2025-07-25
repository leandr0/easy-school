package br.com.easyschool.domain.entities;

import jakarta.persistence.*;
@Entity
@Table(name = "technical_config",
        uniqueConstraints = {@UniqueConstraint( columnNames = {"code"})})
public class TechnicalConfig implements EntityBase{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private int code;

    @Column(nullable = false)
    private String param;

    @Override
    public Integer getId() {
        return id;
    }

    @Override
    public void setId(Integer id) {
        this.id = id;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getParam() {
        return param;
    }

    public void setParam(String param) {
        this.param = param;
    }
}
