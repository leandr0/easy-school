package br.com.easyschool.service.controllers;

import br.com.easyschool.domain.entities.CalendarRangeHourDay;
import br.com.easyschool.domain.repositories.CalendarRangeHourDayRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/calendar/range-hour-day")
public class CalendarRangeHourDayController {

    private final CalendarRangeHourDayRepository repository;

    public CalendarRangeHourDayController(CalendarRangeHourDayRepository repository) {
        this.repository = repository;

    }


    @GetMapping
    public List<CalendarRangeHourDay> fetchAvailabilityTeacher(@RequestParam(value = "calendar_week_day_ids", required = true) List<Integer> calendarWeekDayIds,
                                                               @RequestParam(value = "language_id", required = true) Integer languageId,
                                                               @RequestParam(value = "start_hour", required = true) Integer startHour,
                                                               @RequestParam(value = "start_minute", required = true) Integer startMinute,
                                                               @RequestParam(value = "end_hour", required = true) Integer endHour,
                                                               @RequestParam(value = "end_minute", required = true) Integer endMinute) {



        return repository.findAllTeachersAvailableByClassCalendar(calendarWeekDayIds,
                languageId,
                startHour,
                startMinute,
                endHour,
                endMinute);
    }


    @PostMapping
    public CalendarRangeHourDay create(@RequestBody CalendarRangeHourDay request) {

        return repository.save(request);
    }

    @PostMapping("/list")
    public Collection<CalendarRangeHourDay> createAll(@RequestBody Collection<CalendarRangeHourDay> request) {
        return repository.saveAll(request);
    }
}
