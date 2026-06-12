import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // path 모듈 임포트 유지

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // index.html 자원 경로 가드
  resolve: {
    // 경로 별칭 설정 유지
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@root": path.resolve(__dirname, "./")
    },
  },
  optimizeDeps: {
    // 🎯 [성공 공식 이식] 에러를 내던 주범들과 소켓/엔진 모듈들을 미리 ESM으로 구워버립니다.
    include: [ 'ninegrid2' ],
    // 실시간으로 수정되면서 변경점이 즉각 반영되어야 하는 사내 모듈만 제외(exclude)로 격리
    exclude: ['@ninebone/util', '@ninebone/ux', '@ninebone/ai', '@ninebone/mu']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/], // 모든 node_modules의 CommonJS를 ESM으로 수용
      transformMixedEsModules: true,
    },
    chunkSizeWarningLimit: 10000,
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 현재 가동 중인 백엔드 포트 유지
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    }
  },
})