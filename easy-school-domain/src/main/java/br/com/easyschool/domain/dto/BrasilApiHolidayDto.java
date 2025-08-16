package br.com.easyschool.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BrasilApiHolidayDto {
    // BrasilAPI returns ISO-8601 date string (YYYY-MM-DD)
    private LocalDate date;
    private String name;

    // "type" examples: "national", "state", "municipal" (keep flexible)
    private String type;

    // Some versions may include extras (law, subdivisions). We ignore them.

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}

