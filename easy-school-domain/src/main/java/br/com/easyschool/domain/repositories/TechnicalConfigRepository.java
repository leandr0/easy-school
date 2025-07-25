package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.entities.TechnicalConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TechnicalConfigRepository extends JpaRepository<TechnicalConfig, Integer> {

    @Query(value = """
            SELECT param
            FROM technical_config
            WHERE code = :code
            """,nativeQuery = true)
    public String fetchParamByCode(@Param("code") int code);

}
