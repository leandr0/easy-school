package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.Language;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LanguageRepository extends JpaRepository<Language, Integer> {
}
