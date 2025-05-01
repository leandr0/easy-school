package br.com.easyschool.service.controllers;


import br.com.easyschool.domain.entities.Language;
import br.com.easyschool.domain.repositories.LanguageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/languages")
public class LanguageController {

    private final LanguageRepository repository;

    public LanguageController(LanguageRepository repository){
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
