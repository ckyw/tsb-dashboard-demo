# Marketing Intelligence Dashboard PRD 및 화면별 기능 명세

작성일 2026년 10월 8일 · 버전 1.1 · 제품 및 개발 정책 확정

Marketing Intelligence Dashboard는 경영진과 사업 운영자가 매출과 공헌이익의 변화를 확인하고, 개선할 지점과 마케팅 활동의 우선순위를 결정하는 Next.js 커스텀 웹앱이다. 첫 MVP는 다점포 리테일·F&B 합성 데이터로 구축한다. PIPE와 TapShopBar에서 축적한 데이터 파이프라인 경험을 설계에 반영하며, 아래 스키마는 신규 제안 스키마다. 기존 시스템의 실제 테이블 구조를 의미하지 않는다.

제품 범위와 지표 정책은 본 문서로 확정한다. 실제 고객사 도입 시 POS 필드, 부가세 처리, 원가 제공 방식, 광고비의 지점 귀속은 데이터 온보딩에서 검증한다. 데모 완성과 실제 연동 완료를 각각 판정한다.

## 목차

1. 제품 목표와 고객가치

2. MVP 범위

3. 지표 정의와 집계 정책

4. 화면 공통 기능 명세

5. 화면별 기능 명세

6. 브리프 기능 명세

7. 데이터 아키텍처

8. Warehouse 스키마

9. 마트 스키마와 조인 규칙

10. 적재 및 품질 명세

11. Next.js 앱 및 API 명세

12. 성능과 수용 테스트

13. 구현 순서와 완료 기준

14. 온보딩 미결 사항

15. 부록 기존 경험의 적용

문서의 네이티브 제목이 H1 역할을 한다.

## 1 제품 목표와 고객가치

사용자의 핵심 질문은 “얼마나 팔렸는가”, “얼마나 남았는가”, “어디에서 변화했는가”, “무엇부터 확인하고 개선해야 하는가”다. 광고 운영자에게 필요한 세부 입찰 기능보다 사업 단위별 매출·비용·수익성·목표 달성률을 먼저 제공한다.

| 사용자 | 주요 의사결정 | 제공 가치 |
| --- | --- | --- |
| 경영진 | 성장과 수익성 균형, 지점 투자 우선순위 | 전사 KPI, 목표 대비 실적, 변동 기여도 |
| 사업 운영자 | 지점·상품·프로모션 개선 | 지점 비교, 상품 믹스, 비용 구성 |
| 마케팅 책임자 | 집행 효율 점검, 예산 검토 | 광고 성과와 확정 매출을 구분한 진단 |
| 데이터 관리자 | 데이터 신뢰성 확보 | 적재 상태, 누락, 매핑·원가 커버리지 |

첫 화면에서 핵심 실적을 1분 안에 파악하고, 지점 또는 비용 항목을 따라 3분 안에 변화의 근거를 확인하는 경험을 목표로 한다. 이는 사용자 검증 목표이며 측정된 성과가 아니다.

제품 성공 기준: 경영진·사업 운영자 5명을 대상으로 동일한 시연 과제 3개를 수행한다. 각 과제에서 최소 4명이 도움 없이 성공하고, 경영 개요 파악은 1분 이내, 매출 감소 지점 확인·공헌이익 하락 항목 확인·광고 보고 매출과 확정 매출 구분은 각각 3분 이내여야 한다. 과제별 성공률과 시간으로 합격을 판정한다.

## 2 MVP 범위

| 우선순위 | 범위 | 완료 결과 |
| --- | --- | --- |
| P0 | 경영 개요 | 순매출·공헌이익·광고비·목표와 전기 비교 |
| P0 | 지점 및 매출 분석 | 지점·상품군 실적과 매출 변화 기여 |
| P0 | 수익성 및 마케팅 | 비용 브리지, MER, 플랫폼 ROAS, 귀속 상태 |
| P0 | 근거 기반 브리프 | 세 화면 공통 패널, 관찰·가설·권고 구분 |
| P0 | 데이터 상태와 지표 사전 | 보조 화면, 최신성·누락·산식 확인 |
| P0 | 공통 UX | 날짜·지점 필터, 드릴다운, CSV 다운로드 |
| P0 | 합성 데이터 파이프라인 | 생성→Staging→Warehouse→Marts→API→화면 |
| P1 | 실제 POS·광고 소스별 어댑터 | 고객 온보딩 이후 순차 구현 |
| P1 | GA4 퍼널, 목표 편집, 고정비 손익 | 확보된 데이터와 권한에 맞춰 확장 |
| P2 | 고객 코호트·LTV, 자연어 SQL, 예측 | 고객 식별과 검증 체계 확보 후 구현 |
| P2 | Hospitality, 액션 워크플로 | 업종 마트와 실행 이력 확장 |

MVP에서 광고 계정 자동 변경, 범용 챗봇, 실시간 스트리밍, CRM 고객 프로파일, 결제·급여 기능은 개발하지 않는다. AI 브리프는 관찰과 권고를 제공하며 광고비 변경을 실행하지 않는다. 전용 Funnel과 Customer 화면은 P1·P2 범위다.

데모는 360일, 가상 브랜드 1개, 가상 지점 4개, 상품군 5개, Google·Meta 광고를 사용한다. 정상 데이터 외에 지점 매출 하락, 할인 증가, 원가 누락, 광고 지점 미귀속, 적재 지연, 환불, 전기 0값 시나리오를 포함한다. PIPE·TapShopBar 실적과 고객 개인정보를 사용하지 않는다.

## 3 지표 정의와 집계 정책

MVP 기준 통화는 KRW, 업무 날짜는 Asia/Seoul이다. 금액은 부가세 제외 기준으로 표준화한다. 원본 금액과 세액을 보존하고, 세액 불명 데이터는 검증 실패 또는 별도 미확정 상태로 처리한다. 세율을 일괄 가정하지 않는다.

| 지표 | 정의 | 주의사항 |
| --- | --- | --- |
| 순매출 | 할인 전 매출 − 할인 − 환불 | 세액 제외, 확정 POS 원장 |
| 완료 주문수 | 정상 완료 주문 고유 개수 | 취소 제외, 과거 주문 환불은 새 주문으로 세지 않음 |
| 객단가 | 순매출 ÷ 완료 주문수 | 환불 영향 포함, 주문 0이면 계산 불가 |
| 상품원가 | 판매 원가 − 환불 원가 환입 | 환입 가능 여부 반영, 누락은 0원 처리 금지 |
| 매출총이익 | 순매출 − 상품원가 | 원가 범위와 커버리지 표시 |
| 기타 변동비 | 결제·판매 수수료 등 정의된 변동비 | 상품원가와 광고비 중복 제외 |
| 마케팅 전 공헌이익 | 순매출 − 상품원가 − 기타 변동비 | 아래 공헌이익과 구분 |
| 공헌이익 | 마케팅 전 공헌이익 − 광고비 | 고정비 전 지표, 영업이익으로 표기 금지 |
| 공헌이익률 | 공헌이익 ÷ 순매출 | 순매출 0 이하이면 계산 불가 |
| 광고비 | 해당 기간 광고 집행 비용 | 청구 세액 제외, 플랫폼 기준일 |
| MER | 전사 순매출 ÷ 전사 광고비 | 블렌디드 효율, 광고 인과효과 아님 |
| 플랫폼 ROAS | 플랫폼 보고 전환매출 ÷ 해당 플랫폼 광고비 | 플랫폼별로 표시, 중복 가능 |
| 순매출 목표 달성률 | 순매출 ÷ 동일 기간 목표 | 목표 미등록은 미설정 |
| 할인율 | 할인 ÷ 할인 전 판매액 | 분모 0이면 계산 불가 |
| 공헌이익 목표 달성률 | 같은 범위 공헌이익 실적 ÷ 같은 범위 공헌이익 목표 | 목표 0 이하 또는 미설정이면 계산 불가 |

15개 제품 지표 외 클릭·노출·CPC·CTR은 마케팅 상세 표의 보조 지표다. GA4 전환 매출은 P1에서 별도 라벨로 제공한다. POS 매출, 플랫폼 전환 매출, GA4 매출을 합산하지 않는다. 채널별 확정 매출 ROAS와 CAC는 연결 가능한 주문·신규 고객 데이터가 확보될 때만 추가한다.

기간 비율은 일별 비율의 평균이 아니라 합계 분자÷합계 분모로 계산한다. 변화율은 (현재−전기)÷전기이며 전기가 0 또는 음수이면 백분율 대신 절대 변화와 사유를 표시한다. 비율 지표 변화는 %p로 표시한다.

기본 기간은 전일까지 완료된 최근 30일이며, 비교 기간은 직전 동일 일수다. 7일·30일·90일·직접 선택을 지원하고 최대 180일이다. 데모 기준일은 시나리오의 고정 as_of_date이며 마지막 180일을 선택 가능 범위, 앞선 180일을 비교 이력으로 사용한다. 실제 데이터에서 비교 기간 일부가 없으면 comparison_status=unavailable로 반환하고 비교 카드·기여 분석·변화 브리프를 차단하되 현재 실적은 표시한다. 기간을 임의로 줄이지 않는다. 영업일에 데이터가 누락되면 0매출로 대체하지 않는다. 휴무는 영업일 캘린더로 구분한다. 오늘 조회는 잠정 배지를 붙이고 기본 비교에서 제외한다.

환불은 환불 발생 업무일에 음수 매출과 실제 원가 환입을 기록한다. 지점 목표는 공통 광고비 차감 전 공헌이익으로 정의한다. 공통 행에는 일별 target_shared_ad_spend를 저장하고 target_contribution은 그 음수로 산출한다. 전사 공헌이익 목표=지점 공헌이익 목표 합−공통 광고비 예산이며 전사 실적과 같은 비용 범위를 사용한다. 전사 순매출 목표는 지점 목표 합이다. 공통 광고 계획이 없는 날도 명시적 0 예산이 필요하며 미등록은 null이다. 필요한 목표가 하나라도 미등록이면 해당 달성률은 unavailable이다.

월 목표 온보딩 기본값은 해당 지점의 예정 영업일에 균등 배분하며 마지막 영업일에 반올림 잔액을 반영한다. 요일 가중치는 고객 합의 후 적용한다. 공통 광고 월 예산은 달력일에 균등 배분한다. 월 원값, 배분 방식, 가중치, target_version을 보존하고 일 목표 합계=월 목표를 검증한다.

광고 지점 귀속은 확인된 캠페인 매핑을 우선한다. 브랜드 공통 광고, 여러 지점 대상 캠페인, 확인되지 않은 미귀속 캠페인은 전사 공통 행으로 유지하며 assignment_reason=brand_shared/multi_unit/unmapped로 구분한다. MVP는 매출 비중으로 배분하지 않는다. 전사 공헌이익은 모든 광고비를 차감하고, 지점 공헌이익은 지점 귀속 광고만 차감하며 “공통 광고비 차감 전”임을 표시한다. 전사 값과 지점 합계 차이는 공통 광고비로 조정 설명한다.

P1에서는 승인된 원가 추정 방법과 커버리지 임계값에 따른 추정 공헌이익을 별도 지표로 검토한다. MVP에서는 원가 완비 100% 기준을 유지한다. 원가 누락이 있으면 완전한 공헌이익을 산출하지 않는다. 확인된 원가와 원가 커버리지만 보여주고 공헌이익 카드·브리지는 계산 불가로 표시한다. 플랫폼 어트리뷰션 창, 모델, 보고 날짜 기준은 소스 메타데이터로 보존한다. 서로 다른 규칙의 ROAS에 통합 합계를 제공하지 않는다.

## 4 화면 공통 기능 명세

데스크톱은 사이드 메뉴와 상단 필터를 사용하고, 모바일은 메뉴를 접으며 KPI와 표를 세로로 배치한다. 제품 문구는 한국어를 기본으로 한다.

| ID | 기능 | 동작 및 수용 기준 |
| --- | --- | --- |
| C01 | 전역 필터 | 기간·비교 기간·지점 다중 선택을 URL에 저장, 새로고침과 화면 이동 후 유지 |
| C02 | 필터 적용 범위 | 순매출·원가·광고에 동일 필터 적용, 상품 필터는 매출 상세에만 적용 |
| C03 | 미귀속 비용 | 명시적 report_scope=company/units 사용, 아래 범위 계약에 따라 KPI·공통 광고 비중 표시 |
| C04 | 비교·툴팁 | 금액 단위, 산식, 기준일, 전기 값, 변화 기준 제공 |
| C05 | 드릴다운 | 지점 클릭→지점 분석, 비용 클릭→수익성, 필터 유지·뒤로 가기 복원 |
| C06 | 데이터 배지 | 소스별 latest_complete_date 및 확정·잠정·지연 상태 표시 |
| C07 | CSV | 화면 표와 같은 필터·정렬, 원·소수 원값과 지표 버전·기준일 포함 |
| C08 | 접근성 | 키보드 이동, 포커스, 차트 대체 표, 색 외 상태 텍스트 제공 |
| C09 | 상태 처리 | 로딩 skeleton, 빈 데이터 안내, 오류 재시도, 부분 누락 배지 |
| C10 | 데모 표시 | 모든 화면에서 합성 데이터 표시, 시나리오 선택은 데모 모드에서만 활성 |

지점 필터가 있는 플랫폼 지표는 지점으로 매핑된 캠페인만 조회한다. 미귀속 캠페인을 조용히 제거하지 않고 제외된 광고비와 적용 범위를 알려준다. 빈 결과는 0으로 표시하지 않는다. 오류 시 기존 데이터가 있으면 이전 조회 기준과 함께 유지할 수 있으나 새 조회 결과로 오인시키지 않는다.

### 조회 범위 계약

| 선택 | report_scope | 광고비 | 공헌이익 | MER |
| --- | --- | --- | --- | --- |
| 필터 없음 또는 전사 버튼 | company | 모든 귀속 및 공통 광고 | 공통 광고 차감 후 전사 이익 | 전사 순매출÷전사 광고비 |
| 경영진이 모든 실제 지점 선택 | company로 정규화 | 전사와 동일 | 전사와 동일 | 전사와 동일 |
| 일부 지점 선택 | units | 선택 지점 귀속 광고만 | 공통 광고비 차감 전 지점 이익 합 | unavailable, 지점 MER 미지원 |
| 제한된 Operator의 전체 허용 지점 선택 | units | 허용 지점 귀속 광고만 | 해당 지점 이익 합 | unavailable |

company는 전사 권한이 있어야 한다. 전 지점 정규화는 기간 내 실제 지점 집합을 기준으로 하며 휴·폐점 이력 지점을 포함한다. 임의의 빈 unit_ids는 전체로 해석하지 않고 INVALID_FILTER로 처리한다. 전사 기본 조회는 report_scope=company를 명시한다.

O01·P02의 지점 공헌이익 카드에는 공통 광고비 차감 전 라벨을 항상 표시한다. 전사 광고비 카드 근처에는 공통비중=(brand_shared+multi_unit+unmapped 광고비)÷전사 광고비, 미귀속 비중=unmapped 광고비÷전사 광고비를 함께 표시한다. 광고비 0이면 비중은 계산 불가다. 부분 지점 조회에는 공통 광고비 미반영 배지와 전사 공통 금액·비중을 참고값으로 표시하되 전사 권한이 없는 사용자는 금액 대신 적용 제한 문구만 본다. 이 상태의 지점 공헌이익만으로 투자 순위를 확정하지 않는다.

## 5 화면별 기능 명세

### S01 경영 개요

경로: /overview. 질문: “사업 실적과 이익이 목표에 맞게 움직이는가?”

| ID | 영역 | 기능 | 수용 기준 |
| --- | --- | --- | --- |
| O01 | KPI 카드 | 순매출, 공헌이익, 공헌이익률, 광고비, MER, 순매출 목표 달성률 | 현재·전기·증감·상태와 report_scope 표시, 지점 조회 MER는 계산 불가 |
| O02 | 추이 | 일별 순매출과 공헌이익, 광고비 보조 그래프 | 세 지표는 명확한 단위·축, 일/주 전환 |
| O03 | 목표 | 순매출·공헌이익 실적 대 목표 | 동일 날짜 목표만 합산, 미설정 명시 |
| O04 | 지점 실적 | 순매출·전기 차이·공헌이익·목표 달성 표 | 순매출 기본 내림차순, 열별 정렬 |
| O05 | 변화 기여 | 전사 순매출 차이의 지점별 기여 | 지점 차이 합=전사 차이 |
| O06 | 브리프 | 주요 변화 최대 3개와 확인할 항목 | 클릭 시 근거 패널 및 관련 화면 |

배치 순서는 KPI→추이 및 목표→지점 실적→브리프다. 이익 원가 누락 시 매출 영역은 정상 제공하고 이익 영역만 계산 불가로 표시한다. 지점별 기여는 산술 분해이며 매출 변화의 인과 원인으로 단정하지 않는다.

### S02 지점 및 매출 분석

경로: /sales. 질문: “어느 지점과 상품군에서 변화했는가?”

| ID | 영역 | 기능 | 수용 기준 |
| --- | --- | --- | --- |
| S201 | 요약 | 순매출, 완료 주문수, 객단가, 할인율 | 할인율=할인÷할인 전 판매액, 분모 0 처리 |
| S202 | 지점 비교 | 순매출·주문수·객단가·동일 요일 추이 | 휴무·누락을 구분 |
| S203 | 상품군 | 매출액·구성비·전기 차이 표와 막대 | 미분류도 포함, 구성비 합계 설명 |
| S204 | 지점 상세 | 선택 지점 KPI, 일별 추이, 상품군 믹스 | 전역 기간 유지, 지점 변경 가능 |
| S205 | 프로모션 | 할인액·환불액·순매출 관계 | 할인 증가를 매출 원인으로 확정하지 않음 |
| S206 | 다운로드 | 현재 표 CSV | 원장 주문·고객 개인정보 미포함 |
| S207 | 브리프 | 매출·주문·할인 변화 최대 3개 | scope=sales, 근거 패널·관련 상세 이동 |

순매출이 음수이거나 상품군별 음수 금액이 있는 경우 구성비 차트 대신 금액 막대와 표를 보여준다. 시간별·신규/재방문 분석은 표시하지 않는다.

### S03 수익성 및 마케팅

경로: /profitability. 질문: “매출이 늘어도 남는 돈이 줄어드는 이유는 무엇인가?”

| ID | 영역 | 기능 | 수용 기준 |
| --- | --- | --- | --- |
| P01 | 비용 브리지 | 순매출→원가→기타 변동비→광고비→공헌이익 | 각 금액과 최종 이익의 산식 일치 |
| P02 | 지점 수익성 | 원가·수수료·귀속 광고·공헌이익 비교 | 공통 광고 차감 전 라벨과 전사 조정 행 |
| P03 | 마케팅 | 전사 MER와 광고비 추이 | 지점 조회에는 전사 MER를 해당 지점 값으로 표시하지 않음 |
| P04 | 플랫폼 표 | 플랫폼·캠페인별 광고비, 노출, 클릭, CPC, CTR, 보고 매출, ROAS | 캠페인 매핑·어트리뷰션 창·기준일 표시 |
| P05 | 변화 분석 | 전기 대비 이익 차이를 매출·원가·변동비·광고로 분해 | Δ이익=Δ매출−Δ원가−Δ변동비−Δ광고 |
| P06 | 점검 제안 | 비용 증가·저효율 캠페인 점검 | 근거·가설·확인 항목, 자동 집행 없음 |

전기·현재 중 원가 누락이 있으면 이익 변화 분해를 차단한다. 손익분기 ROAS와 허용 CAC는 고객 가치와 비용 가정이 필요한 후속 기능으로 남긴다.

### S04 데이터 상태와 지표 사전

경로: /data-health. 질문: “이 숫자를 의사결정에 사용해도 되는가?”

| ID | 영역 | 기능 | 수용 기준 |
| --- | --- | --- | --- |
| D01 | 소스 상태 | POS·광고·원가·목표별 마지막 성공, 완전 기준일, 누락 일 | 적재 성공과 데이터 완전성을 구분 |
| D02 | 검증 | 중복 키·미분류·미귀속 광고·원가 커버리지 | 영향 지표·기간·지점 표시 |
| D03 | 지표 사전 | 산식, 원장, 세액·환불·귀속 정책, 버전 | KPI 툴팁에서 직접 이동 |
| D04 | 재조회 | 현재 공개 snapshot 조회 | 재조회 버튼이 파이프라인 재실행을 의미하지 않음 |

MVP는 읽기 전용이다. 원가·목표·매핑 편집과 적재 재실행은 관리자 운영 절차로 처리한다.

## 6 브리프 기능 명세

전용 AI 화면 대신 세 핵심 화면에 브리프 패널을 붙인다. SQL 또는 코드가 KPI와 변화·기여도를 먼저 계산하고, LLM은 승인된 집계 근거를 문장으로 정리한다.

| 단계 | 규칙 |
| --- | --- |
| 후보 탐지 | 기본 전기 대비 절대 변화율 10% 이상 및 금액 차이 100만원 이상, 운영 설정값 |
| 이익 후보 | 금액·이익률 %p 변화 함께 사용, 분모·결측 검증 |
| 제외 | 미완료 기간, 원가 누락 지표, 0·음수 전기 변화율, 너무 작은 표본 |
| 근거 | metric_id, 현재·전기 값, 필터, snapshot_id, metric_version |
| 문장 | 관찰 사실, 가능한 설명, 추가 확인, 권고를 분리 |
| 출력 | 같은 기간·지점·지표 중복 제거 후 아래 scope별 우선순위로 최대 3개, 후보 없으면 주요 변화 없음 |
| 안전성 | 자유 SQL·원장 개인정보·광고 실행 권한 제공 안 함 |
| 실패 | LLM 타임아웃·응답 검증 실패 시 동일 근거의 템플릿 브리프 |

예: “A지점 순매출은 전기 대비 12% 감소했고, 주문수는 15% 감소했습니다. 객단가 상승이 일부 상쇄했습니다. 방문 감소 원인은 확인되지 않았습니다. 휴무·프로모션 종료 여부를 확인하세요.” 수치는 시나리오 예시다.

브리프는 화면의 “브리프 생성” 버튼으로 요청한다. 최초 진입이나 필터 변경만으로 유료 LLM을 호출하지 않는다. 필터 변경 시 기존 브리프는 재생성 필요 상태로 표시한다. 허용 scope는 overview, sales, profitability이며 data-health 또는 자유 scope는 허용하지 않는다.

overview는 검증 가능한 공헌이익 금액 변동 후보를 먼저, 그다음 순매출 금액 변동 후보를 선정한다. sales는 지점·상품군 순매출 금액 변동 순으로 선정한다. profitability는 공헌이익 분해 항목의 절대 금액 영향 순으로 선정하고 이익 데이터가 불완전하면 광고비 변동을 보조 후보로 사용한다. 같은 우선순위는 절대 금액 차이 내림차순, 동률은 안정적인 candidate_id 오름차순이다. 서로 다른 단위의 변화율을 금액과 직접 비교하지 않는다.

LLM은 자유 숫자 문장 대신 candidate_id, evidence_ref, observation_template_id, hypothesis, check_action의 구조화 JSON을 반환한다. 수치 문장은 서버가 승인된 템플릿과 evidence_ref로 렌더링한다. hypothesis와 check_action에는 수치·금액·비율 주장을 허용하지 않고 검사 실패 시 템플릿으로 대체한다. 근거 참조·지표·범위·snapshot 일치와 허용 template_id를 검증한다. 캠페인 ROAS 우열만으로 예산 재배분을 확정 권고하지 않는다.

공개 데모는 미리 생성된 규칙 기반 브리프만 반환하며 유료 LLM 호출 수는 0이다. 공개 API는 세션과 IP 각각 분당 10회로 제한하고 공유 카운터로 강제한다. 실제 인증 모드는 사용자 분당 5회, tenant별 신규 LLM 호출 일 100회·최대 동시 2회다. 일자는 Asia/Seoul이며 캐시 적중은 LLM 일 한도에서 제외하되 요청 rate limit에는 포함한다. 초과는 429와 Retry-After 및 템플릿 브리프를 제공한다. tenant 일 예산은 별도 설정으로 강제하며 예산 소진 시 LLM 대신 템플릿을 반환한다. 외부 발송 기능은 MVP 범위 밖이다.

## 7 데이터 아키텍처

합성 원본과 실제 소스 어댑터는 같은 canonical 입력 계약을 사용한다. Next.js 서버는 공개 완료된 마트만 읽는다.

| 계층 | 책임 | 주요 데이터 |
| --- | --- | --- |
| Staging | 원본·수집 시각·변경 이력 보존 | raw_pos_orders, raw_pos_items, raw_refunds, raw_ads_daily, raw_costs, raw_targets |
| Warehouse | 주문·환불·상품·지점·캠페인 표준화 | 차원과 원장 fact |
| Marts | 화면 단위 합산, 계산 근거 | business_daily, sales_mix_daily, ads_daily |
| Serving | 권한·필터·캐시·응답 검증 | Next.js 서버 API |
| UI | KPI·드릴다운·근거 표시 | React 화면, Recharts |
| Brief | 집계 근거 요약 | 규칙 엔진, 선택적 LLM |

금액은 BigQuery NUMERIC, 횟수는 INT64, 업무일은 DATE, 수집·갱신 시각은 TIMESTAMP UTC다. KRW 소수점은 계산 과정에서 유지하고 UI에서 원 단위로 반올림한다. unknown 지점·상품군은 고정 차원 키를 사용하며 누락 문자열로 조인을 잃지 않게 한다.

## 8 Warehouse 스키마

모든 업무 테이블은 tenant_id STRING을 포함한다. 아래 PK는 논리적 고유 키이며 적재 검증으로 보장한다. 차원 키는 tenant 내에서 유일하고 조인은 tenant_id를 반드시 포함한다.

| 테이블 | Grain과 PK | 주요 컬럼 및 타입 |
| --- | --- | --- |
| dim_business_unit | tenant×지점; tenant_id, unit_id | unit_id STRING, brand_id STRING, unit_name STRING, industry STRING, timezone STRING, business_day_cutoff TIME, cutoff_rule_version STRING, opened_date DATE, closed_date DATE nullable |
| dim_category | tenant×상품군; tenant_id, category_id | category_id STRING, category_name STRING, active BOOL |
| dim_product | tenant×소스 상품; tenant_id, product_id | product_id STRING, source_product_id STRING, source_system STRING, product_name STRING |
| dim_product_category_history | 상품×유효 시작일 | product_id STRING, category_id STRING, valid_from DATE, valid_to DATE nullable, mapping_version STRING |
| dim_campaign_history | 캠페인×유효 시작일 | campaign_id STRING, platform STRING, account_id STRING, source_campaign_id STRING, unit_id STRING nullable, assignment_reason STRING, valid_from DATE, valid_to DATE nullable, mapping_version STRING |
| dim_calendar_unit | 날짜×지점 | business_date DATE, unit_id STRING, is_open BOOL, closure_reason STRING nullable |
| fact_order | 주문 1건; tenant_id, order_id | order_id STRING, source_system STRING, source_order_id STRING, unit_id STRING, business_date DATE, ordered_at TIMESTAMP nullable, status STRING, gross_sales NUMERIC, discount NUMERIC, tax NUMERIC, net_sales NUMERIC |
| fact_order_item | 주문 품목 1행; tenant_id, order_id, item_id | business_date DATE, unit_id STRING, product_id STRING, quantity NUMERIC, gross_sales NUMERIC, discount NUMERIC, net_sales NUMERIC, cogs NUMERIC nullable, cost_status STRING |
| fact_refund_item | 환불 품목 1행; tenant_id, refund_id, refund_item_id | original_order_id STRING, original_item_id STRING nullable, unit_id STRING, product_id STRING, business_date DATE, refund_net_sales NUMERIC, cogs_reversal NUMERIC nullable, reversal_status STRING |
| fact_variable_cost | 비용 원장 1행; tenant_id, source_system, cost_id | unit_id STRING, business_date DATE, cost_type STRING, amount NUMERIC, source_order_id STRING nullable, quality_status STRING |
| fact_ad_daily | 일×플랫폼×계정×캠페인; tenant_id, ad_date, platform, account_id, campaign_id | ad_date DATE, platform STRING, account_id STRING, campaign_id STRING, attribution_rule_id STRING, spend NUMERIC, impressions INT64, clicks INT64, reported_conversions NUMERIC, reported_revenue NUMERIC, currency STRING, reporting_timezone STRING |
| dim_attribution_rule | 소스 보고 규칙 1개 | attribution_rule_id STRING, model STRING, click_window_days INT64 nullable, view_window_days INT64 nullable, date_basis STRING, reporting_timezone STRING |
| fact_target_daily | 날짜×지점×목표 버전 | business_date DATE, unit_id STRING, target_version STRING, target_net_sales NUMERIC nullable, target_contribution NUMERIC nullable, target_shared_ad_spend NUMERIC nullable, source_month DATE, allocation_method STRING, is_active BOOL |

Warehouse fact는 source_updated_at TIMESTAMP nullable, ingested_at TIMESTAMP, load_id STRING, metric_version STRING을 포함한다. order_id는 source_system과 source_order_id를 조합한 canonical 키다. 상품 차원도 소스별 키 충돌을 방지한다.

### 영업일 계산

데모 컷오프는 지점 현지시각 06:00이다. 타임스탬프가 있는 원장은 현지시각의 시간이 컷오프보다 이르면 전날, 그 외에는 현지 날짜를 business_date로 지정한다. 업무일 D의 종료는 D+1의 컷오프다. ordered_at 원본·source_business_date·cutoff_rule_version을 보존하고 취소·환불·비용에도 동일 소스 계약을 적용한다.

POS가 이미 마감 업무일만 제공하면 그 날짜를 우선 사용하며 컷오프를 다시 적용하지 않는다. timestamp 없는 달력 날짜를 받는 경우 업무일로 바꾸는 근거가 없으므로 온보딩에서 계약을 확인할 때까지 미확정 처리한다. 지점 컷오프 변경은 cutoff 이력 테이블 dim_business_unit_day_rule(tenant_id, unit_id, valid_from DATE, valid_to DATE nullable, cutoff TIME, timezone STRING, rule_version STRING)에 기록하고 유효 기간 중복을 금지한다. 지점 차원의 필드는 현재 설정이며 역사 계산은 이력 테이블을 따른다.

fact_order.net_sales는 원 주문의 할인 후·세액 제외 판매액이며 환불을 포함하지 않는다. 일별 순매출은 완료 주문 매출에서 별도 환불 fact를 차감한다. 주문·품목 할인과 세액은 원장 배분값을 우선하고, 배분 시 총액 일치와 반올림 잔액 정책을 유지한다. 환불은 부분·복수 환불을 허용하되 환불 고유 키로 중복을 제거한다. 원 주문 미연결 환불은 unknown 품목으로 유지하고 검증 이슈를 기록한다.

fact_variable_cost는 결제·채널 판매 수수료 등만 포함한다. 광고·상품원가는 각각 별도 fact에서 계산한다. 음수 비용은 실제 취소·환입에만 허용한다. 원가 미제공과 0원 원가는 cost_status로 구분한다.

광고 캠페인이 계정별로 같은 ID를 가질 수 있으므로 플랫폼×계정×캠페인을 canonical campaign_id로 만든다. 소스가 동일 광고비를 여러 어트리뷰션 규칙마다 반복 반환하면 날짜×플랫폼×계정×캠페인마다 하나의 활성 규칙만 fact_ad_daily에 적재한다. attribution_rule_id는 PK가 아닌 속성이며 규칙 변경 시 같은 키를 갱신하고 새 snapshot을 발행한다. 광고비가 규칙 수만큼 중복되지 않도록 검증한다. 소스 보고 시간대와 업무 시간대가 다르고 일별 값만 있으면 이를 변환하지 않고 기간 비교 제한을 표시한다.

## 9 마트 스키마와 조인 규칙

| 테이블 | Grain | 주요 필드 |
| --- | --- | --- |
| mart_business_daily | snapshot×날짜×tenant×지점 또는 공통비용 단위 | business_date, unit_id, gross_sales, discount, refunds, net_sales, order_count, cogs nullable, variable_cost, ad_spend, contribution_before_ads nullable, contribution nullable, target_net_sales nullable, target_contribution nullable, target_shared_ad_spend nullable, shared_ad_spend, unmapped_ad_spend, multi_unit_ad_spend, cost_coverage, sales_complete BOOL, profit_complete BOOL, snapshot_id, metric_version |
| mart_sales_mix_daily | snapshot×날짜×tenant×지점×상품군 | net_sales, gross_sales, discount, refunds, quantity, cogs nullable, mapping_version, snapshot_id |
| mart_ads_daily | snapshot×날짜×tenant×플랫폼×계정×캠페인 | unit_id nullable, spend, impressions, clicks, reported_conversions, reported_revenue, attribution_rule_id, snapshot_id |
| ops_load_run | tenant×소스×실행 | load_id, started_at, finished_at, status, row_count, latest_complete_date, error_code |
| ops_data_quality | tenant×실행×규칙×범위 | rule_id, severity, affected_date, unit_id nullable, affected_metrics, issue_count |
| ops_snapshot | tenant×공개 snapshot | snapshot_id, created_at, status, source_watermarks, metric_version, mapping_version |

공통 광고비는 `mart_business_daily`의 예약 키 `__shared__`에 저장한다. 매출은 0이며 공통 광고비와 해당 비용의 음수 공헌이익을 가진다. 지점 목록에는 포함하지 않지만 전사 합계와 전사 목표에는 포함한다. target_shared_ad_spend와 그 음수 target_contribution을 저장한다. 실제 누락 지점 unknown과 공통비용 키는 구분한다.

cost_coverage는 완료 판매 및 환불 품목 중 필요한 원가 정보가 완비된 행 수÷전체 대상 행 수다. 거래량이 없는 날은 not_applicable 상태로 별도 처리한다. 금액 기준 커버리지를 보조로 제공할 수 있지만 100%가 아닌 이익을 완전한 값으로 표시하지 않는다.

주문 품목과 광고 fact를 직접 JOIN하지 않는다. 판매, 환불, 변동비, 광고를 각각 날짜×지점으로 선집계한 뒤 동일 grain으로 결합한다. 상품군별 광고비·공헌이익은 MVP에서 계산하지 않는다. 상품군 이익에 지점 광고비를 복제하는 조인을 금지한다.

전사 비율·지점 비율·기간 비율은 API에서 합산 분자와 분모로 계산한다. 이익 완전성은 선택 기간의 모든 영업일·선택 지점과 필요한 비용 소스가 완전할 때만 true다. 업종 공통 키를 유지하되 숙박 원장을 주문 테이블에 억지로 맞추지 않고 후속 fact_booking·fact_stay_night를 추가한다.

### 소스별 완전성 테이블

ops_source_day_status의 grain과 PK는 tenant_id×snapshot_id×source_system×business_date×scope_type×scope_id다. scope_type은 unit 또는 ad_account이고 scope_id는 지점 또는 광고 계정이다. 필드는 expected BOOL, status STRING, expected_close_at TIMESTAMP, confirmed_complete_at TIMESTAMP nullable, received_rows INT64, completeness_evidence STRING, load_id STRING, reason STRING이다. status는 pending, partial, complete, no_activity, closed, not_applicable, failed다.

예정 영업일인데 마감 이후 pending·partial·failed이면 누락 또는 불완전 일이다. no_activity는 소스의 무거래 확인 또는 완료 manifest가 있을 때만 사용하며 행 0개만으로 판정하지 않는다. closed는 영업일 캘린더가 확인한 휴무다. 광고는 캠페인이 행을 반환하지 않는 날도 계정별 완료 manifest와 무집행 확인이 필요하다. 완료 광고 계정과 캠페인 매핑을 통해 지점·공통비용의 ad_complete를 판정한다.

sales_complete는 POS 및 환불 데이터가 complete/no_activity/closed의 허용 상태이고 원장 검증을 통과할 때만 true다. 휴무일 거래가 있으면 캘린더 불일치로 차단한다. profit_complete는 sales_complete와 원가·변동비·필요 광고 범위의 완전성을 모두 요구한다. 목표 미설정은 이익 실적을 차단하지 않고 목표 달성률만 차단한다. latest_complete_date는 가장 늦게 수신한 날짜가 아니라 해당 보고 범위에서 누락 없이 연속 완료된 마지막 날짜다.

## 10 적재 및 품질 명세

Staging은 source_system, source_record_id, payload JSON, source_updated_at, ingested_at, load_id를 보존한다. 최신 레코드 선택 규칙이 동일한 상태에서 MERGE 재실행은 같은 결과를 만들어야 한다.

| 항목 | 확정 정책 |
| --- | --- |
| 갱신 주기 | 일 1회, 가장 늦은 지점 컷오프와 소스 완료 확인 후 실행 |
| 기본 재집계 | 최근 30일, 오래된 수정·환불은 변경 감지된 업무일을 추가 |
| 키 중복 | canonical PK 중복 0건, 원본 중복은 최신성 규칙으로 해소 |
| 금액 검증 | 주문과 품목 금액 일치, 일별 소스와 마트 차이 추적 |
| 매핑 | 지점 누락은 공개 차단, 상품군 unknown은 경고 후 공개 가능 |
| 원가 | 누락 매출은 공개 가능, 해당 이익은 계산 차단 |
| 광고 | 원본 비용 합=마트 비용 합, 공통·미귀속 잔액 보존 |
| 목표 | 활성 버전 한 개, 미설정은 0으로 대체 금지 |
| 공개 | 검증 완료 snapshot만 원자적으로 serving pointer 변경 |
| 실패 | 이전 정상 snapshot 유지, 최신성 경고, 실패 이력 기록 |

Warehouse 일별 fact 파티션은 업무일/광고일이며 tenant_id와 unit_id 또는 campaign_id로 클러스터링한다. 차원 이력의 유효 기간은 겹치지 않아야 한다. 과거 기간을 새 매핑으로 재계산하면 새 snapshot과 mapping_version을 발행한다. 마트별 snapshot이 다른 숫자를 한 화면에 섞지 않는다.

### snapshot 보존 정책

Warehouse는 최신 정제 원장을 MERGE로 유지한다. Marts는 snapshot_id별 360일 범위의 전체 행을 새로 작성하는 불변 버전 방식이며 단순 pointer-only 저장이 아니다. 마트 PK에는 snapshot_id가 포함되고 물리 파티션은 snapshot_date DATE, 클러스터는 tenant_id·business_date·unit_id 또는 campaign_id다. 모든 마트와 상태 테이블을 작성·검증한 뒤 ops_serving_pointer(tenant_id, scenario_id, snapshot_id, published_at)를 한 번에 전환한다.

최근 30일의 공개 snapshot과 현재 serving snapshot, 진행 중 요청이 참조하는 snapshot을 보존한다. 참조 중 버전은 삭제하지 않으며 실패·비공개 snapshot은 7일 후 정리한다. snapshot 메타데이터·load·품질 감사 기록은 1년, 데모 재생성 fixture는 버전 관리로 유지한다. 실제 원본 보존기간은 온보딩에서 별도 합의하며 마트 삭제가 원본 삭제를 의미하지 않는다.

데모 시나리오마다 별도 합성 tenant_id와 scenario_id, 고정 as_of_date, 독립 serving snapshot을 사용한다. UI의 scenario_id는 서버 allowlist의 합성 tenant로만 해석한다. 실제 데이터 tenant 선택에 사용할 수 없다. 모든 화면·캐시·CSV·브리프는 같은 시나리오와 snapshot으로 조회한다.

## 11 Next.js 앱 및 API 명세

Next.js App Router와 TypeScript를 사용하며, 서버에서 BigQuery 마트를 조회한다. 클라이언트에는 집계 데이터만 전달한다. Recharts는 표시를 담당하고 KPI 산식은 서버의 공통 지표 모듈에서 계산한다. 특정 패키지 버전은 구현 착수 시 고정한다.

| API | 입력 | 출력 |
| --- | --- | --- |
| GET /api/overview | from, to, comparison, report_scope, unit_ids | KPI, 일별 추이, 목표, 지점 기여 |
| GET /api/sales | 공통 필터, category_id optional | 요약, 지점 표, 상품군 믹스 |
| GET /api/profitability | 공통 필터, platform optional | 비용 브리지, 이익 분해, 플랫폼 표 |
| GET /api/data-health | 공통 필터 | 소스 상태, 품질 이슈, 영향 지표 |
| GET /api/metrics | metric_version optional | 지표 사전 |
| POST /api/brief | 공통 필터와 scope=overview/sales/profitability | 근거 JSON, 요약, 권고, fallback 여부 |
| GET /api/export | 허용 screen, 공통 필터 | 현재 표 CSV |

응답 공통 메타데이터: currency, timezone, snapshot_id, metric_version, latest_complete_date, source_status, comparison_status, report_scope, shared_cost_coverage, warnings, applied_filters, comparison_range. 값은 value, status, reason을 함께 반환하며 null과 0을 구분한다. status는 complete, provisional, unavailable 중 하나다.

서버는 로그인으로 결정된 tenant_id와 허용 지점 목록을 사용한다. 요청의 tenant_id를 신뢰하지 않는다. 필터·기간·정렬은 allowlist와 매개변수 바인딩으로 처리하고 사용자 문자열을 SQL에 직접 삽입하지 않는다. CSV에도 동일 권한 필터를 적용한다.

실제 데이터 모드는 인증 필수, 역할은 Executive와 Operator를 제공한다. Executive는 전 지점, Operator는 지정 지점을 조회한다. Demo는 합성 데이터 전용 경로로 분리한다. BigQuery 키와 LLM 키는 서버에만 보관한다. 캐시 키는 tenant·권한 범위·필터·snapshot·지표 버전을 포함하며 데이터 공개 이후 기존 snapshot 캐시를 새 숫자로 오인하지 않게 한다.

API 오류는 INVALID_FILTER 400, UNAUTHENTICATED 401, FORBIDDEN_UNIT 403, SOURCE_UNAVAILABLE 503, INTERNAL_ERROR 500으로 구분한다. 정상 일부 누락은 200과 warnings를 사용한다. 서버 로그에는 request_id, 소요 시간, snapshot, 소스 오류 코드만 남기고 원장 개인정보를 포함하지 않는다.

## 12 성능과 수용 테스트

성능 목표는 저장된 데모 360일×4개 지점 데이터와 최대 180일 조회와 10명 동시 조회에서 캐시된 화면 API p95 2초 이하, 초기 주요 KPI 표시 3초 이하, 브리프 15초 초과 시 템플릿 전환이다. 이 값은 설계 목표이며 배포 환경에서 측정한다.

| ID | 검증 | 합격 조건 |
| --- | --- | --- |
| A01 | 원장 정합성 | 순매출·원가·광고비가 합성 원본 기준값과 NUMERIC 계산상 일치 |
| A02 | 재실행 | 동일 입력 2회 적재 후 행 수·합계 동일 |
| A03 | 조인 중복 | 여러 품목 주문과 복수 캠페인에서도 광고비·매출 중복 없음 |
| A04 | 환불 | 부분 환불·과거 주문 환불이 해당 환불일에 1회 반영 |
| A05 | 전사 공통비 | 전사 이익=지점 이익 합−공통 광고비 |
| A06 | 비율 | 여러 날짜·지점 필터에서 합계 기준 MER·객단가 계산 |
| A07 | 결측 | 원가 누락·휴무·적재 누락·전기 0 상태가 명세대로 구분 |
| A08 | 목표 | 누락 목표는 미설정, 기간 목표만 합산 |
| A09 | 화면 일치 | API·KPI·차트·CSV가 같은 snapshot과 필터 사용 |
| A10 | 브리프 | 모든 수치가 근거 JSON과 일치, LLM 실패 fallback 작동 |
| A11 | 권한 | Operator 타 지점·CSV·브리프 요청 모두 차단 |
| A12 | 소스 실패 | 신규 적재 실패 시 이전 정상 snapshot과 지연 배지 유지 |
| A13 | UX | 모바일 390px·데스크톱 1440px에서 조작 가능, 키보드·빈 상태 확인 |
| A14 | 매핑 이력 | 변경 전후 날짜가 각각 유효 매핑을 사용, 버전 추적 가능 |
| A15 | 필터 범위 | 무필터 전사와 전 지점 선택 전사가 동일, 부분 지점 MER 계산 불가, 공통·미귀속 비중 표시 |
| A16 | 목표 조정 | 전사 목표=지점 목표 합−공통 광고 예산, 월→일 배분 합계 일치 |
| A17 | 기간 | 최대 180일과 직전 180일 비교 가능, 이력 부족 시 unavailable |
| A18 | 영업일 | 06시 컷오프에서 05:59 전일·06:00 당일, 날짜만 있는 원장은 재변환하지 않음 |
| A19 | 완전성 | 휴무·확인된 무거래·미도착·부분 수집·완료 구분, 누락일이 이익·비교에 전파 |
| A20 | URL | 새로고침·뒤로가기·화면 이동 후 기간·지점·scope·시나리오 유지 |
| A21 | 접근성 | 키보드 전체 조작과 포커스 복원, 차트 대체 표, 자동 serious/critical 위반 0 |
| A22 | 데모 | 시나리오별 tenant·snapshot 격리, 공개 데모 유료 호출 0·실데이터 접근 차단 |
| A23 | 브리프 검증 | 잘못된 evidence_ref·template_id·숫자 주장 주입 시 거부, 서버 렌더링 수치와 JSON 일치 |
| A24 | 호출 제한 | 경계값 및 동시 요청에서 429·일 한도·예산·동시 2회 제한 작동 |
| A25 | snapshot | 공개 원자성·실패 이전 버전 유지·30일 보존·참조 중 삭제 금지 |

금액 수용 테스트는 표시 반올림 전 원값으로 검사한다. 비용 브리지·기여 합계·비율의 불변식을 자동 검증하고, 화면 이동·필터 유지·CSV·브리프 근거는 통합 검증한다.

## 13 구현 순서와 완료 기준

| 단계 | 작업 | 산출물과 종료 조건 |
| --- | --- | --- |
| 1 | KPI 계약과 합성 데이터 | 스키마·시나리오 fixture·기준값, A01~A08 기초 검증 |
| 2 | BigQuery 파이프라인 | Staging·Warehouse·Marts SQL, 재실행·snapshot 공개 확인 |
| 3 | Next.js 핵심 화면 | 3개 화면·공통 필터·CSV·상태·지표 사전 |
| 4 | 브리프와 접근 제어 | 근거 패널·fallback·역할별 조회 검증 |
| 5 | 제안 시연 | 배포 링크·시연 시나리오·성능 측정·전체 수용 검증 |

데모 완료: 합성 데이터 생성부터 BigQuery 마트, 서버 API, 세 핵심 화면, 브리프까지 실제로 연결되고 A01부터 A25까지를 통과한다. 정적 mock 데이터 화면만으로 완료 판정하지 않는다. LLM이 연결되지 않은 경우 “규칙 기반 브리프”로 표시하며 “AI 연동 완료”로 표현하지 않는다.

실제 도입 완료: 소스 접근, canonical 매핑, 부가세·환불·원가·광고 귀속 합의, 운영 원장 대사, 인증·권한, 일일 적재와 실패 복구를 확인한다. 데이터 대사 허용 오차는 원장 반올림 정책에 맞춰 온보딩에서 정하고 설명 없는 차이는 허용하지 않는다.

제안 시연 흐름: 전사 이익 감소 확인→하락 지점 이동→주문수·할인 변화 확인→비용 브리지 확인→광고 보고 ROAS와 MER 구분→브리프 근거 확인→개선 점검 항목 선택. 외부 제안용 데이터는 항상 합성 데이터로 표시한다.

다음 개발 착수 산출물은 이 명세를 기준으로 한 저장소 구조, BigQuery DDL·변환 SQL, 합성 데이터 생성기, API 타입 계약이다. 현재 문서는 제품·기능·데이터 설계이며 웹앱 구현이나 실제 데이터 연결이 완료된 상태를 뜻하지 않는다.

## 14 온보딩 미결 사항

아래 사항은 실제 소스와 운영 정책을 알아야 확정할 수 있는 고객별 설정이다. 제품의 기본 동작은 본문 정책을 따른다.

| 항목 | 데모 기본값 | 결정 책임과 완료 시점 |
| --- | --- | --- |
| POS 날짜·마감·소스 필드 | 현지 06시, 업무일 계약 제공 | 운영자·데이터 담당, 매핑 전 |
| 세액·할인·환불·원가 환입 | 세액 분리·발생일 환불 | 재무·운영자, 대사 전 |
| 원가·변동비 소스와 지연 | 완비된 합성 원장, 누락 시 차단 | 재무·데이터 담당, 이익 공개 전 |
| 광고 귀속·어트리뷰션 규칙·시간대 | 단일 지점 또는 공통, 플랫폼별 규칙 | 마케팅·데이터 담당, 광고 공개 전 |
| 월 목표 일 배분·공통 광고 예산 | 영업일 균등·공통은 달력일 균등 | 경영진, 목표 공개 전 |
| manifest·무거래 확인·완료 SLA | 소스별 확인 증거 제공 | 운영자·데이터 담당, 적재 운영 전 |
| 원본 보존·인증·역할·비용 한도 | 데모 분리, 본문 API 상한 | 고객 책임자·개발자, 실제 모드 공개 전 |
| 금액 대사 반올림 허용 오차 | 합성 원값 일치 | 재무·데이터 담당, 도입 검수 전 |

P1 동일점포 비교는 현재·전기 전체 기간에 운영된 지점만 비교집합에 포함한다. 신규·폐점·영업 중단은 별도 라벨과 제외 사유를 제공한다. opened_date·closed_date·영업 캘린더로 집합을 계산하며 전사 증감과 SSS 증감을 나란히 표시한다. 임시 휴무의 비교 처리 정책은 P1 설계에서 확정한다.

## 부록 기존 경험의 적용

| 경험 | 이번 제품에 적용 |
| --- | --- |
| TapShopBar POS에서 BigQuery와 Looker Studio로 이어지는 집계 | POS 원본 보존, 지점·상품 분류 표준화, 일별 매출 마트 |
| 마스터 v2 집계 기준 변경 경험 | metric_version과 mapping_version으로 정의 변경 추적 |
| 일 마감 후 데이터 적재 운영 | 실시간 대신 일 단위 확정 데이터, 적재 기준일 표시 |
| PIPE 지점·예약·OTA 운영 | business_unit 모델 공통화, 예약 업종 확장 여지 확보 |
| GA4와 GTM 구현·교육 | 플랫폼 보고 지표와 웹 행동 및 확정 매출의 분리 |
| SQL·ETL·운영 자동화 | 재실행 가능한 MERGE, 검증 후 마트 공개, 근거 기반 브리프 |

기존 데이터가 시간대를 포함하지 않는 경우 일별 분석만 제공한다. 시간대별 매출 그래프를 임의로 생성하지 않는다. Hospitality 확장에서는 예약 생성일, 숙박일, 정산일을 분리하며 OCC·ADR·RevPAR은 첫 MVP에 포함하지 않는다.
