import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { nine, trace } from '@nine-lab/nine-util'

// 💡 앱 구동 전 최상단에서 전역 UI 셋업을 딱 한 번만 실행합니다.
nine.setup({
    ux: {
        nativeOverride: ['alert', 'confirm'],
    },
    cssPath: "/css/nine",
    debug: true
});

trace.init("nine-template", "#333");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
