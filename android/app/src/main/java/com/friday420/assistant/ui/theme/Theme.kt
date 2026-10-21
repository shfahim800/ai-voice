package com.friday420.assistant.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val BgDark = Color(0xFF030712)
val SurfaceDark = Color(0xFF0F172A)
val GlassSurface = Color(0x331E293B)
val GlassBorder = Color(0x4038BDF8)
val CyanAccent = Color(0xFF06B6D4)
val PurpleAccent = Color(0xFF8B5CF6)
val PinkAccent = Color(0xFFEC4899)
val TextPrimary = Color(0xFFF8FAFC)
val TextMuted = Color(0xFF94A3B8)

private val DarkColorScheme = darkColorScheme(
    primary = CyanAccent,
    secondary = PurpleAccent,
    tertiary = PinkAccent,
    background = BgDark,
    surface = SurfaceDark,
    onPrimary = Color.Black,
    onSecondary = Color.White,
    onBackground = TextPrimary,
    onSurface = TextPrimary
)

@Composable
fun Friday420Theme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
