const api = require('../../utils/api')
const app = getApp()

Page({
  data: {
    profile: null,
    target: null,
    goalLabels: api.GOAL_LABELS,
    activityLabels: api.ACTIVITY_LABELS,
  },

  onShow() {
    if (app.hasProfile()) {
      this.setData({ profile: app.globalData.profile })
      // 如果有缓存的目标，直接展示
      if (app.globalData.todayTarget) {
        this.setData({ target: app.globalData.todayTarget })
      } else {
        this.loadTarget()
      }
    }
  },

  async loadTarget() {
    try {
      const target = await api.computeTarget(this.data.profile)
      this.setData({ target })
      app.globalData.todayTarget = target
    } catch (err) {
      console.error('loadTarget:', err)
    }
  },

  goOnboarding() {
    wx.navigateTo({ url: '/pages/onboarding/onboarding' })
  },

  async onReset() {
    const { confirm } = await wx.showModal({
      title: '清除体测数据',
      content: '将清除所有本地数据，需要重新录入',
      confirmText: '清除',
      confirmColor: '#ef4444',
    })
    if (confirm) {
      app.clearProfile()
      this.setData({ profile: null, target: null })
      wx.showToast({ title: '已清除', icon: 'success' })
    }
  },

  onShareAppMessage() {
    return {
      title: '吃什么 · AI 体测饮食管家',
      path: '/pages/index/index',
    }
  },
})
