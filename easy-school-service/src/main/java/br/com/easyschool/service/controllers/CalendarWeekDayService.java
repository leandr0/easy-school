package br.com.easyschool.service.controllers;

import br.com.easyschool.domain.entities.CalendarWeekDay;
import br.com.easyschool.domain.repositories.CalendarWeekDayRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/week-days")
public class CalendarWeekDayService {

    private final CalendarWeekDayRepository repository;


    public CalendarWeekDayService(CalendarWeekDayRepository repository){
        this.repository = repository;
    }

    @GetMapping
    public List<CalendarWeekDay> getAll() {
        return repository.findAll();
    }

}