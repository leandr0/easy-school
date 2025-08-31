package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.CalendarRangeHourDay;
import br.com.easyschool.domain.entities.Teacher;
import br.com.easyschool.domain.repositories.CalendarRangeHourDayRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/calendar/range-hour-days")
@Slf4j
@RequiredArgsConstructor
public class CalendarRangeHourDayGateway {

    private final CalendarRangeHourDayRepository repository;

    @GetMapping("teacher/available")
    public List<CalendarRangeHourDay> fetchAvailabilityTeacher(@RequestParam(value = "calendar_week_day_ids", required = true) List<Integer> calendarWeekDayIds,
                                                               @RequestParam(value = "language_id", required = true) Integer languageId,
                                                               @RequestParam(value = "start_hour", required = true) Integer startHour,
                                                               @RequestParam(value = "start_minute", required = true) Integer startMinute,
                                                               @RequestParam(value = "end_hour", required = true) Integer endHour,
                                                               @RequestParam(value = "end_minute", required = true) Integer endMinute) {


        return repository.findTeachersAvailableByClassCalendarNotInCourseClass(calendarWeekDayIds,
                languageId,
                startHour,
                startMinute,
                endHour,
                endMinute);
    }


    @GetMapping("/teacher/{id}")
    public ResponseEntity<List<CalendarRangeHourDay>> fetchByTeacherId(@PathVariable(value = "id", required = true) Integer teacherId) {

        List<CalendarRangeHourDay> result = null;

        try {
            result = repository.findCalendarRangeHourDayByTeacherId(teacherId);

            if(result.isEmpty())
                return ResponseEntity.notFound().build();

        }catch (Throwable t){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }


    @DeleteMapping("resources")
    public ResponseEntity delete(@RequestParam(value = "ids", required = true) List<Integer> ids) {

        try {
            repository.deleteAllById(ids);
        }catch (Throwable t){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping
    public CalendarRangeHourDay create(@RequestBody CalendarRangeHourDay request) {

        return repository.save(request);
    }


    @PostMapping("/teacher/{id}")
    public ResponseEntity<List<CalendarRangeHourDay>> createByTeacher(@PathVariable("id") Integer teacherId, @RequestBody @Valid List<CalendarRangeHourDay> request) {

        if (request == null || request.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {

            Teacher teacher = new Teacher(teacherId);

            // Use stream API for cleaner transformation
            List<CalendarRangeHourDay> calendarEntries = request.stream()
                    .map(entry -> {
                        entry.setTeacher(teacher);
                        return entry;
                    })
                    .collect(Collectors.toList());

            List<CalendarRangeHourDay> savedEntries = repository.saveAll(calendarEntries);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedEntries);

        } catch (DataIntegrityViolationException e) {
            log.warn("Data integrity violation while creating calendar entries for teacher {}: {}",
                    teacherId, e.getMessage());
            return ResponseEntity.badRequest().build();

        } catch (Exception e) {
            log.error("Unexpected error while creating calendar entries for teacher {}: {}",
                    teacherId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/list")
    public Collection<CalendarRangeHourDay> createAll(@RequestBody Collection<CalendarRangeHourDay> request) {
        return repository.saveAll(request);
    }
}