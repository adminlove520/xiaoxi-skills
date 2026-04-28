# 🦞 xiaoxi-skills

> 小溪自用 + 推荐的高质量 Skills 收藏库 | 持续更新

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

## 📚 文档目录

| 目录 | 说明 |
|------|------|
| docs/README.md | 全量 Skills 索引 |
| docs/INSTALL.md | 详细安装指南 |
| docs/skills/ | 每个 Skill 的使用配置说明 |

## 🎯 Skills 统计

| 来源 | 数量 |
|------|------|
| workspace | 44 |
| openclaw | 24 |
| repo | 73 |
| **总计** | **73** |

## 📖 查看某个 Skill 的文档

```bash
# 列出所有 Skill
ls docs/skills/

# 查看具体 Skill
cat docs/skills/agent-reach.md
cat docs/skills/clawhub.md
cat docs/skills/minimax-docx.md
```

## 🔧 常用命令

```bash
# 安装单个 Skill
cp -r <skill-dir> ~/.openclaw/skills/

# 查看已安装 Skills
openclaw skills list

# 更新 Skills
bash scripts/sync.sh
```

## 🌐 在线资源

- **SkillHub**: https://xiaoxi-skills.vercel.app （浏览所有 Skills）
- **GitHub**: https://github.com/adminlove520/xiaoxi-skills

## 📝 CHANGELOG

- 2026-04-28: 新增 30 个 Skills，整理文档和安装脚本，添加 Vercel SkillHub
- 2026-03-15: 初始化收藏库
