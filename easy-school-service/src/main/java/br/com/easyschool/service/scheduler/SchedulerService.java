package br.com.easyschool.service.scheduler;

import br.com.easyschool.domain.entities.ScheduledJob;
import br.com.easyschool.domain.repositories.ScheduledJobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class SchedulerService {

    private final ThreadPoolTaskScheduler taskScheduler;
    private final ScheduledJobRepository repo;
    private final JobRunner jobRunner;

    private final Map<Integer, ScheduledFuture<?>> futures = new ConcurrentHashMap<>();

    @EventListener(ApplicationReadyEvent.class)
    public void loadAndScheduleAll() {
        repo.findByActiveTrue().forEach(this::scheduleJobSafe);
    }

    @Transactional
    public void reloadJob(Integer jobId) {
        futures.computeIfPresent(jobId, (id, f) -> { f.cancel(false); return null; });
        repo.findById(jobId).ifPresent(job -> {
            if (Boolean.TRUE.equals(job.getActive())) scheduleJobSafe(job);
        });
    }


    @Transactional
    public void reloadAll() {
        // cancel & clear first (to avoid stale futures)
        futures.forEach((id, f) -> { if (f != null) f.cancel(false); });
        futures.clear();
        repo.findByActiveTrue().forEach(this::scheduleJobSafe);
    }

    public void cancel(Integer jobId) {
        ScheduledFuture<?> f = futures.remove(jobId);
        if (f != null) {
            f.cancel(false);
            log.info("Cancelled job {}", jobId);
        }
    }

    private void scheduleJobSafe(ScheduledJob job) {
        futures.compute(job.getId(), (id, existing) -> {
            if (existing != null && !existing.isCancelled()) {
                existing.cancel(false);
                log.info("Rescheduled job {} ({})", job.getName(), id);
            }
            return schedule(job);
        });
    }


    private ScheduledFuture<?> schedule(ScheduledJob job) {
        Runnable task = () -> runJob(job.getId());
        if ("CRON".equalsIgnoreCase(job.getType())) {
            CronTrigger trigger = new CronTrigger(job.getCronExpression());
            return taskScheduler.schedule(task, trigger);
        } else if ("FIXED_RATE".equalsIgnoreCase(job.getType())) {
            return taskScheduler.scheduleAtFixedRate(task, Duration.ofMillis(job.getIntervalMs()));
        } else if ("FIXED_DELAY".equalsIgnoreCase(job.getType())) {
            long initial = job.getInitialDelayMs() == null ? 0L : job.getInitialDelayMs();
            return taskScheduler.schedule(() -> runFixedDelay(task, job.getIntervalMs()),
                    Instant.now().plusMillis(initial));
        } else {
            throw new IllegalArgumentException("Unknown type " + job.getType());
        }
    }

    private void runFixedDelay(Runnable task, Long delayMs) {
        try {
            task.run();
        } finally {
            taskScheduler.schedule(() -> runFixedDelay(task, delayMs),
                    Instant.now().plusMillis(delayMs));
        }
    }

    @Transactional
    void runJob(Integer jobId) {
        repo.findById(jobId).ifPresent(job -> {
            try {
                jobRunner.execute(job);
                job.setLastStatus("SUCCESS");
            } catch (Exception e) {
                log.error("Job {} failed", job.getName(), e);
                job.setLastStatus("FAILED");
            } finally {
                job.setLastRunAt(Instant.now());
                repo.save(job);
            }
        });
    }
}
