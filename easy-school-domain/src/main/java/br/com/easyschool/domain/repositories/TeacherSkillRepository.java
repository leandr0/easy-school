package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.TeacherSkill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherSkillRepository extends JpaRepository<TeacherSkill, Integer> {
}
