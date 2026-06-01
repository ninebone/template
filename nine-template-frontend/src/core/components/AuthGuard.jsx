import React, { useState, useEffect } from 'react'
import { LoginPage } from "@/views/Login.jsx";
import MyCustom404 from "@/core/frame/Error404.jsx";
import LeftMenu from "@/core/menu/LeftMenu.jsx";
import TopMenu from "@/core/menu/TopMenu.jsx";
import AiChat from "./AiChat.jsx";

import '@ninebone/ux';
import { NineHook } from '@ninebone/mu';
import menuData from "/public/data/routes.json";

const rawViews = import.meta.glob("../../views/**/*.jsx");

const projectViews = Object.keys(rawViews).reduce((acc, key) => {
    const cleanKey = key.replace("../../views/", "");
    acc[cleanKey] = rawViews[key];
    return acc;
}, {});

export const AuthGuard = () => {
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
    const routeUrl = `${baseUrl}/data/routes.json`;

    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
        setLoading(false);
    }, []);

    const handleLoginSuccess = (accessToken, username) => {
        setToken(accessToken);
        localStorage.setItem('token', accessToken);
        localStorage.setItem('username', username);
    };

    if (loading) {
        return <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>로딩 중...</div>;
    }

    if (!token) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <TopMenu />
            <LeftMenu menuData={menuData} />
            <NineHook menuData={menuData} views={projectViews} error404={MyCustom404} />
            {import.meta.env.DEV && <AiChat routeUrl={routeUrl} />}
        </div>
    );
};