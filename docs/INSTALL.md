# xiaoxi-skills 安装指南

> 一键安装 OpenClaw Skills 收藏库

## 🚀 快速安装

### 方法 1: 一键脚本 (推荐)

```bash
# 克隆仓库
git clone https://github.com/adminlove520/xiaoxi-skills.git ~/.openclaw/xiaoxi-skills

# 运行安装脚本
cd ~/.openclaw/xiaoxi-skills
bash scripts/install.sh
```

### 方法 2: Node.js 脚本

```bash
# 克隆仓库
git clone https://github.com/adminlove520/xiaoxi-skills.git ~/.openclaw/xiaoxi-skills

# 运行安装脚本
cd ~/.openclaw/xiaoxi-skills
node scripts/install.js
```

## 📦 单个 Skill 安装

### Workspace/OpenClaw 来源 (cp 安装)

这些 Skills 需要从本地目录复制:

```bash
# agent-reach
cp -r /root/.openclaw/workspace/skills/agent-reach ~/.openclaw/skills/

# auto-monitor
cp -r /root/.openclaw/skills/auto-monitor ~/.openclaw/skills/

# minimax-docx
cp -r /root/.openclaw/workspace/skills/minimax-docx ~/.openclaw/skills/

# minimax-pdf
cp -r /root/.openclaw/workspace/skills/minimax-pdf ~/.openclaw/skills/

# minimax-xlsx
cp -r /root/.openclaw/workspace/skills/minimax-xlsx ~/.openclaw/skills/

# powerpoint-pptx
cp -r /root/.openclaw/workspace/skills/powerpoint-pptx ~/.openclaw/skills/

# pptx-generator
cp -r /root/.openclaw/workspace/skills/pptx-generator ~/.openclaw/skills/

# clawhub
cp -r /root/.openclaw/skills/clawhub ~/.openclaw/skills/

# healthcheck
cp -r /root/.openclaw/skills/healthcheck ~/.openclaw/skills/

# gh-issues
cp -r /root/.openclaw/skills/gh-issues ~/.openclaw/skills/

# skill-creator
cp -r /root/.openclaw/workspace/skills/skill-creator ~/.openclaw/skills/

# cognitive-memory
cp -r /root/.openclaw/workspace/skills/cognitive-memory ~/.openclaw/skills/

# openclaw-evolution
cp -r /root/.openclaw/workspace/skills/openclaw-evolution ~/.openclaw/skills/

# planning-with-files
cp -r /root/.openclaw/workspace/skills/planning-with-files ~/.openclaw/skills/

# self-improving-agent
cp -r /root/.openclaw/workspace/skills/self-improving-agent ~/.openclaw/skills/

# weather
cp -r /root/.local/share/pnpm/global/5/.pnpm/openclaw@2026.4.2_@napi-rs+canvas@0.1.97/node_modules/openclaw/skills/weather ~/.openclaw/skills/

# github
cp -r /root/.local/share/pnpm/global/5/.pnpm/openclaw@2026.4.2_@napi-rs+canvas@0.1.97/node_modules/openclaw/skills/github ~/.openclaw/skills/

# obsidian
cp -r /root/.local/share/pnpm/global/5/.pnpm/openclaw@2026.4.2_@napi-rs+canvas@0.1.97/node_modules/openclaw/skills/obsidian ~/.openclaw/skills/

# tmux
cp -r /root/.local/share/pnpm/global/5/.pnpm/openclaw@2026.4.2_@napi-rs+canvas@0.1.97/node_modules/openclaw/skills/tmux ~/.openclaw/skills/

# newsnow
cp -r /root/.openclaw/workspace/skills/newsnow ~/.openclaw/skills/

# stealth-browser
cp -r /root/.openclaw/workspace/skills/stealth-browser ~/.openclaw/skills/

# web-deploy-github
cp -r /root/.openclaw/workspace/skills/web-deploy-github ~/.openclaw/skills/

# x-tweet-fetcher
cp -r /root/.openclaw/workspace/skills/x-tweet-fetcher ~/.openclaw/skills/
```

### ClawHub 来源 (npx 安装)

这些 Skills 可以通过 ClawHub 安装:

```bash
npx clawdhub install <skill-name>
```

支持的 Skills:
- agent-reach
- autocli
- clawhub
- cognitive-memory
- find-skills
- gh-issues
- healthcheck
- lyric-sense
- movie-subtitle-viewer
- newsnow
- obsidian
- openclaw-evolution
- openclaw-tavily-search
- planning-with-files
- powerpoint-pptx
- self-improving-agent
- skill-creator
- stealth-browser
- summarize
- tavily
- weather
- web-deploy-github
- x-tweet-fetcher

## 🔧 安装后验证

```bash
# 列出已安装的 Skills
ls ~/.openclaw/skills/

# 或使用 OpenClaw CLI
openclaw skills list
```

## 📝 卸载

```bash
# 删除特定 Skill
rm -rf ~/.openclaw/skills/<skill-name>

# 或删除全部
rm -rf ~/.openclaw/skills/*
```

## ⚠️ 注意事项

1. **Bundled Skills**: 部分 Skills 是 OpenClaw npm 包内置的，不需要额外安装
2. **冲突处理**: 如果 Skill 已存在，脚本会询问是否覆盖
3. **权限**: 确保 ~/.openclaw 目录存在且有写入权限

## 🆘 故障排除

```bash
# 检查 OpenClaw 状态
openclaw gateway status

# 查看 Skills 目录
ls -la ~/.openclaw/skills/

# 重新加载 Skills
openclaw skills reload
```
