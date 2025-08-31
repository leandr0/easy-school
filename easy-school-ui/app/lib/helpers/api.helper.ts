export function getURLQueryParam(url: string, queryParam: string) {

    const reqQueryParams = new URL(url).searchParams;
    return reqQueryParams.get(queryParam);

}

export function parseURLQueryArrayParam(url: string, arrayName:string): string[] {


  const search = new URL(url).searchParams;

  const parts: string[] = [];

  const idsMulti = search.getAll(arrayName);       // ids=1&ids=2
  const idsArray = search.getAll(`${arrayName}[]`);     // ids[]=1&ids[]=2
  const idsComma = search.get(arrayName);          // ids=1,2,3

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