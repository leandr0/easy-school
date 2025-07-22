package br.com.easyschool.service.gateways;


import br.com.easyschool.domain.entities.Language;
import br.com.easyschool.domain.repositories.LanguageRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/languages")
public class LanguageGateway {

    private final Log LOG = LogFactory.getLog(this.getClass());
    private final LanguageRepository repository;

    public LanguageGateway(LanguageRepository repository){
        this.repository = repository;
    }

    @GetMapping
    public List<Language> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Language create(@RequestBody Language request) {
        return repository.save(request);
    }

}
