import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// 🎯 부모(App.jsx)가 전달해주는 menuData를 props로 정직하게 받습니다.
const LeftMenu = ({ menuData }) => {
	const navigate = useNavigate();
	const menuRef = useRef(null);

	const wrapStyle = {
		backgroundColor: "#181A31",
		color: "white",
	};

	// 🎯 menuData 알맹이가 바뀔 때마다 웹 컴포넌트 세터에 정직하게 주입
	useEffect(() => {
		if (menuData && menuData.length > 0 && menuRef.current) {
			menuRef.current.data = menuData;
		}
	}, [menuData]);

	useEffect(() => {
		const handleMenuClick = (e) => {
			const href = e.detail.target?.getAttribute("href");
			if (href) navigate(href);
		};
		window.addEventListener("side-menu-click", handleMenuClick);
		return () => window.removeEventListener("side-menu-click", handleMenuClick);
	}, [navigate]);

	return (
		<div style={wrapStyle}>
			<nine-side-menu ref={menuRef} min-width="48" max-width="256">
				<nine-side-menu-head>
					<div style={{padding: "10px", fontWeight: "bold"}}>NINE ADMIN</div>
				</nine-side-menu-head>
				<nine-side-menu-foot>
					<div style={{fontSize: "10px", opacity: 0.5}}>v1.0.0</div>
				</nine-side-menu-foot>
			</nine-side-menu>
		</div>
	);
};

export default LeftMenu;