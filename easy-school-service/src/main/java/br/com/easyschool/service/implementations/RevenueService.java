package br.com.easyschool.service.implementations;

import br.com.easyschool.domain.dto.CollectionFormDTO;
import br.com.easyschool.domain.entities.CourseClass;
import br.com.easyschool.domain.entities.Revenue;
import br.com.easyschool.domain.entities.RevenueCourseClassStudent;
import br.com.easyschool.domain.entities.Student;
import br.com.easyschool.domain.repositories.RevenueCourseClassStudentRepository;
import br.com.easyschool.domain.repositories.RevenueRepository;
import br.com.easyschool.domain.repositories.StudentRepository;
import br.com.easyschool.domain.types.RevenueType;
import br.com.easyschool.domain.vo.DataParam;
import br.com.easyschool.service.requests.CreateRevenueRequest;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RevenueService {


    private final RevenueRepository repository;

    private final StudentRepository studentRepository;

    private final RevenueCourseClassStudentRepository revenueCourseClassStudentRepository;

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
    public List<Revenue> createRevenuesFromCollectionForm(List<CollectionFormDTO> request) {
        if (request == null || request.isEmpty()) {
            return List.of();
        }

        // Group items by student once (removes O(n^2) loop)
        Map<Integer, List<CollectionFormDTO>> byStudent = request.stream()
                .collect(Collectors.groupingBy(CollectionFormDTO::getStudentId, LinkedHashMap::new, Collectors.toList()));

        LocalDate now = LocalDate.now();
        final int year = now.getYear();
        final int monthNumber = now.getMonthValue();

        // Build Revenues (sum per student)
        List<Revenue> revenues = byStudent.entrySet().stream()
                .map(entry -> {
                    Integer studentId = entry.getKey();
                    List<CollectionFormDTO> items = entry.getValue();

                    // Sum course prices precisely
                    BigDecimal total = items.stream()
                            .map(dto -> BigDecimal.valueOf(dto.getCoursePrice())) // dto is Double; convert here
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    // Choose a due date strategy (first non-null in the group)
                    Integer dueDate = items.stream()
                            .map(CollectionFormDTO::getDueDate)
                            .filter(Objects::nonNull)
                            .findFirst()
                            .orElse(null);

                    Student student = new Student();
                    student.setId(studentId);

                    Revenue revenue = new Revenue();
                    revenue.setAmount(total.doubleValue());                    // <-- change entity to BigDecimal if possible
                    revenue.setYear(year);
                    revenue.setMonth(monthNumber);
                    revenue.setStatus(RevenueType.OPEN);
                    revenue.setPaid(false);
                    revenue.setReminderMessageSent(false);
                    revenue.setPaymentMessageSent(false);
                    revenue.setStudent(student);
                    revenue.setDueDate(dueDate);

                    return revenue;
                })
                .toList();

        // Persist revenues
        List<Revenue> savedRevenues = repository.saveAll(revenues);

        // Map studentId -> saved Revenue (to attach link rows)
        Map<Integer, Revenue> revenueByStudentId = savedRevenues.stream()
                .collect(Collectors.toMap(r -> r.getStudent().getId() , Function.identity(), (a, b) -> a, LinkedHashMap::new));

        // Build link rows without nested loops
        List<RevenueCourseClassStudent> linkRows = byStudent.entrySet().stream()
                .flatMap(entry -> {
                    Integer studentId = entry.getKey();
                    Revenue rev = revenueByStudentId.get(studentId);

                    return entry.getValue().stream().map(item -> {
                        RevenueCourseClassStudent link = new RevenueCourseClassStudent();
                        link.setRevenue(rev);
                        link.setStudent(new Student(studentId));

                        // ✅ Set courseClass from CollectionFormDTO.classId
                        CourseClass courseClass = new CourseClass();
                        courseClass.setId(item.getClassId());
                        link.setCourseClass(courseClass);

                        link.setCoursePrice(item.getCoursePrice());
                        return link;
                    });
                })
                .collect(Collectors.toList());

        if (!linkRows.isEmpty()) {
            revenueCourseClassStudentRepository.saveAll(linkRows);
        }

        return savedRevenues;
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
