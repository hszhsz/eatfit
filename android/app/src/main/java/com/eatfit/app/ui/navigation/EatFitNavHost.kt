package com.eatfit.app.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import androidx.navigation.NavType
import com.eatfit.app.ui.AppViewModel
import com.eatfit.app.ui.screens.grocery.GroceryScreen
import com.eatfit.app.ui.screens.onboarding.OnboardingScreen
import com.eatfit.app.ui.screens.profile.ProfileScreen
import com.eatfit.app.ui.screens.recipe.RecipeDetailScreen
import com.eatfit.app.ui.screens.coach.CoachScreen
import com.eatfit.app.ui.screens.settings.SettingsScreen
import com.eatfit.app.ui.screens.today.TodayScreen

@Composable
fun EatFitNavHost() {
    val navController = rememberNavController()
    val appViewModel: AppViewModel = hiltViewModel()
    val profileId by appViewModel.profileId.collectAsState()

    // If a profile already exists, jump straight to Today; otherwise onboard.
    val startDestination = Screen.Onboarding.route

    NavHost(navController = navController, startDestination = startDestination) {
        composable(Screen.Onboarding.route) {
            OnboardingScreen(
                existingProfileId = profileId,
                onDone = {
                    navController.navigate(Screen.Today.route) {
                        popUpTo(Screen.Onboarding.route) { inclusive = true }
                    }
                },
            )
        }
        composable(Screen.Today.route) {
            TodayScreen(
                onOpenRecipe = { id ->
                    navController.navigate(Screen.RecipeDetail.create(id))
                },
                onOpenCoach = { navController.navigate(Screen.Coach.route) },
                onOpenGrocery = { navController.navigate(Screen.Grocery.route) },
                onOpenProfile = { navController.navigate(Screen.Profile.route) },
                onOpenSettings = { navController.navigate(Screen.Settings.route) },
            )
        }
        composable(Screen.Coach.route) {
            CoachScreen(onBack = { navController.popBackStack() })
        }
        composable(Screen.Grocery.route) {
            GroceryScreen(onBack = { navController.popBackStack() })
        }
        composable(Screen.Profile.route) {
            ProfileScreen(
                onBack = { navController.popBackStack() },
                onSaved = { navController.popBackStack() },
            )
        }
        composable(Screen.Settings.route) {
            SettingsScreen(onBack = { navController.popBackStack() })
        }
        composable(
            route = Screen.RecipeDetail.route,
            arguments = listOf(navArgument("recipeId") { type = NavType.IntType }),
        ) { backStackEntry ->
            val recipeId = backStackEntry.arguments?.getInt("recipeId") ?: 0
            RecipeDetailScreen(
                recipeId = recipeId,
                onBack = { navController.popBackStack() },
            )
        }
    }
}
