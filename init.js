import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. 현재 실행 중인 폴더명을 프로젝트명으로 자동 인식 (예: test-app)
const newName = path.basename(__dirname);

const oldName = 'nine-template';
const pascalOldName = 'NineTemplate';

// 하이픈(-) 제거한 파스칼 케이스 (예: TestApp)
const pascalNewName = newName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

// 하이픈(-) 제거하고 소문자 공백 제거한 패키지명 가공 (예: testapp)
const packageNewName = newName.split('-').join('').toLowerCase();

console.log(`🚀 [${newName}] 기반 정밀 리팩토링 초기화를 시작합니다...`);

// 2. 텍스트 일괄 치환 함수
function replaceFileContent(fullPath) {
    if (!fs.existsSync(fullPath)) return;

    let content = fs.readFileSync(fullPath, 'utf8');

    // 순서대로 정밀 매핑 치환
    content = content.split('com.nine.template').join(`com.${packageNewName}.backend`);
    content = content.split('nine-template-backend').join(`${newName}-backend`);
    content = content.split('nine-template-frontend').join(`${newName}-frontend`);
    content = content.split('nine-template').join(newName);
    content = content.split(pascalOldName).join(pascalNewName);

    // IntelliJ 실행 프로필을 test에서 local로 자동 치환
    if (fullPath.includes('runConfigurations')) {
        content = content.split('-Dspring.profiles.active=test').join('-Dspring.profiles.active=local');
    }

    fs.writeFileSync(fullPath, content, 'utf8');
}

// 3. 디렉토리 재귀 탐색하며 모든 텍스트 파일 치환하는 함수 (필터링 조건 완벽 교정 🎯)
function globalTextLookup(dirPath) {
    if (!fs.existsSync(dirPath)) return;

    // 주소 끝자리가 아닌, 순수한 폴더명 자체를 기준으로 철저하게 차단합니다.
    const folderName = path.basename(dirPath);
    const excludeFolders = ['.git', 'node_modules', '.gradle', 'build', 'dist'];
    if (excludeFolders.includes(folderName)) return;

    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);

        // 현재 실행 중인 init.js 자기 자신은 절대 건드리지 않고 패스
        if (fullPath === __filename) return;

        if (fs.statSync(fullPath).isDirectory()) {
            globalTextLookup(fullPath);
        } else {
            if (
                file.endsWith('.java') || file.endsWith('.yml') || file.endsWith('.xml') ||
                file.endsWith('.json') || file.endsWith('.js') || file.endsWith('.ts') ||
                file.endsWith('.tsx') || file.endsWith('.html') || file.endsWith('.gradle') ||
                file.endsWith('.md') || file.endsWith('.iml') || file === '.env' || file.startsWith('.env.')
            ) {
                replaceFileContent(fullPath);
            }
        }
    });
}

// Helper: 폴더가 비어있으면 삭제하는 함수
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

// 4. 실행 프로세스
try {
    // [순서 1] 프론트엔드 환경변수 파일 원본 주소 기준 선 생성
    const originalFePath = path.join(__dirname, 'nine-template-frontend');
    if (fs.existsSync(originalFePath)) {
        fs.writeFileSync(path.join(originalFePath, '.env'), 'VITE_API_BASE_URL=\n', 'utf8');
        fs.writeFileSync(path.join(originalFePath, '.env.development'), 'VITE_API_BASE_URL=/api\n', 'utf8');
    }

    // [순서 2] 자바 메인/테스트 파일명 먼저 안전하게 물리 리네임
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

    // [순서 3] 물리적 자바 패키지 폴더 구조 리팩토링 (com.nine.template -> com.새이름.backend)
    const relocateJavaStructure = (rootType) => {
        const oldJavaRoot = path.join(__dirname, `nine-template-backend/src/${rootType}/java/com/nine/template`);
        if (!fs.existsSync(oldJavaRoot)) return;

        const newJavaRoot = path.join(__dirname, `nine-template-backend/src/${rootType}/java/com/${packageNewName}/backend`);
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

    // [순서 4] 백엔드 및 프론트엔드 모듈 내부의 .iml 파일명 물리 리네임
    const oldBackendIml = path.join(__dirname, 'nine-template-backend/nine-template-backend.iml');
    if (fs.existsSync(oldBackendIml)) {
        fs.renameSync(oldBackendIml, path.join(__dirname, `nine-template-backend/${newName}-backend.iml`));
    }

    if (fs.existsSync(path.join(__dirname, 'nine-template-frontend.iml'))) {
        fs.renameSync(path.join(__dirname, 'nine-template-frontend.iml'), path.join(__dirname, `${newName}-frontend.iml`));
    }

    // [순서 5] 껍데기 대형 프로젝트 대단위 폴더명 최종 리네임
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

    // [순서 6] 🎯 물리 배치가 종료되어 완벽하게 정돈된 새 구조를 대상으로 전역 텍스트 정밀 치환!!
    globalTextLookup(__dirname);
    console.log(`✅ 구조 변경 완료된 전체 파일 내 텍스트 정밀 치환 전면 완료`);

    // [순서 7] 초기화 스크립트 자가 폭파
    console.log('\n🔥 초기화 스크립트(init.js)를 자가 삭제합니다.');
    fs.unlinkSync(__filename);

    console.log(`\n🎉 모든 프로젝트 초기화가 오차 없이 완료되었습니다! IntelliJ에서 프로젝트를 열어주세요.`);
} catch (error) {
    console.error('❌ 작업 중 오류 발생:', error);
}