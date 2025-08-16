package br.com.easyschool.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
public class CollectionFormDTO {

    @JsonProperty("class_id")
    @Getter @Setter
    private Integer classId;

    @JsonProperty("class_name")
    @Getter @Setter
    private String className;

    @JsonProperty("student_id")
    @Getter @Setter
    private Integer studentId;

    @JsonProperty("student_name")
    @Getter @Setter
    private String studentName;

    @JsonProperty("course_price")
    @Getter @Setter
    private Float coursePrice;

    @JsonProperty("due_date")
    @Getter @Setter
    private Integer dueDate;

    /**
    public CollectionFormDTO(){}

    public CollectionFormDTO(Integer classId, String className, Integer studentId, String studentName, Float coursePrice) {
        this.classId = classId;
        this.className = className;
        this.studentId = studentId;
        this.studentName = studentName;
        this.coursePrice = coursePrice;
    }

     public Integer getClassId() {
     return classId;
     }

     public void setClassId(Integer classId) {
     this.classId = classId;
     }

     public String getClassName() {
     return className;
     }

     public void setClassName(String className) {
     this.className = className;
     }

     public Integer getStudentId() {
     return studentId;
     }

     public void setStudentId(Integer studentId) {
     this.studentId = studentId;
     }

     public String getStudentName() {
     return studentName;
     }

     public void setStudentName(String studentName) {
     this.studentName = studentName;
     }

     public Float getCoursePrice() {
     return coursePrice;
     }

     public void setCoursePrice(Float coursePrice) {
     this.coursePrice = coursePrice;
     }

     public Integer getDueDate() {
     return dueDate;
     }

     public void setDueDate(Integer dueDate) {
     this.dueDate = dueDate;
     }

     **/

}
