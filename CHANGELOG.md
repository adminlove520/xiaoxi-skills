# 更新日志

## 2026-04-30 - v2.1.0

### 🚀 脚本升级
- **动态发现**: `install.sh` 和 `install.js` 现在会自动扫描仓库中包含 `SKILL.md` 的所有目录，无需手动维护列表。
- **强制覆盖**: 增加 `-f` / `--force` 参数，支持覆盖已安装的 Skill。
- **环境适配**: 统一使用 `$HOME` 变量，提升在不同 Linux/macOS 环境下的兼容性。
- **同步优化**: `sync.sh` 支持动态发现本地新增 Skill 并自动归类同步。

### 🌐 SkillHub 增强
- **GitHub 登录**: 支持通过 GitHub 账号登录 SkillHub。
- **PR 提交**: 支持在线编辑 Skill 并直接向仓库提交 Pull Request。

## 2026-04-28 - v2.0.0

### 🆕 新增
- **30 个新 Skills**: agent-reach, auto-monitor, autocli, clawteam, coding-delegate-agent, dna-memory, find-skills, gh-issues, healthcheck, hermes-agent, holographic-memory, lyric-sense, memory-curator, minimax-docx, minimax-pdf, minimax-xlsx, movie-subtitle-viewer, openclaw-evolution, openclaw-plugin-sdk-migration, openclaw-pr-maintainer, planning-with-files, powerpoint-pptx, pptx-generator, pr-review, scrapling-official, self-health-monitor, self-improving, summarize, taskflow, taskflow-inbox-triage

### 📝 文档
- 新增 `docs/README.md` - 全量 Skills 索引
- 新增 `docs/INSTALL.md` - 详细安装指南
- 新增 `docs/skills/` - 每个 Skill 的使用配置说明（共 62 个）
- 新增 `scripts/install.sh` - Bash 一键安装
- 新增 `scripts/install.js` - Node.js 一键安装
- 新增 `scripts/sync.sh` - 同步脚本

### 🌐 新增
- `skillhub/` - Vercel SkillHub 网站，支持搜索/过滤/一键复制安装命令

### 🔧 修复
- 恢复所有空 Skill 目录（从 hermes/.agents/openclaw-xiaoxi 找回）

### 📊 统计
- Skills 总数: 73
- 有完整文档: 62

---

## 2026-03-15 - v1.0.0

### 初始版本
- 创建 xiaoxi-skills 收藏库
- 整理小溪自用 Skills
