package br.com.easyschool.service.gateways;

import br.com.easyschool.domain.entities.Book;
import br.com.easyschool.domain.entities.Chapter;
import br.com.easyschool.domain.repositories.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@Slf4j
public class BookGateway {
    private final BookRepository repository;

    ///@PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Book>> getAll() {
        try {
            return ResponseEntity.ok(repository.findAll());
        } catch (Throwable t) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public Optional<Book> findBook(@PathVariable("id") final Integer bookId) {
        return repository.findById(bookId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Book create(@RequestBody Book request) {

        if (request.getId() == null || request.getId() <= 0) {
            request.setStatus(true);
        }

        if (request.getChapters() != null) {
            int position = 1;
            for (Chapter chapter : request.getChapters()) {
                chapter.setBook(request);
                if (chapter.getPosition() == null) {
                    chapter.setPosition(position);
                }
                position++;
            }
        }

        return repository.save(request);
    }
}
