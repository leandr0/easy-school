package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.Language;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LanguageRepository extends JpaRepository<Language, Integer> {

    @Override
    default List<Language> findAll() {
        return findAll(Sort.by(Sort.Direction.ASC, "name"));
    }
}
