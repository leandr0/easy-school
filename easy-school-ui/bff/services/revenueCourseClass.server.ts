import { RevenueCourseClassStudentModel } from "@/app/lib/definitions/revenue_course_class_student_definitons";
import { URLPathParam } from "@/app/lib/url_path_param";

import { bffApiClient } from "@/app/config/clientAPI";

const clientApi = bffApiClient.resource('/revenue-course-class-student');

// Fetch all students
export async function fetchRevenueCourseClassStudentByStudentAndRevenue(student_id: any, revenue_id: any): Promise<RevenueCourseClassStudentModel[]> {

    const pathParams = new URLPathParam();

    pathParams.append("student");
    pathParams.append(student_id);
    pathParams.append("revenue");
    pathParams.append(revenue_id);
    

    return await clientApi.get(pathParams.toString());
}

