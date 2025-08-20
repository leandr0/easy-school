package br.com.easyschool.service.implementations;

import br.com.easyschool.domain.dto.CollectionFormDTO;
import br.com.easyschool.domain.entities.Revenue;
import br.com.easyschool.domain.entities.Student;
import br.com.easyschool.domain.repositories.RevenueRepository;
import br.com.easyschool.domain.repositories.StudentRepository;
import br.com.easyschool.domain.types.RevenueType;
import br.com.easyschool.service.requests.CreateRevenueRequest;
import br.com.easyschool.domain.vo.DataParam;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Month;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RevenueService {


    private final RevenueRepository repository;

    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public List<Revenue> fetchByDataRange(@NonNull DataParam startData, @NonNull DataParam endData) throws Exception {

        try {
            return repository.fetchByRangeData(startData.getMonth(),startData.getYear(),endData.getMonth(),endData.getYear());
        }catch (Throwable t){
            log.error("Find revenues {}",t.getMessage());
            throw new Exception(t);
        }
    }



    @Transactional(readOnly = true)
    public List<Revenue> findByStudent(Integer id) throws Exception {

        try {

            return repository.findByStudentId(id);

        }catch (Throwable t){
            log.error("Find revenues by student {}",t.getMessage());
            throw new Exception(t);
        }
    }

    @Transactional(readOnly = true)
    public List<CollectionFormDTO> fetchCollectionForm() throws Exception {
        try {

            return repository.fetchCollectionForms();

        }catch (Throwable t){
            log.error("Fetch collection form {}",t.getMessage());
            throw new Exception(t);
        }
    }

    @Transactional(readOnly = true)
    public List<CollectionFormDTO> fetchCollectionFormByStudent( Integer id) throws Exception {
        try {

            return repository.fetchCollectionFormByStudent(id);

        }catch (Throwable t){
            log.error("Fetch collection by student {}",t.getMessage());
            throw new Exception(t);
        }
    }

    @Transactional
    public void sendReminderMessage(final Integer revenueId) throws Exception {
        try {

            repository.setReminderSentAsTrue(revenueId);

        }catch (Throwable t){
            log.error("Send reminder message by ID {}",t.getMessage());
            throw new Exception(t);
        }
    }
    @Transactional
    public void sendPaymentMessage(final Integer revenueId) throws Exception {
        try {

            repository.setPaymentSentAsTrue(revenueId);

        }catch (Throwable t){
            log.error("Send payment message by ID {}",t.getMessage());
            throw new Exception(t);
        }
    }
    @Transactional
    public void updatePaymentStatus(final Integer revenueId, Map<String, String> body) throws Exception {

        try {

            String status = body.get("status");
            RevenueType revenueTypeStatus = RevenueType.valueOf(status);

            if (revenueTypeStatus == RevenueType.OPEN)
                status = RevenueType.OK.name();

            repository.setPaidAsOK(revenueId, status);

        } catch (Throwable t) {
            log.error("Update payment status by ID {}",t.getMessage());
            throw new Exception(t);
        }
    }

    @Transactional
    public List<Revenue> createRevenuesFromCollectionForm(List<CollectionFormDTO> request) throws Exception {

        try {

            Map<Integer, Double> students = new LinkedHashMap<>();
            Map<Integer, Integer> studentDuedates = new LinkedHashMap<>();

            LocalDate now = LocalDate.now();
            Integer year = now.getYear();
            Month month = now.getMonth();
            Integer monthNumber = now.getMonthValue();


            request.forEach(collectionForm -> {
                        students.merge(
                                collectionForm.getStudentId(),
                                collectionForm.getCoursePrice(),
                                Double::sum
                        );
                        studentDuedates.put(collectionForm.getStudentId(), collectionForm.getDueDate());
                    }

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
                        revenue.setDueDate(studentDuedates.get(entry.getKey()));

                        return revenue;
                    })
                    .collect(Collectors.toList());

            return repository.saveAll(revenues);

        } catch (Throwable t) {
            log.error("Create revenues from collection form {}",t.getMessage());
            throw new Exception(t);
        }
    }

    @Transactional
    public Revenue create( CreateRevenueRequest request) throws Exception {

        try {

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

            return repository.save(revenue);

        }catch (Throwable t){
            log.error("Create revenues {}",t.getMessage());
            throw new Exception(t);
        }
    }
}
