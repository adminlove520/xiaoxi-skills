# holographic-memory

SQLite-backed persistent memory store with trust scoring and HRR vector operations for AI agents.

## Features

- **SQLite Fact Store**: Persistent storage with FTS5 full-text search
- **Trust Scoring**: Helpful/unhelpful feedback adjusts fact reliability
- **Entity Extraction**: Automatically extracts entities from facts
- **HRR Support**: Optional Holographic Reduced Representations for vector operations (requires numpy)
- **Chinese Support**: FTS5 + LIKE fallback for CJK text

## Installation

```bash
# Clone the repository
git clone https://github.com/adminlove520/holographic-memory.git
cd holographic-memory

# Install dependencies (optional, for HRR features)
pip install numpy
```

## Quick Start

```python
from scripts.store import MemoryStore

store = MemoryStore()

# Add a fact
fact_id = store.add_fact(
    content="The user prefers concise answers",
    category="preferences",
    tags="communication"
)

# Search facts
results = store.search_facts("user preferences")

# Record feedback
store.record_feedback(fact_id, helpful=True)

# List all facts
all_facts = store.list_facts(category="preferences")
```

## CLI Usage

```bash
# Add a fact
python3 scripts/fact_cli.py add --content "..." --category X --tags "a,b"

# Search
python3 scripts/fact_cli.py search --query "关键词"

# List
python3 scripts/fact_cli.py list [--category X]

# Feedback
python3 scripts/fact_cli.py feedback --fact-id 1 --helpful true

# Remove
python3 scripts/fact_cli.py remove --fact-id 1
```

## Database Location

Default: `~/.openclaw/holographic_memory/memory_store.db`

## Trust Scoring

- Initial trust: 0.5
- Helpful feedback: +0.05
- Unhelpful feedback: -0.10
- Search minimum threshold: 0.3 (configurable)

## Categories

Common categories:
- `preferences` - User likes/dislikes, habits
- `facts` - Factual knowledge about user or context
- `projects` - Ongoing work, decisions, status
- `lessons` - Learned from interactions
- `people` - Information about people

## HRR Operations

If numpy is installed, these operations are available via `scripts/holographic.py`:

| Operation | Description |
|-----------|-------------|
| **bind(a, b)** | Combines two concepts (phase addition) |
| **unbind(memory, key)** | Retrieves a bound value (phase subtraction) |
| **bundle(\*vectors)** | Merges multiple concepts (circular mean) |

## File Structure

```
holographic-memory/
├── SKILL.md           # OpenClaw skill definition
├── README.md          # This file
├── LICENSE            # Apache 2.0
└── scripts/
    ├── store.py      # SQLite fact store
    ├── holographic.py # HRR operations
    └── fact_cli.py   # CLI interface
```

## License

Apache 2.0
