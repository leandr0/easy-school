package br.com.easyschool.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;


public record ClassControlDTO(


        Integer id,


        Integer day,


        Integer month,


        Integer year,


        String content,


        boolean replacement,


        @JsonProperty("course_class")
        CourseClassDTO courseClass,


        @JsonProperty("class_control_teachers")
        List<ClassControlTeacherDTO> classControlTeachers,


        @JsonProperty("class_control_students")
        List<ClassControlStudentDTO> classControlStudents
) { }
