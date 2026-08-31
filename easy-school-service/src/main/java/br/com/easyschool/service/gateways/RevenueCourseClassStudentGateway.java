package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.RevenueCourseClassStudent;
import br.com.easyschool.domain.repositories.RevenueCourseClassStudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/revenue-course-class-student")
@Slf4j
@RequiredArgsConstructor
public class RevenueCourseClassStudentGateway {


    private final RevenueCourseClassStudentRepository repository;

    @GetMapping("/student/{student_id}/revenue/{revenue_id}")
    public ResponseEntity<List<RevenueCourseClassStudent>> fetchRevenueCourseClassStudentByStudentAndRevenue(@PathVariable("student_id")Integer studentId, @PathVariable("revenue_id")Integer revenueId){

        try{

            List<RevenueCourseClassStudent> rawData = repository.fetchByStudentAndRevenue(revenueId,studentId);

            List<RevenueCourseClassStudent> result = new LinkedList<>();

            for (RevenueCourseClassStudent revenueCourseClassStudent : rawData) {
                revenueCourseClassStudent.getStudent().getUser().setTeacher(null);
                revenueCourseClassStudent.getStudent().getUser().setStudent(null);

                result.add(revenueCourseClassStudent);
            }

            if (result.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            result.forEach(rev -> {
                if (rev.getStudent() != null && rev.getStudent().getCourseClasses() != null) {
                    rev.getStudent().getCourseClasses().forEach(courseClass ->
                            courseClass.setTeacher(null)
                    );
                }
                rev.getCourseClass().setTeacher(null);
            });

            return ResponseEntity.ok(result);

        }catch (Throwable t){
         log.error(t.getMessage());
         return ResponseEntity.internalServerError().build();
        }
    }

}
