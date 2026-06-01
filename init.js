import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newName = path.basename(__dirname); // 예: test-ap
const oldName = 'nine-template';
const pascalOldName = 'NineTemplate';

// PascalCase 변환 (test-ap -> TestAp)
const pascalNewName = newName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

// 패키지 명칭 규칙 (test-ap -> testap)
const packageNewName = newName.split('-').join('').toLowerCase();

console.log(`🚀 [${newName}] 기반 '안전 최우선' 정밀 리팩토링 초기화를 시작합니다...`);

function replaceFileContent(fullPath) {
    if (!fs.existsSync(fullPath)) return;

    let content = fs.readFileSync(fullPath, 'utf8');

    // -------------------------------------------------------------------------
    // 🛡️ [보호 마커 설정 구역] - 무차별 치환으로부터 진짜 자산들을 보호합니다.
    // -------------------------------------------------------------------------
    const PROTECT_LAB_MARKER = '___NINE_LAB_PROTECTED___';
    const PROTECT_AI_MARKER = '___NINE_AI_PROTECTED___';

    // 1. build.gradle 내부의 implementation("com.nine-lab:nine-mu:0.0.13") 보호
    content = content.replace(/com\.nine-lab/g, PROTECT_LAB_MARKER);

    // 2. 자바 메인 클래스의 "com.ninelab.ai" 컴포넌트 스캔 경로 보호
    content = content.replace(/com\.ninelab\.ai/g, PROTECT_AI_MARKER);

    // -------------------------------------------------------------------------
    // 🔄 [안전 치환 구역] - 오직 해당 템플릿 고유 경로만 정밀 타격합니다.
    // -------------------------------------------------------------------------
    // 정확한 패키지 핑포인팅 치환 먼저 수행
    content = content.split('com.nine.template').join(`com.${packageNewName}`);
    content = content.split('com.nine').join(`com.${packageNewName}`);

    // 구조 및 폴더 명칭 싱크
    content = content.split('nine-template-backend').join(`${newName}-backend`);
    content = content.split('nine-template-frontend').join(`${newName}-frontend`);
    content = content.split('nine-template').join(newName);
    content = content.split(pascalOldName).join(pascalNewName);

    if (fullPath.includes('runConfigurations')) {
        content = content.split('-Dspring.profiles.active=test').join('-Dspring.profiles.active=local');
    }

    // -------------------------------------------------------------------------
    // 🔓 [보호 복원 구역] - 숨겨놓았던 진짜 소중한 이름들을 원상태로 되돌립니다.
    // -------------------------------------------------------------------------
    content = content.split(PROTECT_LAB_MARKER).join('com.nine-lab');
    content = content.split(PROTECT_AI_MARKER).join('com.ninelab.ai');

    fs.writeFileSync(fullPath, content, 'utf8');
}

function globalTextLookup(dirPath) {
    if (!fs.existsSync(dirPath)) return;

    const folderName = path.basename(dirPath);
    const excludeFolders = ['.git', 'node_modules', '.gradle', 'build', 'dist'];
    if (excludeFolders.includes(folderName)) return;

    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);

        if (fullPath === __filename) return;

        if (fs.statSync(fullPath).isDirectory()) {
            globalTextLookup(fullPath);
        } else {
            if (
                file.endsWith('.java') || file.endsWith('.yml') || file.endsWith('.xml') ||
                file.endsWith('.json') || file.endsWith('.js') || file.endsWith('.ts') ||
                file.endsWith('.tsx') || file.endsWith('.html') || file.endsWith('.gradle') ||
                file.endsWith('.md') || file === '.env' || file.startsWith('.env.')
            ) {
                replaceFileContent(fullPath);
            }
        }
    });
}

function removeEmptyDirs(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    if (!fs.statSync(dirPath).isDirectory()) return;
    let files = fs.readdirSync(dirPath);
    if (files.length > 0) {
        files.forEach(file => removeEmptyDirs(path.join(dirPath, file)));
        files = fs.readdirSync(dirPath);
    }
    if (files.length === 0) {
        fs.rmdirSync(dirPath);
    }
}

try {
    const originalFePath = path.join(__dirname, 'nine-template-frontend');
    if (fs.existsSync(originalFePath)) {
        fs.writeFileSync(path.join(originalFePath, '.env'), 'VITE_API_BASE_URL=\n', 'utf8');
        fs.writeFileSync(path.join(originalFePath, '.env.development'), 'VITE_API_BASE_URL=/api\n', 'utf8');
    }

    // 파일명 물리 리네임 단계
    const oldMainJavaDir = path.join(__dirname, 'nine-template-backend/src/main/java/com/nine/template');
    const oldTestJavaDir = path.join(__dirname, 'nine-template-backend/src/test/java/com/nine/template');

    if (fs.existsSync(oldMainJavaDir)) {
        const targetMainFile = path.join(oldMainJavaDir, 'NineTemplateBackendApplication.java');
        if (fs.existsSync(targetMainFile)) {
            fs.renameSync(targetMainFile, path.join(oldMainJavaDir, `${pascalNewName}BackendApplication.java`));
        }
    }
    if (fs.existsSync(oldTestJavaDir)) {
        const targetTestFile = path.join(oldTestJavaDir, 'NineTemplateBackendApplicationTests.java');
        if (fs.existsSync(targetTestFile)) {
            fs.renameSync(targetTestFile, path.join(oldTestJavaDir, `${pascalNewName}BackendApplicationTests.java`));
        }
    }

    const relocateJavaStructure = (rootType) => {
        const oldJavaRoot = path.join(__dirname, `nine-template-backend/src/${rootType}/java/com/nine/template`);
        if (!fs.existsSync(oldJavaRoot)) return;

        const newJavaRoot = path.join(__dirname, `nine-template-backend/src/${rootType}/java/com/${packageNewName}`);
        fs.mkdirSync(newJavaRoot, { recursive: true });

        const items = fs.readdirSync(oldJavaRoot);
        items.forEach(item => {
            fs.renameSync(path.join(oldJavaRoot, item), path.join(newJavaRoot, item));
        });
    };

    relocateJavaStructure('main');
    relocateJavaStructure('test');

    removeEmptyDirs(path.join(__dirname, 'nine-template-backend/src/main/java/com/nine'));
    removeEmptyDirs(path.join(__dirname, 'nine-template-backend/src/test/java/com/nine'));

    // 대형 프로젝트 대단위 폴더명 최종 물리 변경
    const dirTargets = [
        { from: 'nine-template-backend', to: `${newName}-backend` },
        { from: 'nine-template-frontend', to: `${newName}-frontend` }
    ];
    dirTargets.forEach(t => {
        const fromPath = path.join(__dirname, t.from);
        const toPath = path.join(__dirname, t.to);
        if (fs.existsSync(fromPath)) {
            fs.renameSync(fromPath, toPath);
        }
    });

    // 텍스트 글로벌 치환 기동
    globalTextLookup(__dirname);
    console.log(`모든 대상 파일 내 텍스트 정밀 치환 완료`);

    fs.unlinkSync(__filename);
    console.log(`\n🎉 모든 프로젝트 초기화가 완료되었습니다. IntelliJ에서 프로젝트를 열어주세요.`);
} catch (error) {
    console.error('작업 중 오류 발생:', error);
}