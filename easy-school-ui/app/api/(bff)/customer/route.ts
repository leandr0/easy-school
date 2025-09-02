import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {


    const apiKey = request.headers.get('API-KEY')?.trim();


    const correctApiKey = 'cdca8d16-4668-4f88-a180-09a8822b407b';







    
    if(apiKey === correctApiKey){



        
        return NextResponse.json({ status: 200 });
    }
    else{

        return NextResponse.json({ error: 'Invalid API key' }, { status: 405 });
    }
   
}