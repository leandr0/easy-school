package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.dto.ClassControlCreateDTO;
import br.com.easyschool.domain.dto.ClassControlTeacherStudentDTO;
import br.com.easyschool.service.implementations.ClassControlService;
import br.com.easyschool.service.response.ClassControlResponse;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DateTimeException;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/class-control")
@Slf4j
@RequiredArgsConstructor
public class ClassControlGateway {


    private final ClassControlService service;


    @PostMapping
    public ResponseEntity<String> save(@RequestBody ClassControlCreateDTO[] classes) {

        try {
            service.save(classes);
        } catch (Throwable t) {
            log.error("Save Class Control Error : ",t.getMessage());
            return ResponseEntity.internalServerError().build();
        }

        return ResponseEntity.ok("Class control records saved successfully");
    }

    @GetMapping("/course-class/{course_class_id}")
    public ResponseEntity<List<ClassControlTeacherStudentDTO>> filteringDataRange(@RequestParam(value = "start_date", required = true) String startDate,
                                                                                  @RequestParam(value = "end_date", required = true) String endDate,
                                                                                  @PathVariable("course_class_id") Integer courseCLassId) {

        List<ClassControlTeacherStudentDTO> result = null;

        try {

            result = service.filteringDataRange(startDate,endDate,courseCLassId);

            if(result == null || result.isEmpty()){
                return ResponseEntity.notFound().build();
            }

        }catch (IllegalArgumentException i){
            log.info(i.getMessage());
            return ResponseEntity.badRequest().build();
        }
        catch (Throwable t) {
            log.info(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }

        return ResponseEntity.ok(result);

    }

    @GetMapping("/control/course-class/{course_class_id}")
    public ResponseEntity<List<ClassControlResponse>> fetchClassControlByCourseClassAndDateRange(
            @RequestParam("start_day") @Min(1) @Max(31) Integer startDay,
            @RequestParam("start_month") @Min(1) @Max(12) Integer startMonth,
            @RequestParam("start_year") @Min(1900) Integer startYear,
            @RequestParam("end_day") @Min(1) @Max(31) Integer endDay,
            @RequestParam("end_month") @Min(1) @Max(12) Integer endMonth,
            @RequestParam("end_year") @Min(1900) Integer endYear,
            @PathVariable("course_class_id") @Min(1) Integer courseClassId) {

        try {

            List<ClassControlResponse> result = service.fetchClassControlByCourseClassAndDateRange(startDay,startMonth,startYear,endDay,endMonth,endYear,courseClassId);

            if (result == null || result.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(result);

        } catch (DateTimeException e) {
            log.warn("Invalid date parameters: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }catch (IllegalArgumentException i){
            log.info(i.getMessage());
            return ResponseEntity.badRequest().build();
        }
        catch (Throwable t) {
            log.info(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
