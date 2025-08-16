package br.com.easyschool.service.implementations;

import br.com.easyschool.domain.entities.CalendarRangeHourDay;
import br.com.easyschool.domain.repositories.CalendarRangeHourDayRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;

@Service
@Transactional
public class CalendarRangeHourDayService {

    private final CalendarRangeHourDayRepository repository;

    public CalendarRangeHourDayService(CalendarRangeHourDayRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<CalendarRangeHourDay> fetchAvailabilityTeacher(List<Integer> calendarWeekDayIds,
                                                               Integer languageId,
                                                               Integer startHour,
                                                               Integer startMinute,
                                                               Integer endHour,
                                                               Integer endMinute) {
        return repository.findTeachersAvailableByClassCalendarNotInCourseClass(
                calendarWeekDayIds, languageId, startHour, startMinute, endHour, endMinute);
    }

    @Transactional(readOnly = true)
    public List<CalendarRangeHourDay> findByTeacherId(Integer teacherId) {
        return repository.findCalendarRangeHourDayByTeacherId(teacherId);
    }

    @Transactional
    public void deleteAllById(List<Integer> ids) {
        // Process in batches to avoid long-running transactions
        int batchSize = 50;
        for (int i = 0; i < ids.size(); i += batchSize) {
            List<Integer> batch = ids.subList(i, Math.min(i + batchSize, ids.size()));
            repository.deleteAllById(batch);
            repository.flush(); // Force immediate execution
        }
    }

    @Transactional
    public CalendarRangeHourDay save(CalendarRangeHourDay entity) {
        return repository.save(entity);
    }

    @Transactional
    public List<CalendarRangeHourDay> saveAll(List<CalendarRangeHourDay> entities) {
        // Process in batches for better performance and shorter lock times
        int batchSize = 50;
        List<CalendarRangeHourDay> savedEntities = new java.util.ArrayList<>();

        for (int i = 0; i < entities.size(); i += batchSize) {
            List<CalendarRangeHourDay> batch = entities.subList(i, Math.min(i + batchSize, entities.size()));
            savedEntities.addAll(repository.saveAll(batch));
            repository.flush(); // Force immediate write
        }

        return savedEntities;
    }

    @Transactional
    public Collection<CalendarRangeHourDay> saveAllCollection(Collection<CalendarRangeHourDay> entities) {
        return repository.saveAll(entities);
    }
}