const NineNaturalQuery = () => {
	return (
		<nine-deck>
            <nine-deck-page className="active">
                <nine-nav></nine-nav>
                <nine-natural-query style={styles.inputBox}/>
                <nine-natural-query-result/>
            </nine-deck-page>
        </nine-deck>
	);
};

const styles = {
    inputBox: {
		marginTop: '32px'
	},
};

export default NineNaturalQuery;