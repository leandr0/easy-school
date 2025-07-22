package br.com.easyschool.domain.dto;

public record CourseClassCalendarDTO(
        Integer id,
        Integer courseClassId,
        Integer calendarWeekDayId
) {}
