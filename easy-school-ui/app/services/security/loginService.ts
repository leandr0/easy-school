import { apiClient } from "@/app/config/api";
import { UserModel } from "@/app/lib/definitions/user_definitions";
import { NextResponse } from "next/server";
import { serialize } from 'cookie'
import { generateJwtToken} from '@/app/lib/session'



const clientApi = apiClient.resource('/security/login');

// Fetch all students
export async function login(login:string,password:string): Promise<UserModel> {

    const user: UserModel = await clientApi.post<UserModel>({"username" : login, "password":password});

    return user;
  
}