const api = require('../../utils/api')
const app = getApp()

Page({
  data: {
    loading: true,
    grocery: null,
    profile: null,
  },

  onShow() {
    if (app.hasProfile()) {
      this.loadGrocery()
    } else {
      this.setData({ loading: false, profile: null })
    }
  },

  onPullDownRefresh() {
    if (app.hasProfile()) {
      this.loadGrocery(() => wx.stopPullDownRefresh())
    } else {
      wx.stopPullDownRefresh()
    }
  },

  async loadGrocery(cb) {
    const profile = app.globalData.profile
    this.setData({ loading: true, profile })

    try {
      const grocery = await api.fetchGrocery(profile)
      this.setData({ grocery, loading: false })
    } catch (err) {
      console.error('loadGrocery:', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
      this.setData({ loading: false })
    } finally {
      cb && cb()
    }
  },

  goOnboarding() {
    wx.navigateTo({ url: '/pages/onboarding/onboarding' })
  },

  copyList() {
    if (!this.data.grocery) return
    const lines = []
    const categoryLabels = {
      '蔬菜水果': '🥬 蔬菜水果',
      '肉蛋水产': '🥩 肉蛋水产',
      '主食粮油': '🍚 主食粮油',
      '奶制品': '🥛 奶制品',
      '调料其他': '🧂 调料其他',
    }
    Object.entries(this.data.grocery.grouped).forEach(([cat, items]) => {
      lines.push(categoryLabels[cat] || cat)
      items.forEach(item => {
        lines.push(`  ${item.name} ${item.totalAmountG}g`)
      })
      lines.push('')
    })
    wx.setClipboardData({
      data: lines.join('\n'),
      success() {
        wx.showToast({ title: '已复制清单', icon: 'success' })
      },
    })
  },
})
