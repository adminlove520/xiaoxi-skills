#!/bin/bash
# xiaoxi-skills 一键安装脚本
# 适配 Linux/macOS

set -e

SKILLS_DIR="$HOME/.openclaw/skills"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "🦞 xiaoxi-skills 安装脚本"
echo "========================"
echo ""

# 创建目标目录
mkdir -p "$SKILLS_DIR"

# Skills 需要从 workspace/openclaw 复制
CP_SKILLS=(
    "agent-reach"
    "auto-monitor"
    "autocli"
    "building-agentskills"
    "clawhub"
    "clawteam"
    "coding-agent"
    "coding-delegate-agent"
    "dna-memory"
    "find-skills"
    "gh-issues"
    "healthcheck"
    "hermes-agent"
    "holographic-memory"
    "lyric-sense"
    "memory-curator"
    "minimax-docx"
    "minimax-pdf"
    "minimax-xlsx"
    "movie-subtitle-viewer"
    "openclaw-evolution"
    "openclaw-plugin-sdk-migration"
    "openclaw-pr-maintainer"
    "scrapling-official"
    "self-health-monitor"
    "summarize"
    "taskflow"
    "taskflow-inbox-triage"
)

# 从 repo 复制其他 skills
REPO_SKILLS=(
    "avatar-helper"
    "chrome-cdp"
    "clawbot-market"
    "clawbridge"
    "clawfeed"
    "clawpi-redpacket-monitor"
    "cognitive-memory"
    "companion-lobster"
    "create-agent-skills"
    "cross-bot-communication"
    "elite-longterm-memory"
    "epro-memory"
    "fabric"
    "files"
    "gateway-watchdog-xiaoxi"
    "gogcli"
    "lobster-cultivation"
    "memu"
    "multi-search-engine"
    "myclaw-backup"
    "newsnow"
    "obsidian"
    "openclaw-auto-updater"
    "openclaw-qa"
    "openclaw-tavily-search"
    "pentest-learning-skill"
    "pinchtab-helper"
    "planning-with-files"
    "powerpoint-pptx"
    "pptx-generator"
    "pr-review"
    "proactive-solvr"
    "self-driven"
    "self-improving"
    "self-improving-agent"
    "self-reflection"
    "skill-creator"
    "stealth-browser"
    "superpowers"
    "tavily"
    "web-deploy-github"
    "x-tweet-fetcher"
)

echo "📦 安装 CP_SKILLS ($(echo ${#CP_SKILLS[@]}))..."
for skill in "${CP_SKILLS[@]}"; do
    src=""
    if [ -d "$HOME/.openclaw/workspace/skills/$skill" ]; then
        src="$HOME/.openclaw/workspace/skills/$skill"
    elif [ -d "$HOME/.openclaw/skills/$skill" ]; then
        src="$HOME/.openclaw/skills/$skill"
    elif [ -d "$REPO_DIR/$skill" ]; then
        src="$REPO_DIR/$skill"
    fi
    
    if [ -n "$src" ]; then
        if [ -d "$SKILLS_DIR/$skill" ]; then
            echo "  ⏭️  跳过 $skill (已存在)"
        else
            cp -r "$src" "$SKILLS_DIR/$skill"
            echo "  ✅ $skill"
        fi
    else
        echo "  ⚠️  未找到 $skill"
    fi
done

echo ""
echo "📦 安装 REPO_SKILLS ($(echo ${#REPO_SKILLS[@]}))..."
for skill in "${REPO_SKILLS[@]}"; do
    src="$REPO_DIR/$skill"
    if [ -d "$src" ]; then
        if [ -d "$SKILLS_DIR/$skill" ]; then
            echo "  ⏭️  跳过 $skill (已存在)"
        else
            cp -r "$src" "$SKILLS_DIR/$skill"
            echo "  ✅ $skill"
        fi
    else
        echo "  ⚠️  未找到 $skill"
    fi
done

echo ""
echo "🎉 安装完成!"
echo "📂 Skills 目录: $SKILLS_DIR"
echo "📊 已安装: $(ls -1 "$SKILLS_DIR" | wc -l) 个"
