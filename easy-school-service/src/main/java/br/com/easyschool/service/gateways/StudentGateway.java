package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.dto.CoursePriceDTO;
import br.com.easyschool.domain.dto.StudentDTO;
import br.com.easyschool.domain.entities.CourseClass;
import br.com.easyschool.domain.entities.CourseClassStudent;
import br.com.easyschool.domain.entities.Student;
import br.com.easyschool.domain.entities.security.User;
import br.com.easyschool.domain.repositories.CourseClassRepository;
import br.com.easyschool.domain.repositories.CourseClassStudentRepository;
import br.com.easyschool.domain.repositories.StudentRepository;
import br.com.easyschool.domain.repositories.security.UserRepository;
import br.com.easyschool.service.gateways.security.JwtUser;
import br.com.easyschool.service.gateways.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/students")
@Slf4j
@RequiredArgsConstructor
public class StudentGateway {

    private final StudentRepository repository;

    private final CourseClassRepository courseClassRepository;

    private final CourseClassStudentRepository courseClassStudentRepository;

    private final UserRepository userRepository;

    private final JwtUtils jwtUtils;

    @GetMapping
    public ResponseEntity<List<Student>> getStudents(@RequestHeader(value = "Authorization", required = false) String auth) {

        try {

            JwtUser user = jwtUtils.parseBearer(auth);

            List<Student> queryResult = new LinkedList<>();

            if (user.hasRole("ADMIN")) {
                queryResult =  repository.findAll();
            } else if (user.hasRole("TEACHER")) {
                queryResult = repository.fetchStudentsByTeacher(user.profileId());
            }

            List<Student> result = new LinkedList<>();

            for (Student student : queryResult) {
                //student.setUser(null);
                student.getUser().setStudent(null);
                student.getUser().setTeacher(null);
                student.setCourseClasses(null);
                result.add(student);
            }

            return ResponseEntity.ok(result);

        }catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }

    }

    @GetMapping("/course-class/{id}/students")
    public ResponseEntity<List<Student>> getStudentsCourseClass(@PathVariable(value = "id" , required = true) final Integer courseClassId) {

        try {

            CourseClass courseClass = courseClassRepository.findById(courseClassId).orElseThrow();

            if(courseClass.getId() == null){
                return ResponseEntity.notFound().build();
            }

            List<Student> result =  repository.findStudentsInCourseClass(courseClassId);

            result.forEach(student -> student.setCourseClasses(null));
            result.forEach(student -> student.getUser().setRoles(null));
            result.forEach(student -> student.getUser().setStudent(null));
            result.forEach(student -> student.getUser().setTeacher(null));

            return ResponseEntity.ok(result);

        }catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }

    }

    @GetMapping("/course-class/{id}/candidate-students")
    public ResponseEntity<List<Student>> getStudentsNotCourseClass(@PathVariable(value = "id" , required = true) final Integer courseClassId) {

        try {

            List<Student> result = repository.findStudentsNotInCourseClass(courseClassId);

            result.forEach(student -> student.setCourseClasses(null));
            result.forEach(student -> student.getUser().setRoles(null));
            result.forEach(student -> student.getUser().setStudent(null));
            result.forEach(student -> student.getUser().setTeacher(null));

            // An empty result just means every student is already enrolled in this
            // class — that's a normal, successful state, not a "not found" error.
            // Returning 404 here made the UI's list-refresh call fail (the frontend
            // treats any non-2xx as an error and aborts the whole Promise.all), which
            // meant the "students in class" list would silently stop updating once
            // the candidates pool ran out — e.g. right after adding the last few
            // remaining students.
            return ResponseEntity.ok(result);

        }catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }

    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}/course-price")
    public ResponseEntity<StudentDTO> findStudentCoursePrice(@PathVariable("id") final Integer studentId) {
        Optional<Student> studentOpt = repository.findById(studentId);

        if (studentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        StudentDTO student = new StudentDTO();
        student.setStudent(studentOpt.get())
                .setCoursePrice(courseClassRepository.findStudentsCourseClassPrice(studentId));



        return ResponseEntity.ok(student);
    }

    /**
     * Dedicated "Contratos" endpoint: updates ONLY the per-student course price (contract)
     * for the informed student, without touching any personal/user data. Each entry's id
     * refers to the course_class_students (enrollment) row id, and is validated to belong
     * to the given student before being persisted.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/course-price")
    public ResponseEntity<List<CoursePriceDTO>> updateStudentContractCoursePrices(
            @PathVariable("id") final Integer studentId,
            @RequestBody List<CoursePriceDTO> courses) {

        try {

            Student student = repository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));

            if (courses != null) {
                for (CoursePriceDTO coursePrice : courses) {

                    if (coursePrice.getId() == null || coursePrice.getCoursePrice() == null) {
                        continue;
                    }

                    CourseClassStudent enrollment = courseClassStudentRepository.findById(coursePrice.getId())
                            .orElseThrow(() -> new RuntimeException("Course enrollment not found: " + coursePrice.getId()));

                    if (enrollment.getStudent() == null || !studentId.equals(enrollment.getStudent().getId())) {
                        return ResponseEntity.badRequest().build();
                    }

                    courseClassStudentRepository.updateCoursePriceById(coursePrice.getId(), coursePrice.getCoursePrice());
                }
            }

            List<CoursePriceDTO> updated = courseClassRepository.findStudentsCourseClassPrice(studentId);

            return ResponseEntity.ok(updated);

        } catch (Throwable t) {
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/course-price")
    public ResponseEntity<Student> updateStudentCoursePrice(@RequestBody StudentDTO request) {

        if (request == null || request.getId() == null) {
            return ResponseEntity.notFound().build();
        }

        try {

            Student entity = repository.findById(request.getId()).orElseThrow(() -> new RuntimeException("Student not found"));

            // Bug fix: the frontend sends personal data nested under "user" (matching what
            // GET /students/{id}/course-price returns), not as flat top-level fields on the
            // request. Reading request.getName()/getStatus()/... here (as before) was always
            // null, which silently wiped out the student's name/phone/status on every save,
            // or threw a NullPointerException when unboxing a null Boolean into User's
            // primitive `status` field. We now read from the nested user object instead, and
            // only overwrite fields that were actually provided.
            User incomingUser = request.getUser();
            if (incomingUser != null) {
                User persistedUser = entity.getUser();
                if (incomingUser.getName() != null) persistedUser.setName(incomingUser.getName());
                if (incomingUser.getPhoneNumber() != null) persistedUser.setPhoneNumber(incomingUser.getPhoneNumber());
                if (incomingUser.getUsername() != null) persistedUser.setUsername(incomingUser.getUsername());
                persistedUser.setStatus(incomingUser.isStatus());
                userRepository.save(persistedUser);
            }

            if (request.getDueDate() != null) {
                entity.setDueDate(request.getDueDate());
            }

            entity = repository.save(entity);

            if (request.getCoursePrice() != null) {
                for (CoursePriceDTO coursePrice : request.getCoursePrice()) {
                    if (coursePrice.getId() != null && coursePrice.getCoursePrice() != null) {
                        courseClassStudentRepository.updateCoursePriceById(coursePrice.getId(), coursePrice.getCoursePrice().doubleValue());
                    }
                }
            }

            entity.getUser().setStudent(null);
            entity.getUser().setTeacher(null);

            return ResponseEntity.ok(entity);

        } catch (Throwable t) {
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<Student> findCourse(@PathVariable("id") final Integer studentId) {

        try{

            Student result = repository.findById(studentId).orElseThrow();

            result.getUser().setStudent(null);
            result.getUser().setTeacher(null);

            return ResponseEntity.ok(result);

        }catch (Throwable t){
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public Student create(@RequestBody Student student) {

       if(student.getId() == null || student.getId() <= 0){
           student.getUser().setStatus(true);
       }


        return repository.save(student);
    }


    @GetMapping("/by-date")
    public List<Student> getByStartDate(@RequestParam String date) {
        LocalDateTime parsed = LocalDate.parse(date).atStartOfDay(); // se `startDate` for LocalDateTime
        return repository.findByStartDateEquals(parsed);
    }
}
