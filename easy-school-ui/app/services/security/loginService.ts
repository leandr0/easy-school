import { apiClient } from "@/app/config/api";
import { UserModel } from "@/app/lib/definitions/user_definitions";

import { externalApiClient } from '@/app/config/clientAPI';

const clientApi = externalApiClient.resource('/security/login');

export async function login(login:string,password:string): Promise<UserModel> {

    const user: UserModel = await clientApi.post<UserModel>({"username" : login, "password":password});

    return user;
  
}