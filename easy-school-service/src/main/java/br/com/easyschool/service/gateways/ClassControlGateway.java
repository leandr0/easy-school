package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.dto.ClassControlDTO;
import br.com.easyschool.domain.dto.ClassControlTeacherStudentDTO;
import br.com.easyschool.domain.entities.*;
import br.com.easyschool.domain.repositories.ClassControlRepository;
import br.com.easyschool.domain.repositories.ClassControlStudentRepository;
import br.com.easyschool.domain.repositories.ClassControlTeacherRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Month;
import java.util.LinkedList;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/class/control")
public class ClassControlGateway {

    private final Log LOG = LogFactory.getLog(this.getClass());
    private final ClassControlRepository repository;
    private final ClassControlStudentRepository classControlStudentRepository;

    private final ClassControlTeacherRepository classControlTeacherRepository;
    public ClassControlGateway(ClassControlRepository repository, ClassControlStudentRepository classControlStudentRepository, ClassControlTeacherRepository classControlTeacherRepository){
        this.repository = repository;
        this.classControlStudentRepository = classControlStudentRepository;
        this.classControlTeacherRepository = classControlTeacherRepository;
    }

    @PostMapping() // Add proper endpoint mapping
    public ResponseEntity<String> save(@RequestBody ClassControlDTO[] classes){

        try {

            Teacher teacher = null;

            List<ClassControlStudent> classControlStudents = null;
            List<ClassControl> classControls = new LinkedList<>();

            for (ClassControlDTO dto: classes) {

                if(teacher == null){
                    teacher = new Teacher();
                    teacher.setId(dto.getTeacherId());
                }

                ClassControl classControl = new ClassControl();
                CourseClass courseClass = new CourseClass();
                courseClass.setId(dto.getCourseClass());

                classControl.setCourseClass(courseClass);

                classControl.setContent(dto.getContent());

                LocalDate now = LocalDate.parse(dto.getDate());
                Integer year = now.getYear();
                Integer day = now.getDayOfMonth();
                Month month = now.getMonth();
                Integer monthNumber = now.getMonthValue();
                classControl.setDay(day);
                classControl.setMonth(monthNumber);
                classControl.setYear(year);
                classControl.setReplacement(dto.isReplacement());


                classControl = repository.save(classControl);


                if(dto.getStudents().length > 0)
                    classControlStudents = new LinkedList<>();

                for (Integer studentId : dto.getStudents()) {
                    ClassControlStudent classControlStudent = new ClassControlStudent();
                    classControlStudent.setStudent(new Student(studentId));
                    classControlStudent.setClassControl(classControl);

                    classControlStudents.add(classControlStudent);
                }

                if(classControlStudents != null ){
                    classControlStudentRepository.saveAll(classControlStudents);
                }

                if(dto.getTeacherId() != null){
                    ClassControlTeacher classControlTeacher = new ClassControlTeacher();
                    classControlTeacher.setTeacher(new Teacher(dto.getTeacherId()));
                    classControlTeacher.setClassControl(classControl);
                    classControlTeacherRepository.save(classControlTeacher);
                }




            }






        }catch (Throwable t){
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(null);
        }

        return ResponseEntity.ok("Class control records saved successfully");
    }

    @GetMapping("/{course_class_id}/course_class")
    public ResponseEntity<List<ClassControlTeacherStudentDTO>> filteringDataRange(@RequestParam(value = "start_date", required = true) String startDate,
                                                                 @RequestParam(value = "end_date", required = true) String endDate,
                                                                 @PathVariable("course_class_id") Integer courseCLassId){

        List<ClassControlTeacherStudentDTO> result;

        try {
            List<ClassControl> classControls = repository.fetchByDateRange(startDate, endDate, courseCLassId);

            if(classControls != null && !classControls.isEmpty()){
                result = new LinkedList<>();
            }else{
                return null;
            }

            for (ClassControl classControl : classControls) {

                Integer teacherId = classControlTeacherRepository.fetchTeacherIdByClassControlId(classControl.getId());

                List<Integer> studentIds = classControlStudentRepository.fetchStudentIdsByClassControlId(classControl.getId());

                ClassControlTeacherStudentDTO classControlTeacherStudentDTO = getClassControlTeacherStudentDTO(classControl, studentIds, teacherId);

                result.add(classControlTeacherStudentDTO);

            }


        }
        catch (Throwable t ){
            LOG.info(t.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(result);
    }

    private static ClassControlTeacherStudentDTO getClassControlTeacherStudentDTO(ClassControl classControl, List<Integer> studentIds, Integer teacherId) {
        ClassControlTeacherStudentDTO classControlTeacherStudentDTO = new ClassControlTeacherStudentDTO();
        classControlTeacherStudentDTO.setCourseClass(classControl.getCourseClass().getId());
        classControlTeacherStudentDTO.setStudents(studentIds);
        classControlTeacherStudentDTO.setContent(classControl.getContent());
        classControlTeacherStudentDTO.setId(classControl.getId());
        classControlTeacherStudentDTO.setDay(classControl.getDay());
        classControlTeacherStudentDTO.setMonth(classControl.getMonth());
        classControlTeacherStudentDTO.setYear(classControl.getYear());
        classControlTeacherStudentDTO.setReplacement(classControl.getReplacement());
        classControlTeacherStudentDTO.setTeacherId(teacherId);
        return classControlTeacherStudentDTO;
    }
}
