package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.CalendarWeekDay;
import br.com.easyschool.domain.repositories.CalendarWeekDayRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/week-days")
@Slf4j
@RequiredArgsConstructor
public class CalendarWeekDayGateway {

    private final CalendarWeekDayRepository repository;

    @GetMapping
    public ResponseEntity<List<CalendarWeekDay>> getAll() {
        try {

            List<CalendarWeekDay> result = repository.findAll();

            if(result.isEmpty())
                ResponseEntity.notFound().build();

            return ResponseEntity.ok(result);

        }catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/{id}/course-class")
    public ResponseEntity<List<CalendarWeekDay>> getByCourseClassId(@PathVariable final Integer id) {
        try {

            List<CalendarWeekDay> result = repository.findBydCourseClassId(id);

            if(result.isEmpty())
                ResponseEntity.notFound().build();

            return ResponseEntity.ok(result);

        }catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

}