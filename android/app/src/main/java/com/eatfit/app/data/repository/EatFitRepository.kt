package com.eatfit.app.data.repository

import com.eatfit.app.data.model.DailyPlan
import com.eatfit.app.data.model.CoachRequest
import com.eatfit.app.data.model.CoachResponse
import com.eatfit.app.data.model.GroceryList
import com.eatfit.app.data.model.NutritionTarget
import com.eatfit.app.data.model.Recipe
import com.eatfit.app.data.model.UserProfile
import com.eatfit.app.data.model.UserProfileCreate
import com.eatfit.app.data.remote.EatFitApi
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
    val profileIdFlow = prefs.profileId

    suspend fun createProfile(body: UserProfileCreate): Result<UserProfile> = runCatching {
        val profile = api.createProfile(body)
        prefs.setProfileId(profile.id)
        profile
    }

    suspend fun updateProfile(id: Int, body: UserProfileCreate): Result<UserProfile> =
        runCatching { api.updateProfile(id, body) }

    suspend fun getProfile(id: Int): Result<UserProfile> =
        runCatching { api.getProfile(id) }

    suspend fun getTarget(id: Int): Result<NutritionTarget> =
        runCatching { api.getTarget(id) }

    suspend fun getDailyPlan(profileId: Int, date: String? = null): Result<DailyPlan> =
        runCatching { api.getDailyPlan(profileId, date) }

    suspend fun getGroceryList(profileId: Int, date: String? = null): Result<GroceryList> =
        runCatching { api.getGroceryList(profileId, date) }

    suspend fun getCoachAdvice(profileId: Int, body: CoachRequest): Result<CoachResponse> =
        runCatching { api.getCoachAdvice(profileId, body) }

    suspend fun getRecipe(id: Int): Result<Recipe> =
        runCatching { api.getRecipe(id) }

    suspend fun listRecipes(mealType: String? = null): Result<List<Recipe>> =
        runCatching { api.listRecipes(mealType) }
}
