package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.Revenue;
import br.com.easyschool.domain.entities.Student;
import br.com.easyschool.domain.repositories.RevenueRepository;
import br.com.easyschool.domain.repositories.StudentRepository;
import br.com.easyschool.domain.types.RevenueType;
import br.com.easyschool.service.requests.CreateRevenueRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/revenues")
public class RevenueGateway {

    private final Log LOG = LogFactory.getLog(this.getClass());
    private final RevenueRepository repository;

    private final StudentRepository studentRepository;

    public RevenueGateway(RevenueRepository repository, StudentRepository studentRepository)
    {
        this.repository = repository;
        this.studentRepository = studentRepository;
    }


    @GetMapping
    public List<Revenue> getAll() {
        return repository.findAll();
    }


    @GetMapping("/student/{id}")
    public List<Revenue> findByStudent(@PathVariable  Integer id) {
        return repository.findByStudentId(id);
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
