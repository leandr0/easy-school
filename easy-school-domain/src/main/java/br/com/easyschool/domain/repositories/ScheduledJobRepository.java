package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.ScheduledJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduledJobRepository extends JpaRepository<ScheduledJob, Integer> {
    List<ScheduledJob> findByActiveTrue();
}
