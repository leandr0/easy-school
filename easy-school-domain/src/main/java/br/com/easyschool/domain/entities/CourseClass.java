package br.com.easyschool.domain.entities;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "course_class")
public class CourseClass implements EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Boolean status;


    @Column(name = "start_hour")
    @JsonProperty("start_hour")
    private Integer startHour;

    @Column(name = "start_minute")
    @JsonProperty("start_minute")
    private Integer startMinute;

    @Column(name = "duration_hour")
    @JsonProperty("duration_hour")
    private Integer durationHour;

    @Column(name = "duration_minute")
    @JsonProperty("duration_minute")
    private Integer durationMinute;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;


    /**
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_class_id")
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

    public Integer getStartHour() {
        return startHour;
    }

    public void setStartHour(Integer startHour) {
        this.startHour = startHour;
    }

    public Integer getStartMinute() {
        return startMinute;
    }

    public void setStartMinute(Integer startMinute) {
        this.startMinute = startMinute;
    }

    public Integer getDurationHour() {
        return durationHour;
    }

    public void setDurationHour(Integer durationHour) {
        this.durationHour = durationHour;
    }

    public Integer getDurationMinute() {
        return durationMinute;
    }

    public void setDurationMinute(Integer durationMinute) {
        this.durationMinute = durationMinute;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }


    /**
    public List<CourseClassCalendar> getCourseClassCalendars() {
        return courseClassCalendars;
    }

    public void setCourseClassCalendars(List<CourseClassCalendar> courseClassCalendars) {
        this.courseClassCalendars = courseClassCalendars;
    }**/
}