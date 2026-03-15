# memU Skill

> 集成 memU Cloud API 的主动记忆系统

## 触发条件

当用户提到以下内容时使用：
- "记住xxx"
- "我之前说过xxx吗"
- "我的偏好是xxx"
- "学习这个"
- 或者需要主动回忆之前对话内容时

## 功能

### 1. memorize - 记忆学习

将当前对话或内容注册到 memU 进行持续学习。

**API**: `POST https://api.memu.so/api/v3/memory/memorize`

**Headers**:
```
Authorization: Bearer {memU_api_key}
Content-Type: application/json
```

**Body**:
```json
{
  "resource_url": "conversation://{session_id}",
  "modality": "conversation",
  "user": {"user_id": "{user_id}"}
}
```

**Response**:
```json
{
  "resource": {...},
  "items": [...],
  "categories": [...]
}
```

### 2. retrieve - 记忆检索

查询已有的记忆，支持 RAG（快速）和 LLM（深度推理）两种模式。

**API**: `POST https://api.memu.so/api/v3/memory/retrieve`

**Headers**: 同上

**Body (RAG 模式)**:
```json
{
  "queries": [
    {"role": "user", "content": {"text": "查询内容"}}
  ],
  "method": "rag",
  "where": {"user_id": "{user_id}"}
}
```

**Body (LLM 模式)**:
```json
{
  "queries": [
    {"role": "user", "content": {"text": "查询内容"}}
  ],
  "method": "llm",
  "where": {"user_id": "{user_id}"}
}
```

### 3. categories - 分类列表

列出所有自动生成的记忆分类。

**API**: `POST https://api.memu.so/api/v3/memory/categories`

## 配置

API Key 已配置：
- Key: `mu_R7_8GJyOhin_Hg7kRBQaPtafBTY0NLgsQO1U94tJGE33NjGgkdZGIzEjNHMtkt3R7d5UcYb5N2vrsT4Dvg76kqAxhJG0Nl18yGX6jQ`
- Base URL: `https://api.memu.so`

## 使用示例

**记住当前对话**:
```
记住我们刚才讨论的关于 MCP 安全的事情
```

**检索记忆**:
```
我之前有没有提到过我喜欢什么天气?
```

**主动推荐**:
根据用户过去的偏好，在适当的时候主动推荐相关内容。

## 注意事项

- memU 是主动记忆系统，会自动从交互中学习用户意图
- 与现有的文件记忆系统互补：文件记忆 = 备份，memU = 智能检索
- RAG 模式快且便宜，LLM 模式慢但能理解更深层意图
