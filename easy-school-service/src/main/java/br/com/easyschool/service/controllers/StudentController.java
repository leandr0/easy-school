package br.com.easyschool.service.controllers;

import br.com.easyschool.domain.entities.Student;
import br.com.easyschool.domain.repositories.StudentRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentRepository repository;


   public StudentController(StudentRepository repository){
        this.repository = repository;
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

    @PostMapping
    public Student create(@RequestBody Student student) {

       student.setStatus(true);

        return repository.save(student);
    }


    @GetMapping("/by-date")
    public List<Student> getByStartDate(@RequestParam String date) {
        LocalDateTime parsed = LocalDate.parse(date).atStartOfDay(); // se `startDate` for LocalDateTime
        return repository.findByStartDateEquals(parsed);
    }
}
