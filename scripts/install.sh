#!/bin/bash
# xiaoxi-skills 一键安装脚本
# 适配 Linux/macOS

set -e

FORCE=false
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -f|--force) FORCE=true ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

SKILLS_DIR="$HOME/.openclaw/skills"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "🦞 xiaoxi-skills 安装脚本"
echo "========================"
echo ""

# 创建目标目录
mkdir -p "$SKILLS_DIR"

echo "🔍 正在从仓库发现 Skills..."

# 动态发现包含 SKILL.md 的目录
# 优先级：workspace > openclaw > agents > root
get_priority() {
    if [[ "$1" == *"/workspace/"* ]]; then echo 1
    elif [[ "$1" == *"/openclaw/"* ]]; then echo 2
    elif [[ "$1" == *"/agents/"* ]]; then echo 3
    else echo 4
    fi
}

# 搜集所有包含 SKILL.md 的目录，按优先级从低到高排序
sorted_paths=$(find "$REPO_DIR" -name "SKILL.md" -not -path '*/.*' -exec dirname {} \; | while read -r p; do
    echo "$(get_priority "$p") $p"
done | sort -r | cut -d' ' -f2-)

for skill_path in $sorted_paths; do
    # 排除 repo 根目录
    if [ "$skill_path" == "$REPO_DIR" ]; then continue; fi
    
    skill_name=$(basename "$skill_path")
    dest="$SKILLS_DIR/$skill_name"
    
    if [ -d "$dest" ]; then
        if [ "$FORCE" = true ]; then
            rm -rf "$dest"
            cp -r "$skill_path" "$dest"
            echo "  🔄 覆盖 $skill_name"
        else
            echo "  ⏭️  跳过 $skill_name (已存在)"
        fi
    else
        cp -r "$skill_path" "$dest"
        echo "  ✅ $skill_name"
    fi
done

echo ""
echo "🎉 安装完成!"
echo "📂 Skills 目录: $SKILLS_DIR"
echo "📊 已安装: $(ls -1 "$SKILLS_DIR" 2>/dev/null | wc -l) 个"
