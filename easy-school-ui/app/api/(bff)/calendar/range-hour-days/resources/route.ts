
'use server'
import { NextRequest, NextResponse } from 'next/server';
import { bearerHeaders, requireAuth } from '@/app/lib/authz.server';
import { externalApiClient } from '@/app/config/clientAPI';


const clientApi = externalApiClient.resource('/calendar/range-hour-days');


export async function DELETE(req: NextRequest) {
  try {
    
    const ids = parseIds(new URL(req.url).searchParams);

     if (ids.length === 0) {
      return NextResponse.json({ error: 'ids query param is required' }, { status: 400 });
    }

      await requireAuth(['ADMIN',"TEACHER"]);
    
      const queryParams = new URLSearchParams();
      queryParams.set("ids", ids.join(','));
    
      await clientApi.delete("/resources?"+queryParams.toString(), { headers: {...(await bearerHeaders()), 'Content-Type': 'application/json', }});

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Delete failed' }, { status: e?.status ?? 500 });
  }
}


function parseIds(search: URLSearchParams): string[] {
  // Support:
  //   ?ids=1,2,3
  //   ?ids=1&ids=2&ids=3
  //   ?ids[]=1&ids[]=2&ids[]=3
  const parts: string[] = [];

  const idsMulti = search.getAll('ids');       // ids=1&ids=2
  const idsArray = search.getAll('ids[]');     // ids[]=1&ids[]=2
  const idsComma = search.get('ids');          // ids=1,2,3

  if (idsMulti.length) parts.push(...idsMulti);
  if (idsArray.length) parts.push(...idsArray);
  if (idsComma) parts.push(idsComma);

  return [...new Set(                         // dedupe
    parts
      .flatMap(s => s.split(','))             // split "1,2,3"
      .map(s => s.trim())
      .filter(Boolean)
  )];
}