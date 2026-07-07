const api = require('../../utils/api')

Page({
  data: {
    loading: true,
    recipes: [],
    filteredRecipes: [],
    activeFilter: 'all',
    filters: [
      { value: 'all', label: '全部' },
      { value: 'breakfast', label: '早餐' },
      { value: 'lunch', label: '午餐' },
      { value: 'dinner', label: '晚餐' },
      { value: 'snack', label: '加餐' },
    ],
  },

  onLoad() {
    this.loadRecipes()
  },

  onPullDownRefresh() {
    this.loadRecipes(() => wx.stopPullDownRefresh())
  },

  async loadRecipes(cb) {
    try {
      const recipes = await api.fetchRecipes()
      this.setData({ recipes, filteredRecipes: recipes, loading: false })
    } catch (err) {
      console.error('loadRecipes:', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
      this.setData({ loading: false })
    } finally {
      cb && cb()
    }
  },

  onFilterTap(e) {
    const { value } = e.currentTarget.dataset
    const filtered = value === 'all'
      ? this.data.recipes
      : this.data.recipes.filter(r => r.mealType === value)
    this.setData({ activeFilter: value, filteredRecipes: filtered })
  },

  onRecipeTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/recipe-detail/recipe-detail?id=${id}` })
  },
})
