import React, { useState, useEffect } from 'react'
import { LoginPage } from "@/views/Login.jsx";
import MyCustom404 from "@/core/frame/Error404.jsx";
import LeftMenu from "@/core/menu/LeftMenu.jsx";
import TopMenu from "@/core/menu/TopMenu.jsx";
import AiChat from "./AiChat.jsx";

import '@ninebone/ux';
import { NineHook } from '@ninebone/mu';
import menuData from "/public/data/routes.json";

//const projectViews = import.meta.glob("../../views/**/*.jsx"); // 🎯 파일 위치가 바뀌었으니 경로 점 두개(../../) 체크

const rawViews = import.meta.glob("../../views/**/*.jsx");

// 2️⃣ 🎯 [치트키] 라이브러리 내부 규칙인 "./views/..."와 완벽하게 싱크를 맞춥니다.
const projectViews = Object.keys(rawViews).reduce((acc, key) => {
    // 앞의 "../../views/" 부분을 라이브러리가 기대하는 "./views/" 로 강제 치환!
    const cleanKey = key.replace("../../views/", "");
    acc[cleanKey] = rawViews[key];
    return acc;
}, {});

export const AuthGuard = () => {
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
    const routeUrl = `${baseUrl}/data/routes.json`;

    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // 창고 검사
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
        setLoading(false);
    }, []);

    // 로그인 성공 콜백
    const handleLoginSuccess = (accessToken, username) => {
        setToken(accessToken);
        localStorage.setItem('token', accessToken);
        localStorage.setItem('username', username);
    };

    // 깜빡임 방지 가드
    if (loading) {
        return <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>로딩 중...</div>;
    }

    // 🎯 조건부 렌더링 분기
    if (!token) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <TopMenu />
            <LeftMenu menuData={menuData} />
            <NineHook menuData={menuData} views={projectViews} error404={MyCustom404} />
            <AiChat routeUrl={routeUrl} />
        </div>
    );
};