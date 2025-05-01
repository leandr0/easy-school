package br.com.easyschool.service.controllers;

import br.com.easyschool.domain.entities.Course;
import br.com.easyschool.domain.entities.Language;
import br.com.easyschool.domain.repositories.CourseRepository;
import br.com.easyschool.service.requests.CreateCourseRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/courses")
public class CourseController {

    private final CourseRepository repository;


    public CourseController(CourseRepository repository){

        this.repository = repository;
    }
    @GetMapping
    public List<Course> getAll() {

        return repository.findAll();
    }

    @GetMapping("/available")
    public List<Course> getAllCoursesAvailable() {

        return repository.findAllCoursesAvailable();
    }

    @GetMapping("/{id}")
    public Optional<Course> findCourse(@PathVariable("id") final Integer courseId) {

        return repository.findById(courseId);
    }

    @PostMapping
    public Course create(@RequestBody CreateCourseRequest request) {

        Course course = new Course();
        course.setStatus(true);
        course.setName(request.getName());

        Language language = new Language();
        language.setId(request.getLanguageId());

        course.setLanguage(language);

        return repository.save(course);
    }


}
