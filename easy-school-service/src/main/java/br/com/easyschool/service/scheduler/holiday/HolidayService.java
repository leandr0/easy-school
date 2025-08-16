package br.com.easyschool.service.scheduler.holiday;

import br.com.easyschool.domain.entities.Holiday;
import br.com.easyschool.domain.repositories.HolidayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Set;
@Service
@RequiredArgsConstructor
public class HolidayService {

    private final HolidayRepository repo;

    /** Returns all holiday dates in [start, end] as a Set for fast lookup. */
    public Set<LocalDate> holidaysInRange(LocalDate start, LocalDate end) {
        return repo.findByDateBetween(start, end)
                .stream()
                .map(Holiday::getDate)
                .collect(java.util.stream.Collectors.toSet());
    }

    /** Convenience for a single month. */
    public Set<LocalDate> holidaysInMonth(YearMonth ym) {
        return holidaysInRange(ym.atDay(1), ym.atEndOfMonth());
    }

    /** True if weekend or in the given holiday set. */
    private static boolean isNonBusiness(LocalDate d, Set<LocalDate> holidays) {
        var w = d.getDayOfWeek();
        return w == java.time.DayOfWeek.SATURDAY
                || w == java.time.DayOfWeek.SUNDAY
                || holidays.contains(d);
    }

    /** Shift forward to the next business day (Mon–Fri and not a holiday). */
    public LocalDate shiftToNextBusinessDay(LocalDate d, Set<LocalDate> holidays) {
        while (isNonBusiness(d, holidays)) {
            d = d.plusDays(1);
        }
        return d;
    }
}
