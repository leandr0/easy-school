import { apiClient } from "@/app/config/api";
import { RevenueCourseClassStudentModel } from "../lib/definitions/revenue_course_class_student_definitons";
import { URLPathParam } from "../lib/url_path_param";

const clientApi = apiClient.resource('/revenue_course_class_student');

// Fetch all students
export async function fetchRevenueCourseClassStudentByStudentAndRevenue(student_id: any, revenue_id: any): Promise<RevenueCourseClassStudentModel[]> {
    
    console.log(`student_id ${student_id} , revenue_id ${revenue_id}`)
    const pathParams = new URLPathParam();

    pathParams.append(student_id);
    pathParams.append("student");
    pathParams.append(revenue_id);
    pathParams.append("revenue");

    return await clientApi.get(pathParams.toString());
}

