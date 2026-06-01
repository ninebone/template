//import React from 'react';

const HomePage = () => {
	return (
		<div style={styles.container}>
			<div style={styles.contentBox}>
				<h1 style={styles.title}>프로젝트 메인 홈</h1>
			</div>
		</div>
	);
};

// 🎯 군더더기 없이 화면 정중앙에 칼정렬하는 스타일 셋업
const styles = {
	container: {
		width: '100%',
		height: 'calc(100vh - 50px)', // 상단 탑메뉴 높이(50px)만큼 빼서 딱 떨어지는 정중앙 배치
		display: 'flex',
		justifyContent: 'center',    // 가로축 기준 정중앙
		alignItems: 'center',        // 세로축 기준 정중앙
		backgroundColor: 'white',   // 다크 테마 코어 배경색
		fontFamily: "'Segoe UI', Roboto, sans-serif",
		boxSizing: 'border-box'
	},
	contentBox: {
		textAlign: 'center',
		animation: 'fadeIn 0.6s ease-out' // 진입 시 부드러운 전환 효과 감성 추가
	},
	title: {
		fontSize: '26px',
		fontWeight: '600',
		color: '#333',
		margin: 0,
		letterSpacing: '0.5px'
	}
};

export default HomePage;