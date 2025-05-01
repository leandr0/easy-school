package br.com.easyschool.service.gateway;

import br.com.easyschool.domain.entities.Teacher;
import br.com.easyschool.service.controllers.CalendarRangeHourDayController;
import br.com.easyschool.service.controllers.TeacherController;
import br.com.easyschool.service.controllers.TeacherSkillController;
import br.com.easyschool.service.requests.CreateLTeacherSkillListRequest;
import br.com.easyschool.service.requests.CreateTeacherRequest;
import br.com.easyschool.service.response.TeacherResponse;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/teachers")
public class TeacherGateway {

    private final TeacherController teacherController;

    private final TeacherSkillController teacherSkillController;

    private final CalendarRangeHourDayController calendarRangeHourDayController;

    public TeacherGateway(TeacherController teacherController,
                          TeacherSkillController teacherSkillController,
                          CalendarRangeHourDayController calendarRangeHourDayController){
        this.teacherController = teacherController;
        this.teacherSkillController = teacherSkillController;
        this.calendarRangeHourDayController = calendarRangeHourDayController;
    }


    @GetMapping
    public List<Teacher> getAll() {
        return teacherController.getAll();
    }

    @GetMapping("/available")
    public List<TeacherResponse> getAllTeachersAvailable(@RequestParam(value = "language", required = false) String languageId,
                                                         @RequestParam(value = "course_class", required = false) String courseClassId) {

        if (languageId != null && !languageId.isEmpty()) {
            return this.createListTeacherResponseFromListTeacher(teacherController.getAvailableTeachers(languageId,null));
        } else if (courseClassId != null && !courseClassId.isEmpty()) {
            return this.createListTeacherResponseFromListTeacher(teacherController.getAvailableTeachers(null,courseClassId));
        } else {
            return this.createListTeacherResponseFromListTeacher(teacherController.getAvailableTeachers(null,null));
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

        Teacher createdTeacher = teacherController.create(teacher);

        request.getCalendarRangeHourDays().forEach(calendarRangeHourDay -> {
            calendarRangeHourDay.setTeacher(createdTeacher);
        });

        teacherSkillController.createAll(CreateLTeacherSkillListRequest.build().
                                                addLanguageIds(request.getLanguagesId()).
                                                    addTeacherId(teacher.getId())
                                            );

        calendarRangeHourDayController.createAll(request.getCalendarRangeHourDays());

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
