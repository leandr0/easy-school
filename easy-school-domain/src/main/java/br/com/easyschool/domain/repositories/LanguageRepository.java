package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.Language;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

import java.util.List;
public interface LanguageRepository extends JpaRepository<Language, Integer> {

    @Override
    @NonNull
    default List<Language> findAll() {
        return findAll(Sort.by(Sort.Direction.ASC, "name"));
    }
}
