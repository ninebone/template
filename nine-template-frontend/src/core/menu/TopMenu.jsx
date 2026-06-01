const TopMenu = () => {

	const handleLogoutClick = () => {
		localStorage.clear();
		window.location.href = '/';
	};

	return (
		<div style={styles.wrap}>
			{/* 1️⃣ 좌측: 서비스 타이틀 */}
			<div style={styles.title}>
				Nine Template Workspace
			</div>

			<button
				onClick={handleLogoutClick}
				style={styles.logoutBtn}
				title="로그아웃"
				onMouseEnter={(e) => {
					const svg = e.currentTarget.querySelector('svg');
					if (svg) svg.style.stroke = '#ffffff';
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.backgroundColor = 'transparent';
					const svg = e.currentTarget.querySelector('svg');
					if (svg) svg.style.stroke = '#cccccc';
				}}
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#cccccc"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					style={{ display: 'block', minWidth: '20px', minHeight: '20px', transition: 'stroke 0.2s ease' }}
				>
					<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
					<polyline points="16 17 21 12 16 7"></polyline>
					<line x1="21" y1="12" x2="9" y2="12"></line>
				</svg>
			</button>
		</div>
	);
};

const styles = {
	wrap: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#2b2b36',
		color: 'white',
		padding: '0 20px',
		height: '40px',
		minHeight: '40px',
		borderBottom: '1px solid #3f3f4e',
		fontFamily: "'Segoe UI', Roboto, sans-serif",
		boxSizing: 'border-box'
	},
	title: {
		fontWeight: '600',
		fontSize: '15px',
		letterSpacing: '0.5px',
		color: '#ffffff'
	},
	logoutBtn: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		border: 'none',
		borderRadius: '6px',
		width: '20px',
		height: '40px',
		minWidth: '20px',
		minHeight: '40px',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		outline: 'none',
		padding: 0,
		overflow: 'visible'
	}
};

export default TopMenu;