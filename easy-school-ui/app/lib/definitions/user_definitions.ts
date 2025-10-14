import { RoleModel } from "./role_definitions";
import { StudentModel } from "./students_definitions";
import { TeacherModel } from "./teacher_definitions";

export type UserModel = {
    id?: string;
    username: string;
    roles: RoleModel[];
    status?: boolean;
    password_hash?:string;
    created_at?: string;
    student?: StudentModel | null;
    teacher?: TeacherModel | null;
  };

  export type UserLoginModel = {
    id?: string;
    username: string;
    roles: RoleModel[];
    status?: boolean;
    password_hash?:string;
    created_at?: string;
    profile_id: string;
    profile_type: string;
  };