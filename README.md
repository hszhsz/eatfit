# EatFit 吃什么 · AI 饮食管家

> 基于 TRAE SOLO 挑战赛创意提案「EatFit 吃什么」开发的全栈应用。
> 录入身体数据 → AI 生成个性化每日食谱 → 一键买菜清单 → step-by-step 烹饪引导。

本仓库包含两部分:

```
EatFit/
├── backend/      # Python FastAPI 后端 + 营养计算 / 食谱匹配引擎 + SQLite
└── android/      # Kotlin + Jetpack Compose Android 前端
```

---

## 一、整体架构

```
┌─────────────────────────┐        HTTP/JSON        ┌──────────────────────────┐
│   Android (Compose)      │ ───────────────────────▶│   FastAPI 后端            │
│                          │                         │                          │
│  Onboarding 录入体测      │   POST /api/profiles    │  营养引擎(BMR/TDEE/宏量) │
│  Today 今日食谱看板       │   GET  /api/plan/{id}   │  食谱匹配 + 过敏原过滤    │
│  RecipeDetail 烹饪步骤    │   GET  /api/recipes/{id}│  买菜清单聚合             │
│  Grocery 买菜清单         │   GET  .../grocery      │  SQLite + 13 道种子食谱   │
│  Profile 体测编辑         │                         │                          │
│  (MVVM + Hilt + Retrofit)│                         │                          │
└─────────────────────────┘                         └──────────────────────────┘
```

- **前端**:Kotlin / Jetpack Compose / Material3 / MVVM / Hilt(DI)/ Retrofit + kotlinx.serialization / Navigation / DataStore
- **后端**:Python 3 / FastAPI / SQLAlchemy / SQLite,纯规则引擎(不依赖任何外部大模型,完全离线可跑)

---

## 二、快速开始

### 1. 启动后端

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

启动后:
- 接口文档(Swagger UI):http://localhost:8000/docs
- 健康检查:http://localhost:8000/api/health
- 首次启动会自动建表并写入 13 道种子食谱。

### 2. 运行 Android 前端

1. 用 **Android Studio**(或 TRAE)打开 `android/` 目录,等待 Gradle 同步。
2. 后端地址已在 `app/build.gradle.kts` 配置为 `http://10.0.2.2:8000/`
   - `10.0.2.2` 是 **Android 模拟器** 访问宿主机 `localhost` 的专用回环地址。
   - 若用 **真机** 调试,把它改成你电脑的局域网 IP,例如 `http://192.168.1.100:8000/`,并确保手机与电脑同一 WiFi。
3. 选择模拟器/真机,点击 Run ▶。

> 工程自带 Gradle Wrapper(`gradlew` / `gradle-wrapper.jar`),首次构建会自动下载 Gradle 8.7。

---

## 三、核心算法说明

### 营养目标计算(`backend/app/services/nutrition.py`)

1. **基础代谢 BMR** — Mifflin-St Jeor 公式:
   - 男:`10×体重 + 6.25×身高 − 5×年龄 + 5`
   - 女:`10×体重 + 6.25×身高 − 5×年龄 − 161`
2. **每日总消耗 TDEE** = BMR × 活动系数(久坐 1.2 ~ 极高 1.9)
3. **目标热量** = TDEE × (1 + 目标系数):减脂 −18%、保持 0、增肌 +12%
4. **宏量分配**:蛋白质按体重锚定(减脂 2.0 / 保持 1.6 / 增肌 2.2 g·kg⁻¹),脂肪占总热量 25~28%,碳水补足剩余。

### 食谱匹配(`backend/app/services/planner.py`)

- 按 早 25% / 午 35% / 晚 30% / 加餐 10% 分配每餐热量预算。
- 过滤掉含用户过敏原、忌口标签的食谱;支持纯素偏好。
- 打分:热量接近度 + 目标标签匹配(增肌偏向高蛋白、减脂偏向低脂),在 Top-3 中按日期确定性轮换,保证每天有变化但可复现。
- 买菜清单跨餐合并同名食材,并按「蔬菜水果 / 肉蛋水产 / 主食粮油 / 奶制品 / 调料其他」分组。

---

## 四、API 一览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/profiles` | 创建体测档案 |
| GET  | `/api/profiles/{id}` | 查询档案 |
| PUT  | `/api/profiles/{id}` | 更新档案 |
| GET  | `/api/profiles/{id}/target` | 计算营养目标 |
| GET  | `/api/recipes` | 食谱列表(可按 meal_type / tag 过滤) |
| GET  | `/api/recipes/{id}` | 食谱详情(含食材与步骤) |
| GET  | `/api/plan/{profileId}` | 生成今日食谱(可传 `?date=`) |
| GET  | `/api/plan/{profileId}/grocery` | 生成买菜清单 |

---

## 五、离线验证

后端逻辑可在不启动服务的情况下验证:

```bash
cd backend
python3 verify_logic.py
```

会校验:数据库建表与种子、营养公式数值、每日食谱生成、过敏原过滤、买菜清单聚合、素食偏好。

---

## 六、目录结构

```
backend/
├── app/
│   ├── main.py              # FastAPI 入口
│   ├── database.py          # SQLAlchemy 模型 + session
│   ├── schemas.py           # Pydantic 数据契约
│   ├── seed.py              # 食谱入库
│   ├── routers/             # profiles / recipes / plan 路由
│   ├── services/            # nutrition(营养)/ planner(食谱)/ mappers
│   └── data/recipes_seed.py # 13 道种子食谱
├── requirements.txt
└── verify_logic.py

android/app/src/main/java/com/eatfit/app/
├── EatFitApp.kt / MainActivity.kt
├── data/
│   ├── model/               # Kotlin 数据模型(与后端契约一致)
│   ├── remote/EatFitApi.kt  # Retrofit 接口
│   └── repository/          # Repository + DataStore
├── di/AppModule.kt          # Hilt 依赖注入
└── ui/
    ├── theme/ navigation/ components/
    └── screens/ onboarding / today / recipe / grocery / profile
```

---

## 七、说明

- 本项目的食谱营养数据为演示用途的人工整理值,不构成专业医学或营养建议。
- 食谱库、营养计算均为本地规则实现,**不调用任何外部 AI 服务**,可完全离线运行,便于评审复现。
- 后续可扩展方向(对应提案):接入生鲜平台导购、对接体脂秤/手环数据形成「测→吃→练」闭环、营养师人工审核(Pro/专业版)。
