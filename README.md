# EatFit 吃什么 · AI 饮食管家

> 基于 TRAE SOLO 挑战赛创意提案「EatFit 吃什么」开发的全栈应用。
> 录入身体数据 → AI 生成个性化每日食谱 → AI 营养顾问复盘与策略建议 → 一键买菜清单 → step-by-step 烹饪引导。

本仓库包含四部分:

```
EatFit/
├── backend/      # Python FastAPI 后端（部署在 Vercel Serverless）
├── android/      # Kotlin + Jetpack Compose Android 客户端
├── ios/          # SwiftUI 原生 iOS 客户端
└── web/          # React Web 客户端（部署在 Vercel）
```

## 在线体验

- **Web 端**：[eatfit-web.vercel.app](https://eatfit-web.vercel.app)
- **API 文档**：[backend Swagger](https://backend-auushsk3z-jackhes-projects-5ded530b.vercel.app/docs)

---

## 一、整体架构

```
┌─────────────────────────┐        HTTP/JSON        ┌──────────────────────────┐
│   Android (Compose)      │ ───────────────────────▶│   FastAPI 后端            │
│   iOS (SwiftUI)          │                         │   (Vercel Serverless)     │
│   Web (React)            │                         │                          │
│                          │   POST /api/web/*       │  营养引擎(BMR/TDEE/宏量) │
│  Onboarding 录入体测      │   GET  /api/recipes     │  食谱匹配 + 过敏原过滤    │
│  Today 今日饮食控制台     │                         │  LLM 营养分析与行动建议   │
│  Coach AI营养顾问         │                         │  买菜清单聚合             │
│  RecipeDetail 烹饪步骤    │                         │  Supabase 持久化          │
│  Grocery 买菜清单         │                         │  54 道种子食谱            │
│  Profile 体测编辑         │                         │                          │
└─────────────────────────┘                         └──────────────────────────┘
```

- **Android**: Kotlin / Jetpack Compose / Material3 / MVVM / Hilt / Retrofit + kotlinx.serialization
- **iOS**: Swift / SwiftUI / URLSession / MVVM
- **Web**: React 18 / TypeScript / Vite / Tailwind CSS / TanStack Query / Zustand / Clerk / Supabase
- **后端**: Python 3 / FastAPI / Pydantic / Supabase / 火山引擎 Ark LLM

---

## 二、快速开始

### 1. 后端（已部署在 Vercel，本地可选）

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export EATFIT_LLM_API_KEY="你的 Ark API Key"
export EATFIT_LLM_BASE_URL="https://ark.cn-beijing.volces.com/api/v3"
export EATFIT_LLM_MODEL="minimax-m3"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- 接口文档: http://localhost:8000/docs
- 健康检查: http://localhost:8000/api/health
- 若未配置 `EATFIT_LLM_API_KEY`, AI 顾问会回退到本地策略建议
- 若只配置了 `EATFIT_LLM_API_KEY`, 后端会优先尝试项目默认的 Ark + `minimax-m3`, 并兼容历史 Moonshot/Kimi 配置

### 2. Web 前端

```bash
cd web
pnpm install
pnpm dev    # http://localhost:5173
pnpm build  # 生产构建
```

### 3. Android 前端

1. 用 **Android Studio** 打开 `android/` 目录,等待 Gradle 同步
2. 后端地址已配置为生产环境 URL,无需手动修改
3. 选择模拟器/真机,点击 Run ▶

### 4. iOS 前端

1. 安装 XcodeGen: `brew install xcodegen`
2. 生成工程: `cd ios && xcodegen generate`
3. 打开 `EatFitIOS.xcodeproj`,选择设备运行
4. 后端地址已硬编码为生产环境 URL,无需手动配置

---

## 三、核心算法说明

### 营养目标计算 (`backend/app/services/nutrition.py`)

1. **基础代谢 BMR** — Mifflin-St Jeor 公式:
   - 男: `10×体重 + 6.25×身高 − 5×年龄 + 5`
   - 女: `10×体重 + 6.25×身高 − 5×年龄 − 161`
2. **每日总消耗 TDEE** = BMR × 活动系数(久坐 1.2 ~ 极高 1.9)
3. **目标热量** = TDEE × (1 + 目标系数): 减脂 −18%、保持 0、增肌 +12%
4. **宏量分配**: 蛋白质按体重锚定(减脂 2.0 / 保持 1.6 / 增肌 2.2 g·kg⁻¹),脂肪占总热量 25~28%,碳水补足剩余

### 食谱匹配 (`backend/app/services/planner.py`)

- 按 早 25% / 午 35% / 晚 30% / 加餐 10% 分配每餐热量预算
- 过滤掉含用户过敏原、忌口标签的食谱;支持纯素偏好
- 打分: 热量接近度 + 目标标签匹配,在 Top-3 中按日期确定性轮换
- 买菜清单跨餐合并同名食材,按类别分组

---

## 四、API 一览

| 方法 | 路径 | 说明 |
|------|------|------|
| GET  | `/api/health` | 健康检查 |
| GET  | `/api/recipes` | 食谱列表(可按 meal_type / tag 过滤) |
| GET  | `/api/recipes/{id}` | 食谱详情(含食材与步骤) |
| POST | `/api/web/target` | 计算营养目标(传入完整 profile) |
| POST | `/api/web/plan` | 生成今日食谱 |
| POST | `/api/web/grocery` | 生成买菜清单 |
| POST | `/api/web/coach/advice` | AI 营养顾问建议 |
| POST | `/api/web/by-id/plan` | 按 Supabase profile UUID 生成食谱 |
| POST | `/api/web/by-id/grocery` | 按 UUID 生成买菜清单 |
| POST | `/api/web/by-id/coach/advice` | 按 UUID 生成 AI 建议 |

---

## 五、技术栈

| 端 | 技术 |
|------|------|
| Android | Kotlin, Jetpack Compose, Material3, Hilt, Retrofit, Navigation, DataStore |
| iOS | Swift, SwiftUI, URLSession, MVVM |
| Web | React 18, TypeScript, Vite, Tailwind, TanStack Query, Zustand, Clerk, Supabase |
| Backend | Python 3, FastAPI, Pydantic, Supabase, 火山引擎 Ark LLM |
| 部署 | Vercel (Web + Backend Serverless) |

---

## 六、说明

- 食谱营养数据为演示用途的人工整理值,不构成专业医学或营养建议
- AI 顾问采用火山引擎 Ark 的 OpenAI Responses 兼容接口
- 后续可扩展方向: 拍照识别饮食记录、体脂秤/手环数据回流、会员版营养师审核
