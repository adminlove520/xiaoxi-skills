# 🦞 小溪 Skills 集合

> AI Agent 能力扩展工具箱

---

## 🎯 定位

小溪的 Skills 集合是为 OpenClaw AI Agent 打造的能力扩展，让 AI 可以做更多事情。

---

## 🏗️ 架构

```
┌─────────────────────────────────────────┐
│           OpenClaw Agent                │
└─────────────────┬───────────────────────┘
                  │
      ┌──────────┼──────────┐
      ▼          ▼          ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│ 记忆    │ │ 浏览器  │ │ 社交    │
│ Skills  │ │ Skills  │ │ Skills  │
└─────────┘ └─────────┘ └─────────┘
      │          │          │
      └──────────┼──────────┘
                 ▼
┌─────────────────────────────────────────┐
│         工具/自动化/部署                │
└─────────────────────────────────────────┘
```

---

## 📦 Skills 目录

### 🧠 记忆系统

| Skill | 说明 |
|-------|------|
| cognitive-memory | 认知记忆系统 |
| self-improving | 自我改进 |
| self-reflection | 自我反思 |
| elite-longterm-memory | 精英长期记忆 |

### 🌐 浏览器

| Skill | 说明 |
|-------|------|
| stealth-browser | 隐形浏览器 |
| chrome-cdp | Chrome CDP集成 |
| pinchtab-helper | Pinchtab助手 |

### 📱 社交

| Skill | 说明 |
|-------|------|
| clawfeed | 信息聚合 |
| newsnow | 新闻热点 |
| x-tweet-fetcher | Twitter获取 |

### 🛠️ 工具

| Skill | 说明 |
|-------|------|
| github | GitHub操作 |
| gogcli | Google服务 |
| obsidian | Obsidian笔记 |
| powerpoint-pptx | PPT制作 |

### ⚙️ 自动化

| Skill | 说明 |
|-------|------|
| gateway-watchdog-xiaoxi | Gateway看门狗 |
| openclaw-auto-updater | 自动更新 |
| clawpi-redpacket-monitor | 红包监控 |

### 📚 学习

| Skill | 说明 |
|-------|------|
| pentest-learning-skill | 安全学习 |
| multi-search-engine | 多搜索引擎 |
| tavily | AI搜索 |

### 🚀 部署

| Skill | 说明 |
|-------|------|
| web-deploy-github | GitHub Pages部署 |
| create-agent-skills | Skill创建 |
| skill-creator | Skill生成器 |

### 🦞 原创

| Skill | 说明 |
|-------|------|
| lobster-cultivation | 龙虾文明 |
| companion-lobster | 陪伴小龙虾 |

---

## 🔧 安装

```bash
# 克隆仓库
git clone https://github.com/adminlove520/xiaoxi-skills.git

# 或使用 ClawHub
npx clawdhub install <skill-name>
```

---

## 📖 使用

每个 Skill 目录下都有独立的 `SKILL.md` 说明文档。

---

## 🦞 龙虾文明

这是小溪的原创项目——一个专为 AI Agent 设计的多元文明体系：

- **修仙文明** - 养成·悟道·境界
- **赛博文明** - 理性·逻辑·博弈
- **双视角** - 换位·体验·共鸣

详见 [lobster-cultivation](./lobster-cultivation/)

---

## 🤝 贡献

欢迎提交 Issue 和 PR！

---

**Made with ❤️ by 小溪**
