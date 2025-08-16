package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.dto.CollectionFormDTO;
import br.com.easyschool.domain.entities.Revenue;
import br.com.easyschool.service.implementations.RevenueService;
import br.com.easyschool.service.requests.CreateRevenueRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/revenues")
@RequiredArgsConstructor
@Slf4j
public class RevenueGateway {

    private final RevenueService service;


    @GetMapping
    public ResponseEntity<List<Revenue>> getAll() {

        try {
            return ResponseEntity.ok(service.getAll());
        }catch (Throwable t){
            log.error("Find revenues {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/student/{id}")
    public ResponseEntity<List<Revenue>> findByStudent(@PathVariable Integer id) {

        try {

            return ResponseEntity.ok(service.findByStudent(id));

        }catch (Throwable t){
            log.error("Find revenues by student {}",t.getMessage());
            return  ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/collection-form")
    public ResponseEntity<List<CollectionFormDTO>> fetchCollectionForm() {
        try {

            return ResponseEntity.ok(service.fetchCollectionForm());

        }catch (Throwable t){
            log.error("Fetch collection form {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/collection-form/student/{id}")
    public ResponseEntity<List<CollectionFormDTO>> fetchCollectionFormByStudent(@PathVariable Integer id) {
        try {

            return ResponseEntity.ok(service.fetchCollectionFormByStudent(id));

        }catch (Throwable t){
            log.error("Fetch collection by student {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}/reminder-message")
    public ResponseEntity<?> sendReminderMessage(@PathVariable("id") final Integer revenueId) {
        try {

            service.sendReminderMessage(revenueId);

            return ResponseEntity.ok().build();

        }catch (Throwable t){
            log.error("Send reminder message by ID {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}/payment-message")
    public ResponseEntity<?> sendPaymentMessage(@PathVariable("id") final Integer revenueId) {
        try {

            service.sendPaymentMessage(revenueId);

            return ResponseEntity.ok().build();

        }catch (Throwable t){
            log.error("Send payment message by ID {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}/payment-status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable("id") final Integer revenueId, @RequestBody Map<String, String> body) {

        try {

            service.updatePaymentStatus(revenueId, body);

            return ResponseEntity.ok().build();

        } catch (Throwable t) {
            log.error("Update payment status by ID {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/collection-form")
    public ResponseEntity<List<Revenue>> createRevenuesFromCollectionForm(@RequestBody @NonNull List<CollectionFormDTO> request) {

        try {

            return ResponseEntity.ok(service.createRevenuesFromCollectionForm(request));

        } catch (Throwable t) {
            log.error("Create revenues from collection form {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Revenue> create(@RequestBody CreateRevenueRequest request) {

        try {
            return ResponseEntity.ok(service.create(request));

        }catch (Throwable t){
            log.error("Create revenues from collection form {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
