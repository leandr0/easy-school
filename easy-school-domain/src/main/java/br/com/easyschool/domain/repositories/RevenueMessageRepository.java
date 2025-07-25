package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.RevenueMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RevenueMessageRepository extends JpaRepository<RevenueMessage, Integer> {

}
