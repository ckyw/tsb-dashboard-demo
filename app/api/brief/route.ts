import { dashboard, parseFilters, briefs } from '@/lib/demo';
export async function POST(request:Request){
 try{const body=await request.json() as {query:string;scope:string};if(!['overview','sales','profitability'].includes(body.scope))throw Error();const d=dashboard(parseFilters(new URLSearchParams(body.query)));return Response.json({items:briefs(d,body.scope),snapshot:d.meta.snapshot,kind:'rule_based',paidCalls:0});}catch{return Response.json({error:'브리프 요청을 확인해주세요.'},{status:400});}
}
