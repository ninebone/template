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

const styles = {
	container: {
		width: '100%',
		height: 'calc(100vh - 50px)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-start',
		backgroundColor: 'white',
		fontFamily: "'Segoe UI', Roboto, sans-serif",
		boxSizing: 'border-box',
		padding: '30px',
		overflowY: 'auto'
	},
	contentBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
		width: '100%',
		height: '100%',
		maxWidth: '1600px',
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