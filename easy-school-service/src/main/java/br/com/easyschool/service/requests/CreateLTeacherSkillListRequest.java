package br.com.easyschool.service.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Set;

public class CreateLTeacherSkillListRequest {


    @JsonProperty("language_ids")
    private Set<Integer> languageIds;

    @JsonProperty("language_id")
    private Integer teacherId;

    public static CreateLTeacherSkillListRequest build(){
        return new CreateLTeacherSkillListRequest();
    }

    public CreateLTeacherSkillListRequest addLanguageIds(Set<Integer> languageIds) {
        this.languageIds = languageIds;
        return this;
    }

    public CreateLTeacherSkillListRequest addTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
        return this;
    }

    public Set<Integer> getLanguageIds() {
        return languageIds;
    }

    public void setLanguageIds(Set<Integer> languageIds) {
        this.languageIds = languageIds;
    }

    public Integer getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
    }
}