package br.com.easyschool.service.requests;

import br.com.easyschool.domain.dto.CollectionFormDTO;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
public class CreateRevenuesFromCollectionForm {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter @Setter
    private List<CollectionFormDTO> collection;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter @Setter
    private LocalDate date;
}