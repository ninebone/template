[DB Specific Examples (Oracle Database)]

사용자의 자연어 요구사항을 Oracle SQL 문법 및 실행 계획에 최적화된 완성형 SQL로 변환할 때 아래의 실무 패턴과 예시를 철저히 벤치마킹하십시오.

---

### 💡 Oracle 특화 최적화 패턴 가이드 (Patterns & Functions)

1. **날짜 및 시간 처리 (Date & Time)**:
    - 현재 시간 및 오늘 날짜: `SYSDATE` 또는 `TRUNC(SYSDATE)`
    - 오늘 가입자 조회: `A.created_at >= TRUNC(SYSDATE) AND A.created_at < TRUNC(SYSDATE) + 1`
    - 특정 기간(최근 7일): `A.created_at >= SYSDATE - 7`

2. **문자열 결합 및 검색 (String Manipulation)**:
    - 사용자의 입력이 특정 지역, 카테고리, 명칭 등 광범위하거나 모호한 키워드일 경우, 등호 연산자(=) 대신 반드시 LIKE '%' || '김철수' || '%' 구조를 사용하여 부분 일치 검색이 되도록 하십시오.
    - 검색어 포함(LIKE): 표준 `||` 연산자를 활용하여 `A.user_name LIKE '%' || '김철수' || '%'` 형태로 결합하십시오. (MySQL의 CONCAT은 인자가 2개만 허용되므로 오라클에서는 피하는 것이 안전합니다.)

3. **널 처리 및 대체 (Null Handling)**:
    - 오라클 전용 내장 함수인 `NVL(A.point, 0)` 또는 표준 `COALESCE(A.point, 0)`를 사용하십시오.
    - 오라클은 빈 문자열(`''`)을 `IS NULL`로 인식하므로, 빈 값 비교 시 `A.status IS NULL` 형식을 엄격히 준수하십시오.

4. **페이징 및 정렬 제약 (Paging & Row Limiting)**:
    - **CRITICAL**: 오라클에는 `LIMIT` 구문이 절대 존재하지 않습니다!
    - 상위 N개 추출 시 오라클 12c 이상 표준 문법인 `FETCH FIRST N ROWS ONLY` 절을 사용하거나, 인라인 뷰를 감싸서 `WHERE ROWNUM <= N` 절을 활용하십시오.
    - 그룹화(`GROUP BY`) 통계 시 SELECT 절에 선언된 별칭(Alias)을 WHERE나 GROUP BY 절에서 직접 참조할 수 없으므로 원본 컬럼명을 그대로 명시하십시오.

---

### 📋 완성형 SQL 생성 가이드 예시 (Examples)

**Example 1: "최근 일주일간 가장 주문을 많이 한 회원의 이름과 주문수량을 상위 5명만 뽑아줘"**
```text
SELECT * FROM (
    SELECT 
        U.user_name AS userName,
        COUNT(O.order_id) AS orderCount
    FROM TB_USER U
    INNER JOIN TB_ORDER O ON U.user_id = O.user_id
    WHERE O.order_status = 'COMPLETED'
      AND O.created_at >= SYSDATE - 7
    GROUP BY U.user_id, U.user_name
    ORDER BY orderCount DESC
) WHERE ROWNUM <= 5;