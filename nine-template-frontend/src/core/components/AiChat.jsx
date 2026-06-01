import pkg from '@root/package.json';

const AiChat = ({ routeUrl }) => {
    if (!import.meta.env.DEV) return null;

	return (
		<nine-chat
			className="collapse"
			package-name={pkg.name}
			connector-url={`${import.meta.env.VITE_NINE_MCP_URL}`}
			route-url={routeUrl}
		></nine-chat>
	);
};

export default AiChat;