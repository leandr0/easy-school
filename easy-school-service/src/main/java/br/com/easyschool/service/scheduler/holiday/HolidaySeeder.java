package br.com.easyschool.service.scheduler.holiday;

import br.com.easyschool.domain.entities.Holiday;
import br.com.easyschool.domain.repositories.HolidayRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class HolidaySeeder {

    private final HolidayRepository repo;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedIfEmpty() throws Exception {
        if (repo.count() > 0) {
            log.info("Holiday table already populated, seeder skipped.");
            return;
        }
        ClassPathResource res = new ClassPathResource("seed/holidays-2025.json");
        try (InputStream in = res.getInputStream()) {
            ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());
            List<Map<String, Object>> items = mapper.readValue(in, new TypeReference<>() {});
            for (Map<String, Object> it : items) {
                Holiday h = new Holiday();
                h.setDate(LocalDate.parse((String) it.get("date"))); // 'YYYY-MM-DD'
                h.setName((String) it.get("name"));
                // normalize type -> scope
                String type = ((String) it.getOrDefault("type", "national")).toLowerCase();
                String scope = switch (type) {
                    case "national" -> "national";
                    case "state"    -> "state";
                    case "municipal", "city" -> "city";
                    default -> "national";
                };
                h.setScope(scope);
                h.setRegionCode(null);
                h.setType(type);
                repo.save(h);
            }
            log.info("Seeded {} holidays from classpath JSON.", items.size());
        }
    }
}
