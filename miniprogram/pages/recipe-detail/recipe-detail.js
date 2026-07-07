const api = require('../../utils/api')

Page({
  data: {
    loading: true,
    recipe: null,
    mealLabel: '',
  },

  onLoad(options) {
    if (options.id) {
      this.loadRecipe(Number(options.id))
    }
  },

  async loadRecipe(id) {
    try {
      const recipe = await api.fetchRecipeDetail(id)
      const mealLabels = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐' }
      this.setData({ recipe, mealLabel: mealLabels[recipe.mealType] || '', loading: false })
      wx.setNavigationBarTitle({ title: recipe.name })
    } catch (err) {
      console.error('loadRecipe:', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
      this.setData({ loading: false })
    }
  },
})
