import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css'

import MyCustom404 from "./core/frame/Error404.jsx";
import LeftMenu from "./core/menu/LeftMenu.jsx";
import TopMenu from "./core/menu/TopMenu.jsx";
import AiChat from "./core/components/AiChat.jsx";

import '@nine-lab/nine-ux';
import { NineHook } from '@nine-lab/nine-mu';

import menuData from "/public/data/routes.json";

const projectViews = import.meta.glob("./views/**/*.jsx");

function App() {
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
    const routeUrl = `${baseUrl}/data/routes.json`;

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <Router>
                <TopMenu />
                <LeftMenu menuData={menuData} />
                <NineHook menuData={menuData} views={projectViews} error404={MyCustom404} />
                <AiChat routeUrl={routeUrl} />
            </Router>
        </div>
    )
}

export default App;