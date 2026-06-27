package com.eatfit.app.ui.screens.recipe

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.AssistChip
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
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.eatfit.app.data.model.IngredientItem
import com.eatfit.app.data.model.Recipe
import com.eatfit.app.ui.components.ErrorState
import com.eatfit.app.ui.components.LoadingState

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun RecipeDetailScreen(
    recipeId: Int,
    onBack: () -> Unit,
    viewModel: RecipeDetailViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsState()
    LaunchedEffect(recipeId) { viewModel.load(recipeId) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(state.recipe?.name ?: "食谱详情") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "返回")
                    }
                },
            )
        },
    ) { padding ->
        when {
            state.loading -> LoadingState(Modifier.padding(padding))
            state.error != null -> ErrorState(state.error!!, { viewModel.load(recipeId) }, Modifier.padding(padding))
            state.recipe != null -> {
                val r = state.recipe!!
                LazyColumn(
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                    modifier = Modifier.padding(padding),
                ) {
                    item { HeaderCard(r) }
                    item { NutritionRow(r) }
                    item { TagsRow(r) }
                    item { IngredientsCard(r.ingredients) }
                    item {
                        Text(
                            "🍳 烹饪步骤",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                        )
                    }
                    itemsIndexed(r.steps) { index, step ->
                        StepRow(index + 1, step)
                    }
                }
            }
        }
    }
}

@Composable
private fun StepRow(number: Int, step: String) {
    Row(verticalAlignment = Alignment.Top) {
        Surface(
            shape = CircleShape,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(28.dp),
        ) {
            Box(contentAlignment = Alignment.Center) {
                Text("$number", color = Color.White, fontWeight = FontWeight.Bold)
            }
        }
        Text(
            step,
            style = MaterialTheme.typography.bodyLarge,
            modifier = Modifier.padding(start = 12.dp, top = 2.dp),
        )
    }
}

@Composable
private fun HeaderCard(r: Recipe) {
    Card(
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
        ),
    ) {
        Row(Modifier.padding(20.dp), verticalAlignment = Alignment.CenterVertically) {
            Text(r.imageEmoji, fontSize = 48.sp)
            Column(Modifier.padding(start = 16.dp)) {
                Text(r.name, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                Text(
                    "约 ${r.cookMinutes} 分钟完成",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}

@Composable
private fun NutritionRow(r: Recipe) {
    Row(
        Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        NutriStat("热量", "${r.calories.toInt()}", "kcal")
        NutriStat("蛋白质", "${r.proteinG.toInt()}", "g")
        NutriStat("碳水", "${r.carbsG.toInt()}", "g")
        NutriStat("脂肪", "${r.fatG.toInt()}", "g")
    }
}

@Composable
private fun NutriStat(label: String, value: String, unit: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        Text("$label·$unit", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun TagsRow(r: Recipe) {
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        r.tags.forEach { AssistChip(onClick = {}, label = { Text(it) }) }
    }
}

@Composable
private fun IngredientsCard(ingredients: List<IngredientItem>) {
    Card {
        Column(Modifier.padding(16.dp)) {
            Text("🧺 食材清单", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            ingredients.forEach { ing ->
                Row(
                    Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    Text(ing.name, style = MaterialTheme.typography.bodyLarge)
                    Text(
                        "${ing.amountG.toInt()} g",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
    }
}
