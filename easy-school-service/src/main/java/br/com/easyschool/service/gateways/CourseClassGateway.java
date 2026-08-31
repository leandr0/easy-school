package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.dto.CourseClassTeacherDTO;
import br.com.easyschool.domain.entities.*;
import br.com.easyschool.domain.repositories.CourseClassCalendarRepository;
import br.com.easyschool.domain.repositories.CourseClassRepository;
import br.com.easyschool.domain.repositories.CourseRepository;
import br.com.easyschool.domain.repositories.TeacherRepository;
import br.com.easyschool.service.gateways.security.JwtUser;
import br.com.easyschool.service.gateways.security.JwtUtils;
import br.com.easyschool.service.requests.CreateCourseClassRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/course-classes")
@Slf4j
@RequiredArgsConstructor
public class CourseClassGateway {

    private final CourseClassRepository repository;

    private final CourseRepository courseRepository;

    private final TeacherRepository teacherRepository;

    private final CourseClassCalendarRepository courseClassCalendarRepository;

    private final JwtUtils jwtUtils;

    @GetMapping
    public ResponseEntity<List<CourseClass>> getAll() {

        try{

            List<CourseClass> rawData = repository.findAllCourseClassesOrdered();

            return ResponseEntity.ok(cleanCourseClassList(rawData));

        }catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }

    }

    private List<CourseClass> cleanCourseClassList(List<CourseClass> rawData){

        rawData.forEach(courseClass -> courseClass.getTeacher().getUser().setStudent(null));
        rawData.forEach(courseClass -> courseClass.getTeacher().getUser().setTeacher(null));
        rawData.forEach(courseClass -> courseClass.getTeacher().getUser().setRoles(null));
        rawData.forEach(courseClass -> courseClass.getTeacher().setLanguages(null));

        return rawData;
    }

    @GetMapping("/available")
    public ResponseEntity<List<CourseClass>> getAllAvailable(@RequestHeader(value = "Authorization", required = false) String auth) {
        try {
            JwtUser user = jwtUtils.parseBearer(auth);

            List<CourseClass> queryResult = new LinkedList<>();

            if (user.hasRole("ADMIN")) {
                queryResult = repository.findAllCourseClassesAvailable();
            } else if (user.hasRole("TEACHER")) {
                queryResult = repository.findAllCourseClassesAvailableByTeacher(user.profileId());
            } else if (user.hasRole("STUDENT")) {
                queryResult = repository.findAllCourseClassesAvailableByStudent(user.profileId());
            }

            queryResult.forEach(courseClass -> {
                var item = courseClass.getTeacher().getUser();
                item.setStudent(null);
                item.setRoles(null);
                item.setTeacher(null);
            });

            return ResponseEntity.ok(cleanCourseClassList(queryResult));

        } catch (Throwable t) {
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<CourseClass> getCourseClassById(@PathVariable final Integer id) {

        try {

            CourseClass courseClass = repository.findById(id).orElseThrow();

            courseClass.getTeacher().getUser().setTeacher(null);
            courseClass.getTeacher().getUser().setStudent(null);
            courseClass.getTeacher().getUser().setRoles(null);

            return  ResponseEntity.ok(courseClass);

        }catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }

    }


    @GetMapping("/teacher/{id}")
    public ResponseEntity<List<CourseClassTeacherDTO>> getCourseClassByTeacherId(@PathVariable("id") Integer teacherId) {

        List<CourseClassTeacherDTO> result = null;

        try {
            result = repository.fetchCourseClassByTeacher(teacherId);
        } catch (Throwable t) {
            log.info(t.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping
    public CourseClass create(@RequestBody CreateCourseClassRequest request) {

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        CourseClass entity = new CourseClass();

        if (request.getId() != null && request.getId() > 0) {
            entity.setId(request.getId());
            entity.setStatus(request.getStatus());
        } else {
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

        for (int weekDayId : request.getWeekDays()) {

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
    public CourseClass addTeacher(@PathVariable Integer id, @PathVariable Integer teacherId) {

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        CourseClass entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course Class not found"));

        entity.setTeacher(teacher);


        return repository.save(entity);
    }

    @PutMapping
    public CourseClass updateCourseClass(@RequestBody CourseClass request) {

        return repository.save(request);
    }

}