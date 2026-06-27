package com.eatfit.app.data.remote

import com.eatfit.app.data.model.DailyPlan
import com.eatfit.app.data.model.GroceryList
import com.eatfit.app.data.model.NutritionTarget
import com.eatfit.app.data.model.Recipe
import com.eatfit.app.data.model.UserProfile
import com.eatfit.app.data.model.UserProfileCreate
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface EatFitApi {

    @POST("api/profiles")
    suspend fun createProfile(@Body body: UserProfileCreate): UserProfile

    @GET("api/profiles/{id}")
    suspend fun getProfile(@Path("id") id: Int): UserProfile

    @PUT("api/profiles/{id}")
    suspend fun updateProfile(
        @Path("id") id: Int,
        @Body body: UserProfileCreate,
    ): UserProfile

    @GET("api/profiles/{id}/target")
    suspend fun getTarget(@Path("id") id: Int): NutritionTarget

    @GET("api/recipes")
    suspend fun listRecipes(
        @Query("meal_type") mealType: String? = null,
        @Query("tag") tag: String? = null,
    ): List<Recipe>

    @GET("api/recipes/{id}")
    suspend fun getRecipe(@Path("id") id: Int): Recipe

    @GET("api/plan/{profileId}")
    suspend fun getDailyPlan(
        @Path("profileId") profileId: Int,
        @Query("date") date: String? = null,
    ): DailyPlan

    @GET("api/plan/{profileId}/grocery")
    suspend fun getGroceryList(
        @Path("profileId") profileId: Int,
        @Query("date") date: String? = null,
    ): GroceryList
}
