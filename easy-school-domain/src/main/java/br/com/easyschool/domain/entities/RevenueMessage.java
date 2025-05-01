package br.com.easyschool.domain.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "revenue_message")
public class RevenueMessage implements EntityBase{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "reminder_message",nullable = false)
    @JsonProperty("reminder_message")
    private String reminderMessage;

    @Column(name = "payment_overdue_message",nullable = false)
    @JsonProperty("payment_overdue_message")
    private String paymentOverdueMessage;

    @Override
    public Integer getId() {
        return id;
    }

    @Override
    public void setId(Integer id) {
        this.id = id;
    }

    public String getReminderMessage() {
        return reminderMessage;
    }

    public void setReminderMessage(String reminderMessage) {
        this.reminderMessage = reminderMessage;
    }

    public String getPaymentOverdueMessage() {
        return paymentOverdueMessage;
    }

    public void setPaymentOverdueMessage(String paymentOverdueMessage) {
        this.paymentOverdueMessage = paymentOverdueMessage;
    }
}
