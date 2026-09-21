#!/bin/bash
# 手工组装 HPClaw win-unpacked（替代卡死的 electron-builder 流程）
# 依赖：electron-dist 已预解压；dist/dist-electron/pipelines 已构建
set -e
SRC=/e/hpclaw--/源码
EDIST=/c/Users/Administrator/electron-dist
OUT=/c/Users/Administrator/HPClaw-v14-x64
STAGE=/c/Users/Administrator/hpclaw-v14-staging

echo "== 清理并建 staging"
rm -rf "$OUT" "$STAGE"
mkdir -p "$STAGE/node_modules" "$OUT"

echo "== 拷贝应用文件"
cd "$SRC"
cp -r dist dist-electron electron skills lsf_skills pipelines package.json "$STAGE/"

echo "== 收集生产依赖"
npm ls --omit=dev --all --parseable --silent 2>/dev/null | tail -n +2 > /tmp/prod-deps.txt
wc -l < /tmp/prod-deps.txt

echo "== 拷贝生产 node_modules（保持目录结构）"
while IFS= read -r p; do
  # npm 输出 Windows 反斜杠路径，先统一为正斜杠再剥前缀
  p="${p//\\//}"
  rel="${p#E:/hpclaw--/源码/}"
  rel="${rel#/e/hpclaw--/源码/}"
  case "$rel" in node_modules/*) ;; *) continue;; esac
  mkdir -p "$STAGE/$(dirname "$rel")"
  [ -d "$STAGE/$rel" ] || cp -r "$p" "$STAGE/$rel" 2>/dev/null || true
done < /tmp/prod-deps.txt

echo "== 打包 app.asar（native 模块 unpacked）"
mkdir -p "$OUT/resources"
npx asar pack "$STAGE" "$OUT/resources/app.asar" \
  --unpack-dir "node_modules/{ssh2,cpu-features,@napi-rs,@tailwindcss,lightningcss-win32-x64-msvc,jszip}"

echo "== 拷贝 electron 运行时"
cp -r "$EDIST"/* "$OUT/"
mv "$OUT/electron.exe" "$OUT/HPClaw.exe"

echo "== 打 zip"
cd /c/Users/Administrator
rm -f HPClaw-v14-x64.zip
zip -q -r HPClaw-v14-x64.zip HPClaw-v14-x64
ls -lh HPClaw-v14-x64.zip
echo "== DONE"
