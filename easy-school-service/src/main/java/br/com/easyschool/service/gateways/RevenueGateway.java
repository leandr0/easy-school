package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.dto.CollectionFormDTO;
import br.com.easyschool.domain.entities.Revenue;
import br.com.easyschool.service.implementations.RevenueService;
import br.com.easyschool.service.requests.CreateRevenueRequest;
import br.com.easyschool.domain.vo.DataParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize( "hasRole('ADMIN')")
    @GetMapping("/date-range")
    public ResponseEntity<List<Revenue>> getRevenuesByRangeData(@RequestParam(value = "start_month", required = true) Integer startMonth,
                                                                @RequestParam(value = "start_year", required = true) Integer startYear,
                                                                @RequestParam(value = "end_month", required = true) Integer endMonth,
                                                                @RequestParam(value = "end_year", required = true) Integer endYear) {

        try {
            return ResponseEntity.ok(service.fetchByDataRange(new DataParam(startMonth,startYear),new DataParam(endMonth,endYear)));
        }catch (Throwable t){
            log.error("Find revenues {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize( "hasRole('ADMIN')")
    @GetMapping("/student/{id}")
    public ResponseEntity<List<Revenue>> findByStudent(@PathVariable Integer id) {

        try {

            return ResponseEntity.ok(service.findByStudent(id));

        }catch (Throwable t){
            log.error("Find revenues by student {}",t.getMessage());
            return  ResponseEntity.internalServerError().build();
        }
    }
    @PreAuthorize( "hasRole('ADMIN')")
    @GetMapping("/collection-form")
    public ResponseEntity<List<CollectionFormDTO>> fetchCollectionForm() {
        try {

            return ResponseEntity.ok(service.fetchCollectionForm());

        }catch (Throwable t){
            log.error("Fetch collection form {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    @PreAuthorize( "hasRole('ADMIN')")
    @GetMapping("/collection-form/student/{id}")
    public ResponseEntity<List<CollectionFormDTO>> fetchCollectionFormByStudent(@PathVariable Integer id) {
        try {

            return ResponseEntity.ok(service.fetchCollectionFormByStudent(id));

        }catch (Throwable t){
            log.error("Fetch collection by student {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize( "hasRole('ADMIN')")
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
    @PreAuthorize( "hasRole('ADMIN')")
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
    @PreAuthorize( "hasRole('ADMIN')")
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
    @PreAuthorize( "hasRole('ADMIN')")
    @PostMapping("/collection-form")
    public ResponseEntity<List<Revenue>> createRevenuesFromCollectionForm(@RequestBody @NonNull List<CollectionFormDTO> request) {

        try {

            return ResponseEntity.ok(service.createRevenuesFromCollectionForm(request));

        } catch (Throwable t) {
            log.error("Create revenues from collection form {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    //TODO: Criar Lógica para criar por estudante em períodos anteriores
    @PreAuthorize( "hasRole('ADMIN')")
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
