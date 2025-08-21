package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.RevenueCourseClassStudent;
import br.com.easyschool.domain.repositories.RevenueCourseClassStudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/revenue_course_class_student")
@Slf4j
@RequiredArgsConstructor
public class RevenueCourseClassStudentGateway {


    private final RevenueCourseClassStudentRepository repository;

    @GetMapping("{student_id}/student/{revenue_id}/revenue")
    public ResponseEntity<List<RevenueCourseClassStudent>> fetchRevenueCourseClassStudentByStudentAndRevenue(@PathVariable("student_id")Integer studentId, @PathVariable("revenue_id")Integer revenueId){

        try{

            List<RevenueCourseClassStudent> result = repository.fetchByStudentAndRevenue(revenueId,studentId);

            if(result.isEmpty())
                return ResponseEntity.notFound().build();

            return ResponseEntity.ok(result);

        }catch (Throwable t){
         log.error(t.getMessage());
         return ResponseEntity.internalServerError().build();
        }
    }

}
