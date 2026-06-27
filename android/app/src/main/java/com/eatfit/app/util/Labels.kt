package com.eatfit.app.util

/** Display helpers shared across screens. */
object Labels {
    val goals = mapOf(
        "lose_fat" to "减脂",
        "maintain" to "保持",
        "gain_muscle" to "增肌",
    )
    val activity = mapOf(
        "sedentary" to "久坐(几乎不运动)",
        "light" to "轻度(每周1-3次)",
        "moderate" to "中度(每周3-5次)",
        "active" to "高度(每周6-7次)",
        "very_active" to "极高(体力工作/双训)",
    )
    val gender = mapOf(
        "male" to "男",
        "female" to "女",
    )
    val mealTypes = mapOf(
        "breakfast" to "早餐",
        "lunch" to "午餐",
        "dinner" to "晚餐",
        "snack" to "加餐",
    )

    fun goal(key: String) = goals[key] ?: key
    fun activity(key: String) = activity[key] ?: key
    fun gender(key: String) = gender[key] ?: key
    fun meal(key: String) = mealTypes[key] ?: key
}

/** Common allergen and preference tag chips. */
object Tags {
    val commonAllergens = listOf("蛋", "奶", "麸质", "大豆", "虾", "鱼", "坚果")
    val dislikedTags = listOf("素食") // tags users may want to avoid in this demo
}
