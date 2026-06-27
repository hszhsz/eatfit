package com.eatfit.app.ui.screens.onboarding

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.eatfit.app.util.Labels
import com.eatfit.app.util.Tags

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun OnboardingScreen(
    existingProfileId: Int?,
    onDone: () -> Unit,
    viewModel: OnboardingViewModel = hiltViewModel(),
) {
    val state by viewModel.state.collectAsState()

    LaunchedEffect(existingProfileId) {
        if (existingProfileId != null) viewModel.loadExisting(existingProfileId)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        Text("🥗 EatFit 吃什么", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
        Text(
            "录入你的身体数据,AI 立即为你生成今日个性化食谱。",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )

        OutlinedTextField(
            value = state.name,
            onValueChange = { v -> viewModel.update { it.copy(name = v) } },
            label = { Text("昵称") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
        )

        SectionTitle("性别")
        SegmentChips(
            options = Labels.gender,
            selected = state.gender,
            onSelect = { v -> viewModel.update { it.copy(gender = v) } },
        )

        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            OutlinedTextField(
                value = state.age,
                onValueChange = { v -> viewModel.update { it.copy(age = v.filter { c -> c.isDigit() }) } },
                label = { Text("年龄") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                singleLine = true,
                modifier = Modifier.weight(1f),
            )
            OutlinedTextField(
                value = state.bodyFatPct,
                onValueChange = { v -> viewModel.update { it.copy(bodyFatPct = v) } },
                label = { Text("体脂率% (可选)") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                singleLine = true,
                modifier = Modifier.weight(1f),
            )
        }

        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            OutlinedTextField(
                value = state.heightCm,
                onValueChange = { v -> viewModel.update { it.copy(heightCm = v) } },
                label = { Text("身高 cm") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                singleLine = true,
                modifier = Modifier.weight(1f),
            )
            OutlinedTextField(
                value = state.weightKg,
                onValueChange = { v -> viewModel.update { it.copy(weightKg = v) } },
                label = { Text("体重 kg") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                singleLine = true,
                modifier = Modifier.weight(1f),
            )
        }

        SectionTitle("运动量")
        SegmentChips(
            options = Labels.activity,
            selected = state.activityLevel,
            onSelect = { v -> viewModel.update { it.copy(activityLevel = v) } },
        )

        SectionTitle("目标")
        SegmentChips(
            options = Labels.goals,
            selected = state.goal,
            onSelect = { v -> viewModel.update { it.copy(goal = v) } },
        )

        SectionTitle("过敏原 / 忌口")
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Tags.commonAllergens.forEach { tag ->
                FilterChip(
                    selected = tag in state.allergens,
                    onClick = { viewModel.toggleAllergen(tag) },
                    label = { Text(tag) },
                )
            }
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text("纯素食偏好", style = MaterialTheme.typography.bodyLarge)
            Switch(
                checked = state.vegetarian,
                onCheckedChange = { v -> viewModel.update { it.copy(vegetarian = v) } },
            )
        }

        state.error?.let {
            Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodyMedium)
        }

        Button(
            onClick = { viewModel.submit(existingProfileId, onDone) },
            enabled = state.isValid && !state.submitting,
            modifier = Modifier.fillMaxWidth(),
        ) {
            if (state.submitting) {
                CircularProgressIndicator(
                    modifier = Modifier.padding(end = 8.dp),
                    strokeWidth = 2.dp,
                )
            }
            Text(if (existingProfileId != null) "保存并查看食谱" else "生成我的今日食谱")
        }
    }
}

@Composable
private fun SectionTitle(text: String) {
    Text(
        text,
        style = MaterialTheme.typography.titleSmall,
        fontWeight = FontWeight.SemiBold,
        modifier = Modifier.padding(top = 4.dp),
    )
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun SegmentChips(
    options: Map<String, String>,
    selected: String,
    onSelect: (String) -> Unit,
) {
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        options.forEach { (key, label) ->
            FilterChip(
                selected = key == selected,
                onClick = { onSelect(key) },
                label = { Text(label) },
            )
        }
    }
}
