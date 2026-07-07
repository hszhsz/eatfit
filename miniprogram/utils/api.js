/**
 * EatFit API 封装
 * 后端部署在 Vercel，小程序直接调用
 * 后端返回 snake_case，这里做 camelCase 映射
 */

const app = getApp()

const BASE = app.globalData.apiBaseUrl

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE}${path}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header,
      },
      timeout: 30000,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(new Error(res.data?.detail || `请求失败: ${res.statusCode}`))
        }
      },
      fail(err) {
        reject(err)
      },
    })
  })
}

/** 构造 profile payload（camelCase → snake_case） */
function profilePayload(profile) {
  return {
    name: profile.name,
    gender: profile.gender,
    age: Number(profile.age),
    height_cm: Number(profile.heightCm),
    weight_kg: Number(profile.weightKg),
    body_fat_pct: profile.bodyFatPct ? Number(profile.bodyFatPct) : null,
    activity_level: profile.activityLevel,
    goal: profile.goal,
    allergens: profile.allergens || [],
    disliked_tags: profile.dislikedTags || [],
    diet_preference: profile.dietPreference || null,
  }
}

// ========== Response 映射 snake_case → camelCase ==========

function mapRecipe(r) {
  return {
    id: r.id,
    name: r.name,
    mealType: r.meal_type,
    calories: r.calories,
    proteinG: r.protein_g,
    carbsG: r.carbs_g,
    fatG: r.fat_g,
    tags: r.tags || [],
    allergens: r.allergens || [],
    cookMinutes: r.cook_minutes,
    ingredients: (r.ingredients || []).map(ing => ({
      name: ing.name,
      amountG: ing.amount_g,
      category: ing.category,
    })),
    steps: r.steps || [],
    imageEmoji: r.image_emoji || '🍽️',
    imageUrl: r.image_url || null,
  }
}

function mapTarget(t) {
  return {
    bmr: t.bmr,
    tdee: t.tdee,
    targetCalories: t.target_calories,
    proteinG: t.protein_g,
    carbsG: t.carbs_g,
    fatG: t.fat_g,
    explanation: t.explanation,
  }
}

function mapPlan(p) {
  return {
    date: p.date,
    profileId: p.profile_id,
    target: mapTarget(p.target),
    meals: (p.meals || []).map(m => ({
      mealType: m.meal_type,
      recipe: mapRecipe(m.recipe),
    })),
    totalCalories: p.total_calories,
    totalProteinG: p.total_protein_g,
    totalCarbsG: p.total_carbs_g,
    totalFatG: p.total_fat_g,
  }
}

function mapGrocery(g) {
  const grouped = {}
  Object.entries(g.grouped || {}).forEach(([key, items]) => {
    grouped[key] = items.map(item => ({
      name: item.name,
      totalAmountG: item.total_amount_g,
      category: item.category,
    }))
  })
  return {
    date: g.date,
    profileId: g.profile_id,
    items: (g.items || []).map(item => ({
      name: item.name,
      totalAmountG: item.total_amount_g,
      category: item.category,
    })),
    grouped,
  }
}

function mapCoach(c) {
  return {
    focus: c.focus,
    headline: c.headline,
    summary: c.summary,
    score: c.score,
    riskAlerts: c.risk_alerts || [],
    nutritionInsights: c.nutrition_insights || [],
    nextActions: c.next_actions || [],
    mealStrategy: c.meal_strategy || [],
    disclaimer: c.disclaimer,
  }
}

// ========== API 方法 ==========

function health() {
  return request('/api/health')
}

function fetchRecipes(filter = {}) {
  const params = []
  if (filter.mealType) params.push(`meal_type=${filter.mealType}`)
  if (filter.tag) params.push(`tag=${filter.tag}`)
  const qs = params.length ? '?' + params.join('&') : ''
  return request(`/api/recipes${qs}`).then(list => list.map(mapRecipe))
}

function fetchRecipeDetail(id) {
  return request(`/api/recipes/${id}`).then(mapRecipe)
}

function computeTarget(profile) {
  return request('/api/web/target', {
    method: 'POST',
    data: { profile: profilePayload(profile) },
  }).then(mapTarget)
}

function fetchPlan(profile, date) {
  return request('/api/web/plan', {
    method: 'POST',
    data: {
      profile: profilePayload(profile),
      date: date || todayISO(),
    },
  }).then(mapPlan)
}

function fetchGrocery(profile, date) {
  return request('/api/web/grocery', {
    method: 'POST',
    data: {
      profile: profilePayload(profile),
      date: date || todayISO(),
    },
  }).then(mapGrocery)
}

function fetchCoachAdvice(profile, date, coachRequest) {
  return request('/api/web/coach/advice', {
    method: 'POST',
    data: {
      profile: profilePayload(profile),
      date: date || todayISO(),
      request: coachRequest,
    },
  }).then(mapCoach)
}

// ========== 工具函数 ==========

function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDate(iso) {
  const d = new Date(iso)
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `周${weekdays[d.getDay()]} · ${d.getMonth() + 1}月${d.getDate()}日`
}

// ========== 常量 ==========

const MEAL_LABELS = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
}

const MEAL_EMOJI = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
}

const GOAL_LABELS = {
  lose_fat: '减脂',
  maintain: '保持',
  gain_muscle: '增肌',
}

const ACTIVITY_LABELS = {
  sedentary: '久坐',
  light: '轻度活动',
  moderate: '中度活动',
  active: '高度活动',
  very_active: '极高强度',
}

const COACH_FOCUS_LABELS = {
  daily_review: '今日复盘',
  meal_strategy: '下一餐策略',
  eating_out: '外食选择',
  cravings: '嘴馋管理',
}

module.exports = {
  request,
  health,
  fetchRecipes,
  fetchRecipeDetail,
  computeTarget,
  fetchPlan,
  fetchGrocery,
  fetchCoachAdvice,
  todayISO,
  formatDate,
  MEAL_LABELS,
  MEAL_EMOJI,
  GOAL_LABELS,
  ACTIVITY_LABELS,
  COACH_FOCUS_LABELS,
}
