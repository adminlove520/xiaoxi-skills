# OpenClaw Plugin SDK Migration

## Problem

OpenClaw moved from a barrel import (`openclaw/plugin-sdk`) to specific subpaths (`openclaw/plugin-sdk/<subpath>`). Plugins importing from the barrel will fail with errors like:
- `Cannot find module 'openclaw/plugin-sdk'`
- `(0, _pluginSdk.fn) is not a function`
- Type mismatches on `PluginRuntime`, `OpenClawPluginApi`, etc.

## Workflow

### Step 1 — Audit imports

Find all files importing from `openclaw/plugin-sdk`:

```bash
grep -r 'from "openclaw/plugin-sdk"' ~/.openclaw/extensions/<plugin-name>/src/
```

Also check the plugin entry point (`index.ts`):
```bash
grep -r 'from "openclaw/plugin-sdk"' ~/.openclaw/extensions/<plugin-name>/index.ts
```

### Step 2 — Update imports

Replace barrel imports with specific subpaths:

```typescript
// Before
import type { PluginRuntime } from "openclaw/plugin-sdk";
import { buildChannelConfigSchema } from "openclaw/plugin-sdk";

// After
import type { PluginRuntime } from "openclaw/plugin-sdk/core";
import { buildChannelConfigSchema } from "openclaw/plugin-sdk/core";
```

### Step 3 — Create symlink

```bash
mkdir -p ~/.openclaw/extensions/<plugin-name>/node_modules
ln -sf /path/to/global/openclaw ~/.openclaw/extensions/<plugin-name>/node_modules/openclaw
```

### Step 4 — Restart Gateway

```bash
openclaw gateway restart
```

## Common Fixes

| Error | Fix |
|-------|-----|
| `Cannot find module 'openclaw/plugin-sdk'` | Create symlink to global openclaw |
| `(0, _pluginSdk.fn) is not a function` | Update import to use `openclaw/plugin-sdk/core` |

## Reference

| Symbol | Subpath |
|--------|---------|
| `PluginRuntime` | core |
| `OpenClawPluginApi` | core |
| `buildChannelConfigSchema` | core |
| `normalizeAccountId` | core |
