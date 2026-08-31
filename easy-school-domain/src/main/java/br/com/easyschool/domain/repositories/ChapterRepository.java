package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChapterRepository extends JpaRepository<Chapter, Integer> {
}
