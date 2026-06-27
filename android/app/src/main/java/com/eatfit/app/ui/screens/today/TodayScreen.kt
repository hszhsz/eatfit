package com.eatfit.app.ui.screens.today

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.eatfit.app.data.model.MealItem
import com.eatfit.app.ui.components.ErrorState
import com.eatfit.app.ui.components.LoadingState
import com.eatfit.app.ui.components.MacroBar
import com.eatfit.app.ui.theme.CalorieOrange
import com.eatfit.app.ui.theme.CarbsAmber
import com.eatfit.app.ui.theme.FatPurple
import com.eatfit.app.ui.theme.ProteinBlue
import com.eatfit.app.util.Labels

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TodayScreen(
    onOpenRecipe: (Int) -> Unit,
    onOpenGrocery: () -> Unit,
    onOpenProfile: () -> Unit,
    viewModel: TodayViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("今日食谱") },
                actions = {
                    IconButton(onClick = onOpenGrocery) {
                        Icon(Icons.Default.ShoppingCart, contentDescription = "买菜清单")
                    }
                    IconButton(onClick = onOpenProfile) {
                        Icon(Icons.Default.Person, contentDescription = "我的")
                    }
                },
            )
        },
    ) { padding ->
        when {
            state.loading -> LoadingState(Modifier.padding(padding))
            state.error != null -> ErrorState(
                message = state.error!!,
                onRetry = viewModel::load,
                modifier = Modifier.padding(padding),
            )
            state.plan != null -> {
                val plan = state.plan!!
                LazyColumn(
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.padding(padding),
                ) {
                    item { NutritionSummaryCard(plan) }
                    items(plan.meals) { meal ->
                        MealCard(meal = meal, onClick = { onOpenRecipe(meal.recipe.id) })
                    }
                }
            }
        }
    }
}

@Composable
private fun NutritionSummaryCard(plan: com.eatfit.app.data.model.DailyPlan) {
    Card(
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
        ),
    ) {
        Column(Modifier.padding(16.dp)) {
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Bottom,
            ) {
                Column {
                    Text("今日目标摄入", style = MaterialTheme.typography.labelMedium)
                    Text(
                        "${plan.target.targetCalories.toInt()} kcal",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = CalorieOrange,
                    )
                }
                Text(
                    "食谱合计 ${plan.totalCalories.toInt()} kcal",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            Column(
                Modifier.padding(top = 12.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                MacroBar("蛋白质", plan.totalProteinG, plan.target.proteinG, "g", ProteinBlue)
                MacroBar("碳水", plan.totalCarbsG, plan.target.carbsG, "g", CarbsAmber)
                MacroBar("脂肪", plan.totalFatG, plan.target.fatG, "g", FatPurple)
            }
            Text(
                plan.target.explanation,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 12.dp),
            )
        }
    }
}

@Composable
private fun MealCard(meal: MealItem, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
    ) {
        Row(
            Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Surface(
                shape = CircleShape,
                color = MaterialTheme.colorScheme.primaryContainer,
                modifier = Modifier.size(52.dp),
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(meal.recipe.imageEmoji, fontSize = 26.sp)
                }
            }
            Column(
                Modifier
                    .padding(start = 14.dp)
                    .weight(1f),
            ) {
                Text(
                    Labels.meal(meal.mealType),
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.SemiBold,
                )
                Text(
                    meal.recipe.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                )
                Text(
                    "${meal.recipe.calories.toInt()} kcal · 蛋白 ${meal.recipe.proteinG.toInt()}g · " +
                        "${meal.recipe.cookMinutes}分钟",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}
