package br.com.easyschool.domain.entities;

import br.com.easyschool.domain.jpa.InstantToLongConverter;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

// entity
@Entity
@Table(name = "scheduled_job")
public class ScheduledJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable=false, unique=true)
    private String name;
    @Column(nullable=false)
    private String type; // CRON | FIXED_DELAY | FIXED_RATE
    private String cronExpression;
    private Long intervalMs;
    private Long initialDelayMs = 0L;
    @Column(nullable=false)
    private Boolean active = true;

    @JdbcTypeCode(SqlTypes.BIGINT)
    @Convert(converter = InstantToLongConverter.class)
    @Column(name = "last_run_at_ms")
    private Instant lastRunAt;

    @JdbcTypeCode(SqlTypes.BIGINT)
    @Convert(converter = InstantToLongConverter.class)
    @Column(name = "updated_at_ms")
    private Instant updatedAt;
    private String lastStatus;
    @Lob
    private String payloadJson;

    @PrePersist
    public void prePersist() {
        if (updatedAt == null) updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCronExpression() {
        return cronExpression;
    }

    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }

    public Long getIntervalMs() {
        return intervalMs;
    }

    public void setIntervalMs(Long intervalMs) {
        this.intervalMs = intervalMs;
    }

    public Long getInitialDelayMs() {
        return initialDelayMs;
    }

    public void setInitialDelayMs(Long initialDelayMs) {
        this.initialDelayMs = initialDelayMs;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Instant getLastRunAt() {
        return lastRunAt;
    }

    public void setLastRunAt(Instant lastRunAt) {
        this.lastRunAt = lastRunAt;
    }

    public String getLastStatus() {
        return lastStatus;
    }

    public void setLastStatus(String lastStatus) {
        this.lastStatus = lastStatus;
    }

    public String getPayloadJson() {
        return payloadJson;
    }

    public void setPayloadJson(String payloadJson) {
        this.payloadJson = payloadJson;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
