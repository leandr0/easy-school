package br.com.easyschool.domain.dto;

import br.com.easyschool.domain.entities.Teacher;

public record ClassControlTeacherDTO(
        Integer id,
        Teacher teacher

) {}
