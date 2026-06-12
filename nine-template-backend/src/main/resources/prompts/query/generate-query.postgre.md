[DB Specific Examples (PostgreSQL)]

사용자의 자연어 요구사항을 PostgreSQL 문법 및 기능에 최적화된 완성형 SQL로 변환할 때 아래의 실무 패턴과 예시를 철저히 벤치마킹하십시오.

---

### 💡 PostgreSQL 특화 최적화 패턴 가이드 (Patterns & Functions)

1. **날짜 및 시간 처리 (Date & Time)**:
    - 현재 시간 및 오늘 날짜: `CURRENT_DATE` 또는 `NOW()`
    - 오늘 가입자 조회: `A.created_at >= CURRENT_DATE`
    - 특정 기간(최근 7일): `A.created_at >= NOW() - INTERVAL '7 days'`

2. **문자열 결합 및 검색 (String Manipulation)**:
   - 사용자의 입력이 특정 지역, 카테고리, 명칭 등 광범위하거나 모호한 키워드일 경우, 등호 연산자(=) 대신 반드시 LIKE '%' || '김철수' || '%' 구조를 사용하여 부분 일치 검색이 되도록 하십시오.
   - 검색어 포함(LIKE/ILIKE): 표준 `||` 연산자 또는 `CONCAT`을 모두 지원합니다.
   - **CRITICAL**: PostgreSQL은 대소문자를 구분하므로, 대소문자 무시 검색 요구사항 시 반드시 `ILIKE` 연산자를 활용하여 `A.user_name ILIKE '%' || '김철수' || '%'` 형태로 작성하십시오.

3. **널 처리 및 명시적 타입 캐스팅 (Nulls & Type Casting)**:
    - 널 대체 함수는 표준 함수인 `COALESCE(A.point, 0)`를 사용하십시오. (MySQL의 IFNULL이나 Oracle의 NVL 사용 금지)
    - PostgreSQL은 타입 검격이 매우 엄격하므로 필요시 `A.status::text` 또는 `A.age::integer`와 같은 명시적 캐스팅을 활용하십시오.

4. **페이징 및 제한 (Paging & Row Limiting)**:
    - 상위 N개 추출 시 `LIMIT N` 구문을 지원합니다.
    - 대량 데이터 통계 정렬 시 `ORDER BY`와 `LIMIT` 결합을 최적화하여 반영하십시오.

---

### 📋 완성형 SQL 생성 가이드 예시 (Examples)

**Example 1: "최근 일주일간 가장 주문을 많이 한 회원의 이름과 주문수량을 상위 5명만 뽑아줘 (대소문자 무시)"**
```text
SELECT 
    U.user_name AS "userName",
    COUNT(O.order_id) AS "orderCount"
FROM TB_USER U
INNER JOIN TB_ORDER O ON U.user_id = O.user_id
WHERE O.order_status ILIKE 'completed'
  AND O.created_at >= NOW() - INTERVAL '7 days'
GROUP BY U.user_id, U.user_name
ORDER BY "orderCount" DESC
LIMIT 5;