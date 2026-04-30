---
name: harness-creator
description: >
  创建生产级 Harness 脚手架的技能。
  用于快速为一个新项目或工作区创建 AGENTS.md、feature_list.json、init.sh、claude-progress.md 等核心文件。
  基于 WalkingLabs Learn Harness Engineering 课程。
triggers:
  - 创建 harness
  - 初始化项目脚手架
  - 创建 AGENTS.md
  - 创建 feature list
  - 项目开工准备
  - 帮我搭 harness
---

# Harness Creator

## 功能

快速为一个项目创建 Harness Engineering 脚手架文件。

## 使用场景

- 新项目开工
- 当前项目缺少 AGENTS.md 或其他 harness 文件
- 需要标准化 agent 工作流程

## 创建的文件

### AGENTS.md
根指令文件。定义：
- 开工流程（开工前读什么）
- 工作规则（做什么、禁止做什么）
- 完成定义（什么叫"做完"）
- 验证标准

### feature_list.json
机器可读的功能清单。每个功能包含：
- id、priority、area、title
- user_visible_behavior
- status (not_started/in_progress/blocked/passing)
- verification 步骤
- evidence (验证通过后记录)

### init.sh
启动脚本：
- INSTALL_CMD - 依赖安装
- VERIFY_CMD - 基础验证
- START_CMD - 开发服务器启动

### claude-progress.md
进度日志。记录：
- 当前已验证状态
- 当前最高优先级
- 会话记录

## 使用方法

对项目目录运行：

```bash
# 在项目根目录执行
cat > AGENTS.md << 'EOF'
# 项目名

## 开工流程
1. 读取 feature_list.json 了解当前状态
2. 读取 claude-progress.md 了解进度
3. 检查未完成功能的验证状态

## 完成定义
- [ ] 测试通过
- [ ] 代码通过 lint
- [ ] 文档已更新
EOF

cat > feature_list.json << 'EOF'
{
  "features": []
}
EOF
```

## 五层防御检查清单

创建 harness 时，确保：

1. **任务规范层** - 完成定义是否明确可验证？
2. **上下文供给层** - feature_list 是否包含所有关键信息？
3. **执行环境层** - init.sh 是否覆盖依赖安装？
4. **验证反馈层** - 每项功能是否有验证步骤？
5. **状态管理层** - claude-progress 是否记录跨会话状态？

## 参考

- https://walkinglabs.github.io/learn-harness-engineering/zh/resources/templates/
- OpenAI: Harness engineering
- Anthropic: Effective harnesses for long-running agents