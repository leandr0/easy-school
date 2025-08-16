package br.com.easyschool.service.scheduler;

import br.com.easyschool.domain.dto.CollectionFormDTO;
import br.com.easyschool.domain.entities.ScheduledJob;
import br.com.easyschool.service.implementations.RevenueService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class JobRunner {


    private final RevenueService revenueService;

    private final ObjectMapper mapper = new ObjectMapper();

    public void execute(ScheduledJob job) throws Exception {
        // Route the job to the correct logic based on name
        switch (job.getName()) {
            case "reconcile-payments" -> reconcilePayments(job);
            case "send-dunning-emails" -> sendDunning(job);
            default -> log.info("No matching logic for job {} " , job.getName());
        }
    }

    private void reconcilePayments(ScheduledJob job) throws Exception {
        Map<String, Object> payload = parsePayload(job.getPayloadJson());
        log.info("Reconciling payments with payload: {}", payload);
        List<CollectionFormDTO> collectionFormDTOS = revenueService.fetchCollectionForm();
        revenueService.createRevenuesFromCollectionForm(collectionFormDTOS);
    }

    private void sendDunning(ScheduledJob job) throws Exception {
        Map<String, Object> payload = parsePayload(job.getPayloadJson());
        log.info("Sending dunning emails with payload: {}", payload);
        // Implement your email sending logic here
    }

    private Map<String, Object> parsePayload(String json) throws Exception {
        if (json == null || json.isBlank()) return Map.of();
        return mapper.readValue(json, new TypeReference<>() {});
    }
}
