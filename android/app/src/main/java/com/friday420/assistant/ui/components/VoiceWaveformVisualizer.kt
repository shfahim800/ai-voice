package com.friday420.assistant.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.friday420.assistant.ui.theme.CyanAccent
import com.friday420.assistant.ui.theme.PinkAccent
import com.friday420.assistant.ui.theme.PurpleAccent
import kotlin.math.sin

@Composable
fun VoiceWaveformVisualizer(
    isListening: Boolean,
    rmsLevel: Float,
    modifier: Modifier = Modifier
) {
    val transition = rememberInfiniteTransition(label = "WaveAnimation")
    val phase by transition.animateFloat(
        initialValue = 0f,
        targetValue = 6.28f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1400, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "Phase"
    )

    Canvas(
        modifier = modifier
            .fillMaxWidth()
            .height(72.dp)
    ) {
        val barCount = 28
        val barSpacing = size.width / barCount
        val barWidth = barSpacing * 0.45f
        val centerY = size.height / 2f

        for (i in 0 until barCount) {
            val normalizedIndex = i.toFloat() / barCount
            val waveMultiplier = if (isListening) {
                val dynamicHeight = (rmsLevel.coerceIn(0f, 15f) / 15f) * 0.5f + 0.5f
                val sine = sin(normalizedIndex * 3.14f * 2f + phase) * 0.5f + 0.5f
                (sine * dynamicHeight).coerceIn(0.15f, 1.0f)
            } else {
                0.12f
            }

            val barHeight = size.height * waveMultiplier
            val left = i * barSpacing + (barSpacing - barWidth) / 2
            val top = centerY - barHeight / 2

            val brush = Brush.verticalGradient(
                colors = listOf(CyanAccent, PurpleAccent, PinkAccent),
                startY = top,
                endY = top + barHeight
            )

            drawRoundRect(
                brush = brush,
                topLeft = Offset(left, top),
                size = Size(barWidth, barHeight),
                cornerRadius = CornerRadius(4.dp.toPx(), 4.dp.toPx())
            )
        }
    }
}
