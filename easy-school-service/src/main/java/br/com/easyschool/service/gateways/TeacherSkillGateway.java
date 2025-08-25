package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.Language;
import br.com.easyschool.domain.entities.Teacher;
import br.com.easyschool.domain.entities.TeacherSkill;
import br.com.easyschool.domain.repositories.LanguageRepository;
import br.com.easyschool.domain.repositories.TeacherRepository;
import br.com.easyschool.domain.repositories.TeacherSkillRepository;
import br.com.easyschool.service.requests.CreateLTeacherSkillListRequest;
import br.com.easyschool.service.requests.CreateTeacherSkillRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/teacher/skills")
@Slf4j
@RequiredArgsConstructor
public class TeacherSkillGateway {

    private final TeacherSkillRepository repository;

    private final LanguageRepository languageRepository;

    private final TeacherRepository teacherRepository;

    @GetMapping
    public List<TeacherSkill> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public TeacherSkill create(@RequestBody CreateTeacherSkillRequest request) {

        Teacher teacher = teacherRepository.findById(request.getTeacherID())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Language language = languageRepository.findById(request.getLanguageID())
                .orElseThrow(() -> new RuntimeException("Language not found"));

        TeacherSkill entity = new TeacherSkill();
        entity.setTeacher(teacher);
        entity.setLanguage(language);

        return repository.save(entity);
    }

    @PostMapping("/list")
    public List<TeacherSkill> createAll(@RequestBody CreateLTeacherSkillListRequest request) {

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        //TODO: popular a lista de languages sem chamada ao banco
        List<Language> languages = languageRepository.findAllById(request.getLanguageIds());

        if (languages.isEmpty()) {
            throw new RuntimeException("Language not found");
        }

        List<TeacherSkill> entities = languages.stream()
                .map(language -> {
                    TeacherSkill entity = new TeacherSkill();
                    entity.setTeacher(teacher);
                    entity.setLanguage(language);
                    return entity;
                })
                .collect(Collectors.toList());

        return repository.saveAll(entities);
    }
}
