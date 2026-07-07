package com.eatfit.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

private val LightColors = lightColorScheme(
    primary = WarmPrimary,
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = WarmPrimaryLight,
    onPrimaryContainer = WarmText,
    secondary = WarmAmber,
    onSecondary = Color(0xFFFFFFFF),
    secondaryContainer = Color(0xFFFEF3C7),
    onSecondaryContainer = WarmText,
    tertiary = WarmHealth,
    onTertiary = Color(0xFFFFFFFF),
    background = WarmBg,
    onBackground = WarmText,
    surface = WarmCard,
    onSurface = WarmText,
    surfaceVariant = WarmSubtle,
    onSurfaceVariant = WarmTextSecondary,
    outline = WarmBorder,
    outlineVariant = WarmBorderStrong,
    error = Color(0xFFDC2626),
    onError = Color(0xFFFFFFFF),
    errorContainer = Color(0xFFFEE2E2),
    onErrorContainer = Color(0xFF991B1B),
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFFFF8A65),
    onPrimary = Color(0xFF1F1611),
    primaryContainer = WarmPrimaryDark,
    onPrimaryContainer = Color(0xFFFFF5EE),
    secondary = WarmAmber,
    onSecondary = Color(0xFF1F1611),
    background = Color(0xFF1A1410),
    onBackground = Color(0xFFF5E6DD),
    surface = Color(0xFF2A2018),
    onSurface = Color(0xFFF5E6DD),
    surfaceVariant = Color(0xFF3A2E24),
    onSurfaceVariant = Color(0xFFD4C4B5),
    outline = Color(0xFF5A4A3C),
    error = Color(0xFFF87171),
    onError = Color(0xFF1A1410),
)

private val EatFitTypography = Typography(
    headlineLarge = TextStyle(fontSize = 32.sp, fontWeight = FontWeight.Bold, color = WarmText),
    headlineMedium = TextStyle(fontSize = 28.sp, fontWeight = FontWeight.Bold, color = WarmText),
    titleLarge = TextStyle(fontSize = 22.sp, fontWeight = FontWeight.Bold, color = WarmText),
    titleMedium = TextStyle(fontSize = 18.sp, fontWeight = FontWeight.SemiBold, color = WarmText),
    titleSmall = TextStyle(fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = WarmText),
    bodyLarge = TextStyle(fontSize = 16.sp, color = WarmText),
    bodyMedium = TextStyle(fontSize = 14.sp, color = WarmTextSecondary),
    bodySmall = TextStyle(fontSize = 12.sp, color = WarmTextMuted),
    labelLarge = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = WarmPrimary),
    labelMedium = TextStyle(fontSize = 12.sp, fontWeight = FontWeight.Medium, color = WarmTextSecondary),
    labelSmall = TextStyle(fontSize = 11.sp, color = WarmTextMuted),
)

@Composable
fun EatFitTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colorScheme = if (darkTheme) DarkColors else LightColors

    MaterialTheme(
        colorScheme = colorScheme,
        typography = EatFitTypography,
        content = content,
    )
}
