package com.eatfit.app.ui.components

import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import com.eatfit.app.ui.theme.WarmPrimary
import com.eatfit.app.ui.theme.WarmSubtle

data class BottomNavItem(
    val route: String,
    val label: String,
    val icon: ImageVector,
)

val bottomNavItems = listOf(
    BottomNavItem("home", "首页", Icons.Default.Home),
    BottomNavItem("today", "食谱", Icons.Default.Restaurant),
    BottomNavItem("coach", "顾问", Icons.Default.AutoAwesome),
    BottomNavItem("grocery", "买菜", Icons.Default.ShoppingCart),
    BottomNavItem("profile", "我的", Icons.Default.Person),
)

@Composable
fun BottomNavBar(
    currentRoute: String?,
    onNavigate: (String) -> Unit,
) {
    NavigationBar(
        containerColor = WarmSubtle,
    ) {
        bottomNavItems.forEach { item ->
            val selected = currentRoute == item.route
            NavigationBarItem(
                selected = selected,
                onClick = { onNavigate(item.route) },
                icon = {
                    Icon(
                        item.icon,
                        contentDescription = item.label,
                        modifier = Modifier.size(24.dp),
                    )
                },
                label = { Text(item.label) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = WarmPrimary,
                    selectedTextColor = WarmPrimary,
                    unselectedIconColor = Color(0xFF9C8B7A),
                    unselectedTextColor = Color(0xFF9C8B7A),
                    indicatorColor = Color(0xFFFFE5D9),
                ),
            )
        }
    }
}
