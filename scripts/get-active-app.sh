#!/bin/bash
# Linux 版本：用 xdotool 拿当前前台窗口的 WM_CLASS（进程名）
# 需要安装：sudo apt install xdotool
WID=$(xdotool getactivewindow 2>/dev/null)
if [ -z "$WID" ]; then exit 0; fi
xdotool getwindowclassname "$WID" 2>/dev/null
