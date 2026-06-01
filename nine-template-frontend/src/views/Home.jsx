const HomePage = () => {
	return (
		<div style={styles.container}>
			<div style={styles.contentBox}>
				<h1 style={styles.title}>프로젝트 메인 홈</h1>
			</div>
		</div>
	);
};

const styles = {
	container: {
		width: '100%',
		height: 'calc(100vh - 50px)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
		fontFamily: "'Segoe UI', Roboto, sans-serif",
		boxSizing: 'border-box'
	},
	contentBox: {
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

export default HomePage;