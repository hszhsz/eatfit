package com.eatfit.app.ui.navigation

sealed class Screen(val route: String) {
    data object Onboarding : Screen("onboarding")
    data object Today : Screen("today")
    data object Grocery : Screen("grocery")
    data object Profile : Screen("profile")
    data object RecipeDetail : Screen("recipe/{recipeId}") {
        fun create(recipeId: Int) = "recipe/$recipeId"
    }
}
