export type Lang = "en" | "zh";

type TranslationDict = Record<string, string>;

export const translations: Record<Lang, TranslationDict> = {
  en: {
    // Home / Nav
    "home.brand": "EatFit",
    "home.brandTagline": "AI Nutrition Coach",
    "home.nav.features": "Features",
    "home.nav.pricing": "Pricing",
    "home.nav.download": "Download",
    "home.nav.signIn": "Sign In",
    "home.nav.getStarted": "Get Started",

    // LandingHero
    "hero.badge": "AI Nutrition Coach",
    "hero.title": "Eat smart in 3 minutes a day.",
    "hero.subtitle":
      "No more staring at the fridge. AI builds personalized meal plans from your body metrics — complete with grocery lists and cooking guides.",
    "hero.ctaPrimary": "Try Free",
    "hero.ctaSecondary": "See Demo",
    "hero.stat1": "3s",
    "hero.stat1.label": "Meal plan generated",
    "hero.stat2": "1850",
    "hero.stat2.label": "kcal precision target",
    "hero.stat3": "4",
    "hero.stat3.label": "Meals per day",

    // ProductShowcase
    "showcase.eyebrow": "Product Preview",
    "showcase.title": "Your pocket nutritionist",
    "showcase.subtitle":
      "Three screens, one workflow — from body data to dinner plate.",
    "showcase.screen1": "Dashboard",
    "showcase.screen1.desc": "Calories & macros at a glance",
    "showcase.screen2": "AI Meal Plan",
    "showcase.screen2.desc": "Full day of meals in 3 seconds",
    "showcase.screen3": "Grocery List",
    "showcase.screen3.desc": "One tap to order fresh ingredients",

    // FeatureGrid
    "features.main.title": "AI Meal Planning",
    "features.main.body":
      "Based on your BMI, body fat, activity level, and goals — AI generates breakfast, lunch, dinner, and snacks in 3 seconds. Every recipe comes with detailed steps and nutrition labels.",
    "features.adaptive.title": "Body Metrics Tracking",
    "features.adaptive.body":
      "Sync with smart scales and wearables. Weight, BMI, and body fat trends visualized clearly.",
    "features.grocery.title": "One-Tap Grocery",
    "features.grocery.body":
      "Ingredients sorted by category with estimated total. Jump directly to fresh delivery platforms.",
    "features.security.title": "Allergen Safety",
    "features.security.body":
      "Auto-filter allergens — nuts, seafood, gluten — one tap to flag. Protect your family's health.",

    // WorkflowStrip
    "workflow.eyebrow": "3 Steps",
    "workflow.title": "From body scan to dining table in 3 minutes",
    "workflow.step1.title": "Input Body Metrics",
    "workflow.step1.body":
      "Height, weight, body fat, activity level, taste preferences — done in 30 seconds.",
    "workflow.step2.title": "AI Generates Meals",
    "workflow.step2.body":
      "Daily macro targets + breakfast, lunch, dinner, and snacks. Allergens auto-filtered.",
    "workflow.step3.title": "Shop & Cook",
    "workflow.step3.body":
      "Grocery list sorted by category. Cooking steps in large text — easy to read in the kitchen.",

    // PricingSection
    "pricing.eyebrow": "Pricing",
    "pricing.title": "Simple, transparent pricing",
    "pricing.subtitle": "Start free, upgrade anytime.",
    "pricing.free.name": "Free",
    "pricing.free.price": "¥0",
    "pricing.free.period": "/forever",
    "pricing.free.desc": "Basic metrics + daily meals",
    "pricing.free.f1": "1 AI meal plan per day",
    "pricing.free.f2": "Basic body tracking",
    "pricing.free.f3": "3-day history",
    "pricing.free.cta": "Get Started",
    "pricing.pro.name": "Pro",
    "pricing.pro.price": "¥19.9",
    "pricing.pro.period": "/mo",
    "pricing.pro.desc": "Unlimited plans + grocery + AI coach",
    "pricing.pro.f1": "Unlimited AI meal plans",
    "pricing.pro.f2": "Smart grocery lists",
    "pricing.pro.f3": "AI nutrition coach",
    "pricing.pro.f4": "Allergen management",
    "pricing.pro.f5": "30-day history",
    "pricing.pro.cta": "Upgrade to Pro",
    "pricing.pro.badge": "Most Popular",
    "pricing.pro2.name": "Professional",
    "pricing.pro2.price": "¥99",
    "pricing.pro2.period": "/mo",
    "pricing.pro2.desc": "Team management + export + priority",
    "pricing.pro2.f1": "All Pro features",
    "pricing.pro2.f2": "Multi-profile management",
    "pricing.pro2.f3": "Data export (CSV/PDF)",
    "pricing.pro2.f4": "Priority support",
    "pricing.pro2.f5": "Weekly planning mode",
    "pricing.pro2.cta": "Contact Us",

    // CTABanner
    "cta.title": "Let AI decide what to eat",
    "cta.subtitle": "3 minutes a day to healthy eating — starting today.",
    "cta.button": "Try EatFit Free",

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
    "faq.heading": "Everything you want to know",
    "faq.q1": "How does the AI meal plan work?",
    "faq.a1":
      "EatFit uses your body metrics (BMI, body fat, activity level) and goals (fat loss, muscle gain, maintenance) to calculate daily calorie and macro targets, then generates a full day of meals that fit those targets.",
    "faq.q2": "Can I set allergens and food preferences?",
    "faq.a2":
      "Yes. Mark allergens (nuts, seafood, gluten, etc.) and disliked ingredients in your profile. The AI will automatically filter them from all meal plans.",
    "faq.q3": "Does it support weekly meal planning?",
    "faq.a3":
      "Pro and Professional plans support weekly planning — generate 7 days of meals at once and get a consolidated grocery list for the entire week.",
    "faq.q4": "Where is my data stored?",
    "faq.a4":
      "All profile data is encrypted and stored securely. Your body metrics and meal plans are private to your account and never shared with third parties.",
    "faq.q5": "Can I cancel my subscription anytime?",
    "faq.a5":
      "Yes. Subscriptions can be cancelled at any time from your account settings. You keep access until the end of the current billing period.",
    "faq.q6": "What's the difference between Pro and Professional?",
    "faq.a6":
      "Pro is for individuals — unlimited meal plans, grocery lists, and AI coaching. Professional adds multi-profile management, data export, weekly planning, and priority support for families or small teams.",

    // Footer
    "footer.desc":
      "AI-powered personalized nutrition planning, meal generation, and smart grocery lists.",
    "footer.copyright": "© 2026 EatFit. All rights reserved.",

    // SignIn / SignUp
    "signin.eyebrow": "EatFit Access",
    "signin.title": "Sign in to your nutrition dashboard.",
    "signin.subtitle":
      "Your dashboard keeps profile data, meal plans, grocery lists, and AI coaching sessions in one place.",
    "signin.back": "Back to home",
    "signup.eyebrow": "Start Here",
    "signup.title": "Create your EatFit account.",
    "signup.subtitle":
      "Register once, save your profile, and get personalized meal plans every day.",
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
      "Profile data is saved securely. Plans and coaching are computed from your latest inputs.",

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
    "dash.metaSupabase": "Saved to database",
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
    "profile.eyebrow": "Profile",
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
      "Create the profile once and EatFit will remember it.",
    "profile.noProfileTitle": "No profile row yet",
    "profile.noProfileBody":
      "Once you save the form above, the dashboard will start generating targets, plans, grocery output, and AI coach sessions.",
    "profile.clerkSessionErrorTitle": "Session error detected",
    "profile.clerkSessionErrorBody":
      "Clerk's local session storage is not working correctly. This often happens when browser IndexedDB data becomes stale after an app update. Sign out and sign back in to fix it.",
    "profile.signOutAndBack": "Sign out & back in →",

    // PlanPage
    "plan.eyebrow": "Planner",
    "plan.title": "Daily meal plan",
    "plan.viewing":
      "Viewing {date}. Every request uses your latest profile data and the meal planner.",
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
    "coach.sessions.eyebrow": "History",
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
      "EatFit Web needs a Clerk publishable key and Supabase frontend credentials in the environment before authentication and persistence can run end to end.",
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
    "home.nav.pricing": "定价",
    "home.nav.download": "下载",
    "home.nav.signIn": "登录",
    "home.nav.getStarted": "免费开始",

    // LandingHero
    "hero.badge": "AI 体测饮食管家",
    "hero.title": "每天 3 分钟，吃得明明白白",
    "hero.subtitle":
      "不用再盯着冰箱发呆。AI 根据你的体测数据，一键生成个性化食谱、买菜清单和烹饪引导。",
    "hero.ctaPrimary": "免费体验",
    "hero.ctaSecondary": "看产品演示",
    "hero.stat1": "3秒",
    "hero.stat1.label": "生成一日食谱",
    "hero.stat2": "1850",
    "hero.stat2.label": "kcal 精准目标",
    "hero.stat3": "4餐",
    "hero.stat3.label": "每日三餐+加餐",

    // ProductShowcase
    "showcase.eyebrow": "产品预览",
    "showcase.title": "你的口袋营养师",
    "showcase.subtitle": "三个界面，一条链路——从体测数据到餐桌",
    "showcase.screen1": "今日面板",
    "showcase.screen1.desc": "热量与营养一目了然",
    "showcase.screen2": "AI 食谱",
    "showcase.screen2.desc": "3 秒生成一日三餐",
    "showcase.screen3": "买菜清单",
    "showcase.screen3.desc": "一键下单食材到家",

    // FeatureGrid
    "features.main.title": "AI 智能配餐",
    "features.main.body":
      "根据你的 BMI、体脂率、运动量和目标，3 秒生成一日三餐+加餐，每道菜配详细步骤和营养标注。自动避开过敏原和忌口食材。",
    "features.adaptive.title": "体测数据追踪",
    "features.adaptive.body":
      "对接体脂秤和智能手环，体重、BMI、体脂率变化趋势一目了然。",
    "features.grocery.title": "一键买菜",
    "features.grocery.body":
      "食材按类别分类，预估总价，直接跳转生鲜平台下单。",
    "features.security.title": "过敏原管理",
    "features.security.body":
      "自动过滤过敏食材——坚果、海鲜、麸质一键标记，保护家人健康。",

    // WorkflowStrip
    "workflow.eyebrow": "三步搞定",
    "workflow.title": "从体测到餐桌，只需 3 分钟",
    "workflow.step1.title": "录入体测",
    "workflow.step1.body":
      "身高、体重、体脂率、运动量、口味偏好——30 秒搞定。",
    "workflow.step2.title": "AI 生成食谱",
    "workflow.step2.body":
      "每日营养配比 + 早中晚加餐菜谱，自动避开过敏原和忌口。",
    "workflow.step3.title": "买菜 & 烹饪",
    "workflow.step3.body":
      "买菜清单按类别整理，烹饪步骤大字显示，厨房也能看。",

    // PricingSection
    "pricing.eyebrow": "定价",
    "pricing.title": "简单透明的价格",
    "pricing.subtitle": "免费开始，随时升级",
    "pricing.free.name": "免费版",
    "pricing.free.price": "¥0",
    "pricing.free.period": "/永久",
    "pricing.free.desc": "基础体测 + 每日食谱",
    "pricing.free.f1": "每日 1 次 AI 食谱",
    "pricing.free.f2": "基础体测追踪",
    "pricing.free.f3": "3 天历史记录",
    "pricing.free.cta": "免费开始",
    "pricing.pro.name": "Pro 版",
    "pricing.pro.price": "¥19.9",
    "pricing.pro.period": "/月",
    "pricing.pro.desc": "无限食谱 + 买菜单 + AI 顾问",
    "pricing.pro.f1": "无限 AI 食谱生成",
    "pricing.pro.f2": "智能买菜清单",
    "pricing.pro.f3": "AI 营养顾问",
    "pricing.pro.f4": "过敏原 & 忌口管理",
    "pricing.pro.f5": "30 天历史记录",
    "pricing.pro.cta": "升级 Pro",
    "pricing.pro.badge": "最受欢迎",
    "pricing.pro2.name": "专业版",
    "pricing.pro2.price": "¥99",
    "pricing.pro2.period": "/月",
    "pricing.pro2.desc": "团队管理 + 数据导出 + 优先支持",
    "pricing.pro2.f1": "全部 Pro 功能",
    "pricing.pro2.f2": "多人档案管理",
    "pricing.pro2.f3": "数据导出 (CSV/PDF)",
    "pricing.pro2.f4": "优先客服支持",
    "pricing.pro2.f5": "周计划模式",
    "pricing.pro2.cta": "联系开通",

    // CTABanner
    "cta.title": "让 AI 替你决定吃什么",
    "cta.subtitle": "从今天起，每天 3 分钟搞定健康饮食",
    "cta.button": "免费体验 EatFit",

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
    "faq.heading": "你想知道的，都在这里",
    "faq.q1": "AI 食谱是怎么生成的？",
    "faq.a1":
      "EatFit 根据你的体测数据（BMI、体脂率、运动量）和目标（减脂、增肌、维持）计算每日热量和宏量营养素目标，然后生成符合目标的一日三餐+加餐食谱。",
    "faq.q2": "可以设置过敏原和忌口吗？",
    "faq.a2":
      "可以。在档案中标记过敏原（坚果、海鲜、麸质等）和忌口食材，AI 会自动从所有食谱中过滤。",
    "faq.q3": "支持一周食谱规划吗？",
    "faq.a3":
      "Pro 和专业版支持周计划模式——一次性生成 7 天食谱，并汇总一份完整的一周买菜清单。",
    "faq.q4": "我的数据安全吗？",
    "faq.a4":
      "所有档案数据加密存储。你的体测数据和食谱计划仅你本人可见，绝不会分享给第三方。",
    "faq.q5": "可以随时取消订阅吗？",
    "faq.a5":
      "可以。随时在账户设置中取消订阅，取消后当前计费周期结束前仍可使用所有功能。",
    "faq.q6": "Pro 版和专业版有什么区别？",
    "faq.a6":
      "Pro 版面向个人用户——无限食谱、买菜清单和 AI 顾问。专业版增加多人档案管理、数据导出、周计划模式和优先客服，适合家庭或小团队。",

    // Footer
    "footer.desc":
      "AI 驱动的个性化营养规划、智能食谱生成和买菜清单服务。",
    "footer.copyright": "© 2026 EatFit. 保留所有权利。",

    // SignIn / SignUp
    "signin.eyebrow": "EatFit 登录",
    "signin.title": "登录你的营养面板。",
    "signin.subtitle":
      "你的面板集中管理档案数据、食谱计划、买菜清单和 AI 顾问会话。",
    "signin.back": "返回首页",
    "signup.eyebrow": "从这里开始",
    "signup.title": "创建你的 EatFit 账号。",
    "signup.subtitle":
      "一次注册，保存档案，每天获得个性化食谱计划。",
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
      "档案数据安全存储。计划和顾问根据最新输入实时计算。",

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
    "dash.metaSupabase": "已保存到数据库",
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
    "profile.eyebrow": "档案",
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
    "profile.createHint": "创建一次档案，EatFit 将自动记住。",
    "profile.noProfileTitle": "尚无档案记录",
    "profile.noProfileBody":
      "保存表单后，面板将开始生成目标、计划、买菜清单和 AI 顾问会话。",
    "profile.clerkSessionErrorTitle": "检测到会话错误",
    "profile.clerkSessionErrorBody":
      "Clerk 本地会话存储工作异常，通常发生在 App 更新后浏览器 IndexedDB 数据过期。请退出登录并重新登录以修复。",
    "profile.signOutAndBack": "退出并重新登录 →",

    // PlanPage
    "plan.eyebrow": "计划",
    "plan.title": "每日饮食计划",
    "plan.viewing":
      "查看 {date}。每次请求使用最新的档案数据和食谱规划器。",
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
