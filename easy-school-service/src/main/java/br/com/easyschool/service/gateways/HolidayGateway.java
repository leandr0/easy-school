package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.Holiday;
import br.com.easyschool.domain.repositories.HolidayRepository;
import br.com.easyschool.service.scheduler.holiday.HolidaySyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/holidays")
@RequiredArgsConstructor
@Slf4j
public class HolidayGateway {

    private final HolidayRepository repository;
    private final HolidaySyncService holidaySyncService;

    @PostMapping("/sync")
    public ResponseEntity<?> syncHolidays (@RequestBody Map<String,Integer> request){

        Integer year = request.get("year");
        if (year == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        log.info(" request body {}",request);
        holidaySyncService.syncYear(request.get("year"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{year}/year")
    public ResponseEntity<List<Holiday>> fetchHolidayByYear (@PathVariable("year") final Integer year){

        if (year == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        log.info(" request year {}",year);
        return ResponseEntity.ok().body(repository.findByDateBetween(LocalDate.of(year, 1, 1),
               LocalDate.of(year, 12, 31)));
    }
}
