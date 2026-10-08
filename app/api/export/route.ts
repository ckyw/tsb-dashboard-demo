import { dashboard, parseFilters, csv } from '@/lib/demo';
export async function GET(request:Request){try{const p=new URL(request.url).searchParams,screen=p.get('screen')||'overview';if(!['overview','sales','profitability','data-health'].includes(screen))throw Error();const d=dashboard(parseFilters(p));
const search=p.get('search')||'', platform=p.get('platform')||'all';
d.campaigns=d.campaigns.filter(c=>c.name.includes(search)&&(platform==='all'||c.platform===platform));
const key=p.get('sort')||'net', descending=p.get('desc')!=='false';
if(['net','growth','profit'].includes(key))d.branches.sort((a,b)=>{const val=(r:typeof a)=>key==='growth'?(r.previous.net>0?(r.net-r.previous.net)/r.previous.net:-100):key==='profit'?(r.profit??-Infinity):r.net;return (descending?-1:1)*(val(a)-val(b));});
return new Response(csv(d,screen),{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="tapshopbar-demo-'+screen+'.csv"'}});}catch{return Response.json({error:'내보내기 필터를 확인해주세요.'},{status:400});}}
