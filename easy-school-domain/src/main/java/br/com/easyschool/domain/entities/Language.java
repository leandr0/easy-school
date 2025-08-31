package br.com.easyschool.domain.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "language" ,
        uniqueConstraints = { @UniqueConstraint( columnNames = {"name"})})
public class Language implements EntityBase{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter @Setter
    private Integer id;

    @Getter @Setter
    private String name;

    @Getter @Setter
    private boolean status = true;

    @JsonProperty("image_url")
    @Getter @Setter
    private String imageUrl;


}