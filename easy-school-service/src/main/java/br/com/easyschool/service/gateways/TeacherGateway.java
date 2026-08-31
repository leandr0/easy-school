package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.Teacher;
import br.com.easyschool.domain.entities.security.User;
import br.com.easyschool.domain.repositories.TeacherRepository;
import br.com.easyschool.domain.repositories.security.UserRepository;
import br.com.easyschool.service.gateways.security.JwtUser;
import br.com.easyschool.service.gateways.security.JwtUtils;
import br.com.easyschool.service.requests.CreateLTeacherSkillListRequest;
import br.com.easyschool.service.requests.CreateTeacherRequest;
import br.com.easyschool.service.response.TeacherResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    private final TeacherRepository repository;

    private final UserRepository userRepository;

    private final TeacherSkillGateway teacherSkillGateway;

    private final CalendarRangeHourDayGateway calendarRangeHourDayGateway;

    private final JwtUtils jwtUtils;


    @PreAuthorize( "hasRole('ADMIN') or hasRole('TEACHER')")
    @GetMapping
    public ResponseEntity<List<TeacherResponse>> getAll(@RequestHeader(value = "Authorization", required = false) String auth) {

        try{

            JwtUser user = jwtUtils.parseBearer(auth);

            List<Teacher> queryResult = new LinkedList<>();

            if (user.hasRole("ADMIN")) {
                queryResult =  repository.findAll();
            } else if (user.hasRole("TEACHER")) {
                queryResult.add(repository.findById(user.profileId()).orElseThrow());
            }

            List<TeacherResponse> result = new LinkedList<>();

            for (Teacher teacher : queryResult) {
                teacher.getUser().setTeacher(null);
                teacher.getUser().setStudent(null);
                result.add(new TeacherResponse(teacher));
            }

            return ResponseEntity.ok(result);

        }catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
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

        } catch (Throwable t) {
            return ResponseEntity.notFound().build();
        }


        return ResponseEntity.ok(teacher);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    @PostMapping
    public Teacher create(@RequestBody CreateTeacherRequest request) {

        Teacher teacher = new Teacher();
        teacher.setCompensation(request.getCompensation());
        teacher.getUser().setUsername(request.getEmail());
        teacher.getUser().setName(request.getName());
        teacher.getUser().setPhoneNumber(request.getPhoneNumber());
        teacher.getUser().setCreatedAt(request.getStartDate());

        teacher.getUser().setStatus(true);

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
            Teacher persistedTeacher = repository.findById(teacher.getId())
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));

            persistedTeacher.setCompensation(teacher.getCompensation());
            persistedTeacher.setLanguages(teacher.getLanguages());

            // name/phone_number/email/status actually live on the linked User row, not on
            // Teacher itself, and the `user` association here has no cascade configured -
            // so repository.save(teacher) alone never wrote those changes to the users
            // table. Apply them to the persisted User explicitly.
            User incomingUser = teacher.getUser();
            if (incomingUser != null) {
                User persistedUser = persistedTeacher.getUser();

                if (incomingUser.getName() != null) {
                    persistedUser.setName(incomingUser.getName());
                }
                if (incomingUser.getPhoneNumber() != null) {
                    persistedUser.setPhoneNumber(incomingUser.getPhoneNumber());
                }
                if (incomingUser.getUsername() != null) {
                    persistedUser.setUsername(incomingUser.getUsername());
                }
                persistedUser.setStatus(incomingUser.isStatus());

                userRepository.save(persistedUser);
            }

            teacher = repository.save(persistedTeacher);

            teacher.getUser().setTeacher(null);
            teacher.getUser().setRoles(null);

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
