package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.Course;
import br.com.easyschool.domain.repositories.CourseRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/courses")
public class CourseGateway {

    private final Log LOG = LogFactory.getLog(this.getClass());
    private final CourseRepository repository;


    public CourseGateway(CourseRepository repository){

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
    public Course create(@RequestBody Course request) {

        if (request.getId() == null || request.getId() <= 0) {
            request.setStatus(true);
        }

        return repository.save(request);
    }
}
