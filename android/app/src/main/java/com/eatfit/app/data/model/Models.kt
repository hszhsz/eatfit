package com.eatfit.app.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class WebTargetRequest(val profile: UserProfileCreate)

@Serializable
data class WebPlanRequest(
    val profile: UserProfileCreate,
    val date: String? = null,
)

@Serializable
data class WebCoachAdviceRequest(
    val profile: UserProfileCreate,
    val date: String? = null,
    val request: CoachRequest,
)

@Serializable
data class NutritionTarget(
    val bmr: Double,
    val tdee: Double,
    @SerialName("target_calories") val targetCalories: Double,
    @SerialName("protein_g") val proteinG: Double,
    @SerialName("carbs_g") val carbsG: Double,
    @SerialName("fat_g") val fatG: Double,
    val explanation: String,
)

@Serializable
data class IngredientItem(
    val name: String,
    @SerialName("amount_g") val amountG: Double,
    val category: String = "其他",
)

@Serializable
data class Recipe(
    val id: Int,
    val name: String,
    @SerialName("meal_type") val mealType: String,
    val calories: Double,
    @SerialName("protein_g") val proteinG: Double,
    @SerialName("carbs_g") val carbsG: Double,
    @SerialName("fat_g") val fatG: Double,
    val tags: List<String> = emptyList(),
    val allergens: List<String> = emptyList(),
    @SerialName("cook_minutes") val cookMinutes: Int,
    val ingredients: List<IngredientItem> = emptyList(),
    val steps: List<String> = emptyList(),
    @SerialName("image_emoji") val imageEmoji: String = "🍽️",
    @SerialName("image_url") val imageURL: String? = null,
)

@Serializable
data class MealItem(
    @SerialName("meal_type") val mealType: String,
    val recipe: Recipe,
)

@Serializable
data class DailyPlan(
    val date: String,
    @SerialName("profile_id") val profileId: Int,
    val target: NutritionTarget,
    val meals: List<MealItem>,
    @SerialName("total_calories") val totalCalories: Double,
    @SerialName("total_protein_g") val totalProteinG: Double,
    @SerialName("total_carbs_g") val totalCarbsG: Double,
    @SerialName("total_fat_g") val totalFatG: Double,
)

@Serializable
data class GroceryItem(
    val name: String,
    @SerialName("total_amount_g") val totalAmountG: Double,
    val category: String,
)

@Serializable
data class GroceryList(
    val date: String,
    @SerialName("profile_id") val profileId: Int,
    val items: List<GroceryItem>,
    val grouped: Map<String, List<GroceryItem>>,
)

@Serializable
data class CoachRequest(
    val message: String? = null,
    val focus: String = "daily_review",
)

@Serializable
data class CoachResponse(
    val focus: String,
    val headline: String,
    val summary: String,
    val score: Int,
    @SerialName("risk_alerts") val riskAlerts: List<String> = emptyList(),
    @SerialName("nutrition_insights") val nutritionInsights: List<String> = emptyList(),
    @SerialName("next_actions") val nextActions: List<String> = emptyList(),
    @SerialName("meal_strategy") val mealStrategy: List<String> = emptyList(),
    val disclaimer: String,
)
