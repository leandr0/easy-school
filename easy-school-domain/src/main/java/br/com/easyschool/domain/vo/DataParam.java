package br.com.easyschool.domain.vo;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@AllArgsConstructor
public class DataParam {

    @Getter @Setter
    private int month;

    @Getter @Setter
    private int year;
}
