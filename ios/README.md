# EatFit iOS

原生 iOS 客户端，使用 `SwiftUI + URLSession + async/await`，直接复用现有 FastAPI 接口。

## 功能范围

- 首次建档 / 编辑档案
- 今日饮食计划
- 食谱库与食谱详情
- 买菜清单
- AI 营养顾问

## 本地运行

1. 先启动后端：

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. 生成 Xcode 工程：

```bash
cd ios
xcodegen generate
```

3. 用 Xcode 打开 `ios/EatFitIOS.xcodeproj`

4. 运行前确认后端地址：
   - iOS 模拟器：`http://127.0.0.1:8000`
   - iPhone 真机：改成你电脑的局域网 IP，例如 `http://192.168.1.100:8000`

## 说明

- 当前工程未引入第三方依赖，便于直接打开和调试。
- 如果本机 `xcodebuild` 报错缺少 iOS runtime / simulator platform，请在 Xcode 的 `Settings > Components` 安装对应 iOS Platform，并确保 `xcode-select` 指向完整 Xcode。
