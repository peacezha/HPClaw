#!/bin/bash
# scan-large-files.sh - 扫描当前账号下的大文件
# 用法: bash scan-large-files.sh [大小阈值(M)] [最小修改天数]
#
# 示例:
#   bash scan-large-files.sh 100        # 扫描大于100M的所有文件
#   bash scan-large-files.sh 100 90     # 扫描大于100M且90天未修改的文件

SIZE_THRESHOLD=${1:-100}
MTIME_DAYS=${2:-0}
OUTPUT_FILE="fileall_$(whoami)_$(date +%y%m%d)"

echo "=== 扫描大文件 ==="
echo "大小阈值: ${SIZE_THRESHOLD}M"
echo "修改天数: ${MTIME_DAYS} 天前"
echo "输出文件: ${OUTPUT_FILE}"
echo ""

MTIME_OPT=""
if [ "$MTIME_DAYS" -gt 0 ]; then
  MTIME_OPT="-mtime +${MTIME_DAYS}"
fi

echo "开始扫描..."
ls -d ~/* | xargs -I[] -P 5 find [] ${MTIME_OPT} -size +${SIZE_THRESHOLD}M -type f | xargs du -sm > "${OUTPUT_FILE}"

COUNT=$(wc -l < "${OUTPUT_FILE}")
TOTAL_SIZE=$(awk '{sum+=$1} END {printf "%.1f", sum/1024}' "${OUTPUT_FILE}")

echo ""
echo "扫描完成!"
echo "找到 ${COUNT} 个大文件，总计 ${TOTAL_SIZE}G"
echo "结果保存在: ${OUTPUT_FILE}"
echo ""
echo "Top 20 最大文件:"
sort -rn "${OUTPUT_FILE}" | head -20
