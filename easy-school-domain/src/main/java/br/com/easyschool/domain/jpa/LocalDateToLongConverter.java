package br.com.easyschool.domain.jpa;

// Convert LocalDate <-> BIGINT (epoch millis at start of day in São Paulo)
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.time.*;

@Converter(autoApply = false)
public class LocalDateToLongConverter implements AttributeConverter<LocalDate, Long> {
    private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");
    @Override public Long convertToDatabaseColumn(LocalDate attribute) {
        if (attribute == null) return null;
        return attribute.atStartOfDay(ZONE).toInstant().toEpochMilli();
    }
    @Override public LocalDate convertToEntityAttribute(Long dbData) {
        if (dbData == null) return null;
        return Instant.ofEpochMilli(dbData).atZone(ZONE).toLocalDate();
    }
}

