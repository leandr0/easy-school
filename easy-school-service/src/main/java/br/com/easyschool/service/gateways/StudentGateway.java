package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.dto.StudentDTO;
import br.com.easyschool.domain.entities.Student;
import br.com.easyschool.domain.repositories.CourseClassRepository;
import br.com.easyschool.domain.repositories.StudentRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/students")
public class StudentGateway {

    private final Log LOG = LogFactory.getLog(this.getClass());

    private final StudentRepository repository;

    private final CourseClassRepository courseClassRepository;


   public StudentGateway(StudentRepository repository, CourseClassRepository courseClassRepository){

       this.repository = repository;
       this.courseClassRepository = courseClassRepository;
    }


    @GetMapping
    public List<Student> getStudents(@RequestParam(value = "not_in_course_class", required = false) String notInCourseClassId,
                                     @RequestParam(value = "in_course_class", required = false) String inCourseClassId) {

        if (notInCourseClassId != null && !notInCourseClassId.isEmpty()) {
            return repository.findStudentsNotInCourseClass(Integer.valueOf(notInCourseClassId));
        } else if (inCourseClassId != null && !inCourseClassId.isEmpty()) {
            return repository.findStudentsInCourseClass(Integer.valueOf(inCourseClassId));
        } else {
            return repository.findAll();
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
