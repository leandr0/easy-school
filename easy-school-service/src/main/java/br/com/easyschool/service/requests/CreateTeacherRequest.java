package br.com.easyschool.service.requests;

import br.com.easyschool.domain.entities.CalendarRangeHourDay;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.Set;

public class CreateTeacherRequest {

    private String name;

    @JsonProperty("phone_number")
    private String phoneNumber;

    private String email;

    private Double compensation;

    @JsonProperty("start_date")
    private LocalDateTime startDate;

    @JsonProperty("language_ids")
    private Set<Integer> languagesId;

    @JsonProperty("calendar_range_hour_days")
    private Set<CalendarRangeHourDay> calendarRangeHourDays;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getCompensation() {
        return compensation;
    }

    public void setCompensation(Double compensation) {
        this.compensation = compensation;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public Set<Integer> getLanguagesId() {
        return languagesId;
    }

    public void setLanguagesId(Set<Integer> languagesId) {
        this.languagesId = languagesId;
    }

    public Set<CalendarRangeHourDay> getCalendarRangeHourDays() {
        return calendarRangeHourDays;
    }

    public void setCalendarRangeHourDays(Set<CalendarRangeHourDay> calendarRangeHourDays) {
        this.calendarRangeHourDays = calendarRangeHourDays;
    }
}