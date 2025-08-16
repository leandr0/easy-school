package br.com.easyschool.service.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SchedulerReloader {

    private final SchedulerService scheduler;

    @Scheduled(fixedDelayString = "PT30S") // every 30s
    public void refresh() { scheduler.reloadAll(); }
}

