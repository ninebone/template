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

// 하이픈(-) 제거하고 소문자 패키지명 가공 (예: testapp)
const packageNewName = newName.split('-').join('').toLowerCase();

console.log(`🚀 [${newName}] 기반 정밀 리팩토링 초기화를 시작합니다...`);

// 2. 텍스트 일괄 치환 함수
function replaceFileContent(fullPath) {
    if (!fs.existsSync(fullPath)) return;

    let content = fs.readFileSync(fullPath, 'utf8');

    // 1. 가장 길고 복잡한 인텔리제이 모듈 연동용 고유 문자열 우선 치환 (범위가 큰 것부터)
    content = content.split('nine-template.nine-template-backend.main').join(`${newName}.${newName}-backend.main`);
    content = content.split('nine-template.nine-template-frontend.main').join(`${newName}.${newName}-frontend.main`);
    content = content.split('nine-template-backend.main').join(`${newName}-backend.main`);
    content = content.split('nine-template.main').join(`${newName}.main`);

    // 2. 패키지 및 서브폴더 명칭 정밀 치환
    content = content.split('com.nine.template').join(`com.${packageNewName}.backend`);
    content = content.split('nine-template-backend').join(`${newName}-backend`);
    content = content.split('nine-template-frontend').join(`${newName}-frontend`);

    // 3. 가장 광범위한 기본 단어 치환을 '맨 마지막'에 배치 (앞에서 쪼개지는 것 방지)
    content = content.split('nine-template').join(newName);
    content = content.split(pascalOldName).join(pascalNewName);

    // IntelliJ 실행 구성 프로필 자동 치환 (test -> local)
    if (fullPath.includes('runConfigurations')) {
        content = content.split('-Dspring.profiles.active=test').join('-Dspring.profiles.active=local');
        content = content.split('nine-template').join(newName);
    }

    fs.writeFileSync(fullPath, content, 'utf8');
}

// 3. 디렉토리 재귀 탐색하며 모든 텍스트 파일 치환하는 함수
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

// 4. 실행 프로세스
try {
    // [순서 1] 프론트엔드 환경변수 파일 원본 주소 기준 선 생성
    const originalFePath = path.join(__dirname, 'nine-template-frontend');
    if (fs.existsSync(originalFePath)) {
        fs.writeFileSync(path.join(originalFePath, '.env'), 'VITE_API_BASE_URL=\n', 'utf8');
        fs.writeFileSync(path.join(originalFePath, '.env.development'), 'VITE_API_BASE_URL=/api\n', 'utf8');
    }

    // [순서 2] 🎯 복사 테스트 시 딸려오는 꼬임의 근원(modules.xml 및 옛날 .iml)을 치환 전에 선제 삭제
    //const ideaModulesXml = path.join(__dirname, '.idea/modules.xml');
    //if (fs.existsSync(ideaModulesXml)) {
    //    fs.unlinkSync(ideaModulesXml);
    //}
    const ideaModulesDir = path.join(__dirname, '.idea/modules');
    if (fs.existsSync(ideaModulesDir)) {
        fs.rmSync(ideaModulesDir, { recursive: true, force: true });
    }
    const oldBackendIml = path.join(__dirname, 'nine-template-backend/nine-template-backend.iml');
    if (fs.existsSync(oldBackendIml)) {
        fs.unlinkSync(oldBackendIml);
    }
    const oldFrontendIml = path.join(__dirname, 'nine-template-frontend.iml');
    if (fs.existsSync(oldFrontendIml)) {
        fs.unlinkSync(oldFrontendIml);
    }



    // [순서 4] 자바 메인/테스트 파일명 먼저 안전하게 물리 리네임
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

    // [순서 5] 물리적 자바 패키지 폴더 구조 리팩토링 (com.nine.template -> com.새이름.backend)
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

    // [순서 6] 대형 프로젝트 대단위 폴더명 최종 물리 변경
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

    // [순서 7] 안전 설계 정방향: 물리적 구조가 유지된 상태에서 전역 텍스트 정밀 치환 완수
        globalTextLookup(__dirname);
        console.log(`✅ 모든 대상 파일 내 텍스트 정밀 치환 완료`);

    // [순서 8] 초기화 완료 후 스크립트 자가 삭제
    console.log('\n🔥 초기화 스크립트(init.js)를 자가 삭제합니다.');
    fs.unlinkSync(__filename);

    console.log(`\n🎉 모든 프로젝트 초기화가 완료되었습니다. IntelliJ에서 프로젝트를 열어주세요.`);
} catch (error) {
    console.error('❌ 작업 중 오류 발생:', error);
}