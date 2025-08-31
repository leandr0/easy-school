import { RoleModel } from "./role_definitions";

export type UserModel = {
    id?: string;
    username: string;
    roles: RoleModel[];
    status?: boolean;
    password_hash?:string;
    created_at?: string;
  };