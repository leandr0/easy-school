package br.com.easyschool.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Set;
import java.util.UUID;

public record UserDTO (UUID id, String username, String name, @JsonProperty("profile_id") Integer profileId,@JsonProperty("profile_type") String profileType, Set<String> roles) {}
