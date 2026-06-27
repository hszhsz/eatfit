package com.eatfit.app.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class UserProfile(
    val id: Int = 0,
    val name: String,
    val gender: String,            // male / female
    val age: Int,
    @SerialName("height_cm") val heightCm: Double,
    @SerialName("weight_kg") val weightKg: Double,
    @SerialName("body_fat_pct") val bodyFatPct: Double? = null,
    @SerialName("activity_level") val activityLevel: String = "sedentary",
    val goal: String = "maintain",  // lose_fat / maintain / gain_muscle
    val allergens: List<String> = emptyList(),
    @SerialName("disliked_tags") val dislikedTags: List<String> = emptyList(),
    @SerialName("diet_preference") val dietPreference: String? = null,
    @SerialName("created_at") val createdAt: String? = null,
)

/** Payload used when creating/updating a profile (no server-side fields). */
@Serializable
data class UserProfileCreate(
    val name: String,
    val gender: String,
    val age: Int,
    @SerialName("height_cm") val heightCm: Double,
    @SerialName("weight_kg") val weightKg: Double,
    @SerialName("body_fat_pct") val bodyFatPct: Double? = null,
    @SerialName("activity_level") val activityLevel: String = "sedentary",
    val goal: String = "maintain",
    val allergens: List<String> = emptyList(),
    @SerialName("disliked_tags") val dislikedTags: List<String> = emptyList(),
    @SerialName("diet_preference") val dietPreference: String? = null,
)
