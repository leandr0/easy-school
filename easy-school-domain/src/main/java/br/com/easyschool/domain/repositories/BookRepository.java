package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Integer> {

    @Query("SELECT b FROM Book b WHERE b.status = true")
    List<Book> findAllBooksAvailable();

}
