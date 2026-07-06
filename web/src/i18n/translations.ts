export type Lang = "en" | "zh";

type TranslationDict = Record<string, string>;

export const translations: Record<Lang, TranslationDict> = {
  en: {
    // Home / Nav
    "home.brand": "EatFit",
    "home.brandTagline": "Nutrition Platform",
    "home.nav.features": "Features",
    "home.nav.download": "Download",
    "home.nav.signIn": "Sign In",
    "home.nav.getStarted": "Get Started",

    // LandingHero
    "hero.badge": "Product Dashboard",
    "hero.title":
      "The nutrition platform that looks as sharp as the discipline it builds.",
    "hero.subtitle":
      "EatFit pairs a premium brand surface with a full daily operating system: personalized targets, meal planning, grocery aggregation, and an AI coach that pushes the next best move.",
    "hero.ctaPrimary": "Start With Clerk",
    "hero.ctaSecondary": "Explore Dashboard",
    "hero.board.title": "Today's Operating Board",
    "hero.board.target": "2,214 kcal target",
    "hero.board.protein": "Protein",
    "hero.board.carbs": "Carbs",
    "hero.board.fat": "Fat",
    "hero.board.quality": "Plan Quality",
    "hero.board.qualityDesc":
      "Structured coaching with risk alerts, next actions, and meal strategy.",
    "hero.board.flow": "Flow",
    "hero.board.flow1": "Clerk authentication",
    "hero.board.flow2": "Supabase persistence",
    "hero.board.flow3": "FastAPI nutrition engine",

    // FeatureGrid
    "features.adaptive.title": "Adaptive macro targets",
    "features.adaptive.body":
      "FastAPI computes BMR, TDEE, and macro distribution directly from profile inputs and goal state.",
    "features.coach.title": "AI coach with structure",
    "features.coach.body":
      "Advice is returned with a headline, summary, score, risks, insights, next actions, and meal strategy.",
    "features.grocery.title": "Grocery built from plan",
    "features.grocery.body":
      "Ingredients are aggregated by category so daily planning turns into an executable shopping list.",
    "features.security.title": "User data isolation",
    "features.security.body":
      "Clerk secures identity and Supabase RLS isolates every profile, plan snapshot, and coach session.",

    // WorkflowStrip
    "workflow.eyebrow": "Operating Flow",
    "workflow.step1.title": "01. Capture the profile",
    "workflow.step1.body":
      "Body metrics, activity level, goal, allergens, and preferences are saved to Supabase.",
    "workflow.step2.title": "02. Generate the day",
    "workflow.step2.body":
      "The dashboard requests a stateless plan and grocery list from the FastAPI nutrition engine.",
    "workflow.step3.title": "03. Tighten the loop",
    "workflow.step3.body":
      "The AI coach turns context into targeted advice and stores sessions for follow-up reviews.",

    // AppDownload
    "download.eyebrow": "Download",
    "download.title": "Eat smart, anywhere.",
    "download.subtitle":
      "EatFit works on web, Android, and iOS. Download the native app for a smoother experience.",
    "download.android.title": "Android APK",
    "download.android.desc":
      "Download the APK installer. Requires Android 7.0+.",
    "download.android.button": "Download",
    "download.ios.title": "iOS",
    "download.ios.desc":
      "iOS client is ready. Build with Xcode and install manually.",
    "download.ios.button": "Source",
    "download.web.title": "Web App",
    "download.web.desc": "No installation needed. Use it right in your browser.",
    "download.web.button": "Try Now",
    "download.qr.title": "Scan to Download",
    "download.qr.desc":
      "Scan the QR code with your phone to download EatFit.",

    // FaqList
    "faq.eyebrow": "FAQ",
    "faq.heading": "Built for a real product surface, not a one-page demo.",
    "faq.q1": "Where is user data stored?",
    "faq.a1":
      "Web user data is stored in Supabase under row-level security policies bound to the Clerk user identity.",
    "faq.q2": "What powers the nutrition logic?",
    "faq.a2":
      "The existing FastAPI backend handles nutrition targets, meal planning, grocery aggregation, and AI coaching orchestration.",
    "faq.q3": "Can the dashboard be used without a profile?",
    "faq.a3":
      "You can sign in and browse the shell, but planning and coaching stay locked until the nutrition profile is saved.",

    // Footer
    "footer.desc":
      "Personalized nutrition planning, meal generation, and AI coaching — powered by Clerk, Supabase, and FastAPI.",
    "footer.copyright": "© 2026 EatFit. All rights reserved.",

    // SignIn / SignUp
    "signin.eyebrow": "EatFit Access",
    "signin.title": "Sign in to your nutrition operating board.",
    "signin.subtitle":
      "Your dashboard keeps profile data, plan snapshots, grocery output, and AI coaching sessions in one place.",
    "signin.back": "Back to home",
    "signup.eyebrow": "Start Here",
    "signup.title":
      "Create the account that unlocks the full EatFit dashboard.",
    "signup.subtitle":
      "Register once, save your profile to Supabase, and use the same plan and coaching loop across every session.",
    "signup.back": "Back to home",

    // AppShell
    "shell.brandTagline": "Nutrition OS",
    "shell.signedInAs": "Signed in as",
    "shell.signedInDesc": "Personalized nutrition dashboard",
    "shell.nav.overview": "Overview",
    "shell.nav.profile": "Profile",
    "shell.nav.plan": "Plan",
    "shell.nav.recipes": "Recipes",
    "shell.nav.grocery": "Grocery",
    "shell.nav.coach": "AI Coach",
    "shell.operatingNote": "Operating note",
    "shell.operatingDesc":
      "Profile data lives in Supabase. Plans and coaching are computed from your latest inputs through the FastAPI nutrition engine.",

    // ProtectedRoute
    "protected.loading": "Loading your workspace...",

    // DashboardHome
    "dash.overview": "Dashboard Overview",
    "dash.welcome": "Welcome back, {name}.",
    "dash.reviewing":
      "Reviewing {date} with your current goal locked to {goal}.",
    "dash.openCoach": "Open AI Coach",
    "dash.targetCalories": "Target Calories",
    "dash.protein": "Protein",
    "dash.plannedMeals": "Planned Meals",
    "dash.coachSessions": "Coach Sessions",
    "dash.metaGenerated": "Generated from your latest profile",
    "dash.metaDailyTarget": "Daily target",
    "dash.metaBreakfast": "Breakfast to snack coverage",
    "dash.metaSupabase": "Saved to Supabase",
    "dash.todayLineup": "Today's meal lineup",
    "dash.noPlanYet": "No plan generated yet.",
    "dash.executionSummary": "Execution summary",
    "dash.saveProfile": "Save your profile to unlock calculations.",
    "dash.latestMomentum": "Latest coaching momentum",
    "dash.noCoachHistory":
      "No coach history yet. Open the coach workspace and start the first session.",

    // EmptyState (profile)
    "empty.profile.title": "Your dashboard is ready. Your profile is not.",
    "empty.profile.body":
      "Complete the nutrition profile first so EatFit can calculate targets, generate meals, and anchor the AI coach in real context.",
    "empty.profile.cta": "Set Up Profile",

    // ProfilePage
    "profile.eyebrow": "Supabase",
    "profile.title": "Nutrition profile",
    "profile.name": "Name",
    "profile.age": "Age",
    "profile.height": "Height (cm)",
    "profile.weight": "Weight (kg)",
    "profile.bodyFat": "Body fat %",
    "profile.gender": "Gender",
    "profile.male": "Male",
    "profile.female": "Female",
    "profile.goal": "Goal",
    "profile.activity": "Activity level",
    "profile.diet": "Diet preference",
    "profile.dietPlaceholder": "vegetarian, high-protein, etc.",
    "profile.allergens": "Allergens (comma separated)",
    "profile.allergensPlaceholder": "shrimp, peanut",
    "profile.disliked": "Disliked tags (comma separated)",
    "profile.dislikedPlaceholder": "fish, spicy",
    "profile.save": "Save Profile",
    "profile.saving": "Saving...",
    "profile.lastUpdated": "Last updated {date}",
    "profile.createHint":
      "Create the profile once and EatFit will persist it to Supabase.",
    "profile.noProfileTitle": "No profile row yet",
    "profile.noProfileBody":
      "Once you save the form above, the dashboard will start generating targets, plans, grocery output, and AI coach sessions.",

    // PlanPage
    "plan.eyebrow": "Planner",
    "plan.title": "Daily meal plan",
    "plan.viewing":
      "Viewing {date}. Every request uses your latest Supabase profile data and the backend meal planner.",
    "plan.noData": "No data returned for this date.",
    "plan.calories": "Calories",
    "plan.protein": "Protein",
    "plan.carbs": "Carbs",
    "plan.fat": "Fat",
    "plan.empty.title": "No plan without a profile",
    "plan.empty.body":
      "Save your profile first so the planner has real inputs for calories, macro targets, allergens, and preferences.",
    "plan.empty.cta": "Go to Profile",

    // RecipesPage
    "recipes.eyebrow": "Catalog",
    "recipes.title": "Recipe library",
    "recipes.allMeals": "All meals",
    "recipes.breakfast": "Breakfast",
    "recipes.lunch": "Lunch",
    "recipes.dinner": "Dinner",
    "recipes.snack": "Snack",
    "recipes.filterPlaceholder": "Filter by tag",
    "recipes.calories": "Calories",
    "recipes.protein": "Protein",
    "recipes.carbs": "Carbs",
    "recipes.cookTime": "{min} min",
    "recipes.empty.title": "No recipes match the current filters",
    "recipes.empty.body":
      "Adjust the meal type or tag filter to reveal the seeded recipe library.",

    // GroceryPage
    "grocery.eyebrow": "Shopping",
    "grocery.title": "Grocery list",
    "grocery.generateFirst": "Generate a plan first.",
    "grocery.empty.title": "No grocery output without a profile",
    "grocery.empty.body":
      "Save your profile and daily plan inputs first. EatFit uses them to aggregate ingredients into a shopping list.",
    "grocery.empty.cta": "Go to Profile",

    // CoachPage
    "coach.eyebrow": "Input",
    "coach.title": "Coach control",
    "coach.focus.dailyReview": "Daily Review",
    "coach.focus.mealStrategy": "Meal Strategy",
    "coach.focus.eatingOut": "Eating Out",
    "coach.focus.cravings": "Cravings",
    "coach.context": "Context",
    "coach.contextPlaceholder":
      "Review today and tell me what to tighten for tomorrow.",
    "coach.generate": "Generate Advice",
    "coach.generating": "Generating advice...",
    "coach.response.eyebrow": "Output",
    "coach.response.title": "Structured response",
    "coach.headline": "Headline",
    "coach.score": "Score",
    "coach.disclaimer": "Disclaimer",
    "coach.riskAlerts": "Risk alerts",
    "coach.nutritionInsights": "Nutrition insights",
    "coach.nextActions": "Next actions",
    "coach.mealStrategy": "Meal strategy",
    "coach.noResponse":
      "Run a coaching prompt to generate the first structured response.",
    "coach.sessions.eyebrow": "Supabase history",
    "coach.sessions.title": "Saved sessions",
    "coach.noSessions": "No saved sessions yet.",
    "coach.empty.title": "The coach needs your profile context",
    "coach.empty.body":
      "Save a profile first so the AI advice can anchor to your calories, macros, goal, allergens, and meal plan.",
    "coach.empty.cta": "Go to Profile",

    // SetupMissingPage
    "setup.eyebrow": "Configuration required",
    "setup.title": "Finish the environment wiring.",
    "setup.desc":
      "EatFit Web needs a Clerk publishable key and Supabase frontend credentials in the `web/` environment before authentication and persistence can run end to end.",
    "setup.clerk": "VITE_CLERK_PUBLISHABLE_KEY",
    "setup.supabaseUrl": "VITE_SUPABASE_URL",
    "setup.supabaseKey": "VITE_SUPABASE_ANON_KEY",
    "setup.configured": "configured",
    "setup.missing": "missing",

    // MissingClerkApp
    "noclerk.eyebrow": "Missing Clerk key",
    "noclerk.title": "Add `VITE_CLERK_PUBLISHABLE_KEY` to continue.",
    "noclerk.desc":
      "The landing page is available, but authentication screens and the protected dashboard require a valid Clerk publishable key.",
    "noclerk.current": "Current value",

    // Language switcher
    "lang.switch": "中文",

    // Goal labels
    "goal.lose_fat": "Fat Loss",
    "goal.maintain": "Maintenance",
    "goal.gain_muscle": "Muscle Gain",

    // Activity labels
    "activity.sedentary": "Sedentary",
    "activity.light": "Light",
    "activity.moderate": "Moderate",
    "activity.active": "Active",
    "activity.very_active": "Very Active",

    // Meal labels
    "meal.breakfast": "Breakfast",
    "meal.lunch": "Lunch",
    "meal.dinner": "Dinner",
    "meal.snack": "Snack",
  },

  zh: {
    // Home / Nav
    "home.brand": "EatFit 吃什么",
    "home.brandTagline": "AI 饮食管家",
    "home.nav.features": "功能",
    "home.nav.download": "下载",
    "home.nav.signIn": "登录",
    "home.nav.getStarted": "开始使用",

    // LandingHero
    "hero.badge": "产品面板",
    "hero.title": "精准营养管理平台，像你的自律一样出色。",
    "hero.subtitle":
      "EatFit 提供完整的日常饮食管理系统：个性化营养目标、智能食谱生成、买菜清单聚合，以及 AI 营养顾问为你推送下一步行动。",
    "hero.ctaPrimary": "立即注册",
    "hero.ctaSecondary": "了解功能",
    "hero.board.title": "今日操作面板",
    "hero.board.target": "目标 2,214 kcal",
    "hero.board.protein": "蛋白质",
    "hero.board.carbs": "碳水",
    "hero.board.fat": "脂肪",
    "hero.board.quality": "计划评分",
    "hero.board.qualityDesc": "结构化教练指导，含风险提示、行动建议和饮食策略。",
    "hero.board.flow": "流程",
    "hero.board.flow1": "Clerk 身份认证",
    "hero.board.flow2": "Supabase 数据持久化",
    "hero.board.flow3": "FastAPI 营养引擎",

    // FeatureGrid
    "features.adaptive.title": "自适应宏量目标",
    "features.adaptive.body":
      "FastAPI 根据体测数据和目标直接计算 BMR、TDEE 和宏量分配。",
    "features.coach.title": "结构化 AI 顾问",
    "features.coach.body":
      "建议包含标题、摘要、评分、风险提示、营养洞察、行动建议和饮食策略。",
    "features.grocery.title": "从计划生成买菜清单",
    "features.grocery.body":
      "食材按类别聚合，每日计划直接转化为可执行的购物清单。",
    "features.security.title": "用户数据隔离",
    "features.security.body":
      "Clerk 保护身份安全，Supabase RLS 隔离每个档案、计划快照和顾问会话。",

    // WorkflowStrip
    "workflow.eyebrow": "操作流程",
    "workflow.step1.title": "01. 录入体测数据",
    "workflow.step1.body":
      "身体数据、运动量、目标、过敏原和偏好保存到 Supabase。",
    "workflow.step2.title": "02. 生成今日计划",
    "workflow.step2.body":
      "面板从 FastAPI 营养引擎获取无状态计划和买菜清单。",
    "workflow.step3.title": "03. 闭环优化",
    "workflow.step3.body":
      "AI 顾问将上下文转化为精准建议，并保存会话供后续复盘。",

    // AppDownload
    "download.eyebrow": "下载",
    "download.title": "随时随地，吃得明白。",
    "download.subtitle":
      "EatFit 支持网页、Android 和 iOS 三端。下载原生 App，体验更流畅的体测录入、食谱查看和烹饪引导。",
    "download.android.title": "Android 安装包",
    "download.android.desc": "下载 APK 安装包，支持 Android 7.0+ 设备。",
    "download.android.button": "下载",
    "download.ios.title": "iOS",
    "download.ios.desc": "iOS 客户端已就绪，需通过 Xcode 自行编译安装。",
    "download.ios.button": "源码",
    "download.web.title": "Web 版",
    "download.web.desc": "无需安装，浏览器直接使用。",
    "download.web.button": "立即体验",
    "download.qr.title": "扫码下载",
    "download.qr.desc": "用手机扫描二维码，直接下载 EatFit App。",

    // FaqList
    "faq.eyebrow": "常见问题",
    "faq.heading": "为真实产品而设计，不是一次性 Demo。",
    "faq.q1": "用户数据存在哪里？",
    "faq.a1":
      "Web 端用户数据存储在 Supabase 中，通过绑定 Clerk 用户身份的行级安全策略进行隔离。",
    "faq.q2": "营养逻辑由什么驱动？",
    "faq.a2":
      "现有 FastAPI 后端负责营养目标计算、食谱规划、买菜清单聚合和 AI 顾问调度。",
    "faq.q3": "没有档案可以使用面板吗？",
    "faq.a3":
      "可以登录并浏览界面，但在保存营养档案之前，计划和顾问功能将保持锁定。",

    // Footer
    "footer.desc":
      "个性化营养规划、智能食谱生成和 AI 营养顾问 — 由 Clerk、Supabase 和 FastAPI 驱动。",
    "footer.copyright": "© 2026 EatFit. 保留所有权利。",

    // SignIn / SignUp
    "signin.eyebrow": "EatFit 登录",
    "signin.title": "登录你的营养操作面板。",
    "signin.subtitle":
      "你的面板集中管理档案数据、计划快照、买菜清单和 AI 顾问会话。",
    "signin.back": "返回首页",
    "signup.eyebrow": "从这里开始",
    "signup.title": "创建账号，解锁完整的 EatFit 面板。",
    "signup.subtitle":
      "一次注册，将档案保存到 Supabase，在每次会话中使用相同的计划和顾问循环。",
    "signup.back": "返回首页",

    // AppShell
    "shell.brandTagline": "饮食管家",
    "shell.signedInAs": "登录身份",
    "shell.signedInDesc": "个性化营养面板",
    "shell.nav.overview": "总览",
    "shell.nav.profile": "档案",
    "shell.nav.plan": "计划",
    "shell.nav.recipes": "食谱",
    "shell.nav.grocery": "买菜",
    "shell.nav.coach": "AI 顾问",
    "shell.operatingNote": "运行说明",
    "shell.operatingDesc":
      "档案数据存储在 Supabase。计划和顾问通过 FastAPI 营养引擎根据最新输入计算。",

    // ProtectedRoute
    "protected.loading": "正在加载工作区...",

    // DashboardHome
    "dash.overview": "面板总览",
    "dash.welcome": "欢迎回来，{name}。",
    "dash.reviewing": "查看 {date}，当前目标：{goal}。",
    "dash.openCoach": "打开 AI 顾问",
    "dash.targetCalories": "目标热量",
    "dash.protein": "蛋白质",
    "dash.plannedMeals": "计划餐次",
    "dash.coachSessions": "顾问会话",
    "dash.metaGenerated": "根据最新档案生成",
    "dash.metaDailyTarget": "每日目标",
    "dash.metaBreakfast": "从早餐到加餐全覆盖",
    "dash.metaSupabase": "已保存到 Supabase",
    "dash.todayLineup": "今日餐次",
    "dash.noPlanYet": "暂无生成的计划。",
    "dash.executionSummary": "执行摘要",
    "dash.saveProfile": "保存档案以解锁计算。",
    "dash.latestMomentum": "最新顾问动态",
    "dash.noCoachHistory":
      "暂无顾问记录。打开顾问工作区开始第一次会话。",

    // EmptyState (profile)
    "empty.profile.title": "面板已就绪，但还没有你的档案。",
    "empty.profile.body":
      "先完成营养档案，EatFit 才能计算目标、生成食谱，并让 AI 顾问基于真实数据提供建议。",
    "empty.profile.cta": "设置档案",

    // ProfilePage
    "profile.eyebrow": "Supabase",
    "profile.title": "营养档案",
    "profile.name": "姓名",
    "profile.age": "年龄",
    "profile.height": "身高 (cm)",
    "profile.weight": "体重 (kg)",
    "profile.bodyFat": "体脂率 %",
    "profile.gender": "性别",
    "profile.male": "男",
    "profile.female": "女",
    "profile.goal": "目标",
    "profile.activity": "运动量",
    "profile.diet": "饮食偏好",
    "profile.dietPlaceholder": "素食、高蛋白等",
    "profile.allergens": "过敏原（逗号分隔）",
    "profile.allergensPlaceholder": "虾、花生",
    "profile.disliked": "忌口标签（逗号分隔）",
    "profile.dislikedPlaceholder": "鱼、辣",
    "profile.save": "保存档案",
    "profile.saving": "保存中...",
    "profile.lastUpdated": "最后更新于 {date}",
    "profile.createHint": "创建一次档案，EatFit 将持久化到 Supabase。",
    "profile.noProfileTitle": "尚无档案记录",
    "profile.noProfileBody":
      "保存表单后，面板将开始生成目标、计划、买菜清单和 AI 顾问会话。",

    // PlanPage
    "plan.eyebrow": "计划",
    "plan.title": "每日饮食计划",
    "plan.viewing":
      "查看 {date}。每次请求使用最新的 Supabase 档案数据和后端食谱规划器。",
    "plan.noData": "该日期暂无数据。",
    "plan.calories": "热量",
    "plan.protein": "蛋白质",
    "plan.carbs": "碳水",
    "plan.fat": "脂肪",
    "plan.empty.title": "需要档案才能生成计划",
    "plan.empty.body":
      "先保存档案，规划器才能获取热量、宏量目标、过敏原和偏好的真实输入。",
    "plan.empty.cta": "前往档案",

    // RecipesPage
    "recipes.eyebrow": "食谱库",
    "recipes.title": "食谱库",
    "recipes.allMeals": "全部餐次",
    "recipes.breakfast": "早餐",
    "recipes.lunch": "午餐",
    "recipes.dinner": "晚餐",
    "recipes.snack": "加餐",
    "recipes.filterPlaceholder": "按标签筛选",
    "recipes.calories": "热量",
    "recipes.protein": "蛋白质",
    "recipes.carbs": "碳水",
    "recipes.cookTime": "{min} 分钟",
    "recipes.empty.title": "没有匹配当前筛选的食谱",
    "recipes.empty.body": "调整餐次或标签筛选以查看内置食谱库。",

    // GroceryPage
    "grocery.eyebrow": "买菜",
    "grocery.title": "买菜清单",
    "grocery.generateFirst": "请先生成计划。",
    "grocery.empty.title": "需要档案才能生成买菜清单",
    "grocery.empty.body":
      "先保存档案和每日计划。EatFit 会根据这些信息聚合食材生成购物清单。",
    "grocery.empty.cta": "前往档案",

    // CoachPage
    "coach.eyebrow": "输入",
    "coach.title": "顾问控制台",
    "coach.focus.dailyReview": "每日复盘",
    "coach.focus.mealStrategy": "饮食策略",
    "coach.focus.eatingOut": "外食建议",
    "coach.focus.cravings": "嘴馋应对",
    "coach.context": "上下文",
    "coach.contextPlaceholder": "回顾今天，告诉我明天该怎么调整。",
    "coach.generate": "生成建议",
    "coach.generating": "正在生成建议...",
    "coach.response.eyebrow": "输出",
    "coach.response.title": "结构化回复",
    "coach.headline": "标题",
    "coach.score": "评分",
    "coach.disclaimer": "免责声明",
    "coach.riskAlerts": "风险提示",
    "coach.nutritionInsights": "营养洞察",
    "coach.nextActions": "行动建议",
    "coach.mealStrategy": "饮食策略",
    "coach.noResponse": "运行一个顾问提示来生成第一条结构化回复。",
    "coach.sessions.eyebrow": "历史记录",
    "coach.sessions.title": "已保存的会话",
    "coach.noSessions": "暂无已保存的会话。",
    "coach.empty.title": "顾问需要你的档案信息",
    "coach.empty.body":
      "先保存档案，AI 建议才能基于你的热量、宏量、目标、过敏原和饮食计划。",
    "coach.empty.cta": "前往档案",

    // SetupMissingPage
    "setup.eyebrow": "需要配置",
    "setup.title": "完成环境配置。",
    "setup.desc":
      "EatFit Web 需要 Clerk 公钥和 Supabase 前端凭证才能运行认证和数据持久化。",
    "setup.clerk": "VITE_CLERK_PUBLISHABLE_KEY",
    "setup.supabaseUrl": "VITE_SUPABASE_URL",
    "setup.supabaseKey": "VITE_SUPABASE_ANON_KEY",
    "setup.configured": "已配置",
    "setup.missing": "未配置",

    // MissingClerkApp
    "noclerk.eyebrow": "缺少 Clerk 密钥",
    "noclerk.title": "请添加 `VITE_CLERK_PUBLISHABLE_KEY` 以继续。",
    "noclerk.desc":
      "首页可以浏览，但认证界面和受保护的面板需要有效的 Clerk 公钥。",
    "noclerk.current": "当前状态",

    // Language switcher
    "lang.switch": "EN",

    // Goal labels
    "goal.lose_fat": "减脂",
    "goal.maintain": "保持",
    "goal.gain_muscle": "增肌",

    // Activity labels
    "activity.sedentary": "久坐",
    "activity.light": "轻度",
    "activity.moderate": "中度",
    "activity.active": "活跃",
    "activity.very_active": "极度活跃",

    // Meal labels
    "meal.breakfast": "早餐",
    "meal.lunch": "午餐",
    "meal.dinner": "晚餐",
    "meal.snack": "加餐",
  },
};
