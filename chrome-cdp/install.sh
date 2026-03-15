#!/bin/bash
# chrome-cdp 安装脚本

echo "🦞 正在安装 chrome-cdp..."

# 检查Node版本
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
  echo "❌ 需要 Node.js 22+，当前版本: $(node --version)"
  exit 1
fi

# 创建scripts目录
mkdir -p scripts

# 克隆仓库
if [ ! -d "temp-cdp" ]; then
  echo "📦 克隆 chrome-cdp-skill..."
  git clone https://github.com/pasky/chrome-cdp-skill.git temp-cdp
fi

# 复制脚本
if [ -f "temp-cdp/scripts/cdp.mjs" ]; then
  cp temp-cdp/scripts/cdp.mjs scripts/
  echo "✅ cdp.mjs 已安装"
else
  echo "❌ 未找到 cdp.mjs"
  exit 1
fi

# 清理
rm -rf temp-cdp

echo "🎉 安装完成！"
echo ""
echo "下一步："
echo "1. 在Chrome地址栏输入: chrome://inspect/#remote-debugging"
echo "2. 打开'启用远程调试'开关"
echo "3. 运行: node scripts/cdp.mjs list"
