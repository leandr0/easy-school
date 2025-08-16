package br.com.easyschool.service.scheduler;

import br.com.easyschool.service.scheduler.holiday.HolidayService;
import br.com.easyschool.service.scheduler.payment.VerifyPaymentsJob;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.*;
import java.util.Date;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class MonthlyVerificationPlanner {

    private final Scheduler quartz;
    private final HolidayService holidayService;

    private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");
    private static final String JOB_KEY = "verifyPaymentsJob"; // single durable JobDetail

    // Run at 00:05 on the 1st of every month (São Paulo time)
    @Scheduled(cron = "0 5 0 1 * ?", zone = "America/Sao_Paulo")
    public void plan() throws SchedulerException {
        YearMonth ym = YearMonth.now(ZONE);

        // Buffer a week into next month to cover shifts crossing month boundary
        LocalDate start = ym.atDay(1);
        LocalDate end   = ym.plusMonths(1).atDay(7);
        Set<LocalDate> holidays = holidayService.holidaysInRange(start, end);

        planForBaseDay(ym, 5,  holidays);
        planForBaseDay(ym, 10, holidays);
        planForBaseDay(ym, 20, holidays);
    }

    private void planForBaseDay(YearMonth ym, int baseDay, Set<LocalDate> holidays) throws SchedulerException {
        LocalDate due = ym.atDay(baseDay);
        LocalDate shifted = holidayService.shiftToNextBusinessDay(due, holidays);
        LocalDate verification = shifted.plusDays(1);

        ZonedDateTime zdt = verification.atStartOfDay(ZONE);
        Date fireTime = Date.from(zdt.toInstant());

        // Keys
        String trigName = "verify-" + ym + "-" + baseDay; // e.g. verify-2025-08-5
        TriggerKey tk = TriggerKey.triggerKey(trigName);
        JobKey jk = JobKey.jobKey(JOB_KEY);

        // Ensure one durable JobDetail exists
        if (!quartz.checkExists(jk)) {
            JobDetail job = JobBuilder.newJob(VerifyPaymentsJob.class)
                    .withIdentity(jk)
                    .storeDurably()
                    .build();
            quartz.addJob(job, false);
        }

        // Build (or rebuild) the trigger
        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity(tk)
                .forJob(jk)
                .startAt(fireTime)
                .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                        .withMisfireHandlingInstructionFireNow())
                .usingJobData("baseDay", baseDay)
                .usingJobData("plannedMonth", ym.getMonthValue())
                .usingJobData("plannedYear", ym.getYear())
                .build();

        if (quartz.checkExists(tk)) {
            quartz.rescheduleJob(tk, trigger);
            log.info("Rescheduled verification trigger {} → fires {}", trigName, fireTime);
        } else {
            quartz.scheduleJob(trigger);
            log.info("Scheduled verification trigger {} → fires {}", trigName, fireTime);
        }
    }
}
