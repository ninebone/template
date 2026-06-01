//import React from "react";

const Error404 = () => {
	const handleGoHome = () => {
		window.location.href = '/';
	};

	return (
		<div style={styles.container}>
			<div style={styles.contentBox}>
				{/* 404 엠블럼 데코 */}
				<div style={styles.badge}>ERROR CODE</div>

				{/* 거대한 404 에러 코드 */}
				<h1 style={styles.errorCode}>404</h1>

				{/* 상태 메시지 */}
				<h2 style={styles.title}>Page Not Found</h2>

				{/* 상세 설명 */}
				<p style={styles.description}>
					요청하신 페이지를 찾을 수 없습니다.<br />
					주소가 변경되었거나 잘못된 경로로 접근하셨을 수 있습니다.
				</p>

				{/* 홈으로 복귀하는 버튼 */}
				<button
					onClick={handleGoHome}
					style={styles.homeBtn}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = '#4338ca';
						e.currentTarget.style.transform = 'translateY(-1px)';
						e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.4)';
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = '#4f46e5';
						e.currentTarget.style.transform = 'translateY(0)';
						e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.2)';
					}}
				>
					메인 화면으로 돌아가기
				</button>
			</div>
		</div>
	);
};

// 🎯 확실하게 정중앙에 고정시키는 스타일 블록
const styles = {
	container: {
		width: '100%',
		height: '100vh',          // ❌ 100% 대신 100vh로 화면 전체 높이를 확보하여 완벽한 수직 중앙 정렬 보장
		display: 'flex',
		justifyContent: 'center', // 가로 기준 정중앙
		alignItems: 'center',     // 세로 기준 정중앙
		backgroundColor: 'trasparent',
		fontFamily: "'Segoe UI', Roboto, sans-serif",
		boxSizing: 'border-box',
		position: 'absolute',     // 부모 레이아웃의 내부 패딩을 무시하고 꽉 채우기 위해 absolute 가드
		top: 0,
		left: 0
	},
	contentBox: {
		textAlign: 'center',
		padding: '40px',
		backgroundColor: '#2b2b36', // 탑메뉴, 로그인 카드와 톤앤매너 싱크 일치
		borderRadius: '12px',
		boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
		border: '1px solid #3f3f4e',
		maxWidth: '440px',
		width: '90%'
	},
	badge: {
		display: 'inline-block',
		padding: '4px 12px',
		backgroundColor: 'rgba(79, 70, 229, 0.15)',
		color: '#818cf8',
		borderRadius: '20px',
		fontSize: '11px',
		fontWeight: '700',
		letterSpacing: '1px',
		marginBottom: '16px'
	},
	errorCode: {
		fontSize: '110px',        // 크기를 시원하게 확장
		fontWeight: '900',
		margin: '0 0 10px 0',
		color: '#4f46e5',
		letterSpacing: '-3px',
		lineHeight: '1'
	},
	title: {
		fontSize: '24px',
		fontWeight: '700',
		color: '#ffffff',
		margin: '0 0 14px 0'
	},
	description: {
		fontSize: '14px',
		color: '#9a9aab',
		lineHeight: '1.6',
		margin: '0 0 32px 0'
	},
	homeBtn: {
		backgroundColor: '#4f46e5',
		color: '#ffffff',
		border: 'none',
		borderRadius: '6px',
		padding: '14px 28px',
		fontSize: '14px',
		fontWeight: '600',
		cursor: 'pointer',
		boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
		transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
		outline: 'none',
		width: '100%'            // 버튼을 와이드하게 펼쳐 모던함 강조
	}
};

export default Error404;