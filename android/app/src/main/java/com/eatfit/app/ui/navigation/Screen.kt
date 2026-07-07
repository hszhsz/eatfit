package com.eatfit.app.ui.navigation

sealed class Screen(val route: String) {
    data object Splash : Screen("splash")
    data object Login : Screen("login")
    data object Onboarding : Screen("onboarding")
    data object Home : Screen("home")
    data object Today : Screen("today")
    data object Coach : Screen("coach")
    data object Grocery : Screen("grocery")
    data object Profile : Screen("profile")
    data object Settings : Screen("settings")
    data object RecipeDetail : Screen("recipe/{recipeId}") {
        fun create(recipeId: Int) = "recipe/$recipeId"
    }
}
