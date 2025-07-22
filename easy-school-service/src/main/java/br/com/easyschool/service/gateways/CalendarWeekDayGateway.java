package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.CalendarWeekDay;
import br.com.easyschool.domain.repositories.CalendarWeekDayRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/week-days")
public class CalendarWeekDayGateway {

    private final  Log LOG = LogFactory.getLog(this.getClass());


    private final CalendarWeekDayRepository repository;


    public CalendarWeekDayGateway(CalendarWeekDayRepository repository){
        this.repository = repository;
    }

    @GetMapping
    public List<CalendarWeekDay> getAll() {
        return repository.findAll();
    }


    @GetMapping("/{id}/course-class")
    public List<CalendarWeekDay> getByCourseClassId(@PathVariable final Integer id) {
        return repository.findBydCourseClassId(id);
    }

}