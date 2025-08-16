package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface HolidayRepository extends JpaRepository<Holiday, Integer> {
    // exact-date checks
    List<Holiday> findByDate(LocalDate date);
    List<Holiday> findByDateAndScope(LocalDate date, String scope);
    List<Holiday> findByDateAndScopeAndRegionCode(LocalDate date, String scope, String regionCode);

    // month prefetch (for caching / planner)
    List<Holiday> findByDateBetween(LocalDate startInclusive, LocalDate endInclusive);

    @Modifying
    @Query(value = "DELETE FROM holiday WHERE date >= ?1 AND date <= ?2", nativeQuery = true)
    int deleteByDateBetween(LocalDate startInclusive, LocalDate endInclusive);

    @Query(value = "SELECT * FROM holiday WHERE strftime('%Y', date) = :year", nativeQuery = true)
    List<Holiday> findByYear(@Param("year") String year);

}
