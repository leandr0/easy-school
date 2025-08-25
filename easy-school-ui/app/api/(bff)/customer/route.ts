import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    console.log('Chamando a API');
    //console.log('Incoming Request Headers:', request.headers);
    const apiKey = request.headers.get('API-KEY')?.trim();
    console.log('Incoming api key:', apiKey);

    const correctApiKey = 'cdca8d16-4668-4f88-a180-09a8822b407b';

    console.log('Received API key:', JSON.stringify(apiKey));
    console.log('Expected API key:', JSON.stringify(correctApiKey));

    console.log('Type of apiKey:', typeof apiKey);
    console.log('Type of correctApiKey:', typeof correctApiKey);
    console.log('Comparison result:', apiKey === correctApiKey);
    
    if(apiKey === correctApiKey){
        console.log("Inside the IF : ", apiKey === correctApiKey);

        //console.log(data);
        
        return NextResponse.json({ status: 200 });
    }
    else{
        console.log('Invalid API KEY');
        return NextResponse.json({ error: 'Invalid API key' }, { status: 405 });
    }
   
}