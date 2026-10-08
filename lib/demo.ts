export const AS_OF = '2026-10-07';
export const UNITS = [
  { id: 'gwanghwamun', name: '광화문점', tag: '도심 · 오피스', base: 2750000 },
  { id: 'seongsu', name: '성수점', tag: '라이프스타일', base: 2350000 },
  { id: 'magok', name: '마곡점', tag: '주거 · 오피스', base: 1650000 },
  { id: 'pangyo', name: '판교점', tag: '오피스 · 커뮤니티', base: 2050000 },
];
export const CATEGORIES = ['탭 와인', '보틀 와인', '푸드', '논알코올', '리테일'];
export const SCENARIOS = [
  { id: 'growth', name: '정상 성장', description: '매출과 이익이 함께 성장하는 시나리오' },
  { id: 'margin', name: '매출 증가 · 이익 하락', description: '성수점의 할인과 원가 상승이 공헌이익에 영향을 줍니다.' },
  { id: 'missing', name: '원가 누락', description: '성수점의 원가 정보가 일부 누락되어 이익 계산이 제한됩니다.' },
  { id: 'delay', name: '적재 지연', description: '마곡점의 최근 2일 POS가 미도착했습니다. 누락을 0매출로 처리하지 않습니다.' },
  { id: 'unmapped', name: '미귀속 광고', description: '지점에 연결되지 않은 광고비가 증가한 시나리오' },
  { id: 'refund', name: '환불 증가', description: '판교점의 환불 발생일 기준 순매출이 감소합니다.' },
  { id: 'zero', name: '전기 광고비 0', description: '현재 광고 집행은 있지만 비교 기간의 광고비는 0입니다.' },
];
export type Filters = { from: string; to: string; units: string[]; scenario: string };
export type Row = { date: string; unit: string; gross: number; discount: number; refund: number; net: number; orders: number; cogs: number | null; variable: number; ad: number; target: number; profitTarget: number; complete: boolean; open: boolean; categories: number[] };
export type Ad = { date: string; unit: string | null; platform: string; campaign: string; reason: string; spend: number; clicks: number; impressions: number; reported: number };
export type Totals = { gross: number; discount: number; refund: number; net: number; orders: number; cogs: number | null; variable: number; ad: number; profit: number | null; margin: number | null; mer: number | null; aov: number | null; target: number; profitTarget: number; coverage: number; salesComplete: boolean; shared: number; unmapped: number };
export const shift = (date: string, days: number) => new Date(Date.parse(date+'T12:00:00Z')+days*86400000).toISOString().slice(0,10);
export const daysBetween = (a: string,b: string) => Math.round((Date.parse(b)-Date.parse(a))/86400000)+1;
export const defaultFilters = (): Filters => ({from:shift(AS_OF,-29),to:AS_OF,units:UNITS.map(u=>u.id),scenario:'growth'});
export function parseFilters(p: URLSearchParams): Filters {
  const d=defaultFilters();const from=p.get('from')||d.from,to=p.get('to')||d.to,scenario=p.get('scenario')||'growth';
  const units=(p.get('units')||UNITS.map(u=>u.id).join(',')).split(',');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(from)||!/^\d{4}-\d{2}-\d{2}$/.test(to)||!Number.isFinite(Date.parse(from))||!Number.isFinite(Date.parse(to))||daysBetween(from,to)<1||daysBetween(from,to)>180||from<shift(AS_OF,-179)||to>AS_OF||new Date(from+'T12:00:00Z').toISOString().slice(0,10)!==from||new Date(to+'T12:00:00Z').toISOString().slice(0,10)!==to||units.some(x=>!UNITS.some(u=>u.id===x))||new Set(units).size!==units.length||!SCENARIOS.some(s=>s.id===scenario))throw new Error('INVALID_FILTER');
  return {from,to,units,scenario};
}
const integer = Math.round;
function allocate(total:number,weights:number[]){let used=0;return weights.map((w,i)=>{const n=i===weights.length-1?total-used:integer(total*w);used+=n;return n;});}
export function generate(scenario:string) {
  const rows:Row[]=[],ads:Ad[]=[];
  for(let i=0;i<360;i++){
    const date=shift(AS_OF,i-359),weekday=new Date(date+'T12:00:00Z').getUTCDay();
    for(let j=0;j<4;j++){
      const u=UNITS[j],open=!(j===2&&weekday===0);
      const seasonal=1+0.15*Math.sin(i*0.17+j)+0.08*Math.sin(i*0.037),weekend=weekday===5||weekday===6?1.35:weekday===1?0.82:1;
      const trend=0.86+0.19*i/359;
      let gross=open?integer(u.base*seasonal*weekend*trend):0;
      let discount=integer(gross*(0.065+0.015*Math.sin(i*0.11+j))),refund=integer(gross*0.009);
      let cogs=integer((gross-discount)*0.345);
      if(scenario==='margin'&&j===1&&i>=330){gross=integer(gross*1.24);discount=integer(gross*0.23);cogs=integer((gross-discount)*0.80);}
      if(scenario==='refund'&&j===3&&i>=350)refund=integer(gross*0.34);
      const net=gross-discount-refund;
      cogs-=integer(refund*0.25);
      const complete=!(scenario==='delay'&&j===2&&i>=358);
      const categories=allocate(net,[0.37,0.25,0.24,0.06,0.08]);
      const orders=open?Math.max(1,integer(gross/(43000+j*3500))):0;
      const ad=open?integer((95000+j*7000)*(1+0.17*Math.cos(i*0.13+j))):0;
      const costMissing=scenario==='missing'&&j===1&&i>=355;
      rows.push({date,unit:u.id,gross,discount,refund,net,orders,cogs:costMissing?null:cogs,variable:integer(net*0.033),ad,target:open?integer(u.base*weekend*1.04):0,profitTarget:open?integer(u.base*weekend*1.04*0.48):0,complete,open,categories});
      for(let a=0;a<2;a++){
        const spend=scenario==='zero'&&i<330?0:(a===0?integer(ad*0.6):ad-integer(ad*0.6));
        ads.push({date,unit:u.id,platform:a===0?'Google Ads':'Meta Ads',campaign:a===0?u.name+' · 검색 유입':u.name+' · 지역 도달',reason:'assigned',spend,clicks:integer(spend/(a===0?680:420)),impressions:integer(spend/(a===0?18:8)),reported:integer(spend*(a===0?4.9:3.2)*(1+0.12*Math.sin(i*0.1+j)))});
      }
    }
    const common=scenario==='zero'&&i<330?0:integer(110000*(1+0.1*Math.sin(i*0.2)));
    ads.push({date,unit:null,platform:'Meta Ads',campaign:'TAPSHOPBAR · 브랜드 캠페인',reason:'brand_shared',spend:common,clicks:integer(common/480),impressions:integer(common/6),reported:integer(common*3.7)});
    if(scenario==='unmapped'&&i>=330)ads.push({date,unit:null,platform:'Google Ads',campaign:'신규 캠페인 · 지점 미매핑',reason:'unmapped',spend:310000,clicks:410,impressions:17800,reported:1230000});
  }
  return {rows,ads};
}
function sum(rows:Row[],ads:Ad[],company:boolean,start:string,end:string):Totals{
 const v=rows.filter(r=>r.complete),add=(key:'gross'|'discount'|'refund'|'net'|'orders'|'variable'|'target'|'profitTarget')=>v.reduce((a,r)=>a+r[key],0);
 const needed=v.filter(r=>r.open),coverage=needed.length?needed.filter(r=>r.cogs!==null).length/needed.length:1;
 const salesComplete=rows.every(r=>r.complete),cogs=coverage===1?v.reduce((a,r)=>a+(r.cogs??0),0):null;
 const net=add('net'),ad=ads.reduce((a,r)=>a+r.spend,0),shared=ads.filter(r=>!r.unit).reduce((a,r)=>a+r.spend,0),unmapped=ads.filter(r=>r.reason==='unmapped').reduce((a,r)=>a+r.spend,0);
 const profit=cogs!==null&&salesComplete?net-cogs-add('variable')-ad:null;
 return {gross:add('gross'),discount:add('discount'),refund:add('refund'),net,orders:add('orders'),cogs,variable:add('variable'),ad,profit,margin:profit!==null&&net>0?profit/net:null,mer:company&&ad>0&&salesComplete?net/ad:null,aov:salesComplete&&add('orders')>0?net/add('orders'):null,target:rows.reduce((a,r)=>a+r.target,0),profitTarget:rows.reduce((a,r)=>a+r.profitTarget,0)-(company?daysBetween(start,end)*110000:0),coverage,salesComplete,shared,unmapped};
}
export function dashboard(f:Filters){
 const {rows,ads}=generate(f.scenario),company=f.units.length===UNITS.length,n=daysBetween(f.from,f.to),prevTo=shift(f.from,-1),prevFrom=shift(f.from,-n);
 const selected=rows.filter(r=>f.units.includes(r.unit));
 const selectedAds=ads.filter(r=>r.unit?f.units.includes(r.unit):company);
 const range=(a:string,b:string)=>({r:selected.filter(r=>r.date>=a&&r.date<=b),a:selectedAds.filter(r=>r.date>=a&&r.date<=b)});
 const now=range(f.from,f.to),old=range(prevFrom,prevTo);
 const total=sum(now.r,now.a,company,f.from,f.to),previous=sum(old.r,old.a,company,prevFrom,prevTo);
 const branches=UNITS.filter(u=>f.units.includes(u.id)).map(u=>{const r=now.r.filter(r=>r.unit===u.id),a=now.a.filter(r=>r.unit===u.id),o=old.r.filter(r=>r.unit===u.id),oa=old.a.filter(r=>r.unit===u.id);return {...u,...sum(r,a,false,f.from,f.to),previous:sum(o,oa,false,prevFrom,prevTo)};});
 const daily=Array.from({length:n},(_,i)=>{const date=shift(f.from,i),prev=shift(prevFrom,i);const v=sum(now.r.filter(r=>r.date===date),now.a.filter(r=>r.date===date),company,date,date);const pv=sum(old.r.filter(r=>r.date===prev),old.a.filter(r=>r.date===prev),company,prev,prev);return {date,label:date.slice(5).replace('-','.'),net:v.salesComplete?v.net:null,profit:v.profit,ad:v.ad,previous:pv.salesComplete?pv.net:null,target:v.target};});
 const categories=CATEGORIES.map((name,i)=>({name,net:now.r.filter(r=>r.complete).reduce((a,r)=>a+r.categories[i],0),previous:old.r.filter(r=>r.complete).reduce((a,r)=>a+r.categories[i],0)}));
 const campaigns=Array.from(new Set(now.a.map(r=>r.campaign))).map(name=>{const r=now.a.filter(r=>r.campaign===name);const spend=r.reduce((a,x)=>a+x.spend,0),clicks=r.reduce((a,x)=>a+x.clicks,0),impressions=r.reduce((a,x)=>a+x.impressions,0),reported=r.reduce((a,x)=>a+x.reported,0);return {name,platform:r[0].platform,reason:r[0].reason,spend,clicks,impressions,reported,roas:spend?reported/spend:null,cpc:clicks?spend/clicks:null,ctr:impressions?clicks/impressions:null};});
 const issues=now.r.filter(r=>!r.complete||r.cogs===null).map(r=>({date:r.date,unit:UNITS.find(u=>u.id===r.unit)!.name,source:!r.complete?'POS':'원가',status:!r.complete?'미도착':'일부 누락',impact:!r.complete?'매출 잠정 · 이익 계산 불가':'공헌이익 계산 불가'}));
 const companyAds=ads.filter(r=>r.date>=f.from&&r.date<=f.to),shared=companyAds.filter(r=>!r.unit).reduce((a,r)=>a+r.spend,0),allSpend=companyAds.reduce((a,r)=>a+r.spend,0);
 return {filters:f,total,previous,branches,daily,categories,campaigns,issues,meta:{asOf:AS_OF,snapshot:'tsb-demo-'+f.scenario+'-v1',tenant:'tsb-synthetic-'+f.scenario,metricVersion:'1.1',scope:company?'company':'units',prevFrom,prevTo,shared,allSpend,sharedRatio:allSpend?shared/allSpend:0,unmappedRatio:allSpend?companyAds.filter(r=>r.reason==='unmapped').reduce((a,r)=>a+r.spend,0)/allSpend:0,latestComplete:issues.some(x=>x.source==='POS')?'2026-10-05':AS_OF,currency:'KRW',timezone:'Asia/Seoul',cutoff:'06:00',storage:'합성 데이터 · 데모 엔진'}};
}
export type Dashboard = ReturnType<typeof dashboard>;
export type Insight = { id: string; title: string; text: string; action: string; current: number; previous: number; metric: string; unit: string; screen: string };
export function briefs(d:Dashboard,scope:string):Insight[]{
 if(!d.total.salesComplete||!d.previous.salesComplete)return [];
 const candidates:Insight[]=[];const money=(n:number)=>Math.round(n).toLocaleString('ko-KR')+'원';
 function candidate(id:string,title:string,current:number|null,previous:number|null,metric:string,unit:string,screen:string,action:string){if(current===null||previous===null||previous<=0||Math.abs(current-previous)<1000000||Math.abs((current-previous)/previous)<0.1)return;candidates.push({id,title,text:`${unit} ${metric}은 직전 기간 대비 ${Math.abs((current-previous)/previous*100).toFixed(1)}% ${current>=previous?'증가':'감소'}했습니다. 금액 차이는 ${money(Math.abs(current-previous))}입니다.`,current,previous,metric,unit,screen,action});}
 if(scope==='profitability'){
   if(d.total.profit!==null&&d.previous.profit!==null){for(const [key,label] of [['net','순매출'],['cogs','상품원가'],['variable','기타 변동비'],['ad','광고비']] as const)candidate(key,label+' 변화',d.total[key],d.previous[key],label,'선택 범위','profitability',label==='상품원가'?'상품 믹스와 매입 단가 변화를 확인하세요.':label==='광고비'?'캠페인별 전환 품질과 귀속 상태를 함께 확인하세요.':'원장과 프로모션 운영 내역을 함께 확인하세요.');}
   else candidate('ad','광고비 변화',d.total.ad,d.previous.ad,'광고비','선택 범위','profitability','이익 데이터가 불완전합니다. 비용 증가와 매핑을 먼저 확인하세요.');
 }else{
   if(scope==='overview')candidate('profit','공헌이익 변화',d.total.profit,d.previous.profit,'공헌이익','선택 범위','profitability','매출·원가·광고비의 변화 기여를 확인하세요.');
   for(const b of d.branches)candidate(b.id,b.name+' 매출 변화',b.net,b.previous.net,'순매출',b.name,'sales','주문수·객단가와 할인 운영을 함께 확인하세요.');
   if(scope==='sales')for(const c of d.categories)candidate(c.name,c.name+' 판매 변화',c.net,c.previous,'순매출',c.name,'sales','상품 믹스와 프로모션 종료 여부를 확인하세요.');
 }
 return candidates.sort((a,b)=>scope==='overview'&&a.id==='profit'?-1:scope==='overview'&&b.id==='profit'?1:Math.abs(b.current-b.previous)-Math.abs(a.current-a.previous)||a.id.localeCompare(b.id)).slice(0,3);
}
export function csv(d:Dashboard,screen:string){
 let header:string[],data:(string|number|null)[][];
 if(screen==='profitability'){header=['캠페인','플랫폼','광고비','클릭','노출','플랫폼 보고매출','플랫폼 ROAS','귀속'];data=d.campaigns.map(x=>[x.name,x.platform,x.spend,x.clicks,x.impressions,x.reported,x.roas,x.reason]);}
 else if(screen==='data-health'){header=['업무일','지점','소스','상태','영향'];data=d.issues.map(x=>[x.date,x.unit,x.source,x.status,x.impact]);}
 else if(screen==='sales'){header=['상품군','순매출','전기 순매출','차이'];data=d.categories.map(x=>[x.name,x.net,x.previous,x.net-x.previous]);}
 else {header=['지점','순매출','전기 순매출','주문수','객단가','공헌이익 공통비 차감 전','광고비','목표'];data=d.branches.map(x=>[x.name,x.salesComplete?x.net:null,x.previous.net,x.orders,x.aov,x.profit,x.ad,x.target]);}
 const quote=(x:unknown)=>'"'+String(x??'').replaceAll('"','""')+'"';
 return '\uFEFF'+[['합성 데이터',d.meta.snapshot,'metric_version',d.meta.metricVersion,'from',d.filters.from,'to',d.filters.to,'scope',d.meta.scope],header,...data].map(r=>r.map(quote).join(',')).join('\r\n');
}
