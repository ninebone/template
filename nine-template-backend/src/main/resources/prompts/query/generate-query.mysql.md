[DB Specific Examples (MySQL/MariaDB)]

사용자의 자연어 요구사항을 MySQL/MariaDB 문법에 최적화된 완성형 SQL로 변환할 때 아래의 실무 패턴과 예시를 철저히 벤치마킹하십시오.

---

### 💡 MySQL 특화 최적화 패턴 가이드 (Patterns & Functions)

1. **날짜 및 시간 처리 (Date & Time)**:
    - 오늘 데이터 조회: `DATE_FORMAT(A.created_at, '%Y-%m-%d') = CURDATE()` 또는 `A.created_at >= CURDATE()`
    - 특정 기간(최근 7일): `A.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`

2. **문자열 결합 및 검색 (String Manipulation)**:
    - 검색어 포함(LIKE): `A.user_name LIKE CONCAT('%', '김철수', '%')`
    - 여러 필드 결합: `CONCAT(A.first_name, ' ', A.last_name)`

3. **널 처리 및 대체 (Null Handling)**:
    - MySQL 전용 내장 함수인 `IFNULL(A.point, 0)` 또는 표준 `COALESCE(A.point, 0)`를 사용하십시오.

4. **페이징 및 정렬 제약 (Paging & Grouping)**:
    - 상위 N개 추출 시 오직 `LIMIT N` 구문을 활용하십시오. (Oracle의 ROWNUM이나 FETCH FIRST 구문 사용 금지)
    - 그룹화 통계 시 집계 함수가 아닌 일반 컬럼은 반드시 `GROUP BY` 절에 명시하십시오.

---

### 📋 완성형 SQL 생성 가이드 예시 (Examples)

**Example 1: "최근 일주일간 가장 주문을 많이 한 회원의 이름과 주문수량을 상위 5명만 뽑아줘"**
```text
SELECT 
    U.user_name AS userName,
    COUNT(O.order_id) AS orderCount
FROM TB_USER U
INNER JOIN TB_ORDER O ON U.user_id = O.user_id
WHERE O.order_status = 'COMPLETED'
  AND O.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY U.user_id, U.user_name
ORDER BY orderCount DESC
LIMIT 5;