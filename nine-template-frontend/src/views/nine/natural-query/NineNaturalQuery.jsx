//import React from 'react';

const NineNatualQuery = () => {
	return (
		<div style={styles.container}>
			<div style={styles.contentBox}>
				<nine-natural-query/>
				<nine-natural-query-result/>
			</div>
		</div>
	);
};

// 🎯 화면을 널찍하고 시원하게 꽉 채우는 스타일 셋업
const styles = {
	container: {
		width: '100%',
		height: 'calc(100vh - 50px)', // 상단 탑메뉴 높이(50px)만큼 빼서 전체 화면 높이 확보
		display: 'flex',
		justifyContent: 'center',    // 가로축 기준 가운데 정렬 유지
		alignItems: 'flex-start',    // 🎯 [교정] 데이터가 많아질 때 위에서부터 자연스럽게 내려오도록 탑 정렬로 변경
		backgroundColor: 'white',
		fontFamily: "'Segoe UI', Roboto, sans-serif",
		boxSizing: 'border-box',
		padding: '30px',             // 화면 가장자리 여유 마진 30px 부여
		overflowY: 'auto'            // 데이터가 넘치면 브라우저 스크롤이 예쁘게 생기도록 가드
	},
	contentBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
		width: '100%',               // 🎯 [핵심] 가로 너비 100% 확장
		height: '100%',
		maxWidth: '1600px',          // 🎯 [핵심] 너무 찢어지지 않게 초고해상도(UHD) 모니터용 맥스 마진 확보
		textAlign: 'center',
		animation: 'fadeIn 0.6s ease-out'
	},
	title: {
		fontSize: '26px',
		fontWeight: '600',
		color: '#333',
		margin: 0,
		letterSpacing: '0.5px'
	}
};

export default NineNatualQuery;