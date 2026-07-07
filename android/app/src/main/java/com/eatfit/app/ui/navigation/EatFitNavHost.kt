package com.eatfit.app.ui.navigation

import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import androidx.navigation.NavType
import com.eatfit.app.ui.AppViewModel
import com.eatfit.app.ui.components.BottomNavBar
import com.eatfit.app.ui.screens.grocery.GroceryScreen
import com.eatfit.app.ui.screens.home.HomeScreen
import com.eatfit.app.ui.screens.login.LoginScreen
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
    val profile by appViewModel.profile.collectAsState()

    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route

    // Routes that show bottom bar
    val showBottomBar = currentRoute in setOf(
        Screen.Home.route,
        Screen.Today.route,
        Screen.Coach.route,
        Screen.Grocery.route,
        Screen.Profile.route,
    )

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                BottomNavBar(
                    currentRoute = currentRoute,
                    onNavigate = { route ->
                        navController.navigate(route) {
                            popUpTo(Screen.Home.route) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                )
            }
        },
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Login.route,
            modifier = Modifier.padding(innerPadding),
        ) {
            // Login
            composable(Screen.Login.route) {
                LoginScreen(
                    onLogin = {
                        // For now, skip to onboarding or home based on profile
                        if (profile != null) {
                            navController.navigate(Screen.Home.route) {
                                popUpTo(Screen.Login.route) { inclusive = true }
                            }
                        } else {
                            navController.navigate(Screen.Onboarding.route) {
                                popUpTo(Screen.Login.route) { inclusive = true }
                            }
                        }
                    },
                    onSkip = {
                        if (profile != null) {
                            navController.navigate(Screen.Home.route) {
                                popUpTo(Screen.Login.route) { inclusive = true }
                            }
                        } else {
                            navController.navigate(Screen.Onboarding.route) {
                                popUpTo(Screen.Login.route) { inclusive = true }
                            }
                        }
                    },
                )
            }

            // Onboarding
            composable(Screen.Onboarding.route) {
                OnboardingScreen(
                    isEdit = profile != null,
                    onDone = {
                        navController.navigate(Screen.Home.route) {
                            popUpTo(Screen.Onboarding.route) { inclusive = true }
                        }
                    },
                )
            }

            // Home (main dashboard)
            composable(Screen.Home.route) {
                HomeScreen(
                    onNavigateToToday = { navController.navigate(Screen.Today.route) },
                    onNavigateToCoach = { navController.navigate(Screen.Coach.route) },
                    onNavigateToGrocery = { navController.navigate(Screen.Grocery.route) },
                    onNavigateToProfile = { navController.navigate(Screen.Profile.route) },
                )
            }

            // Today (daily plan)
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

            // Coach
            composable(Screen.Coach.route) {
                CoachScreen(onBack = { navController.popBackStack() })
            }

            // Grocery
            composable(Screen.Grocery.route) {
                GroceryScreen(onBack = { navController.popBackStack() })
            }

            // Profile
            composable(Screen.Profile.route) {
                ProfileScreen(
                    onBack = { navController.popBackStack() },
                    onSaved = { navController.popBackStack() },
                )
            }

            // Settings
            composable(Screen.Settings.route) {
                SettingsScreen(onBack = { navController.popBackStack() })
            }

            // Recipe Detail
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
}
