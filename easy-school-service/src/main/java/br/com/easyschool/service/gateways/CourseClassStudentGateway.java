package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.CourseClass;
import br.com.easyschool.domain.entities.CourseClassStudent;
import br.com.easyschool.domain.entities.Student;
import br.com.easyschool.domain.repositories.CourseClassRepository;
import br.com.easyschool.domain.repositories.CourseClassStudentRepository;
import br.com.easyschool.domain.repositories.StudentRepository;
import br.com.easyschool.service.requests.CourseClassStudentRequest;
import br.com.easyschool.service.requests.CreateCourseClassSudentListRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/course_class_students")
public class CourseClassStudentGateway {

    private final Log LOG = LogFactory.getLog(this.getClass());
    private final CourseClassStudentRepository repository;

    private final StudentRepository studentRepository;

    private final CourseClassRepository courseClassRepository;

    public CourseClassStudentGateway(CourseClassStudentRepository repository, StudentRepository studentRepository, CourseClassRepository courseClassRepository)
    {
        this.repository = repository;
        this.studentRepository = studentRepository;
        this.courseClassRepository = courseClassRepository;
    }


    @GetMapping
    public List<CourseClassStudent> getAll(){
        return repository.findAll();
    }

    @PostMapping
    public CourseClassStudent create(@RequestBody CourseClassStudentRequest request){

        CourseClass courseClass = courseClassRepository.findById(request.getCourseClassId())
                .orElseThrow(() -> new RuntimeException("CourseClass not found"));

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        CourseClassStudent entity = new CourseClassStudent();
        entity.setCourseClass(courseClass);
        entity.setStudent(student);


        return repository.save(entity);
    }

    @PostMapping("/student-list")
    public Set<CourseClassStudent> createList(@RequestBody CreateCourseClassSudentListRequest request){

        CourseClass courseClass = courseClassRepository.findById(request.getCourseClassId())
                .orElseThrow(() -> new RuntimeException("CourseClass not found"));


        List<Student> students = studentRepository.findAllById( Arrays.asList(request.getStudentIds()));

        Optional.of(students)
                 .filter(list -> !list.isEmpty())
                 .orElseThrow(() -> new RuntimeException("Student not found"));


        Set<CourseClassStudent> result = new LinkedHashSet<CourseClassStudent>();

        for (Student student :students) {

            CourseClassStudent entity = new CourseClassStudent();
            //TODO: get value from course
            entity.setCoursePrice(Double.parseDouble("500.001"));
            entity.setCourseClass(courseClass);
            entity.setStudent(student);
            result.add(repository.save(entity));
        }


        return result;
    }

    @DeleteMapping("/{student_id}/student/{course_class_id}/course-class")
    public void getDeleteByStudentAndCourseClass(@PathVariable("student_id") Integer studentId, @PathVariable("course_class_id") Integer courseClassId){
        repository.deleteByStudentIdAndCourseClassId(studentId,courseClassId);
    }

    @GetMapping("/{student_id}/student")
    public List<CourseClassStudent> fetchCourseClassByStudentId(@PathVariable("student_id") Integer studentId){
        return repository.fetchCourseClassByStudentId(studentId);
    }




}
