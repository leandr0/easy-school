package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.dto.CollectionFormDTO;
import br.com.easyschool.domain.entities.Revenue;
import br.com.easyschool.domain.entities.Student;
import br.com.easyschool.domain.repositories.RevenueRepository;
import br.com.easyschool.domain.repositories.StudentRepository;
import br.com.easyschool.domain.types.RevenueType;
import br.com.easyschool.service.requests.CreateRevenueRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Month;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/revenues")
public class RevenueGateway {

    private final Log LOG = LogFactory.getLog(this.getClass());
    private final RevenueRepository repository;

    private final StudentRepository studentRepository;

    public RevenueGateway(RevenueRepository repository, StudentRepository studentRepository) {
        this.repository = repository;
        this.studentRepository = studentRepository;
    }


    @GetMapping
    public List<Revenue> getAll() {
        return repository.findAll();
    }


    @GetMapping("/student/{id}")
    public List<Revenue> findByStudent(@PathVariable Integer id) {
        return repository.findByStudentId(id);
    }

    @GetMapping("/collection-form")
    public List<CollectionFormDTO> fetchCollectionForm() {
        return repository.fetchCollectionForms();
    }

    @GetMapping("/collection-form/student/{id}")
    public List<CollectionFormDTO> fetchCollectionFormByStudent(@PathVariable Integer id) {
        return repository.fetchCollectionFormByStudent(id);
    }

    @PutMapping("/{id}/reminder-message")
    public void sendReminderMessage(@PathVariable("id") final Integer revenueId) {
        repository.setReminderSentAsTrue(revenueId);
    }

    @PutMapping("/{id}/payment-message")
    public void sendPaymentMessage(@PathVariable("id") final Integer revenueId) {
        repository.setPaymentSentAsTrue(revenueId);
    }

    @PutMapping("/{id}/payment-status")
    public void updatePaymentStatus(@PathVariable("id") final Integer revenueId, @RequestBody Map<String, String> body) {

        String status = body.get("status");
        RevenueType revenueTypeStatus = RevenueType.valueOf(status);

        if (revenueTypeStatus == RevenueType.OPEN)
            status = RevenueType.OK.name();

        repository.setPaidAsOK(revenueId, status);
    }

    @PostMapping("/collection-form")
    @Transactional
    public List<Revenue> createRevenuesFromCollectionForm(@RequestBody List<CollectionFormDTO> request) {

        Map<Integer, Float> students = new LinkedHashMap<>();

        LocalDate now = LocalDate.now();
        Integer year = now.getYear();
        Month month = now.getMonth();
        Integer monthNumber = now.getMonthValue();

        request.forEach(collectionForm ->
                students.merge(
                        collectionForm.getStudentId(),
                        collectionForm.getCoursePrice(),
                        Float::sum
                )
        );

        List<Revenue> revenues = students.entrySet().stream()
                .map(entry -> {
                    Student student = new Student();
                    student.setId(entry.getKey());

                    Revenue revenue = new Revenue();
                    revenue.setAmount(entry.getValue().doubleValue());
                    revenue.setYear(year);
                    revenue.setMonth(monthNumber);
                    revenue.setStatus(RevenueType.OPEN);
                    revenue.setPaid(false);
                    revenue.setReminderMessageSent(false);
                    revenue.setPaymentMessageSent(false);
                    revenue.setStudent(student);

                    return revenue;
                })
                .collect(Collectors.toList());

        return repository.saveAll(revenues);
    }

    @PostMapping
    public Revenue create(@RequestBody CreateRevenueRequest request) {

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));


        Revenue revenue = new Revenue();

        revenue.setPaid(false);
        revenue.setStudent(student);
        revenue.setStatus(RevenueType.OPEN);
        revenue.setPaymentMessageSent(false);
        revenue.setReminderMessageSent(false);
        revenue.setMonth(request.getMonth());
        revenue.setYear(request.getYear());
        //revenue.setAmount(student);

        return repository.save(revenue);
    }
}
