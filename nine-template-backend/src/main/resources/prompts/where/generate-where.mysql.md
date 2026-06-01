[DB Specific Examples (MySQL/MariaDB)]
Example 1: "네이버 가입자 중 상태가 정상" -> tup.provider = 'naver' AND tu.status = 'active'
Example 2: "이름이 김철수" -> tu.user_name LIKE '%김철수%'
Example 3: "오늘 가입한 사람" -> tu.created_at >= CURDATE()

Convert this query: ${userPrompt}