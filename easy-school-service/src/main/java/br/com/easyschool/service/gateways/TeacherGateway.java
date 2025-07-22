package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.Teacher;
import br.com.easyschool.domain.repositories.TeacherRepository;
import br.com.easyschool.service.requests.CreateLTeacherSkillListRequest;
import br.com.easyschool.service.requests.CreateTeacherRequest;
import br.com.easyschool.service.response.TeacherResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/teachers")
public class TeacherGateway {

    private final Log LOG = LogFactory.getLog(this.getClass());

    private final TeacherRepository repository;

    private final TeacherSkillGateway teacherSkillGateway;

    private final CalendarRangeHourDayGateway calendarRangeHourDayGateway;

    public TeacherGateway(TeacherRepository repository,
                          TeacherSkillGateway teacherSkillGateway,
                          CalendarRangeHourDayGateway calendarRangeHourDayGateway){
        this.repository = repository;
      //  this.teacherController = teacherController;
        this.teacherSkillGateway = teacherSkillGateway;
        this.calendarRangeHourDayGateway = calendarRangeHourDayGateway;
    }


    @GetMapping
    public List<Teacher> getAll() {

        return repository.findAll();
    }

    @GetMapping("/available")
    public List<TeacherResponse> getAllTeachersAvailable(@RequestParam(value = "language", required = false) String languageId,
                                                         @RequestParam(value = "course_class", required = false) String courseClassId) {

        if (languageId != null && !languageId.isEmpty()) {
            return this.createListTeacherResponseFromListTeacher( repository.findAllTeachersAvailableByLanguage(Integer.valueOf(languageId)));
        } else if (courseClassId != null && !courseClassId.isEmpty()) {
            return this.createListTeacherResponseFromListTeacher(repository.findAllTeachersAvailableByLanguageFromCourseClass(Integer.valueOf(courseClassId)));
        } else {
            return this.createListTeacherResponseFromListTeacher( repository.findAllTeachersAvailable());
        }

    }

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


    private List<TeacherResponse> createListTeacherResponseFromListTeacher(final List<Teacher> teachers){
        //TODO: usar lambda
        List<TeacherResponse> response = new LinkedList<TeacherResponse>();

        for (Teacher teacher  :teachers) {
            response.add(new TeacherResponse(teacher));
        }
        return response;
    }

}
