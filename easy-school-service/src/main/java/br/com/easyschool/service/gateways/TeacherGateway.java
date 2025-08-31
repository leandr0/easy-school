package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.Teacher;
import br.com.easyschool.domain.repositories.TeacherRepository;
import br.com.easyschool.service.requests.CreateLTeacherSkillListRequest;
import br.com.easyschool.service.requests.CreateTeacherRequest;
import br.com.easyschool.service.response.TeacherResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/teachers")
@Slf4j
@RequiredArgsConstructor
public class TeacherGateway {

    private final Log LOG = LogFactory.getLog(this.getClass());

    private final TeacherRepository repository;

    private final TeacherSkillGateway teacherSkillGateway;

    private final CalendarRangeHourDayGateway calendarRangeHourDayGateway;



    @PreAuthorize( "hasRole('ADMIN')")
    @GetMapping
    public List<Teacher> getAll() {

        return repository.findAll();
    }

    @PreAuthorize( "hasRole('ADMIN')")
    @GetMapping("/available")
    public List<TeacherResponse> getAllTeachersAvailable(@RequestParam(value = "language", required = false) String languageId,
                                                         @RequestParam(value = "course_class", required = false) String courseClassId) {

        if (languageId != null && !languageId.isEmpty()) {
            return this.createListTeacherResponseFromListTeacher(repository.findAllTeachersAvailableByLanguage(Integer.valueOf(languageId)));
        } else if (courseClassId != null && !courseClassId.isEmpty()) {
            return this.createListTeacherResponseFromListTeacher(repository.findAllTeachersAvailableByLanguageFromCourseClass(Integer.valueOf(courseClassId)));
        } else {
            return this.createListTeacherResponseFromListTeacher(repository.findAllTeachersAvailable());
        }

    }

    //@PreAuthorize( "hasRole('ADMIN','TEACHER')")
    @PreAuthorize( "hasRole('ADMIN') or hasRole('TEACHER')")
    @GetMapping("/{id}")
    public ResponseEntity<Teacher> findTeacherById(@PathVariable("id") final Integer teacherId) {

        Teacher teacher = null;

        try {

            teacher = repository.findById(teacherId).orElseThrow(() -> new RuntimeException("Teacher not found"));
            ;

        } catch (Throwable t) {
            return ResponseEntity.notFound().build();
        }


        return ResponseEntity.ok(teacher);
    }

    @PreAuthorize( "hasRole('ADMIN')")
    @PostMapping
    public Teacher create(@RequestBody CreateTeacherRequest request) {

        Teacher teacher = new Teacher();
        teacher.setCompensation(request.getCompensation());
        teacher.setEmail(request.getEmail());
        teacher.setName(request.getName());
        teacher.setPhoneNumber(request.getPhoneNumber());
        teacher.setStartDate(request.getStartDate());

        teacher.setStatus(true);

        Teacher createdTeacher = repository.save(teacher);

        request.getCalendarRangeHourDays().forEach(calendarRangeHourDay -> {
            calendarRangeHourDay.setTeacher(createdTeacher);
        });

        teacherSkillGateway.createAll(CreateLTeacherSkillListRequest.build().
                addLanguageIds(request.getLanguagesId()).
                addTeacherId(teacher.getId())
        );

        calendarRangeHourDayGateway.createAll(request.getCalendarRangeHourDays());

        return teacher;
    }

    //@PreAuthorize( "hasRole('ADMIN','TEACHER')")//para lista
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    @PutMapping
    public ResponseEntity<Teacher> update(@RequestBody Teacher teacher) {

        try {
            teacher = repository.save(teacher);

        } catch (Throwable t) {
            return ResponseEntity.notFound().build();
        }


        return ResponseEntity.ok(teacher);
    }

    private List<TeacherResponse> createListTeacherResponseFromListTeacher(final List<Teacher> teachers) {
        //TODO: usar lambda
        List<TeacherResponse> response = new LinkedList<TeacherResponse>();

        for (Teacher teacher : teachers) {
            response.add(new TeacherResponse(teacher));
        }
        return response;
    }

}
