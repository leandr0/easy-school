package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.Course;
import br.com.easyschool.domain.repositories.CourseRepository;
import br.com.easyschool.service.gateways.security.JwtUser;
import br.com.easyschool.service.gateways.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
@Slf4j
public class CourseGateway {
    private final CourseRepository repository;
    private final JwtUtils jwtUtils;
    @GetMapping
    public ResponseEntity<List<Course>> getAll(@RequestHeader(value = "Authorization", required = false) String auth) {

        try {
            List<Course> result = new LinkedList<>();

            JwtUser user = jwtUtils.parseBearer(auth);


            if (user.hasRole("ADMIN")) {
                result =  repository.findAll();
            } else if (user.hasRole("TEACHER")) {
                result = repository.findAllCoursesByTeacher(user.profileId());
            }

            return ResponseEntity.ok(result);
        }catch (Throwable t){
            return ResponseEntity.internalServerError().build();
        }


    }

    @GetMapping("/available")
    public ResponseEntity<List<Course>> getAllCoursesAvailable(@RequestHeader(value = "Authorization", required = false) String auth) {

        try {
            JwtUser user = jwtUtils.parseBearer(auth);

            List<Course> result = new LinkedList<>();

            if (user.hasRole("ADMIN")) {
                result =  repository.findAllCoursesAvailable();
            } else if (user.hasRole("TEACHER")) {
                result = repository.findAllCoursesAvailable();
            }

            return ResponseEntity.ok(result);

        }catch (Throwable t){
            return ResponseEntity.internalServerError().build();
        }
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
