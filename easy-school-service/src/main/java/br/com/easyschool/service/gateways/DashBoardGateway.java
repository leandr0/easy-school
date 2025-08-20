package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.dto.DashboardMonthGrowthDTO;
import br.com.easyschool.domain.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/dashboard")
@Slf4j
@RequiredArgsConstructor
public class DashBoardGateway {


    private final TeacherRepository teacherRepository;

    private final CourseClassRepository courseClassRepository;

    private final LanguageRepository languageRepository;

    private final StudentRepository studentRepository;

    private final ClassControlRepository classControlRepository;

    @GetMapping("/cards/total")
    public ResponseEntity<Map<String,Integer>> getTeacherCourseClassLanguageStudent(){

        Map<String,Integer> result = new LinkedHashMap<>();

        result.put("total_teacher",teacherRepository.totalTeacherAvailable());
        result.put("total_course_class",courseClassRepository.totalCourseClassesAvailable());
        result.put("total_language",languageRepository.totalLanguageAvailable());
        result.put("total_student",studentRepository.totalStudentAvailable());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/growth")
    public ResponseEntity<List<DashboardMonthGrowthDTO>> getDataDashboardMonthGrowth(){

        return ResponseEntity.ok(classControlRepository.fetchDataDashBoardMothGrowth());
    }

}
