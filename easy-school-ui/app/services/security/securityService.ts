import { UserModel } from '@/app/lib/definitions/user_definitions';

import { browserApiClient } from '@/app/config/clientAPI';

const clientApi = browserApiClient.resource('/security/login');

// Fetch all students
export async function loginSetCookie(login:string,password:string): Promise<UserModel> {
    console.log(`loginSetCookie ${login}`);

    
    const user: UserModel = await clientApi.post<UserModel>({"username" : login, "password":password});

    return user;
  
}