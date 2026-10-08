import { dashboard, parseFilters } from '@/lib/demo';
export async function GET(request: Request) {
 try {return Response.json(dashboard(parseFilters(new URL(request.url).searchParams)),{headers:{'Cache-Control':'private, max-age=60'}});}catch{return Response.json({error:'조회 기간과 지점 필터를 확인해주세요.'},{status:400});}
}
