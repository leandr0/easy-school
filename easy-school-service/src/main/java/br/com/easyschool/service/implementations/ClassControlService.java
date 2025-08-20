package br.com.easyschool.service.implementations;

import br.com.easyschool.domain.dto.ClassControlCreateDTO;
import br.com.easyschool.domain.dto.ClassControlTeacherStudentDTO;
import br.com.easyschool.domain.entities.*;
import br.com.easyschool.domain.jpa.ClassControlRow;
import br.com.easyschool.domain.repositories.ClassControlRepository;
import br.com.easyschool.domain.repositories.ClassControlStudentRepository;
import br.com.easyschool.domain.repositories.ClassControlTeacherRepository;
import br.com.easyschool.service.response.ClassControlResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ClassControlService {

    private final ClassControlRepository repository;

    private final ClassControlStudentRepository classControlStudentRepository;

    private final ClassControlTeacherRepository classControlTeacherRepository;

    public void save(ClassControlCreateDTO[] classes) throws Exception {

        try {

            Teacher teacher = null;

            List<ClassControlStudent> classControlStudents = null;
            List<ClassControl> classControls = new LinkedList<>();

            for (ClassControlCreateDTO dto : classes) {

                if (teacher == null) {
                    teacher = new Teacher();
                    teacher.setId(dto.getTeacherId());
                }

                ClassControl classControl = new ClassControl();
                CourseClass courseClass = new CourseClass();
                courseClass.setId(dto.getCourseClassId());

                classControl.setCourseClass(courseClass);

                classControl.setContent(dto.getContent());

                LocalDate now = LocalDate.parse(dto.getDate());
                Integer year = now.getYear();
                Integer day = now.getDayOfMonth();
                Month month = now.getMonth();
                Integer monthNumber = now.getMonthValue();
                classControl.setDay(day);
                classControl.setMonth(monthNumber);
                classControl.setYear(year);
                classControl.setReplacement(dto.isReplacement());


                classControl = repository.save(classControl);


                if (dto.getStudents().length > 0)
                    classControlStudents = new LinkedList<>();

                for (Integer studentId : dto.getStudents()) {
                    ClassControlStudent classControlStudent = new ClassControlStudent();
                    classControlStudent.setStudent(new Student(studentId));
                    classControlStudent.setClassControl(classControl);

                    classControlStudents.add(classControlStudent);
                }

                if (classControlStudents != null) {
                    classControlStudentRepository.saveAll(classControlStudents);
                }

                if (dto.getTeacherId() != null) {
                    ClassControlTeacher classControlTeacher = new ClassControlTeacher();
                    classControlTeacher.setTeacher(new Teacher(dto.getTeacherId()));
                    classControlTeacher.setClassControl(classControl);
                    classControlTeacherRepository.save(classControlTeacher);
                }

            }

        } catch (Throwable t) {
            throw new Exception(t.getMessage());
        }
    }

    public List<ClassControlTeacherStudentDTO> filteringDataRange(String startDate, String endDate,Integer courseCLassId) throws Exception {

        List<ClassControlTeacherStudentDTO> result;

        try {

            if (!courseClassIdStartDataEndDataValidation(startDate, endDate, courseCLassId)) {
                throw new IllegalArgumentException();
            }

            List<ClassControl> classControls = repository.fetchByDateRange(startDate, endDate, courseCLassId);

            if (classControls != null && !classControls.isEmpty()) {
                result = new LinkedList<>();
            } else {
                return null;
            }

            for (ClassControl classControl : classControls) {

                Integer teacherId = classControlTeacherRepository.fetchTeacherIdByClassControlId(classControl.getId());

                List<Integer> studentIds = classControlStudentRepository.fetchStudentIdsByClassControlId(classControl.getId());

                ClassControlTeacherStudentDTO classControlTeacherStudentDTO = getClassControlTeacherStudentDTO(classControl, studentIds, teacherId);

                result.add(classControlTeacherStudentDTO);

            }

        } catch (Throwable t) {
            log.info(t.getMessage());
            throw  new Exception(t.getMessage());
        }

        return result;

    }

    public List<ClassControlResponse> fetchClassControlByCourseClassAndDateRange(Integer startDay, Integer startMonth, Integer startYear,
                                                                                                 Integer endDay, Integer endMonth, Integer endYear,
                                                                                                 Integer courseClassId) {

        try {

            if (!isValidDateRange(startDay, startMonth, startYear, endDay, endMonth, endYear, courseClassId)) {
                throw  new IllegalArgumentException(" Not all mandatory params are filled");
            }

            // Build date objects for better validation
            LocalDate startDate = LocalDate.of(startYear, startMonth, startDay);
            LocalDate endDate = LocalDate.of(endYear, endMonth, endDay);

            if (startDate.isAfter(endDate)) {
                throw  new IllegalArgumentException("The end date is before the start date");
            }

            List<ClassControlRow> queryResult = repository.fetchByCourseClassAndDateRange(
                    courseClassId, startDay, startMonth, startYear, endDay, endMonth, endYear);

            if (queryResult.isEmpty()) {
                return null;
            }

            return groupClassControlData(queryResult);

        } catch (DateTimeException e) {
            log.warn("Invalid date parameters: {}", e.getMessage());
            throw e;
        }
        catch (IllegalArgumentException i) {
            log.warn("Invalid parameters: {}", i.getMessage());
            throw i;
        } catch (Exception e) {
            log.error("Error fetching class control data", e);
            throw e;
        }
    }

    private static class ClassControlGroup {
        ClassControl classControl;
        Teacher teacher;
        List<Student> students = new ArrayList<>();
    }
    /**
     * Groups ClassControlRow data by classControlId and builds response objects
     */
    private List<ClassControlResponse> groupClassControlData(List<ClassControlRow> queryResult) {
        Map<Integer, ClassControlService.ClassControlGroup> groupedData = new LinkedHashMap<>();

        for (ClassControlRow row : queryResult) {
            int classControlId = row.getClassControlId();

            ClassControlService.ClassControlGroup group = groupedData.computeIfAbsent(classControlId,
                    id -> new ClassControlService.ClassControlGroup());

            // Set class control data (only once per group)
            if (group.classControl == null) {
                group.classControl = buildClassControl(row);
                group.teacher = buildTeacher(row);
            }

            // Add student to the group
            if (row.getStudentId() != null) {
                group.students.add(buildStudent(row));
            }
        }

        return groupedData.values().stream()
                .map(group -> new ClassControlResponse(group.classControl, group.students, group.teacher))
                .collect(Collectors.toList());
    }

    /**
     * Builds ClassControl object from row data
     */
    private ClassControl buildClassControl(ClassControlRow row) {
        ClassControl classControl = new ClassControl();
        classControl.setId(row.getClassControlId());
        classControl.setReplacement(row.getReplacement());
        classControl.setYear(row.getYear());
        classControl.setDay(row.getDay());
        classControl.setContent(row.getContent());
        classControl.setMonth(row.getMonth());
        classControl.setCourseClass(buildCourseClass(row));
        return classControl;
    }

    /**
     * Builds CourseClass object from row data
     */
    private CourseClass buildCourseClass(ClassControlRow row) {
        CourseClass courseClass = new CourseClass();
        courseClass.setId(row.getCourseClassId());
        courseClass.setStatus(row.getCourseClassStatus());
        courseClass.setStartMinute(row.getCourseClassStartMinute());
        courseClass.setEndMinute(row.getCourseClassEndMinute());
        courseClass.setStartHour(row.getCourseClassStartHour());
        courseClass.setEndHour(row.getCourseClassEndHour());
        courseClass.setName(row.getCourseClassName());
        return courseClass;
    }

    /**
     * Builds Teacher object from row data
     */
    private Teacher buildTeacher(ClassControlRow row) {
        Teacher teacher = new Teacher();
        teacher.setId(row.getTeacherId());
        teacher.setName(row.getTeacherName());
        return teacher;
    }

    /**
     * Builds Student object from row data
     */
    private Student buildStudent(ClassControlRow row) {
        Student student = new Student();
        student.setId(row.getStudentId());
        student.setName(row.getStudentName());
        return student;
    }

    /**
     * Validates input parameters with proper date validation
     */
    private boolean isValidDateRange(Integer startDay, Integer startMonth, Integer startYear,
                                     Integer endDay, Integer endMonth, Integer endYear,
                                     Integer courseClassId) {

        // Check for null values
        if (Stream.of(startDay, startMonth, startYear, endDay, endMonth, endYear, courseClassId)
                .anyMatch(Objects::isNull)) {
            return false;
        }

        // Check for positive values
        if (Stream.of(startDay, startMonth, startYear, endDay, endMonth, endYear, courseClassId)
                .anyMatch(value -> value <= 0)) {
            return false;
        }

        // Check month ranges
        if (startMonth > 12 || endMonth > 12) {
            return false;
        }

        // Check day ranges (basic check, detailed validation in LocalDate creation)
        if (startDay > 31 || endDay > 31) {
            return false;
        }

        return true;
    }

    private static boolean courseClassIdStartDataEndDataValidation(String startDate,
                                                                   String endDate,
                                                                   Integer courseCLassId) {
        return ((endDate != null && !endDate.isEmpty()) &&
                (startDate != null && !startDate.isEmpty()) &&
                (courseCLassId != null && courseCLassId > 0));

    }

    private static boolean courseClassIdStartDataEndDataValidationInteger(Integer startDay,
                                                                          Integer startMonth,
                                                                          Integer startYear,
                                                                          Integer endDay,
                                                                          Integer endMonth,
                                                                          Integer endYear,
                                                                          Integer courseCLassId) {
        return ((startDay != null && startDay > 0) &&
                (startMonth != null && startMonth > 0) &&
                (startYear != null && startYear > 0) &&
                (endDay != null && endDay > 0) &&
                (endMonth != null && endMonth > 0) &&
                (endYear != null && endYear > 0) &&
                (courseCLassId != null && courseCLassId > 0));

    }

    private static ClassControlTeacherStudentDTO getClassControlTeacherStudentDTO(ClassControl classControl, List<Integer> studentIds, Integer teacherId) {
        ClassControlTeacherStudentDTO classControlTeacherStudentDTO = new ClassControlTeacherStudentDTO();
        classControlTeacherStudentDTO.setCourseClass(classControl.getCourseClass().getId());
        classControlTeacherStudentDTO.setStudents(studentIds);
        classControlTeacherStudentDTO.setContent(classControl.getContent());
        classControlTeacherStudentDTO.setId(classControl.getId());
        classControlTeacherStudentDTO.setDay(classControl.getDay());
        classControlTeacherStudentDTO.setMonth(classControl.getMonth());
        classControlTeacherStudentDTO.setYear(classControl.getYear());
        classControlTeacherStudentDTO.setReplacement(classControl.getReplacement());
        classControlTeacherStudentDTO.setTeacherId(teacherId);
        return classControlTeacherStudentDTO;
    }
}
