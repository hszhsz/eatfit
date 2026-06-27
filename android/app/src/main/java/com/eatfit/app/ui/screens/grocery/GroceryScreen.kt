package com.eatfit.app.ui.screens.grocery

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Card
import androidx.compose.material3.Checkbox
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.eatfit.app.data.model.GroceryItem
import com.eatfit.app.ui.components.ErrorState
import com.eatfit.app.ui.components.LoadingState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GroceryScreen(
    onBack: () -> Unit,
    viewModel: GroceryViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("买菜清单") },
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
            state.error != null -> ErrorState(state.error!!, viewModel::load, Modifier.padding(padding))
            state.list != null -> {
                val grouped = state.list!!.grouped
                LazyColumn(
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.padding(padding),
                ) {
                    item {
                        Text(
                            "今日食谱共需 ${state.list!!.items.size} 种食材,已按品类整理,逛超市更省时。",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    grouped.forEach { (category, items) ->
                        item {
                            CategoryCard(
                                category = category,
                                items = items,
                                checked = state.checked,
                                onToggle = viewModel::toggle,
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun CategoryCard(
    category: String,
    items: List<GroceryItem>,
    checked: Set<String>,
    onToggle: (String) -> Unit,
) {
    Card {
        Column(Modifier.padding(12.dp)) {
            Text(
                category,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.padding(bottom = 4.dp),
            )
            items.forEach { item ->
                val isChecked = item.name in checked
                Row(
                    Modifier
                        .fillMaxWidth()
                        .clickable { onToggle(item.name) }
                        .padding(vertical = 2.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Checkbox(checked = isChecked, onCheckedChange = { onToggle(item.name) })
                    Text(
                        item.name,
                        style = MaterialTheme.typography.bodyLarge,
                        textDecoration = if (isChecked) TextDecoration.LineThrough else null,
                        modifier = Modifier.weight(1f),
                    )
                    Text(
                        "${item.totalAmountG.toInt()} g",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
    }
}
