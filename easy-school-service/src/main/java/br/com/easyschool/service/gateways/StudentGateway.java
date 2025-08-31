package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.dto.CoursePriceDTO;
import br.com.easyschool.domain.dto.StudentDTO;
import br.com.easyschool.domain.entities.Student;
import br.com.easyschool.domain.repositories.CourseClassRepository;
import br.com.easyschool.domain.repositories.CourseClassStudentRepository;
import br.com.easyschool.domain.repositories.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/students")
@Slf4j
@RequiredArgsConstructor
public class StudentGateway {

    private final StudentRepository repository;

    private final CourseClassRepository courseClassRepository;

    private final CourseClassStudentRepository courseClassStudentRepository;

    @GetMapping
    public ResponseEntity<List<Student>> getStudents() {

        try {

            List<Student> result = repository.findAll();

            if(result.isEmpty())
                return ResponseEntity.notFound().build();

            return ResponseEntity.ok(result);

        }catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }

    }

    @GetMapping("/course-class/{id}/students")
    public ResponseEntity<List<Student>> getStudentsCourseClass(@PathVariable(value = "id" , required = true) final Integer courseClassId) {

        try {

            List<Student> result = repository.findStudentsInCourseClass(courseClassId);

            if(result.isEmpty())
                return ResponseEntity.notFound().build();

            return ResponseEntity.ok(result);

        }catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }

    }

    @GetMapping("/course-class/{id}/candidate-students")
    public ResponseEntity<List<Student>> getStudentsNotCourseClass(@PathVariable(value = "id" , required = true) final Integer courseClassId) {

        try {

            List<Student> result = repository.findStudentsNotInCourseClass(courseClassId);

            if(result.isEmpty())
                return ResponseEntity.notFound().build();

            return ResponseEntity.ok(result);

        }catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }

    }


    @GetMapping("/{id}/course-price")
    public ResponseEntity<StudentDTO> findStudentCoursePrice(@PathVariable("id") final Integer studentId) {
        Optional<Student> studentOpt = repository.findById(studentId);

        if (studentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        StudentDTO student = new StudentDTO();
        student.setStudent(studentOpt.get())
                .setCoursePrice(courseClassRepository.findStudentsCourseClassPrice(studentId));

        return ResponseEntity.ok(student);
    }

    @PutMapping("/course-price")
    public ResponseEntity<Student> updateStudentCoursePrice(@RequestBody StudentDTO request) {

        if (request == null || request.getId() == null) {
            return ResponseEntity.notFound().build();
        }

       Student entity = repository.findById(request.getId()).orElseThrow(() -> new RuntimeException("Student not found"));;

        entity.setName(request.getName());
        entity.setStatus(request.getStatus());
        entity.setEmail(request.getEmail());
        entity.setPhoneNumber(request.getPhoneNumber());
        entity.setDueDate(request.getDueDate());
        entity.setStartDate(request.getStartDate());

        repository.save(entity);

        for (CoursePriceDTO coursePrice :  request.getCoursePrice()){
            courseClassStudentRepository.updateCoursePriceById(coursePrice.getId(),coursePrice.getCoursePrice().doubleValue());
        }

        return ResponseEntity.ok(entity);
    }


    @GetMapping("/{id}")
    public Optional<Student> findCourse(@PathVariable("id") final Integer studentId) {
        return repository.findById(studentId);
    }

    @PostMapping
    public Student create(@RequestBody Student student) {

       if(student.getId() == null || student.getId() <= 0){
           student.setStatus(true);
       }


        return repository.save(student);
    }


    @GetMapping("/by-date")
    public List<Student> getByStartDate(@RequestParam String date) {
        LocalDateTime parsed = LocalDate.parse(date).atStartOfDay(); // se `startDate` for LocalDateTime
        return repository.findByStartDateEquals(parsed);
    }
}
