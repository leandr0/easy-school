package br.com.easyschool.service.controllers;

import br.com.easyschool.domain.entities.Teacher;
import br.com.easyschool.domain.repositories.TeacherRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/service/teachers")
public class TeacherController {


    private final TeacherRepository repository;

    public TeacherController(TeacherRepository repository){
        this.repository = repository;
    }

    @GetMapping
    public List<Teacher> getAll() {
        return repository.findAll();
    }

    @GetMapping("/available")
    public List<Teacher> getAvailableTeachers(@RequestParam(value = "language", required = false) String languageId,
                                              @RequestParam(value = "course_class", required = false) String courseClassId) {
        if (languageId != null && !languageId.isEmpty()) {
            System.out.println("Language ID :: " + languageId);
            return repository.findAllTeachersAvailableByLanguage(Integer.valueOf(languageId));
        } else if (courseClassId != null && !courseClassId.isEmpty()) {
            return repository.findAllTeachersAvailableByLanguageFromCourseClass(Integer.valueOf(courseClassId));
        } else {
            return repository.findAllTeachersAvailable();
        }
    }


    @PostMapping
    public Teacher create(@RequestBody Teacher entity) {

        entity.setStatus(true);

        return repository.save(entity);
    }
}