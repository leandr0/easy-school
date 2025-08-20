package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.RevenueMessage;
import br.com.easyschool.domain.entities.Student;
import br.com.easyschool.domain.repositories.RevenueMessageRepository;
import br.com.easyschool.domain.repositories.RevenueRepository;
import br.com.easyschool.domain.repositories.StudentRepository;
import br.com.easyschool.domain.repositories.TechnicalConfigRepository;
import br.com.easyschool.domain.types.TechnicalConfigCodeType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.Month;
import java.util.List;
import java.util.NoSuchElementException;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/revenue/messages")
@Slf4j
@RequiredArgsConstructor
public class RevenueMessageGateway {

    private final RevenueMessageRepository repository;

    private final StudentRepository studentRepository;

    private final RevenueRepository revenueRepository;

    private final TechnicalConfigRepository technicalConfigRepository;
    private Student transactionalStudent;

    @GetMapping
    public ResponseEntity<RevenueMessage> getAll() {
        try {

            List<RevenueMessage> result = repository.findAll();

            if (result.isEmpty()) {
                log.warn("Revenue Message not found!");
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(result.get(0));

        }catch (Throwable t){
            log.error("Error on getAll {}", t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/payment-message")
    public ResponseEntity<String> getPaymentMessage() {
        try {
            return ResponseEntity.ok(repository.findAll().get(0).getPaymentOverdueMessage());
        }catch (Throwable t){
            log.error("Error on getPaymentMessage {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/payment-message/student/{id}")
    public ResponseEntity<String> getPaymentMessageStudent(@PathVariable("id") final Integer studentId) {

        try {
            if (transactionalStudent == null)
                transactionalStudent = getStudent(studentId);
            //check the student
            String message = repository.findAll().get(0).getPaymentOverdueMessage();

            message = buildMessage(message, transactionalStudent);

            transactionalStudent = null;

            return ResponseEntity.ok(message);

        }catch (Throwable t){
            log.error("Error on getPaymentMessageStudent {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/reminder-message/student/{id}")
    public ResponseEntity<String> getReminderMessage(@PathVariable("id") final Integer studentId) {
        try {
            if (transactionalStudent == null)
                transactionalStudent = getStudent(studentId);
            //check the student

            String message = repository.findAll().get(0).getReminderMessage();

            message = buildMessage(message, transactionalStudent);

            return ResponseEntity.ok(message);

        }catch (Throwable t){
            log.error("Error on getReminderMessage {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/reminder-message/student/{id}/link")
    public ResponseEntity<String> getReminderMessageLink(@PathVariable("id") final Integer studentId){

        try {
            transactionalStudent = getStudent(studentId);

            return ResponseEntity.ok(buildLink(transactionalStudent, getReminderMessage(studentId).getBody()));
        }catch (NoSuchElementException n){
            return ResponseEntity.notFound().build();
        }catch (Throwable t){
            log.error("Error on getReminderMessageLink {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/payment-message/student/{id}/link")
    public ResponseEntity<String>  getPaymentMessageLink(@PathVariable("id") final Integer studentId) throws UnsupportedEncodingException {
        try {
            transactionalStudent = getStudent(studentId);

            return ResponseEntity.ok(buildLink(transactionalStudent, getPaymentMessageStudent(studentId).getBody()));

        }catch (NoSuchElementException n){
            return ResponseEntity.notFound().build();
        }catch (Throwable t){
            log.error("Error on getReminderMessageLink {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    private  String buildLink(final Student student, final String message){

        String link = technicalConfigRepository.fetchParamByCode(TechnicalConfigCodeType.WHATSAPP_LINK.getValue());

        if(link == null || link.isEmpty()) {
            log.warn("WhatsApp link not found ! ");
            throw new NoSuchElementException("WhatsApp link not found ! ");
        }

        final String PHONE_NUMBER = "{phone_number}";
        final String MESSAGE = "{message}";

        link = link.replace(PHONE_NUMBER,student.getPhoneNumber().replaceAll("\\s", ""))
                .replace(MESSAGE, URLEncoder.encode(message, StandardCharsets.UTF_8));

        return link;

    }

    private Student getStudent(Integer id) throws Exception {
        try {
            return studentRepository.findById(id).orElse(null);

        }catch (Throwable t){
            log.error("Error on getStudent {}",t.getMessage());
            throw  new Exception(t.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<RevenueMessage> create(@RequestBody RevenueMessage revenueMessage) {

        try {
            return ResponseEntity.ok(repository.save(revenueMessage));
        }catch (Throwable t){
            log.error("Error on create Revenue Message {}",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    private String buildMessage(String message, Student student) throws Exception {
        try {
            final String NOME = "{nome}";
            final String DATA = "{data}";
            final String VALOR = "{valor}";

            String amount = String.format("%.2f", getCurrentRevenueAmount(student.getId()));

            message = message.replace(NOME, student.getName())
                    .replace(DATA, student.getDueDate().toString())
                    .replace(VALOR, amount);


            return message;
        }catch (Throwable t){
            log.error("Error on buildMessage {}",t.getMessage());
            throw new Exception(t.getMessage());
        }
    }


    private Double getCurrentRevenueAmount(Integer studentId) throws Exception {
        try {
            LocalDate now = LocalDate.now();
            Integer year = now.getYear();
            Month month = now.getMonth();
            Integer monthNumber = now.getMonthValue();

            return revenueRepository.getAmountByStudentIdAndData(studentId, monthNumber, year);
        }catch (Throwable t){
            log.error("Error on getCurrentRevenueAmount {}",t.getMessage());
            throw new Exception(t.getMessage());
        }
    }
}
