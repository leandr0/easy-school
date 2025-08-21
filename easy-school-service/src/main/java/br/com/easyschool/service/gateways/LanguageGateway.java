package br.com.easyschool.service.gateways;


import br.com.easyschool.domain.dto.DashBoardStudentLanguageDTO;
import br.com.easyschool.domain.entities.Language;
import br.com.easyschool.domain.repositories.LanguageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/languages")
@Slf4j
@RequiredArgsConstructor
public class LanguageGateway {


    private final LanguageRepository repository;

    @GetMapping
    public ResponseEntity<List<Language>> getAll() {

        try {
             List<Language> result = repository.findAll();

             if (result.isEmpty())
                 return ResponseEntity.notFound().build();

             return ResponseEntity.ok(result);

        }catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/total_students")
    public ResponseEntity<List<DashBoardStudentLanguageDTO>> getLanguageTotalStudents() {
        try {

            List<DashBoardStudentLanguageDTO> result = repository.totalStudentsLanguage();

            if(result.isEmpty())
                return ResponseEntity.notFound().build();

            return ResponseEntity.ok(result);

        }catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Language> create(@RequestBody Language request) {
        try {

            return ResponseEntity.ok(repository.save(request));

        }catch (Throwable t){
            log.error(t.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

}
