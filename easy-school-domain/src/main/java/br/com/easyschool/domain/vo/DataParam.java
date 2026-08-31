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

    public boolean isValid(){
        if(this.month > 0 && this.month <=12){
            if(this.year >= 2020 && this.year <= 2050){
                return true;
            }
        }

        return false;
    }
}
