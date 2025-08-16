package br.com.easyschool.domain.jpa;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.time.*;
import java.time.format.DateTimeFormatter;

@Converter(autoApply = false)
public class InstantToSqliteStringConverter implements AttributeConverter<Instant, String> {
    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS").withZone(ZoneOffset.UTC);

    @Override public String convertToDatabaseColumn(Instant attribute) {
        return attribute == null ? null : FMT.format(attribute);
    }

    @Override public Instant convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        LocalDateTime ldt = LocalDateTime.parse(dbData,
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS"));
        return ldt.toInstant(ZoneOffset.UTC);
    }
}
