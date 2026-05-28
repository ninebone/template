import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. 현재 실행 중인 폴더명을 프로젝트명으로 자동 인식
const newName = path.basename(__dirname); 

const oldName = 'nine-template'; 
const pascalOldName = 'NineTemplate'; 
const pascalNewName = newName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

// 2. 치환 대상 파일 및 폴더 목록 (인텔리제이 설정 파일 정확히 매핑)
const targets = [
    { type: 'file', path: 'package.json' },
    { type: 'file', path: 'README.md' },
    { type: 'file', path: 'nine-template-backend/settings.gradle' },
    { type: 'file', path: 'nine-template-backend/build.gradle' },
    { type: 'file', path: 'nine-template-backend/src/main/resources/application.yml' },
    
    // 💡 [중요] 인텔리제이 서비스 탭 및 실행 버튼의 경로 설정을 새 폴더명으로 치환
    { type: 'file', path: '.idea/services.xml' },
    { type: 'file', path: '.idea/runConfigurations/Backend.xml' },
    { type: 'file', path: '.idea/runConfigurations/Frontend.xml' },
    
    { type: 'file', path: 'nine-template-frontend/package.json' },
    { type: 'file', path: 'nine-template-frontend/vite.config.js' },
    { type: 'file', path: 'nine-template-frontend/index.html' },
    
    { type: 'dir', from: 'nine-template-backend', to: `${newName}-backend` },
    { type: 'dir', from: 'nine-template-frontend', to: `${newName}-frontend` }
];

console.log(`🚀 [${newName}] 기반으로 템플릿 자동 초기화를 시작합니다...`);

// 3. 텍스트 일괄 치환 함수
function replaceFileContent(filePath) {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return;

    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.split(oldName).join(newName);
    content = content.split(pascalOldName).join(pascalNewName);

    // IntelliJ 실행 프로필을 test에서 local로 자동 치환
    if (filePath.includes('runConfigurations')) {
        content = content.split('-Dspring.profiles.active=test').join('-Dspring.profiles.active=local');
        console.log(`⚙️ IntelliJ 실행 프로필 변경 완료 (test -> local) : ${filePath}`);
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ 치환 완료: ${filePath}`);
}

// 4. 실행 프로세스
try {
    // 파일 내용 치환 (폴더명 변경 전 기존 경로 기준)
    targets.filter(t => t.type === 'file').forEach(t => replaceFileContent(t.path));

    // 물리적 폴더명 최종 변경
    targets.filter(t => t.type === 'dir').forEach(t => {
        const fromPath = path.join(__dirname, t.from);
        const toPath = path.join(__dirname, t.to);
        if (fs.existsSync(fromPath)) {
            fs.renameSync(fromPath, toPath);
            console.log(`📁 폴더명 변경: ${t.from} -> ${t.to}`);
        }
    });

    // 5. 프론트엔드 환경 변수 자동 생성
    const feFolderPath = path.join(__dirname, `${newName}-frontend`);
    if (fs.existsSync(feFolderPath)) {
        fs.writeFileSync(path.join(feFolderPath, '.env'), 'VITE_API_BASE_URL=\n', 'utf8');
        fs.writeFileSync(path.join(feFolderPath, '.env.development'), 'VITE_API_BASE_URL=/api\n', 'utf8');
        console.log(`📝 프론트엔드 .env 및 .env.development 파일 생성 완료!`);
    }

    // 초기화 스크립트 자가 폭파
    console.log('\n🔥 초기화 스크립트(init.js)를 자가 삭제합니다.');
    fs.unlinkSync(__filename);

    console.log(`\n🎉 모든 프로젝트 초기화가 완료되었습니다!`);
} catch (error) {
    console.error('❌ 작업 중 오류 발생:', error);
}