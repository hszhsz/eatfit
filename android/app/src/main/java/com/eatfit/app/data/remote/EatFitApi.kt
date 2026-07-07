package com.eatfit.app.data.remote

import com.eatfit.app.data.model.CoachResponse
import com.eatfit.app.data.model.DailyPlan
import com.eatfit.app.data.model.GroceryList
import com.eatfit.app.data.model.NutritionTarget
import com.eatfit.app.data.model.Recipe
import com.eatfit.app.data.model.WebCoachAdviceRequest
import com.eatfit.app.data.model.WebPlanRequest
import com.eatfit.app.data.model.WebTargetRequest
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface EatFitApi {

    @POST("api/web/target")
    suspend fun getTarget(@Body body: WebTargetRequest): NutritionTarget

    @POST("api/web/plan")
    suspend fun getDailyPlan(@Body body: WebPlanRequest): DailyPlan

    @POST("api/web/grocery")
    suspend fun getGroceryList(@Body body: WebPlanRequest): GroceryList

    @POST("api/web/coach/advice")
    suspend fun getCoachAdvice(@Body body: WebCoachAdviceRequest): CoachResponse

    @GET("api/recipes")
    suspend fun listRecipes(
        @Query("meal_type") mealType: String? = null,
        @Query("tag") tag: String? = null,
    ): List<Recipe>

    @GET("api/recipes/{id}")
    suspend fun getRecipe(@Path("id") id: Int): Recipe
}
