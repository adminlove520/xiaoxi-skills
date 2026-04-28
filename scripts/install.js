#!/usr/bin/env node
// xiaoxi-skills 一键安装脚本 (Node.js)

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOME = process.env.HOME || process.env.USERPROFILE;
const SKILLS_DIR = path.join(HOME, '.openclaw', 'skills');
const REPO_DIR = __dirname + '/..';

console.log('🦞 xiaoxi-skills 安装脚本');
console.log('========================\n');

// 创建目标目录
fs.mkdirSync(SKILLS_DIR, { recursive: true });

// Skills 需要从 workspace/openclaw 复制
const CP_SKILLS = [
    'agent-reach',
    'auto-monitor',
    'autocli',
    'building-agentskills',
    'clawhub',
    'clawteam',
    'coding-agent',
    'coding-delegate-agent',
    'dna-memory',
    'find-skills',
    'gh-issues',
    'healthcheck',
    'hermes-agent',
    'holographic-memory',
    'lyric-sense',
    'memory-curator',
    'minimax-docx',
    'minimax-pdf',
    'minimax-xlsx',
    'movie-subtitle-viewer',
    'openclaw-evolution',
    'openclaw-plugin-sdk-migration',
    'openclaw-pr-maintainer',
    'scrapling-official',
    'self-health-monitor',
    'summarize',
    'taskflow',
    'taskflow-inbox-triage',
];

// 从 repo 复制其他 skills
const REPO_SKILLS = [
    'avatar-helper',
    'chrome-cdp',
    'clawbot-market',
    'clawbridge',
    'clawfeed',
    'clawpi-redpacket-monitor',
    'cognitive-memory',
    'companion-lobster',
    'create-agent-skills',
    'cross-bot-communication',
    'elite-longterm-memory',
    'epro-memory',
    'fabric',
    'files',
    'gateway-watchdog-xiaoxi',
    'gogcli',
    'lobster-cultivation',
    'memu',
    'multi-search-engine',
    'myclaw-backup',
    'newsnow',
    'obsidian',
    'openclaw-auto-updater',
    'openclaw-qa',
    'openclaw-tavily-search',
    'pentest-learning-skill',
    'pinchtab-helper',
    'planning-with-files',
    'powerpoint-pptx',
    'pptx-generator',
    'pr-review',
    'proactive-solvr',
    'self-driven',
    'self-improving',
    'self-improving-agent',
    'self-reflection',
    'skill-creator',
    'stealth-browser',
    'superpowers',
    'tavily',
    'web-deploy-github',
    'x-tweet-fetcher',
];

function copyDir(src, dest) {
    fs.rmSync(dest, { recursive: true, force: true });
    fs.cpSync(src, dest, { recursive: true });
}

function installSkill(skill, src) {
    const dest = path.join(SKILLS_DIR, skill);
    if (fs.existsSync(dest)) {
        console.log(`  ⏭️  跳过 ${skill} (已存在)`);
    } else if (fs.existsSync(src)) {
        copyDir(src, dest);
        console.log(`  ✅ ${skill}`);
    } else {
        console.log(`  ⚠️  未找到 ${skill}`);
    }
}

console.log(`📦 安装 CP_SKILLS (${CP_SKILLS.length})...`);
for (const skill of CP_SKILLS) {
    let src = path.join(REPO_DIR, skill);
    if (!fs.existsSync(src)) {
        src = path.join(HOME, '.openclaw', 'workspace', 'skills', skill);
    }
    if (!fs.existsSync(src)) {
        src = path.join(HOME, '.openclaw', 'skills', skill);
    }
    installSkill(skill, src);
}

console.log(`\n📦 安装 REPO_SKILLS (${REPO_SKILLS.length})...`);
for (const skill of REPO_SKILLS) {
    const src = path.join(REPO_DIR, skill);
    installSkill(skill, src);
}

const installed = fs.readdirSync(SKILLS_DIR).length;
console.log(`\n🎉 安装完成!`);
console.log(`📂 Skills 目录: ${SKILLS_DIR}`);
console.log(`📊 已安装: ${installed} 个`);
