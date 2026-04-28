# Holographic Memory - SQLite Fact Store with HRR

name: holographic-memory description: Use when you need to store, search, or retrieve facts with trust scoring and HRR vector similarity. Provides SQLite-backed persistent memory with entity extraction, full-text search, and holographic (bind/unbind/bundle) operations. Trigger phrases: "remember thi

## 安装

```bash
cp -r ~/.openclaw/xiaoxi-skills/holographic-memory ~/.openclaw/skills/
```

## 配置

```bash
# 查看详情
cat ~/.openclaw/skills/holographic-memory/SKILL.md
```

---

## 完整文档

```markdown
---
name: holographic-memory
description: Use when you need to store, search, or retrieve facts with trust scoring and HRR vector similarity. Provides SQLite-backed persistent memory with entity extraction, full-text search, and holographic (bind/unbind/bundle) operations. Trigger phrases: "remember this", "store as fact", "search memories", "what do you know about", "learn from this", "update trust score".
license: Apache-2.0
compatibility: Requires Python 3.8+ and sqlite3 (built-in). Optional: numpy for HRR features.
metadata:
  author: adminlove520
  version: "1.0.0"
  github: https://github.com/adminlove520/holographic-memory
---

# Holographic Memory - SQLite Fact Store with HRR

A persistent memory system using Holographic Reduced Representations (HRR) for vector symbolic operations.

## Core Concepts

### HRR Operations
| Operation | Description |
|-----------|-------------|
| **bind(a, b)** | Combines two concepts (phase addition) |
| **unbind(memory, key)** | Retrieves a bound value (phase subtraction) |
| **bundle(\*vectors)** | Merges multiple concepts (circular mean) |

### Trust Scoring
- Initial trust: 0.5
- Helpful feedback: +0.05
- Unhelpful feedback: -0.10
- Search minimum: 0.3 (configurable)

## Tools

### fact_store
Store or retrieve persistent facts with trust scoring.

**Actions:**

#### add
Add a new fact to memory.
```bash
python3 ~/.openclaw/skills/holographic-memory/scripts/fact_cli.py add \
  --content "The user prefers morning meetings" \
  --category preferences \
  --tags "meetings,schedule"
```

#### search
Search facts by keyword (FTS5).
```bash
python3 ~/.openclaw/skills/holographic-memory/scripts/fact_cli.py search \
  --query "meeting preferences" \
  --limit 5
```

#### list
List all facts, optionally filtered.
```bash
python3 ~/.openclaw/skills/holographic-memory/scripts/fact_cli.py list \
  --category preferences \
  --limit 10
```

#### feedback
Record helpful/unhelpful feedback on a fact.
```bash
python3 ~/.openclaw/skills/holographic-memory/scripts/fact_cli.py feedback \
  --fact-id <id> \
  --helpful true
```

#### remove
Delete a fact by ID.
```bash
python3 ~/.openclaw/skills/holographic-memory/scripts/fact_cli.py remove --fact-id <id>
```

### When to Use

- **Add facts when**: User says "remember this", "note that", important info shared
- **Search when**: User asks "what do you know about X", "did I tell you about Y"
- **Update trust when**: User confirms or corrects information you retrieved
- **Remove when**: User says "forget that", "that's wrong", fact is outdated

## Categories

Common categories:
- `preferences` - User likes/dislikes, habits
- `facts` - Factual knowledge about user or context
- `projects` - Ongoing work, decisions, status
- `lessons` - Learned from interactions
- `people` - Information about people user mentions

## Database Location

`~/.openclaw/holographic_memory/memory_store.db`

SQLite with FTS5 full-text search enabled. HRR vectors stored as BLOBs.

## Installation

```bash
# Clone to your skills directory
git clone https://github.com/adminlove520/holographic-memory.git ~/.openclaw/skills/holographic-memory
```
```
