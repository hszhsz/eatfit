const api = require('../../utils/api')
const app = getApp()

Page({
  data: {
    loading: true,
    dateLabel: '',
    profile: null,
    plan: null,
    target: null,
    nutritionPct: 0,
    mealLabels: api.MEAL_LABELS,
    mealEmojis: api.MEAL_EMOJI,
  },

  onLoad() {
    this.setData({ dateLabel: api.formatDate(api.todayISO()) })
  },

  onShow() {
    // 每次显示时检查 profile
    if (app.hasProfile()) {
      this.loadPlan()
    } else {
      this.setData({ loading: false, profile: null })
    }
  },

  onPullDownRefresh() {
    if (app.hasProfile()) {
      this.loadPlan(() => wx.stopPullDownRefresh())
    } else {
      wx.stopPullDownRefresh()
    }
  },

  async loadPlan(cb) {
    const profile = app.globalData.profile
    this.setData({ loading: true, profile })

    try {
      const plan = await api.fetchPlan(profile)
      const target = plan.target
      const pct = target.targetCalories > 0
        ? Math.min(Math.round(plan.totalCalories / target.targetCalories * 100), 100)
        : 0

      app.globalData.todayPlan = plan
      app.globalData.todayTarget = target

      this.setData({ plan, target, nutritionPct: pct, loading: false })
    } catch (err) {
      console.error('loadPlan error:', err)
      wx.showToast({ title: '加载失败，下拉刷新重试', icon: 'none' })
      this.setData({ loading: false })
    } finally {
      cb && cb()
    }
  },

  goOnboarding() {
    wx.navigateTo({ url: '/pages/onboarding/onboarding' })
  },

  goRecipeDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/recipe-detail/recipe-detail?id=${id}` })
  },

  goCoach() {
    wx.switchTab({ url: '/pages/coach/coach' })
  },

  goGrocery() {
    wx.switchTab({ url: '/pages/grocery/grocery' })
  },
})
