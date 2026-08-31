package br.com.easyschool.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;


public interface LoginDTO {
    UUID getId();
    String getUsername();
    String getName();

    @JsonProperty("profile_id")
    Integer getProfileId();

    @JsonProperty("profile_type")
    String getProfileType();

    String[] getRoles();
}