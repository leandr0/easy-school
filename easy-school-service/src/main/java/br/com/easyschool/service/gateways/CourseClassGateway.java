package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.dto.CourseClassTeacherDTO;
import br.com.easyschool.domain.entities.*;
import br.com.easyschool.domain.repositories.CourseClassCalendarRepository;
import br.com.easyschool.domain.repositories.CourseClassRepository;
import br.com.easyschool.domain.repositories.CourseRepository;
import br.com.easyschool.domain.repositories.TeacherRepository;
import br.com.easyschool.service.requests.CreateCourseClassRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/course_classes")
public class CourseClassGateway {

    private final Log LOG = LogFactory.getLog(this.getClass());
    private final CourseClassRepository repository;

    private final CourseRepository courseRepository;

    private final TeacherRepository teacherRepository;

    private final CourseClassCalendarRepository courseClassCalendarRepository;

    public CourseClassGateway(CourseClassRepository repository, CourseRepository courseRepository, TeacherRepository teacherRepository, CourseClassCalendarRepository courseClassCalendarRepository){
        this.repository = repository;
        this.courseRepository = courseRepository;
        this.teacherRepository = teacherRepository;
        this.courseClassCalendarRepository = courseClassCalendarRepository;
    }

    @GetMapping
    public List<CourseClass> getAll(){
        return repository.findAll();
    }

    @GetMapping("/available")
    public List<CourseClass> getAllAvailable(){
        return repository.findAllCourseClassesAvailable();
    }


    @GetMapping("/{id}")
    public Optional<CourseClass> getCourseClassById(@PathVariable final Integer id){
        return repository.findById(id);
    }


    @GetMapping("/teacher/{id}")
    public ResponseEntity<List<CourseClassTeacherDTO>> getCourseClassByTeacherId(@PathVariable("id") Integer teacherId){

        List<CourseClassTeacherDTO> result = null;

        try {
           result =  repository.fetchCourseClassByTeacher(teacherId);
        }catch (Throwable t){
            LOG.info(t.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok(result);
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
        entity.setEndHour(request.getEndHour());
        entity.setEndMinute(request.getEndMinute());
        entity.setStartHour(request.getStartHour());
        entity.setStartMinute(request.getStartMinute());

        entity = repository.save(entity);

        for(int weekDayId : request.getWeekDays()){

            CalendarWeekDay calendarWeekDay = new CalendarWeekDay();
            calendarWeekDay.setId(weekDayId);

            CourseClassCalendar courseClassCalendar = new CourseClassCalendar();

            courseClassCalendar.setCourseClass(entity);
            courseClassCalendar.setCalendarWeekDay(calendarWeekDay);

            courseClassCalendarRepository.save(courseClassCalendar);
        }

        return entity;
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

    @PutMapping
    public CourseClass updateCourseClass(@RequestBody CourseClass request){

        return repository.save(request);
    }

}