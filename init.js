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

    // 🎯 [치명적 핵심 추가] com.nine-template-lab 같은 외부 고정 라이브러리 주소는
    // 나중에 치환되더라도 최종적으로 원본 주소를 유지하도록 임시 보관 처리하거나,
    // 혹은 애초에 치환 대상에서 빗겨나가게 방어합니다.

    content = content.split('com.nine.template').join(`com.${packageNewName}.backend`);
    content = content.split('com.nine').join(`com.${packageNewName}`);
    content = content.split('nine-template-backend').join(`${newName}-backend`);
    content = content.split('nine-template-frontend').join(`${newName}-frontend`);

    // 만약 dependencies 내부가 test-app-lab으로 깨졌다면 원래 주소로 강제 롤백시킵니다.
    content = content.split('com.testapp-lab:nine-mu').join('com.nine-template-lab:nine-mu'); // 👈 방어선 구축

    content = content.split('nine-template').join(newName);
    content = content.split(pascalOldName).join(pascalNewName);

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