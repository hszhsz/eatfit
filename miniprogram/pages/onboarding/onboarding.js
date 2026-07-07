const api = require('../../utils/api')
const app = getApp()

Page({
  data: {
    step: 1, // 1: 基础信息, 2: 身体数据, 3: 目标偏好
    form: {
      name: '',
      gender: 'male',
      age: '',
      heightCm: '',
      weightKg: '',
      bodyFatPct: '',
      activityLevel: 'sedentary',
      goal: 'lose_fat',
      allergens: [],
      dislikedTags: [],
      dietPreference: 'normal',
    },
    activityIndex: 0,
    activityOptions: [
      { value: 'sedentary', label: '久坐' },
      { value: 'light', label: '轻度活动' },
      { value: 'moderate', label: '中度活动' },
      { value: 'active', label: '高度活动' },
      { value: 'very_active', label: '极高强度' },
    ],
    goalOptions: [
      { value: 'lose_fat', label: '减脂' },
      { value: 'maintain', label: '保持' },
      { value: 'gain_muscle', label: '增肌' },
    ],
    allergenOptions: ['花生', '海鲜', '蛋', '奶', '麸质', '大豆', '坚果'],
    dislikedOptions: ['香菜', '芹菜', '胡萝卜', '洋葱', '辣椒', '苦瓜'],
    dietOptions: [
      { value: 'normal', label: '正常' },
      { value: 'vegetarian', label: '素食' },
    ],
    submitting: false,
  },

  // 通用 input 更新
  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [`form.${field}`]: e.detail.value })
  },

  onGenderChange(e) {
    this.setData({ 'form.gender': e.detail.value })
  },

  onGoalSelect(e) {
    this.setData({ 'form.goal': e.currentTarget.dataset.value })
  },

  onDietSelect(e) {
    this.setData({ 'form.dietPreference': e.currentTarget.dataset.value })
  },

  onActivityChange(e) {
    const idx = e.detail.value
    this.setData({ 'form.activityLevel': this.data.activityOptions[idx].value, activityIndex: idx })
  },

  onAllergenToggle(e) {
    const { value } = e.currentTarget.dataset
    const list = [...this.data.form.allergens]
    const idx = list.indexOf(value)
    if (idx > -1) {
      list.splice(idx, 1)
    } else {
      list.push(value)
    }
    this.setData({ 'form.allergens': list })
  },

  onDislikedToggle(e) {
    const { value } = e.currentTarget.dataset
    const list = [...this.data.form.dislikedTags]
    const idx = list.indexOf(value)
    if (idx > -1) {
      list.splice(idx, 1)
    } else {
      list.push(value)
    }
    this.setData({ 'form.dislikedTags': list })
  },

  nextStep() {
    const { step, form } = this.data
    if (step === 1) {
      if (!form.name.trim()) return wx.showToast({ title: '请输入姓名', icon: 'none' })
      if (!form.age || form.age < 10 || form.age > 100) return wx.showToast({ title: '年龄 10-100', icon: 'none' })
      this.setData({ step: 2 })
    } else if (step === 2) {
      if (!form.heightCm || form.heightCm < 100 || form.heightCm > 250) return wx.showToast({ title: '身高 100-250cm', icon: 'none' })
      if (!form.weightKg || form.weightKg < 30 || form.weightKg > 250) return wx.showToast({ title: '体重 30-250kg', icon: 'none' })
      this.setData({ step: 3 })
    }
  },

  prevStep() {
    if (this.data.step > 1) this.setData({ step: this.data.step - 1 })
  },

  async submit() {
    const form = this.data.form
    const profile = {
      name: form.name.trim(),
      gender: form.gender,
      age: Number(form.age),
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      bodyFatPct: form.bodyFatPct ? Number(form.bodyFatPct) : null,
      activityLevel: form.activityLevel,
      goal: form.goal,
      allergens: form.allergens,
      dislikedTags: form.dislikedTags,
      dietPreference: form.dietPreference,
    }

    this.setData({ submitting: true })

    try {
      // 验证后端能算出营养目标
      const target = await api.computeTarget(profile)
      app.saveProfile(profile)
      wx.showToast({ title: '体测已保存', icon: 'success' })
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' })
      }, 800)
    } catch (err) {
      console.error('submit error:', err)
      wx.showToast({ title: '提交失败，请重试', icon: 'none' })
    } finally {
      this.setData({ submitting: false })
    }
  },
})
