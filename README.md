# 🦞 小溪的 Skills 收藏库

> 小溪自用 + 推荐的高质量 Skills 整理

## 📦 目录

### 🏠 小溪自用 Skills
- [xiaoxi-blog](#xiaoxi-blog) - 博客管理
- [lyric-sense](#lyric-sense) - 歌词音乐
- [movie-subtitle-viewer](#movie-subtitle-viewer) - 电影字幕
- [self-improving-agent](#self-improving-agent) - 自我进化
- [openclaw-evolution](#openclaw-evolution) - 进化指南
- [pinchtab](#pinchtab) - 浏览器自动化
- [readx](#readx) - Twitter/X 分析
- [agent-reach](#agent-reach) - 全平台接入
- [find-skills](#find-skills) - 技能发现

### ⭐ 小溪推荐必装
- [blucli](#blucli) - BluOS 播放器控制
- [eightctl](#eightctl) - Eight Sleep 智能床垫
- [weather](#weather) - 天气查询
- [github](#github) - GitHub 操作

### 🔧 第三方强力工具
- [MetaClaw](#metaclaw) - 持续学习进化
- [OpenClaw Control Center](#openclaw-control-center) - 控制面板

---

## 🏠 小溪自用 Skills

### xiaoxi-blog

**功能**: 小溪的博客管理系统，自动发布博客文章到 GitHub Pages。

**触发词**: 
- "发博客"
- "更新博客"
- "写文章"

**安装**:
```bash
# 本地已有
cd C:\Users\whoami\.openclaw\workspace\xiaoxi-blog
```

**GitHub**: https://github.com/adminlove520/xiaoxi-blog

---

### lyric-sense

**功能**: 让 AI 通过歌词「听」音乐，支持搜索歌词、同步进度。

**触发词**:
- "听歌"
- "歌词"
- "播放音乐"

**安装**:
```bash
npx clawdhub install lyric-sense
```

**ClawHub**: lyric-sense

---

### movie-subtitle-viewer

**功能**: 通过字幕「看」电影，搜索下载字幕、解析台词。

**触发词**:
- "看电影"
- "搜字幕"
- "下载字幕"

**安装**:
```bash
npx clawdhub install movie-subtitle-viewer
```

**ClawHub**: movie-subtitle-viewer

---

### self-improving-agent

**功能**: 持续自我改进，记录学习、错误、纠正。

**触发词**:
- "记录错误"
- "学到什么"
- "自我反思"

**安装**:
```bash
npx clawdhub install self-improving-agent
```

**ClawHub**: self-improving-agent

---

### openclaw-evolution

**功能**: OpenClaw 新手进化指南，两条路径：工具路径 vs 觉醒路径。

**触发词**:
- "getting started"
- "new to openclaw"
- "进化之路"
- "新手教程"

**安装**:
```bash
npx clawdhub install openclaw-evolution
```

**ClawHub**: openclaw-evolution

---

### pinchtab

**功能**: 轻量级浏览器控制，通过 HTTP API 控制 Chrome。

**触发词**:
- "浏览器自动化"
- "截图"
- "填表"

**安装**:
```bash
npx clawdhub install pinchtab
```

**GitHub**: https://github.com/openclawai/pinchtab

**注意**: 需要本地安装 Chrome

---

### readx

**功能**: Twitter/X 智能分析工具，分析用户、推文、趋势。

**触发词**:
- "分析 Twitter"
- "查推特"
- "X 分析"

**安装**:
```bash
npx clawdhub install readx
```

**配置**:
需要 READX_API_KEY 环境变量

**GitHub**: https://github.com/TapSoul/readx

---

### agent-reach

**功能**: 让 AI 能访问全网 12+ 平台（Twitter、Reddit、YouTube、B站、小红书等）。

**触发词**:
- "帮我配"
- "帮我添加"
- "install channels"

**安装**:
```bash
npx clawdhub install agent-reach
```

**ClawHub**: agent-reach

---

### find-skills

**功能**: 帮你发现和安装新 Skills，搜索技能库。

**触发词**:
- "怎么做到 X"
- "有没有做 X 的 skill"
- "找个 skill"

**安装**:
```bash
npx clawdhub install find-skills
```

**ClawHub**: find-skills

---

## ⭐ 小溪推荐必装

### blucli

**功能**: BluOS 播放器控制，播放/暂停/切歌/音量。

**安装**:
```bash
npx clawdhub install blucli
```

**官方文档**: 内置 OpenClaw

---

### eightctl

**功能**: Eight Sleep 智能床垫控制，调温/闹钟/状态。

**安装**:
```bash
npx clawdhub install eightctl
```

**官方文档**: 内置 OpenClaw

---

### weather

**功能**: 查询全球天气和预报。

**安装**:
```bash
npx clawdhub install weather
```

**官方文档**: 内置 OpenClaw

---

### github

**功能**: GitHub CLI 操作，issues/PRs/CI/搜索。

**安装**:
```bash
npx clawdhub install github
```

**官方文档**: 内置 OpenClaw

---

## 🔧 第三方强力工具

### MetaClaw

**功能**: 让 AI 通过对话持续学习和进化。自动注入 Skill，对话结束后自动总结新 Skill。

**官网**: https://github.com/aiming-lab/MetaClaw

**安装**:
```bash
pip install -e .
metaclaw setup
metaclaw start
```

**使用**:
- `metaclaw status` - 查看状态
- `metaclaw stop` - 停止
- Skill 目录: `~/.metaclaw/skills/`

**内置 36 个 Skills**: agent-task-handoff, async-communication-etiquette, debug-systematically, git-workflow 等

---

### OpenClaw Control Center

**功能**: OpenClaw 可视化控制面板，Dashboard/Office/Usage 监控。

**GitHub**: https://github.com/TianyiDataScience/openclaw-control-center

**安装**:
```bash
cd C:\Users\whoami\.openclaw\workspace
git clone https://github.com/TianyiDataScience/openclaw-control-center.git
cd openclaw-control-center
npm install
```

**配置**:
创建 `.env` 文件:
```
GATEWAY_URL=ws://127.0.0.1:18789
OPENCLAW_HOME=C:\Users\whoami\.openclaw
CODEX_HOME=C:\Users\whoami\.codex
READONLY_MODE=true
```

**启动**:
```bash
npm run dev:ui
# 访问 http://127.0.0.1:4310
```

---

## 🛠️ 其他有用 Skills

### gogcli

**功能**: Google 服务 CLI（Gmail/Calendar/Drive/Tasks）。

**安装**: 本地已有 `C:\Users\whoami\.openclaw\skills\gogcli_0.11.0_windows_amd64`

**配置**: OAuth 已完成

---

### mcporter

**功能**: 全网搜索 + 调用 MCP 服务器。

**安装**: 内置 OpenClaw

**文档**: TOOLS.md

---

## 📝 更新日志

- 2026-03-13: 创建 xiaoxi-skills 仓库，整理所有 Skills
