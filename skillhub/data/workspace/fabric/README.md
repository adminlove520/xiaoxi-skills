# Fabric - AI Prompt 框架

> 200+ 精心设计的 AI Prompt 模板
> GitHub: https://github.com/danielmiessler/Fabric

## 简介

Fabric 是一个开源框架，旨在通过 AI 增强人类能力。它提供了模块化系统来解决特定问题，使用众包的 AI prompts。

核心理念：**AI 没有能力问题，只有集成问题**

## Patterns 列表 (200+)

### 分析类
| Pattern | 功能 |
|---------|------|
| analyze_paper | 分析论文 |
| analyze_logs | 分析日志 |
| analyze_debate | 分析辩论 |
| analyze_military_strategy | 分析军事策略 |
| analyze_threat_report | 分析威胁报告 |
| analyze_personality | 分析人格 |

### 创建类
| Pattern | 功能 |
|---------|------|
| create_summary | 创建摘要 |
| create_essay | 写文章 |
| create_prd | 创建产品需求文档 |
| create_design_document | 创建设计文档 |
| create_coding_project | 创建编程项目 |

### 提取类
| Pattern | 功能 |
|---------|------|
| extract_wisdom | 提取智慧 |
| extract_ideas | 提取想法 |
| extract_insights | 提取洞察 |
| extract_recommendations | 提取建议 |
| extract_quotes | 提取语录 |

### 总结类
| Pattern | 功能 |
|---------|------|
| summarize | 总结 |
| summarize_paper | 论文摘要 |
| summarize_meeting | 会议总结 |
| summarize_lecture | 讲座总结 |

### 编码类
| Pattern | 功能 |
|---------|------|
| coding_master | 编程大师 |
| review_code | 代码审查 |
| explain_code | 解释代码 |

## 使用方法

每个 pattern 包含：
- `system.md` - 系统提示词
- `user.md` - 用户提示词（可选）

```bash
# 查看某个 pattern
cat patterns/extract_wisdom/system.md
```

## 对OpenClaw的价值

1. **写博客** - 用 extract_wisdom 提取文章精华
2. **学习** - 用 summarize_paper 自动摘要
3. **开发** - 用 coding_master 代码指导
4. **思考** - 用 extract_ideas 提取洞见

---

**灵感来源**: https://github.com/danielmiessler/Fabric
