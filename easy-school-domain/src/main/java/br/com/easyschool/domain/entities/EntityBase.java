package br.com.easyschool.domain.entities;

import jakarta.persistence.Entity;

import java.io.Serializable;
import java.util.UUID;


public interface EntityBase extends Serializable {


    public void setId(final Integer id);

    public Integer getId();

}
