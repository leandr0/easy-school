package br.com.easyschool.service.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CreateTeacherSkillRequest {

    @JsonProperty("language_id")
    private Integer languageID;

    @JsonProperty("teacher_id")
    private Integer teacherID;

    public Integer getLanguageID() {
        return languageID;
    }

    public void setLanguageID(Integer languageID) {
        this.languageID = languageID;
    }

    public Integer getTeacherID() {
        return teacherID;
    }

    public void setTeacherID(Integer teacherID) {
        this.teacherID = teacherID;
    }
}