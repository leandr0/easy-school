package br.com.easyschool.domain.repositories;

import br.com.easyschool.domain.dto.DashboardMonthGrowthDTO;
import br.com.easyschool.domain.entities.ClassControl;
import br.com.easyschool.domain.jpa.ClassControlRow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClassControlRepository extends JpaRepository<ClassControl, Integer> {


    @Query(value = """
            SELECT *
            FROM class_control
            WHERE make_date(year, month, day) BETWEEN CAST(:start_date AS DATE) AND CAST(:end_date AS DATE)
            AND course_class_id = :course_class_id
            """, nativeQuery = true)
    public List<ClassControl> fetchByDateRange(@Param("start_date") String startDate, @Param("end_date") String endDate, @Param("course_class_id") Integer courseClassId);


    @Query(value = """
                SELECT ccl.*, ccs.* , cct.*
                FROM class_control ccl
                INNER JOIN course_class cc
                ON ccl.course_class_id = cc.id
                LEFT JOIN class_control_student ccs
                ON ccl.id = ccs.class_control_id
                LEFT JOIN class_control_teacher cct
                ON ccl.id = cct.class_control_id
                WHERE make_date(year, month, day)
                BETWEEN CAST(:start_date AS DATE) AND CAST(:end_date AS DATE)
                AND cc.id = :course_class_id
                ORDER BY make_date(year, month, day) ASC
            """, nativeQuery = true)
    List<ClassControl> fetchRevenueDetailsByCourseClass(@Param("course_class_id") final Integer courseClassId,
                                                        @Param("start_data") final String startData,
                                                        @Param("end_data") final String endData);


    @Query(value = """
               SELECT
                 ccl.id         AS classControlId,
                 ccl.day        AS day,
                 ccl.month      AS month,
                 ccl.year       AS year,
                 ccl.content    AS content,
                 ccl.replacement AS replacement,
                       
                 cc.id          AS courseClassId,
                 cc.name        AS courseClassName,
                 cc.status      AS courseClassStatus,
                 cc.start_hour  AS courseClassStartHour,
                 cc.start_minute AS courseClassStartMinute,
                 cc.end_hour    AS courseClassEndHour,
                 cc.end_minute  AS courseClassEndMinute,
                       
                 cct.teacher_id AS teacherId,
                 t.name         AS teacherName,
                 ccs.student_id AS studentId,
                 s.name         AS studentName
            FROM class_control ccl
            JOIN course_class cc ON ccl.course_class_id = cc.id
            LEFT JOIN class_control_teacher cct ON ccl.id = cct.class_control_id
            LEFT JOIN teacher t ON cct.teacher_id = t.id
            LEFT JOIN class_control_student ccs ON ccl.id = ccs.class_control_id
            LEFT JOIN student s ON ccs.student_id = s.id
            WHERE make_date(ccl.year, ccl.month, ccl.day)
            BETWEEN make_date(CAST(:startYear AS int), CAST(:startMonth AS int), CAST(:startDay AS int))
            AND make_date(CAST(:endYear   AS int), CAST(:endMonth   AS int), CAST(:endDay   AS int))
            AND cc.id = :courseClassId
            ORDER BY make_date(ccl.year, ccl.month, ccl.day) ASC
                      """, nativeQuery = true)
    List<ClassControlRow> fetchByCourseClassAndDateRange(
            @Param("courseClassId") Integer courseClassId,
            @Param("startDay") Integer startDay,
            @Param("startMonth") Integer startMonth,
            @Param("startYear") Integer startYear,
            @Param("endDay") Integer endDay,
            @Param("endMonth") Integer endMonth,
            @Param("endYear") Integer endYear
    );

    @Query(value = """
            SELECT
             CAST(COUNT(*) AS int) AS total,
              to_char(make_date(cc.year, cc.month, 1), 'Mon YY') AS month_label
            FROM class_control cc
            GROUP BY cc.year, cc.month
            ORDER BY make_date(cc.year, cc.month, 1) ASC;
            """, nativeQuery = true)
    List<DashboardMonthGrowthDTO> fetchDataDashBoardMothGrowth();
}
