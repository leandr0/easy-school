package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.RevenueMessage;
import br.com.easyschool.domain.entities.Student;
import br.com.easyschool.domain.repositories.RevenueMessageRepository;
import br.com.easyschool.domain.repositories.RevenueRepository;
import br.com.easyschool.domain.repositories.StudentRepository;
import br.com.easyschool.domain.repositories.TechnicalConfigRepository;
import br.com.easyschool.domain.types.TechnicalConfigCodeType;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.Month;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/revenue/messages")
public class RevenueMessageGateway {

    private final Log LOG = LogFactory.getLog(this.getClass());
    private final RevenueMessageRepository repository;

    private final StudentRepository studentRepository;

    private final RevenueRepository revenueRepository;

    private final TechnicalConfigRepository technicalConfigRepository;


    private Student transactionalStudent;

    public RevenueMessageGateway(RevenueMessageRepository repository,
                                 StudentRepository studentRepository,
                                 RevenueRepository revenueRepository,
                                 TechnicalConfigRepository technicalConfigRepository){
        this.repository = repository;
        this.studentRepository = studentRepository;
        this.revenueRepository = revenueRepository;
        this.technicalConfigRepository = technicalConfigRepository;
    }


    @GetMapping
    public RevenueMessage getAll() {
        return repository.findAll().get(0);
    }

    @GetMapping("/payment-message")
    public String getPaymentMessage() {
        return repository.findAll().get(0).getPaymentOverdueMessage();
    }

    @GetMapping("/payment-message/student/{id}")
    public String getPaymentMessageStudent(@PathVariable("id") final Integer studentId) {

        if(transactionalStudent == null)
            transactionalStudent = getStudent(studentId);
        //check the student
        String message =  repository.findAll().get(0).getPaymentOverdueMessage();

        message = buildMessage(message,transactionalStudent);

        transactionalStudent = null;

        return message;
    }


    @GetMapping("/reminder-message/student/{id}")
    public String getReminderMessage(@PathVariable("id") final Integer studentId) {
        if(transactionalStudent == null)
            transactionalStudent = getStudent(studentId);
            //check the student

        String message = repository.findAll().get(0).getReminderMessage();

        message = buildMessage(message,transactionalStudent);

        return message;
    }

    @GetMapping("/reminder-message/student/{id}/link")
    public String getReminderMessageLink(@PathVariable("id") final Integer studentId){

        transactionalStudent = getStudent(studentId);

        return buildLink(transactionalStudent, getReminderMessage(studentId));
    }


    @GetMapping("/payment-message/student/{id}/link")
    public String getPaymentMessageLink(@PathVariable("id") final Integer studentId) throws UnsupportedEncodingException {

        transactionalStudent = getStudent(studentId);

        return buildLink(transactionalStudent,getPaymentMessageStudent(studentId));
    }

    private  String buildLink(final Student student, final String message){

        String link = technicalConfigRepository.fetchParamByCode(TechnicalConfigCodeType.WHATSAPP_LINK.getValue());

        final String PHONE_NUMBER = "{phone_number}";
        final String MESSAGE = "{message}";

        link = link.replace(PHONE_NUMBER,student.getPhoneNumber().replaceAll("\\s", ""))
                .replace(MESSAGE, URLEncoder.encode(message, StandardCharsets.UTF_8));

        return link;

    }

    private Student getStudent(Integer id){
        return studentRepository.findById(id).orElse(null);
    }

    @PostMapping
    public RevenueMessage create(@RequestBody RevenueMessage revenueMessage) {

        return repository.save(revenueMessage);
    }

    private String buildMessage(String message, Student student){

        final String NOME = "{nome}";
        final String DATA = "{data}";
        final String VALOR = "{valor}";

        String amount = String.format("%.2f", getCurrentRevenueAmount(student.getId()));

        message = message.replace(NOME, student.getName())
                .replace(DATA,student.getDueDate().toString())
                .replace(VALOR, amount);



        return message;
    }


    private Double getCurrentRevenueAmount(Integer studentId){
        LocalDate now = LocalDate.now();
        Integer year = now.getYear();
        Month month = now.getMonth();
        Integer monthNumber = now.getMonthValue();

        return revenueRepository.getAmountByStudentIdAndData(studentId,monthNumber,year);
    }
}
