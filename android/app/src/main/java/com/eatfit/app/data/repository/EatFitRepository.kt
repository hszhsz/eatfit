package com.eatfit.app.data.repository

import com.eatfit.app.data.model.CoachRequest
import com.eatfit.app.data.model.CoachResponse
import com.eatfit.app.data.model.DailyPlan
import com.eatfit.app.data.model.GroceryList
import com.eatfit.app.data.model.NutritionTarget
import com.eatfit.app.data.model.Recipe
import com.eatfit.app.data.model.UserProfile
import com.eatfit.app.data.model.UserProfileCreate
import com.eatfit.app.data.model.WebCoachAdviceRequest
import com.eatfit.app.data.model.WebPlanRequest
import com.eatfit.app.data.model.WebTargetRequest
import com.eatfit.app.data.remote.EatFitApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Single source of truth between the UI layer and the network API.
 * All calls return [Result] so ViewModels can render error states cleanly.
 */
@Singleton
class EatFitRepository @Inject constructor(
    private val api: EatFitApi,
    private val prefs: UserPrefs,
) {
    private val json = Json { ignoreUnknownKeys = true }

    val profileIdFlow = prefs.profileId

    val profileFlow: Flow<UserProfile?> = prefs.profileJson.map { stored ->
        stored?.let { json.decodeFromString<UserProfile>(it) }
    }

    suspend fun saveProfile(profile: UserProfile) {
        prefs.setProfileJson(json.encodeToString(UserProfile.serializer(), profile))
        prefs.setProfileId(profile.id)
    }

    suspend fun getStoredProfile(): UserProfile? {
        val stored = prefs.profileJson.first()
        return stored?.let { json.decodeFromString<UserProfile>(it) }
    }

    suspend fun getTarget(profile: UserProfileCreate): Result<NutritionTarget> =
        runCatching { api.getTarget(WebTargetRequest(profile)) }

    suspend fun getDailyPlan(
        profile: UserProfileCreate,
        date: String? = null,
    ): Result<DailyPlan> =
        runCatching { api.getDailyPlan(WebPlanRequest(profile, date)) }

    suspend fun getGroceryList(
        profile: UserProfileCreate,
        date: String? = null,
    ): Result<GroceryList> =
        runCatching { api.getGroceryList(WebPlanRequest(profile, date)) }

    suspend fun getCoachAdvice(
        profile: UserProfileCreate,
        date: String? = null,
        request: CoachRequest,
    ): Result<CoachResponse> =
        runCatching { api.getCoachAdvice(WebCoachAdviceRequest(profile, date, request)) }

    suspend fun getRecipe(id: Int): Result<Recipe> =
        runCatching { api.getRecipe(id) }

    suspend fun listRecipes(mealType: String? = null): Result<List<Recipe>> =
        runCatching { api.listRecipes(mealType) }
}
