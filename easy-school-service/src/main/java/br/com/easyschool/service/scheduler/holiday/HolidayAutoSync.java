package br.com.easyschool.service.scheduler.holiday;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class HolidayAutoSync {

    private final HolidaySyncService holidaySyncService;

    @EventListener(ApplicationReadyEvent.class)
    public void syncOnBoot() {
        int year = java.time.LocalDate.now().getYear();
        holidaySyncService.syncYear(year);
        // Optionally prefetch next year late in the year
        if (java.time.LocalDate.now().getMonthValue() >= 11) {
            holidaySyncService.syncYear(year + 1);
        }
    }

    // Also run every Dec 1st at 03:00 to fetch next year
    @Scheduled(cron = "0 0 3 1 12 ?")
    public void prefetchNextYear() {
        int nextYear = java.time.LocalDate.now().getYear() + 1;
        holidaySyncService.syncYear(nextYear);
    }
}

