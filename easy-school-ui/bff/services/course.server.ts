'use server';
import { bffApiClient } from "@/app/config/clientAPI";
import { bearerHeaders } from "@/app/lib/authz.server";
import { CourseModel } from "@/app/lib/definitions/courses_definitions";

const clientApi = bffApiClient.resource('/courses');

/**
 * Fetches all courses.
 *
 * Calls the API exposed by `/app/courses/route.ts` (GET /api/courses).
 *
 * @async
 * @function getAllCourses
 * @returns {Promise<CourseModel[]>} A promise that resolves with the list of courses.
 * @permission Requires role: `ADMIN` and `TEACHER`
 * @see {@link /app/courses/route.ts} for the API implementation
 */
export async function getAllCourses(): Promise<CourseModel[]> {
  return clientApi.get('', { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
}

/**
 * Fetches only available courses.
 *
 * Calls the API exposed by `/app/courses/route.ts` (GET /api/courses/available).
 *
 * @async
 * @function getAllCoursesAvailable
 * @permission Requires role: `ADMIN`
 * @returns {Promise<CourseModel[]>} A promise that resolves with the list of available courses.
 * @see {@link /app/courses/route.ts}
 */
export async function getAllCoursesAvailable(): Promise<CourseModel[]> {
  return clientApi.get("/available", { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store' } });
}

/**
 * Finds a specific course by its ID.
 *
 * Calls the API exposed by `/app/courses/[course_id]/route.ts` (GET /api/courses/:id).
 *
 * @async
 * @function findCourse
 * @param {string|number} course_id - The unique identifier of the course.
 * @permission Requires role: `ADMIN` and `TEACHER`
 * @returns {Promise<CourseModel>} A promise that resolves with the found course.
 * @see {@link /app/courses/route.ts}
 */
export async function findCourse(course_id:any): Promise<CourseModel> {
  return clientApi.get("/"+course_id, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', cache: 'no-store', credentials: 'include'} });
}

/**
 * Creates a new course.
 *
 * Calls the API exposed by `/app/courses/route.ts` (POST /api/courses).
 *
 * @async
 * @function createCourse
 * @param {CourseModel} course - The course object to create.
 * @permission Requires role: `ADMIN`
 * @returns {Promise<CourseModel>} A promise that resolves with the created course.
 * @see {@link /app/courses/route.ts}
 */
export async function createCourse(course: CourseModel): Promise<CourseModel> {
  return clientApi.post(course, { headers: { ...(await bearerHeaders()), 'Content-Type': 'application/json', } });
}