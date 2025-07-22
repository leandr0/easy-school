package br.com.easyschool.domain.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "calendar_week_day")
public class CalendarWeekDay implements EntityBase{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "week_day", nullable = false)
    @JsonProperty("week_day")
    private String weekDay;


    /**
    @OneToMany(mappedBy = "calendarWeekDay", fetch = FetchType.LAZY)
    private List<CourseClassCalendar> courseClassCalendars;
**/
    @Override
    public Integer getId() {
        return id;
    }

    @Override
    public void setId(Integer id) {
        this.id = id;
    }

    public String getWeekDay() {
        return weekDay;
    }

    public void setWeekDay(String weekDay) {
        this.weekDay = weekDay;
    }
}
