package br.com.easyschool.service.scheduler.payment;

import br.com.easyschool.domain.repositories.RevenueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;

@RequiredArgsConstructor
@Slf4j
public class VerifyPaymentsJob implements Job {


    private final RevenueRepository revenueRepository;
    @Override
    public void execute(JobExecutionContext ctx) {

        JobDataMap data = ctx.getMergedJobDataMap();

        int baseDay = data.getInt("baseDay");
        int month = data.getInt("plannedMonth");
        int year = data.getInt("plannedYear");

        try {
            revenueRepository.updateRevenueStatusByJobVerification(baseDay, month, year);
        }catch (Throwable t){
            log.error("Error Update Revenues {} ",t.getMessage());
        }

        log.info("Revenues updated for due date {} , month {} and year {}",baseDay,month,year);

    }
}

