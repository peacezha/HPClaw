#!/bin/bash
# gzip.sh - 安全地 gzip 压缩文件（检查文件存在后再压缩）
# 用法: echo file_list | xargs -P 5 -i sh gzip.sh {}
file=$1
if [ -f "$file" ];then
  echo "$file"
  gzip "$file"
fi
