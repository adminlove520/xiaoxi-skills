#!/usr/bin/env node
// xiaoxi-skills 一键安装脚本 (Node.js)

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || process.env.USERPROFILE;
const SKILLS_DIR = path.join(HOME, '.openclaw', 'skills');
const REPO_DIR = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const FORCE = args.includes('-f') || args.includes('--force');

console.log('🦞 xiaoxi-skills 安装脚本');
console.log('========================\n');

// 创建目标目录
if (!fs.existsSync(SKILLS_DIR)) {
    fs.mkdirSync(SKILLS_DIR, { recursive: true });
}

console.log('🔍 正在从仓库发现 Skills...');

function findSkills(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        try {
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                if (file.startsWith('.') || file === 'node_modules') return;
                if (fs.existsSync(path.join(filePath, 'SKILL.md'))) {
                    results.push(filePath);
                } else {
                    results = results.concat(findSkills(filePath));
                }
            }
        } catch (e) {
            // Ignore errors for system files/permissions
        }
    });
    return results;
}

const foundPaths = findSkills(REPO_DIR);

function getPriority(p) {
    const normP = p.split(path.sep).join('/');
    if (normP.includes('/workspace/')) return 1;
    if (normP.includes('/openclaw/')) return 2;
    if (normP.includes('/agents/')) return 3;
    return 4;
}

// 排序：优先级从低到高 (4, 3, 2, 1)
// 这样高优先级的 (1) 会在后面处理，如果 FORCE=true 则覆盖前面的
const sortedPaths = foundPaths
    .filter(p => p !== REPO_DIR)
    .sort((a, b) => getPriority(b) - getPriority(a));

let installedCount = 0;
sortedPaths.forEach(skillPath => {
    const skillName = path.basename(skillPath);
    const dest = path.join(SKILLS_DIR, skillName);

    if (fs.existsSync(dest)) {
        if (FORCE) {
            fs.rmSync(dest, { recursive: true, force: true });
            fs.cpSync(skillPath, dest, { recursive: true });
            console.log(`  🔄 覆盖 ${skillName}`);
            installedCount++;
        } else {
            console.log(`  ⏭️  跳过 ${skillName} (已存在)`);
        }
    } else {
        fs.cpSync(skillPath, dest, { recursive: true });
        console.log(`  ✅ ${skillName}`);
        installedCount++;
    }
});

const totalInDir = fs.readdirSync(SKILLS_DIR).length;
console.log(`\n🎉 安装完成!`);
console.log(`📂 Skills 目录: ${SKILLS_DIR}`);
console.log(`📊 本次操作: ${installedCount} 个, 总计已安装: ${totalInDir} 个`);
