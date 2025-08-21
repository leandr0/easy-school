package br.com.easyschool.service.scheduler.holiday;

import br.com.easyschool.domain.dto.BrasilApiHolidayDto;
import br.com.easyschool.domain.entities.Holiday;
import br.com.easyschool.domain.repositories.HolidayRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.time.Year;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HolidaySyncService {

    private final HolidayRepository repo;

    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://brasilapi.com.br/api")
            .build();

    @Transactional
    public void syncYear(int year) {

        try {
            List<BrasilApiHolidayDto> api = fetchYear(year);


            LocalDate start = Year.of(year).atMonth(1).atDay(1);
            LocalDate end = Year.of(year).atMonth(12).atEndOfMonth();
            int deleted = repo.deleteByDateBetween(start, end);
            log.info("Deleted {} holiday rows for {}", deleted, year);


            List<Holiday> toSave = api.stream().map(dto -> {
                Holiday h = new Holiday();
                h.setDate(dto.getDate());
                h.setName(dto.getName());

                String scope = normalizeScope(dto.getType());
                h.setScope(scope);
                h.setRegionCode(null);
                h.setType(dto.getType());
                return h;
            }).collect(Collectors.toList());

            repo.saveAll(toSave);
            log.info("Inserted {} holidays for {}", toSave.size(), year);

        }catch (Throwable t){
            log.error("syncYear error {}", t.getMessage());
        }
    }

    private String normalizeScope(String t) {
        if (t == null) return "national";
        t = t.toLowerCase();
        if (t.startsWith("nac") || t.startsWith("nat") || t.equals("national")) return "national";
        if (t.startsWith("est") || t.equals("state")) return "state";
        if (t.startsWith("mun") || t.equals("municipal") || t.equals("city")) return "city";
        return "national";
    }

    private List<BrasilApiHolidayDto> fetchYear(int year) {
        try {
            ResponseEntity<BrasilApiHolidayDto[]> res = restClient.get()
                    .uri("/feriados/v1/{year}", year)
                    .retrieve()
                    .toEntity(BrasilApiHolidayDto[].class);

            BrasilApiHolidayDto[] body = res.getBody();

            if (body == null)
                return List.of();

            return Arrays.stream(body)
                    .filter(h -> h.getDate() != null)
                    .collect(Collectors.toList());
        }catch (Throwable t){
            log.error("brasilapi.com.br error : {}",t.getMessage());
            throw new NoSuchElementException(t.getMessage());
        }
    }
}

