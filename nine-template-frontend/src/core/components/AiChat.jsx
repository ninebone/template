import pkg from '@root/package.json';

const AiChat = ({ routeUrl }) => {
	return (
		<nine-chat
			className="collapse"
			package-name={pkg.name}
			connector-url="ws://localhost:4001"
			route-url={routeUrl}
		></nine-chat>
	);
};

export default AiChat;