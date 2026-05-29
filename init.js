import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newName = path.basename(__dirname);
const oldName = 'nine-template';
const pascalOldName = 'NineTemplate';

const pascalNewName = newName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

const packageNewName = newName.split('-').join('').toLowerCase();

console.log(`🚀 [${newName}] 기반 정밀 리팩토링 초기화를 시작합니다...`);

function replaceFileContent(fullPath) {
    if (!fs.existsSync(fullPath)) return;

    let content = fs.readFileSync(fullPath, 'utf8');

    // 1️⃣ [정밀 타격] 우리 프로젝트 메인 패키지 뼈대 치환
    content = content.split('com.nine.template').join(`com.${packageNewName}`);

    // 2️⃣ [버전 가변형 방어선] 정규식을 사용해서 com.nine-template-lab:nine-mu:뒤에
    // 어떤 버전 숫자가 오든(0.0.12 등) 통째로 추출해서 안전하게 보관합니다.
    const libRegex = /com\.nine-template-lab:nine-mu:[\d\.]+/g;
    const matchedLibs = content.match(libRegex);
    const originalLibString = matchedLibs ? matchedLibs[0] : null;

    const LIB_MARKER = '___NINE_MU_LIBRARY_PROTECTED_MARKER___';
    if (originalLibString) {
        // 실제 빌드 파일에 있는 주소를 마커로 대피시킴
        content = content.split(originalLibString).join(LIB_MARKER);
    }

    // 3️⃣ [일반 치환] 프로젝트 이름 무차별 변환 (이때 마커는 안전하게 보호됨)
    content = content.split('com.nine').join(`com.${packageNewName}`);
    content = content.split('nine-template-backend').join(`${newName}-backend`);
    content = content.split('nine-template-frontend').join(`${newName}-frontend`);
    content = content.split('nine-template').join(newName);
    content = content.split(pascalOldName).join(pascalNewName);

    // 4️⃣ [최종 복구] 보관해뒀던 진짜 버전이 포함된 원본 주소로 완벽 복구
    if (originalLibString) {
        content = content.split(LIB_MARKER).join(originalLibString);
    }

    // 5️⃣ 인텔리제이 런 실행 구성 프로필 변환
    if (fullPath.includes('runConfigurations')) {
        content = content.split('-Dspring.profiles.active=test').join('-Dspring.profiles.active=local');
    }

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
                file.endsWith('.md') || file.endsWith('.iml') || // .iml 내부 텍스트 치환 허용
                file === '.env' || file.startsWith('.env.')
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

            // 🎯 결정적 주범 해결: 맨 뒤에 붙어있던 /backend 를 완벽하게 삭제했습니다!
            // 결과적으로 src/main/java/com/testapp 폴더가 생성됩니다.
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

    // 🎯 [물리 변경 순서 보장] 최상위 루트에 있는 .iml 파일명들을 먼저 안전하게 리네임합니다.
    const oldBackendImlPath = path.join(__dirname, `nine-template-backend.iml`);
    const newBackendImlPath = path.join(__dirname, `${newName}-backend.iml`);
    if (fs.existsSync(oldBackendImlPath)) {
        fs.renameSync(oldBackendImlPath, newBackendImlPath);
        console.log(`✨ 백엔드 .iml 파일명 리네임 완료: ${newName}-backend.iml`);
    }

    const oldFrontendImlPath = path.join(__dirname, 'nine-template-frontend.iml');
    const newFrontendImlPath = path.join(__dirname, `${newName}-frontend.iml`);
    if (fs.existsSync(oldFrontendImlPath)) {
        fs.renameSync(oldFrontendImlPath, newFrontendImlPath);
        console.log(`✨ 프론트엔드 .iml 파일명 리네임 완료: ${newName}-frontend.iml`);
    }

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

    // 모든 물리 구조 변경(폴더명, 파일명, 패키지 이동)이 끝난 상태에서 전역 텍스트 정밀 치환 완수
    globalTextLookup(__dirname);
    console.log(`✅ 모든 대상 파일 내 텍스트 정밀 치환 완료`);

    // 초기화 완료 후 스크립트 자가 삭제
    fs.unlinkSync(__filename);
    console.log(`\n🎉 모든 프로젝트 초기화가 완료되었습니다. IntelliJ에서 프로젝트를 열어주세요.`);
} catch (error) {
    console.error('❌ 작업 중 오류 발생:', error);
}