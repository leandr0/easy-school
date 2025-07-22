package br.com.easyschool.domain.dto;

public record CourseClassDTO(
        Integer id,
        String name,
        Boolean status,
        Integer startHour,
        Integer startMinute,
        Integer durationHour,
        Integer durationMinute,
        Integer courseId,
        Integer teacherId
) {}
