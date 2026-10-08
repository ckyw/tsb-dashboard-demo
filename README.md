# TAPSHOPBAR Marketing Intelligence Demo

탭샵바를 가정한 합성 데이터로 매출·수익성·마케팅 성과를 시연하는 **표준 Next.js App Router 웹앱**입니다. 지점 구성과 모든 수치는 실제 탭샵바 정보가 아닙니다.

## 기능

- 경영 개요 / 지점·매출 분석 / 수익성·마케팅 / 데이터 상태
- 360일 합성 데이터, 4개 가상 지점, 5개 상품군
- 7·30·90·180일 및 직접 기간 선택, 직전 동일 일수 비교
- 지점 필터, 드릴다운, URL 유지 및 브라우저 뒤로가기
- 일별 또는 7일 묶음 차트, 차트 대체 데이터 표
- 캠페인 검색과 플랫폼 필터, 같은 필터·정렬의 CSV 다운로드
- 규칙 기반 브리프, 수치 근거 모달, 관련 분석 이동
- 정상 성장 / 매출 증가·이익 하락 / 원가 누락 / POS 지연 / 미귀속 광고 / 환불 증가 / 전기 광고비 0 시나리오
- 3단계 시연 가이드와 모바일 반응형 화면

## 로컬 실행

Node.js 22.13 이상과 pnpm 11.25.0을 사용합니다.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

http://localhost:3000 에서 확인합니다.

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm start
```

## Vercel 배포

1. Vercel에서 **Add New → Project**를 선택합니다.
2. GitHub 저장소 `ckyw/tsb-dashboard-demo`를 Import합니다.
3. Framework Preset은 **Next.js**, Root Directory는 저장소 루트입니다.
4. `vercel.json`에 선언된 `pnpm install --frozen-lockfile`과 `pnpm build`를 사용합니다.
5. **Deploy**를 선택합니다.

이 합성 데이터 데모에는 환경변수, BigQuery 인증 또는 LLM API 키가 필요하지 않습니다. Sites 전용 빌드·Cloudflare·Vinext 의존성은 포함하지 않습니다. Vercel 접근 보호 설정은 별도로 적용하며, 기존 Sites의 개인 접근 제한은 이전되지 않습니다.

## 데이터와 계산 정책

KRW·부가세 제외·Asia/Seoul·06시 영업일 마감. 원가 누락을 0원으로 대체하지 않고 이익 계산을 차단합니다. 지점 이익은 공통 광고비 차감 전, 전사 이익은 차감 후입니다. 일부 지점 조회에는 MER를 제공하지 않습니다. 광고 플랫폼 보고 매출과 POS 순매출을 합산하지 않습니다.

데모 엔진이 서버 API에서 데이터를 생성하고 집계합니다. 실제 BigQuery·POS·광고 계정·LLM 연결, 운영 인증 역할, 영속 적재·snapshot 보존, 분산 호출 제한은 포함하지 않습니다. 모든 브리프는 규칙 기반이며 유료 AI 호출이 없습니다.

## API

- `GET /api/dashboard`: 기간·지점·시나리오 검증 및 집계
- `POST /api/brief`: overview/sales/profitability 범위의 근거 브리프
- `GET /api/export`: 화면·검색·플랫폼·정렬을 반영한 CSV

## 검증 및 기획

`tests/demo.test.mjs`: 17개 수치·결측·시나리오 검증.
`tests/api.test.mjs`: API 계약·필터 오류·브리프 scope·CSV 필터 검증.
`docs/PRD.md`: PRD v1.1. 문서는 전체 제품 목표이며 현재 구현은 합성 데이터 시연본입니다.

표준 Next.js production build를 검증했습니다. 브라우저 화면·클릭·접근성 실측은 미검증입니다.
