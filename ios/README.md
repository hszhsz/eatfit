# EatFit iOS

## 构建要求

- macOS + 完整 Xcode（非 Command Line Tools）
- iOS 17.0+ 部署目标
- [XcodeGen](https://github.com/yonaskolb/XcodeGen)（可选，用于重新生成工程文件）

## 构建步骤

### 1. 安装 XcodeGen（如未安装）

```bash
brew install xcodegen
```

### 2. 生成 Xcode 工程

```bash
cd ios
xcodegen generate
```

### 3. 打开并运行

```bash
open EatFitIOS.xcodeproj
```

在 Xcode 中：
- 选择目标设备（模拟器或真机）
- 点击 Run ▶
- 后端地址已硬编码为生产环境 URL，无需手动配置

### 4. 构建 IPA（需要 Apple Developer 账号）

```bash
# Archive
xcodebuild archive \
  -project EatFitIOS.xcodeproj \
  -scheme EatFitIOS \
  -archivePath build/EatFitIOS.xcarchive

# Export IPA
xcodebuild -exportArchive \
  -archivePath build/EatFitIOS.xcarchive \
  -exportPath build/ipa \
  -exportOptionsPlist ExportOptions.plist
```

> 需要在 `project.yml` 中设置 `DEVELOPMENT_TEAM` 为你的 Apple Team ID。

## 项目结构

```
EatFitIOS/
├── App/           # App 入口与 Tab 根视图
├── Models/        # Swift Codable 数据模型
├── Networking/    # URLSession API Client
├── Store/         # 全局会话与 profileId 持久化
├── ViewModels/    # SwiftUI 状态管理
└── Views/         # Onboarding / Today / Recipes / Grocery / Coach / Profile
```
