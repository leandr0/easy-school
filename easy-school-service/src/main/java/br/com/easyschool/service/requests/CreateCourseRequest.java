package br.com.easyschool.service.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CreateCourseRequest {

    private String name;

    @JsonProperty("language_id")
    private Integer languageId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getLanguageId() {
        return languageId;
    }

    public void setLanguageId(Integer languageId) {
        this.languageId = languageId;
    }
}
