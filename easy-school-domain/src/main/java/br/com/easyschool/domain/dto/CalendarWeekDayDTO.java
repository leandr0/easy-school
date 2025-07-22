package br.com.easyschool.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CalendarWeekDayDTO(
        Integer id,
        @JsonProperty("week_day")
        String weekDay
) {}