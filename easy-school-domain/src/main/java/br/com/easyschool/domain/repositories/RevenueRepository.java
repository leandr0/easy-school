package br.com.easyschool.domain.repositories;


import br.com.easyschool.domain.dto.CollectionFormDTO;
import br.com.easyschool.domain.entities.Revenue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface RevenueRepository extends JpaRepository<Revenue, Integer> {

    @Query("SELECT r FROM Revenue r WHERE r.student.id = :student_id")
    List<Revenue> findByStudentId(@Param("student_id") Integer studentId);



    @Query("""
            SELECT r FROM Revenue r
            WHERE ( r.month >= :start_month AND r.year >= :start_year )
            AND (r.month <= :end_month AND r.year <= :end_year )""")
    List<Revenue> fetchByRangeData(@Param("start_month") Integer startMonth,
                                   @Param("start_year") Integer startYear,
                                   @Param("end_month") Integer endMonth,
                                   @Param("end_year") Integer endYear);

    @Query(value = """ 
            SELECT
            cc.id AS class_id,
            cc.name AS class_name,
            s.id AS student_id,
            s.name AS student_name,
            ccs.course_price,
            s.due_date
            FROM course_class_students ccs
            INNER JOIN course_class cc
            ON ccs.course_class_id = cc.id
            INNER JOIN student s
            ON ccs.student_id = s.id
            WHERE s.status = true
            AND
            cc.status = true
            ORDER BY s.id ASC
            """, nativeQuery = true)
    List<CollectionFormDTO> fetchCollectionForms();

    @Query(value = """ 
            SELECT
            cc.id AS class_id,
            cc.name AS class_name,
            s.id AS student_id,
            s.name AS student_name,
            ccs.course_price,
            s.due_date
            FROM course_class_students ccs
            INNER JOIN course_class cc
            ON ccs.course_class_id = cc.id
            INNER JOIN student s
            ON ccs.student_id = s.id
            WHERE s.id = :student_id
            AND ( s.status = true AND cc.status = true )
            """, nativeQuery = true)
    List<CollectionFormDTO> fetchCollectionFormByStudent(@Param("student_id") final Integer studentId);


    @Query( value = """
                SELECT amount FROM revenue
                WHERE month = :month
                AND year = :year
                AND student_id = :student_id
            """, nativeQuery = true)
    Double getAmountByStudentIdAndData(@Param("student_id") final Integer studentId, @Param("month") final Integer month, @Param("year") final Integer year);

    @Modifying
    @Transactional
    @Query(value = """
            UPDATE revenue
            SET paid = true,
            status = :status
            WHERE id = :revenue_id
            """, nativeQuery = true)
    void setPaidAsOK(@Param("revenue_id") final Integer revenueId, @Param("status") final String status);

    @Modifying
    @Transactional
    @Query(value = """
            UPDATE revenue
            SET payment_sent = true
            WHERE id = :revenue_id
            """, nativeQuery = true)
    void setPaymentSentAsTrue(@Param("revenue_id") final Integer revenueId);

    @Modifying
    @Transactional
    @Query(value = """
            UPDATE revenue
            SET reminder_sent = true
            WHERE id = :revenue_id
            """, nativeQuery = true)
    void setReminderSentAsTrue(@Param("revenue_id") final Integer revenueId);


    @Modifying
    @Transactional
    @Query(value = """
            UPDATE revenue
            SET status = 'OVERDUE'
            WHERE status = 'OPEN'
            AND month = :month
            AND year = :year
            AND paid = false
            AND due_date = :due_date;
            """, nativeQuery = true)
    void updateRevenueStatusByJobVerification(@Param("due_date") final Integer dueDate,@Param("month") final Integer month,@Param("year") final Integer year);

}
