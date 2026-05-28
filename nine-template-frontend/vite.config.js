import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 1. path 모듈 임포트
//import rawPlugin from 'vite-plugin-raw';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
    //rawPlugin({
    //  fileRegex: /ckeditor5-[^/]+\/theme\/icons\/.*\.svg$/
    //})
  ],
  base: '/', // 이 설정이 있어야 index.html에서 /admin/assets/... 경로로 파일을 찾습니다.
  resolve: {
    // 2. 경로 별칭 설정 추가
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@root": path.resolve(__dirname, "./") // 루트 경로 추가
    },
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/], // 모든 node_modules의 CommonJS를 허용
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    // 수시로 수정되는 라이브러리는 캐싱하지 않도록 설정
    exclude: ['@nine-lab/nine-util', '@nine-lab/nine-ux', '@nine-lab/nine-ai', '@nine-lab/nine-mu']
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    }
  },
})
