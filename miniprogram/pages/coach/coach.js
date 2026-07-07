const api = require('../../utils/api')
const app = getApp()

Page({
  data: {
    loading: false,
    profile: null,
    advice: null,
    selectedFocus: 'daily_review',
    focusOptions: [
      { value: 'daily_review', label: '今日复盘', emoji: '📊' },
      { value: 'meal_strategy', label: '下一餐策略', emoji: '🍽️' },
      { value: 'eating_out', label: '外食选择', emoji: '🍜' },
      { value: 'cravings', label: '嘴馋管理', emoji: '🍫' },
    ],
    userMessage: '',
  },

  onShow() {
    if (app.hasProfile()) {
      this.setData({ profile: app.globalData.profile })
    }
  },

  onMessageInput(e) {
    this.setData({ userMessage: e.detail.value })
  },

  onFocusTap(e) {
    const { value } = e.currentTarget.dataset
    this.setData({ selectedFocus: value })
  },

  async getAdvice() {
    const { profile, selectedFocus, userMessage } = this.data
    if (!profile) {
      wx.showToast({ title: '请先录入体测', icon: 'none' })
      return
    }

    this.setData({ loading: true })

    try {
      const advice = await api.fetchCoachAdvice(profile, api.todayISO(), {
        focus: selectedFocus,
        message: userMessage || undefined,
      })
      this.setData({ advice, loading: false })
    } catch (err) {
      console.error('getAdvice:', err)
      wx.showToast({ title: 'AI 教练暂时离线', icon: 'none' })
      this.setData({ loading: false })
    }
  },
})
