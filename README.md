# 🦞 xiaoxi-skills

> 小溪自用 + 推荐的高质量 Skills 收藏库 | 持续更新

本项目是一个面向 OpenClaw, Codex 和 AI Agent 生态的技能集合，并提供了一个现代化的 **SkillHub** 平台用于浏览、搜索和发布技能。

## 📦 快速安装

```bash
git clone https://github.com/adminlove520/xiaoxi-skills.git
cd xiaoxi-skills
bash scripts/install.sh
```

或使用 Node.js 版本：
```bash
node scripts/install.js
```

## 🌐 SkillHub 平台

**SkillHub** 是基于 Next.js 构建的高性能技能展示平台：
- **在线访问**: [xiaoxi-skills.vercel.app](https://xiaoxi-skills.vercel.app)
- **动态发现**: 自动扫描仓库目录（workspace/openclaw/agents），动态提取 `SKILL.md` 中的元数据，消除手动维护成本。
- **全球发现**: 集成 **ClawHub**, **GitHub** 和 **skill.sh** API，一站式搜索全球技能。
- **国际化 (i18n)**: 支持中/英双语无缝切换，适配全球开发者需求。
- **实时排行**: 基于多维加权算法的趋势排行榜。
- **GitHub 集成**: 支持 GitHub OAuth 登录，并提供仿 ClawHub 风格的**仓库导入**投稿功能。

## 🛠️ 项目架构

```text
.
├── skillhub/           # Next.js Web 平台
│   ├── data/
│   │   ├── agents/     # 代理类技能
│   │   ├── openclaw/   # OpenClaw 核心扩展技能
│   │   └── workspace/  # 工作流与生产力技能
│   ├── app/
│   │   ├── api/        # 优化过的并行 API 层
│   │   └── components/ # 模块化 React 组件
├── scripts/            # 自动化安装与同步脚本
└── README.md
```

## 🚀 核心优化 (v2.3.0)

1.  **全面国际化**: 全站支持中英双语切换，代码结构适配动态语言包加载。
2.  **极致稳定性**: 
    - 解决了 GitHub OAuth 流程中所有的 404 及跨域报错。
    - 针对 `client_id` 的拼写歧义（1/l）增加了自动纠错映射。
3.  **智能提取**: 投稿系统支持从任意 GitHub 仓库智能识别并提取 `SKILL.md` 的核心元数据。
4.  **性能飞跃**: API 层全面采用 `Promise.all` 并行处理，显著提升了加载速度。

## 📝 贡献指南

1.  登录 SkillHub。
2.  点击 **Submit** 页面。
3.  选择你的 GitHub 仓库或手动输入 `SKILL.md` 内容。
4.  提交后系统会自动创建 Pull Request。

---
© 2026 Xiaoxi Skills. Built for the AI Agent Era.
