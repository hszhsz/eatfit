package com.eatfit.app.ui.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.eatfit.app.ui.AppViewModel
import com.eatfit.app.ui.theme.WarmPrimary
import com.eatfit.app.ui.theme.WarmPrimaryDark
import com.eatfit.app.ui.theme.WarmAmber
import com.eatfit.app.ui.theme.WarmHealth
import com.eatfit.app.ui.theme.WarmSubtle

@Composable
fun HomeScreen(
    onNavigateToToday: () -> Unit,
    onNavigateToCoach: () -> Unit,
    onNavigateToGrocery: () -> Unit,
    onNavigateToProfile: () -> Unit,
    appViewModel: AppViewModel = hiltViewModel(),
) {
    val profile by appViewModel.profile.collectAsState()

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        // Hero greeting card
        item {
            HeroGreeting(
                userName = profile?.name ?: "朋友",
                onNavigateToToday = onNavigateToToday,
            )
        }

        // Quick action grid
        item {
            QuickActions(
                onToday = onNavigateToToday,
                onCoach = onNavigateToCoach,
                onGrocery = onNavigateToGrocery,
                onProfile = onNavigateToProfile,
            )
        }

        // Feature highlights
        item {
            FeatureHighlight()
        }

        // Motivational card
        item {
            MotivationalCard()
        }
    }
}

@Composable
private fun HeroGreeting(
    userName: String,
    onNavigateToToday: () -> Unit,
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(28.dp),
        colors = CardDefaults.cardColors(containerColor = Color.Transparent),
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(180.dp)
                .background(
                    brush = Brush.horizontalGradient(
                        colors = listOf(WarmPrimary, WarmPrimaryDark),
                    ),
                    shape = RoundedCornerShape(28.dp),
                ),
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.SpaceBetween,
            ) {
                Column {
                    Text(
                        "EatFit 吃什么",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "$userName，今天吃什么？",
                        style = MaterialTheme.typography.titleMedium,
                        color = Color.White.copy(alpha = 0.9f),
                    )
                    Text(
                        "AI 为你定制每日饮食计划",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.White.copy(alpha = 0.7f),
                    )
                }
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = Color.White.copy(alpha = 0.2f),
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .clickable(onClick = onNavigateToToday),
                ) {
                    Text(
                        "查看今日食谱 →",
                        style = MaterialTheme.typography.labelLarge,
                        color = Color.White,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                    )
                }
            }
        }
    }
}

@Composable
private fun QuickActions(
    onToday: () -> Unit,
    onCoach: () -> Unit,
    onGrocery: () -> Unit,
    onProfile: () -> Unit,
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        QuickActionCard(
            icon = Icons.Default.Restaurant,
            label = "今日食谱",
            color = WarmPrimary,
            modifier = Modifier.weight(1f),
            onClick = onToday,
        )
        QuickActionCard(
            icon = Icons.Default.AutoAwesome,
            label = "AI 营养顾问",
            color = WarmAmber,
            modifier = Modifier.weight(1f),
            onClick = onCoach,
        )
    }
    Spacer(modifier = Modifier.height(4.dp))
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        QuickActionCard(
            icon = Icons.Default.ShoppingCart,
            label = "买菜清单",
            color = WarmHealth,
            modifier = Modifier.weight(1f),
            onClick = onGrocery,
        )
        QuickActionCard(
            icon = Icons.Default.Person,
            label = "我的 profile",
            color = Color(0xFF8B5CF6),
            modifier = Modifier.weight(1f),
            onClick = onProfile,
        )
    }
}

@Composable
private fun QuickActionCard(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    color: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit,
) {
    Card(
        modifier = modifier
            .height(110.dp)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = WarmSubtle),
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween,
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(color.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    icon,
                    contentDescription = null,
                    tint = color,
                    modifier = Modifier.size(22.dp),
                )
            }
            Text(
                label,
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.SemiBold,
            )
        }
    }
}

@Composable
private fun FeatureHighlight() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp),
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    Icons.Default.LocalFireDepartment,
                    contentDescription = null,
                    tint = WarmPrimary,
                    modifier = Modifier.size(24.dp),
                )
                Text(
                    "AI 驱动的饮食管理",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(start = 8.dp),
                )
            }
            FeatureItem(text = "根据体测数据计算 BMR/TDEE，精准制定每日热量目标")
            FeatureItem(text = "54+ 道食谱智能匹配，自动过滤过敏原")
            FeatureItem(text = "AI 营养顾问实时复盘，给出可执行建议")
            FeatureItem(text = "一键生成买菜清单，按品类分类省时省力")
        }
    }
}

@Composable
private fun FeatureItem(text: String) {
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        Box(
            modifier = Modifier
                .padding(top = 7.dp)
                .size(6.dp)
                .clip(CircleShape)
                .background(WarmPrimary),
        )
        Text(
            text,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
private fun MotivationalCard() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = WarmSubtle),
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Text("🥗", fontSize = 40.sp)
            Text(
                "吃对每一餐，遇见更好的自己",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
            )
            Text(
                "EatFit · AI 体测饮食管家",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}
