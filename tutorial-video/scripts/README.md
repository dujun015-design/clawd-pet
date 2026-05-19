# 录屏脚本

## 准备工作（只做一次）

1. **打开屏幕录制权限**
   系统设置 → 隐私与安全 → 屏幕录制 → 勾选「终端」

2. **调整环境**
   - 系统设置 → 通知 → 开启「勿扰模式」
   - 终端字号调大（Cmd `+` 三四次）
   - 桌面整理一下

## 录制顺序

```bash
cd /Users/jun/desktop-pet/tutorial-video/scripts

# 按顺序录，每段录完用 QuickTime 看一眼
bash record-ch1-prepare.sh    # 准备工作（DeepSeek + Node）
bash record-ch2-clone.sh      # git clone + npm install
bash record-ch3-config.sh     # 配置 + 启动
```

不满意可以单独重录某一段，文件会覆盖。

## 输出

三段视频会出现在 `../recordings/`：
- `ch1-prepare.mov`
- `ch2-clone.mov`
- `ch3-config.mov`

## 后续

用剪映把它们和 Remotion 导出的动画拼起来：

```
[Intro.mp4]
[Showcase.mp4]
[Chapter01 卡].mp4   ←  Remotion 导出
[ch1-prepare.mov]   ←  你录的
[Chapter02 卡].mp4
[ch2-clone.mov]
[Chapter03 卡].mp4
[ch3-config.mov]
[Outro.mp4]
```
