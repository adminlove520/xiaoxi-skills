#!/usr/bin/env python3
"""
Holographic Memory CLI - SQLite Fact Store with HRR

Usage:
    python3 fact_cli.py add --content "..." [--category X] [--tags "x,y"]
    python3 fact_cli.py search --query "..." [--limit N] [--category X]
    python3 fact_cli.py list [--category X] [--limit N]
    python3 fact_cli.py feedback --fact-id N --helpful true|false
    python3 fact_cli.py remove --fact-id N
"""

import argparse
import json
import sys
from pathlib import Path

# Setup path to find store.py
STORE_PATH = Path(__file__).parent.parent / "store.py"
sys.path.insert(0, str(STORE_PATH.parent))

try:
    from scripts.store import MemoryStore
except ImportError:
    # Fallback for direct execution
    import sys
    from pathlib import Path
    store_path = Path(__file__).parent.parent
    sys.path.insert(0, str(store_path))
    from store import MemoryStore

DB_PATH = Path.home() / ".openclaw" / "holographic_memory" / "memory_store.db"

def get_store():
    return MemoryStore(db_path=str(DB_PATH))

def cmd_add(args):
    store = get_store()
    fact_id = store.add_fact(
        content=args.content,
        category=args.category or "general",
        tags=args.tags or ""
    )
    print(json.dumps({"success": True, "fact_id": fact_id}))
    return 0

def cmd_search(args):
    store = get_store()
    results = store.search_facts(
        query=args.query,
        category=args.category,
        limit=args.limit or 10
    )
    print(json.dumps({"results": results, "count": len(results)}))
    return 0

def cmd_list(args):
    store = get_store()
    results = store.list_facts(
        category=args.category,
        limit=args.limit or 50
    )
    print(json.dumps({"facts": results, "count": len(results)}))
    return 0

def cmd_feedback(args):
    store = get_store()
    helpful = args.helpful.lower() in ("true", "1", "yes")
    result = store.record_feedback(args.fact_id, helpful)
    print(json.dumps({"success": True, **result}))
    return 0

def cmd_remove(args):
    store = get_store()
    success = store.remove_fact(args.fact_id)
    print(json.dumps({"success": success}))
    return 0 if success else 1

def main():
    parser = argparse.ArgumentParser(description="Holographic Memory CLI")
    sub = parser.add_subparsers(dest="cmd", required=True)
    
    # add
    p = sub.add_parser("add", help="Add a fact")
    p.add_argument("--content", required=True, help="Fact content")
    p.add_argument("--category", default="general", help="Category")
    p.add_argument("--tags", default="", help="Comma-separated tags")
    
    # search
    p = sub.add_parser("search", help="Search facts")
    p.add_argument("--query", required=True, help="Search query")
    p.add_argument("--category", help="Filter by category")
    p.add_argument("--limit", type=int, default=10, help="Result limit")
    
    # list
    p = sub.add_parser("list", help="List all facts")
    p.add_argument("--category", help="Filter by category")
    p.add_argument("--limit", type=int, default=50, help="Result limit")
    
    # feedback
    p = sub.add_parser("feedback", help="Record feedback")
    p.add_argument("--fact-id", type=int, required=True, help="Fact ID")
    p.add_argument("--helpful", required=True, help="true or false")
    
    # remove
    p = sub.add_parser("remove", help="Remove a fact")
    p.add_argument("--fact-id", type=int, required=True, help="Fact ID")
    
    args = parser.parse_args()
    
    commands = {
        "add": cmd_add,
        "search": cmd_search,
        "list": cmd_list,
        "feedback": cmd_feedback,
        "remove": cmd_remove,
    }
    
    return commands[args.cmd](args)

if __name__ == "__main__":
    sys.exit(main())
