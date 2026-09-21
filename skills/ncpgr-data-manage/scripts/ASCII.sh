#!/bin/bash
# ASCII.sh - 检测文件是否为 ASCII 文本文件并输出大小
# 用法: find /path -size +100M -type f -exec sh ASCII.sh {} \;
na=$1
ty=`file -b $1|xargs echo -n|cut -d" " -f 1`
si=`du -sm $1`
if [ $ty == ASCII ];then
  echo $si
fi
