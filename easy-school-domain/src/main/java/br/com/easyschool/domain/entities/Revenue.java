package br.com.easyschool.domain.entities;


import br.com.easyschool.domain.types.RevenueType;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "revenue" ,
        uniqueConstraints = { @UniqueConstraint( columnNames = {"student_id","year","month"})})
public class Revenue implements EntityBase{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "student_id",nullable = false)
    private Student student;

    private Boolean paid;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RevenueType status = RevenueType.OPEN;

    @JsonProperty("reminder_message_sent")
    @Column(name = "reminder_sent")
    private Boolean reminderMessageSent;

    @JsonProperty("payment_message_sent")
    @Column(name = "payment_sent")
    private Boolean paymentMessageSent;

    @Column(name = "year",nullable = false)
    private Integer year;

    @Column(name = "month",nullable = false)
    private Integer month;

    @Column(name = "amount",nullable = false)
    private Double amount;

    @JsonProperty("due_date")
    @Column(name = "due_date",nullable = false)
    private Integer dueDate;
    @Override
    public Integer getId() {
        return id;
    }

    @Override
    public void setId(Integer id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Boolean getPaid() {
        return paid;
    }

    public void setPaid(Boolean paid) {
        this.paid = paid;
    }

    public RevenueType getStatus() {
        return status;
    }

    public void setStatus(RevenueType status) {
        this.status = status;
    }

    public Boolean getReminderMessageSent() {
        return reminderMessageSent;
    }

    public void setReminderMessageSent(Boolean reminderMessageSent) {
        this.reminderMessageSent = reminderMessageSent;
    }

    public Boolean getPaymentMessageSent() {
        return paymentMessageSent;
    }

    public void setPaymentMessageSent(Boolean paymentMessageSent) {
        this.paymentMessageSent = paymentMessageSent;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Integer getDueDate() {
        return dueDate;
    }

    public void setDueDate(Integer dueDate) {
        this.dueDate = dueDate;
    }
}