#!/bin/bash
# check-integrity.sh - 批量校验文件完整性
# 用法: bash check-integrity.sh [类型] [路径]
#
# 类型:
#   md5     - MD5 校验（需要提供 md5.txt 文件）
#   gzip    - gzip 文件完整性检查
#   bam     - BAM 文件完整性检查
#   pe      - 双端测序配对校验（需要提供 R1 和 R2 文件）
#
# 示例:
#   bash check-integrity.sh md5 ./md5.txt
#   bash check-integrity.sh gzip "*.fq.gz"
#   bash check-integrity.sh bam "*.bam"

TYPE=${1:-help}
TARGET=${2:-.}
THREADS=${3:-5}

case "$TYPE" in
  md5)
    if [ -z "$TARGET" ] || [ "$TARGET" = "." ]; then
      echo "用法: bash check-integrity.sh md5 <md5.txt>"
      exit 1
    fi
    echo "=== MD5 校验 ==="
    echo "校验文件: $TARGET"
    md5sum -c "$TARGET"
    ;;
  gzip)
    echo "=== GZIP 完整性检查 ==="
    echo "目标: $TARGET"
    echo "线程数: $THREADS"
    ls $TARGET | xargs -i -P $THREADS gzip -t {}
    echo ""
    echo "检查完成。无输出表示所有文件完整。"
    ;;
  bam)
    echo "=== BAM 文件完整性检查 ==="
    echo "目标: $TARGET"
    FAILED=0
    for i in $TARGET; do
      if samtools quickcheck "$i" 2>/dev/null; then
        echo "OK: $i"
      else
        echo "ERROR: $i"
        FAILED=$((FAILED + 1))
      fi
    done
    echo ""
    echo "检查完成。失败文件数: $FAILED"
    ;;
  pe)
    echo "=== 双端测序配对校验 ==="
    echo "请提供 R1 和 R2 文件路径"
    echo "用法: bash check-integrity.sh pe <R1.fq.gz> <R2.fq.gz>"
    if [ -n "$TARGET" ] && [ -n "$3" ]; then
      pecheck -i "$TARGET" -I "$3"
    fi
    ;;
  *)
    echo "用法: bash check-integrity.sh <类型> [目标]"
    echo ""
    echo "类型:"
    echo "  md5  <md5.txt>           - MD5 校验"
    echo "  gzip <文件模式>           - GZIP 完整性检查"
    echo "  bam  <文件模式>           - BAM 文件完整性检查"
    echo "  pe   <R1.fq.gz> <R2.fq.gz> - 双端测序配对校验"
    ;;
esac
