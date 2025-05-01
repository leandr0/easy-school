package br.com.easyschool.service.controllers;

import br.com.easyschool.domain.entities.*;
import br.com.easyschool.domain.repositories.CourseClassRepository;
import br.com.easyschool.domain.repositories.CourseRepository;
import br.com.easyschool.domain.repositories.TeacherRepository;
import br.com.easyschool.service.requests.CreateCourseClassRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/course_classes")
public class CourseClassController {

    private final CourseClassRepository repository;

    private final CourseRepository courseRepository;

    private final TeacherRepository teacherRepository;

    public CourseClassController(CourseClassRepository repository, CourseRepository courseRepository,TeacherRepository teacherRepository){
        this.repository = repository;
        this.courseRepository = courseRepository;
        this.teacherRepository = teacherRepository;
    }

    @GetMapping
    public List<CourseClass> getAll(){
        return repository.findAll();
    }


    @GetMapping("/{id}")
    public Optional<CourseClass> getCourseClassById(@PathVariable final Integer id){
        return repository.findById(id);
    }



    @PostMapping
    public CourseClass create(@RequestBody CreateCourseClassRequest request){

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        CourseClass entity = new CourseClass();

        if(request.getId() != null && request.getId() > 0){
            entity.setId(request.getId());
            entity.setStatus(request.getStatus());
        }else{
            entity.setStatus(true);
        }



        entity.setCourse(course);
        entity.setName(request.getName());
        entity.setTeacher(teacher);

        return repository.save(entity);
    }

    @PostMapping("/{id}/teacher/{teacherId}")
    public CourseClass addTeacher(@PathVariable Integer id,@PathVariable Integer teacherId){

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        CourseClass entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course Class not found"));

        entity.setTeacher(teacher);


        return repository.save(entity);
    }

}