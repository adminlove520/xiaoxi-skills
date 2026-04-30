#!/bin/bash
# xiaoxi-skills 同步脚本
# 从本机同步 Skill 到 GitHub 仓库

set -e

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
WORKSPACE_SKILLS="$HOME/.openclaw/workspace/skills"
OPENCLAW_SKILLS="$HOME/.openclaw/skills"

echo "🦞 xiaoxi-skills 同步脚本"
echo "========================"
echo ""

sync_skill() {
    local src="$1"
    local skill_name=$(basename "$src")
    local type="$2" # workspace or openclaw
    
    # 决定在 repo 中的目标目录
    local dest_dir="$REPO_DIR/skillhub/data/$type"
    mkdir -p "$dest_dir"
    
    local dest="$dest_dir/$skill_name"
    
    if [ -d "$dest" ]; then
        echo "  🔄 同步 $skill_name -> $type/"
    else
        echo "  🆕 新增 $skill_name -> $type/"
    fi
    
    rm -rf "$dest"
    cp -r "$src" "$dest"
}

# 发现 workspace skills
if [ -d "$WORKSPACE_SKILLS" ]; then
    echo "📦 正在同步 workspace skills..."
    find "$WORKSPACE_SKILLS" -maxdepth 2 -name "SKILL.md" -exec dirname {} \; | while read -r skill_path; do
        sync_skill "$skill_path" "workspace"
    done
fi

# 发现 openclaw skills
if [ -d "$OPENCLAW_SKILLS" ]; then
    echo ""
    echo "📦 正在同步 openclaw skills..."
    find "$OPENCLAW_SKILLS" -maxdepth 2 -name "SKILL.md" -exec dirname {} \; | while read -r skill_path; do
        skill_name=$(basename "$skill_path")
        # 如果已经在 workspace 中同步过了，就不在 openclaw 中重复同步（假设 workspace 优先级高）
        if [ ! -d "$REPO_DIR/skillhub/data/workspace/$skill_name" ]; then
            sync_skill "$skill_path" "openclaw"
        else
            echo "  ⏭️  跳过 $skill_name (已在 workspace)"
        fi
    done
fi

echo ""
echo "🎉 同步完成!"
echo "📂 仓库目录: $REPO_DIR"
echo "📊 当前仓库 Skill 统计:"
echo "  - Workspace: $(ls -1 "$REPO_DIR/skillhub/data/workspace" 2>/dev/null | wc -l) 个"
echo "  - OpenClaw: $(ls -1 "$REPO_DIR/skillhub/data/openclaw" 2>/dev/null | wc -l) 个"
echo "  - Agents: $(ls -1 "$REPO_DIR/skillhub/data/agents" 2>/dev/null | wc -l) 个"
echo ""
echo "下一步:"
echo "  cd $REPO_DIR"
echo "  git add ."
echo "  git commit -m 'sync: $(date +%Y-%m-%d)'"
echo "  git push"
