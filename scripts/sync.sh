#!/bin/bash
# xiaoxi-skills 同步脚本
# 从本机同步 Skill 到 GitHub 仓库

set -e

REPO_DIR="/tmp/xiaoxi-skills"
WORKSPACE_SKILLS="/root/.openclaw/workspace/skills"
OPENCLAW_SKILLS="/root/.openclaw/skills"

echo "🦞 xiaoxi-skills 同步脚本"
echo "========================"
echo ""

# 同步 workspace skills
echo "📦 同步 workspace skills..."
for skill in $(ls "$WORKSPACE_SKILLS" 2>/dev/null); do
    src="$WORKSPACE_SKILLS/$skill"
    dest="$REPO_DIR/$skill"
    if [ -d "$src" ]; then
        cp -r "$src" "$dest"
        echo "  ✅ $skill"
    fi
done

# 同步 openclaw skills
echo ""
echo "📦 同步 openclaw skills..."
for skill in $(ls "$OPENCLAW_SKILLS" 2>/dev/null); do
    src="$OPENCLAW_SKILLS/$skill"
    dest="$REPO_DIR/$skill"
    # 只复制 workspace 中没有的
    if [ -d "$src" ] && [ ! -d "$WORKSPACE_SKILLS/$skill" ]; then
        cp -r "$src" "$dest"
        echo "  ✅ $skill"
    fi
done

echo ""
echo "🎉 同步完成!"
echo "📂 仓库目录: $REPO_DIR"
echo "📊 共计: $(ls -1 "$REPO_DIR" | grep -v '\.md$' | wc -l) 个 skills"
echo ""
echo "下一步:"
echo "  cd $REPO_DIR"
echo "  git add ."
echo "  git commit -m 'sync: $(date +%Y-%m-%d)'"
echo "  git push"
