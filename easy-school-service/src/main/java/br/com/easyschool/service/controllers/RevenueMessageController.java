package br.com.easyschool.service.controllers;

import br.com.easyschool.domain.entities.RevenueMessage;
import br.com.easyschool.domain.entities.Student;
import br.com.easyschool.domain.repositories.RevenueMessageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/revenue_messages")
public class RevenueMessageController {

    private final RevenueMessageRepository repository;

    public RevenueMessageController(RevenueMessageRepository repository){
        this.repository = repository;
    }


    @GetMapping
    public List<RevenueMessage> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public RevenueMessage create(@RequestBody RevenueMessage revenueMessage) {

        return repository.save(revenueMessage);
    }

}
