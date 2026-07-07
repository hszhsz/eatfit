App({
  globalData: {
    apiBaseUrl: 'https://backend-auushsk3z-jackhes-projects-5ded530b.vercel.app',
    profile: null,      // 用户体测数据
    todayPlan: null,    // 今日食谱
    todayTarget: null,  // 今日营养目标
  },

  onLaunch() {
    // 尝试从本地缓存恢复 profile
    const profile = wx.getStorageSync('eatfit_profile')
    if (profile) {
      this.globalData.profile = profile
    }
  },

  /** 保存 profile 到缓存和 globalData */
  saveProfile(profile) {
    this.globalData.profile = profile
    wx.setStorageSync('eatfit_profile', profile)
  },

  /** 清除 profile */
  clearProfile() {
    this.globalData.profile = null
    wx.removeStorageSync('eatfit_profile')
  },

  /** 是否已录入体测 */
  hasProfile() {
    return !!this.globalData.profile
  },
})
