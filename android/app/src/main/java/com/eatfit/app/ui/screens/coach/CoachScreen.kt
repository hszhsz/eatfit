package com.eatfit.app.ui.screens.coach

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.AssistChip
import androidx.compose.material3.AssistChipDefaults
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.foundation.rememberScrollState
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.eatfit.app.data.model.CoachResponse
import com.eatfit.app.ui.components.ErrorState
import com.eatfit.app.ui.components.LoadingState
import com.eatfit.app.ui.theme.CalorieOrange
import com.eatfit.app.ui.theme.CardGreen
import com.eatfit.app.ui.theme.ProteinBlue

private val focusOptions = listOf(
    "daily_review" to "今日复盘",
    "meal_strategy" to "下一餐",
    "eating_out" to "外食策略",
    "cravings" to "嘴馋管理",
)

private val quickPrompts = listOf(
    "今天训练后特别饿，怎么加餐更稳？",
    "晚上要和朋友聚餐，怎么吃不影响减脂？",
    "我下午容易嘴馋，怎么安排零食更合理？",
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CoachScreen(
    onBack: () -> Unit,
    viewModel: CoachViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("AI 营养顾问") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "返回")
                    }
                },
            )
        },
    ) { padding ->
        when {
            state.loading && state.response == null -> LoadingState(Modifier.padding(padding))
            state.error != null && state.response == null -> ErrorState(
                message = state.error!!,
                onRetry = viewModel::requestAdvice,
                modifier = Modifier.padding(padding),
            )
            else -> {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                ) {
                    item {
                        HeroCard(
                            loading = state.loading,
                            selectedFocus = state.selectedFocus,
                            onSelectFocus = viewModel::updateFocus,
                        )
                    }
                    item {
                        InputCard(
                            value = state.input,
                            onValueChange = viewModel::updateInput,
                            onQuickPrompt = { prompt ->
                                viewModel.updateInput(prompt)
                            },
                            onSubmit = viewModel::requestAdvice,
                            loading = state.loading,
                        )
                    }
                    state.error?.let { message ->
                        item {
                            InlineError(message = message)
                        }
                    }
                    state.response?.let { response ->
                        item { ScoreCard(response = response) }
                        item {
                            InsightSection(
                                title = "风险提醒",
                                icon = { Icon(Icons.Default.Warning, contentDescription = null) },
                                items = response.riskAlerts,
                                tint = CalorieOrange,
                            )
                        }
                        item {
                            InsightSection(
                                title = "营养洞察",
                                icon = { Icon(Icons.Default.AutoAwesome, contentDescription = null) },
                                items = response.nutritionInsights,
                                tint = ProteinBlue,
                            )
                        }
                        item {
                            InsightSection(
                                title = "下一步行动",
                                icon = { Icon(Icons.Default.CheckCircle, contentDescription = null) },
                                items = response.nextActions,
                                tint = MaterialTheme.colorScheme.primary,
                            )
                        }
                        item {
                            InsightSection(
                                title = "下一餐策略",
                                icon = { Icon(Icons.Default.Restaurant, contentDescription = null) },
                                items = response.mealStrategy,
                                tint = MaterialTheme.colorScheme.secondary,
                            )
                        }
                        item {
                            Text(
                                text = response.disclaimer,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun HeroCard(
    loading: Boolean,
    selectedFocus: String,
    onSelectFocus: (String) -> Unit,
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardGreen),
        shape = RoundedCornerShape(28.dp),
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(
                        "专业饮食决策支持",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                    )
                    Text(
                        "把你今天的目标、进食情况和困扰交给 EatFit AI，输出可执行建议。",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                Surface(
                    shape = CircleShape,
                    color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
                    modifier = Modifier.size(48.dp),
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        if (loading) {
                            CircularProgressIndicator(
                                strokeWidth = 2.dp,
                                modifier = Modifier.size(22.dp),
                            )
                        } else {
                            Icon(Icons.Default.AutoAwesome, contentDescription = null)
                        }
                    }
                }
            }
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.horizontalScroll(rememberScrollState()),
            ) {
                focusOptions.forEach { (value, label) ->
                    FilterChip(
                        selected = selectedFocus == value,
                        onClick = { onSelectFocus(value) },
                        label = { Text(label) },
                    )
                }
            }
        }
    }
}

@Composable
private fun InputCard(
    value: String,
    onValueChange: (String) -> Unit,
    onQuickPrompt: (String) -> Unit,
    onSubmit: () -> Unit,
    loading: Boolean,
) {
    Card(shape = RoundedCornerShape(24.dp)) {
        Column(
            modifier = Modifier.padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Text("告诉我你的情况", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            OutlinedTextField(
                value = value,
                onValueChange = onValueChange,
                modifier = Modifier.fillMaxWidth(),
                minLines = 4,
                placeholder = { Text("例如：我今天午饭外卖吃多了，晚上该怎么调整？") },
            )
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                quickPrompts.forEach { prompt ->
                    AssistChip(
                        onClick = { onQuickPrompt(prompt) },
                        label = { Text(prompt) },
                        colors = AssistChipDefaults.assistChipColors(
                            containerColor = MaterialTheme.colorScheme.surfaceVariant,
                        ),
                    )
                }
            }
            Button(
                onClick = onSubmit,
                enabled = !loading,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text(if (loading) "生成中..." else "生成专业建议")
            }
        }
    }
}

@Composable
private fun ScoreCard(response: CoachResponse) {
    Card(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        Column(
            modifier = Modifier.padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column(Modifier.weight(1f)) {
                    Text(
                        response.headline,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                    )
                    Text(
                        response.summary,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 4.dp),
                    )
                }
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(18.dp))
                        .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.12f))
                        .padding(horizontal = 14.dp, vertical = 10.dp),
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            "${response.score}",
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary,
                        )
                        Text("评分", style = MaterialTheme.typography.labelSmall)
                    }
                }
            }
        }
    }
}

@Composable
private fun InsightSection(
    title: String,
    icon: @Composable () -> Unit,
    items: List<String>,
    tint: Color,
) {
    Card(shape = RoundedCornerShape(22.dp)) {
        Column(
            modifier = Modifier.padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(tint.copy(alpha = 0.12f)),
                    contentAlignment = Alignment.Center,
                ) {
                    androidx.compose.runtime.CompositionLocalProvider(
                        androidx.compose.material3.LocalContentColor provides tint,
                    ) {
                        icon()
                    }
                }
                Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            }
            items.ifEmpty { listOf("当前没有额外提示。") }.forEach { item ->
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Box(
                        modifier = Modifier
                            .padding(top = 7.dp)
                            .size(6.dp)
                            .clip(CircleShape)
                            .background(tint),
                    )
                    Text(
                        text = item,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.weight(1f),
                    )
                }
            }
        }
    }
}

@Composable
private fun InlineError(message: String) {
    Card(
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer),
    ) {
        Text(
            text = message,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onErrorContainer,
            modifier = Modifier.padding(16.dp),
        )
    }
}
