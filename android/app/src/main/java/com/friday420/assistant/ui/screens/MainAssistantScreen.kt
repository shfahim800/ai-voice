package com.friday420.assistant.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.MicOff
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.PowerSettingsNew
import androidx.compose.material.icons.filled.VolumeDown
import androidx.compose.material.icons.filled.VolumeMute
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.friday420.assistant.ai.AgentResponse
import com.friday420.assistant.pc.PcCommand
import com.friday420.assistant.service.FridayTtsEngine
import com.friday420.assistant.social.SocialAction
import com.friday420.assistant.social.SocialPlatform
import com.friday420.assistant.ui.components.FridayGlassCard
import com.friday420.assistant.ui.components.VoiceWaveformVisualizer
import com.friday420.assistant.ui.theme.CyanAccent
import com.friday420.assistant.ui.theme.PinkAccent
import com.friday420.assistant.ui.theme.PurpleAccent
import com.friday420.assistant.ui.theme.TextMuted
import com.friday420.assistant.ui.theme.TextPrimary

@Composable
fun MainAssistantScreen(
    isListening: Boolean,
    voiceStatus: String,
    rmsLevel: Float,
    lastCommand: String,
    activeWinner: AgentResponse?,
    onToggleListening: () -> Unit,
    onTriggerRace: (String) -> Unit,
    onSocialAction: (SocialAction) -> Unit,
    onPcCommand: (PcCommand) -> Unit,
    onSelectPreset: (FridayTtsEngine.VoicePreset) -> Unit
) {
    var animateStaircase by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        animateStaircase = true
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF030712))
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp, vertical = 24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Section 1: iOS Blurred Header with Staircase delay 0ms
            item {
                StaircaseItem(visible = animateStaircase, delayMs = 50) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(10.dp)
                                        .clip(CircleShape)
                                        .background(if (isListening) Color(0xFF10B981) else Color(0xFF64748B))
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "FRIDAY 420 AI",
                                    fontSize = 20.sp,
                                    fontWeight = FontWeight.Black,
                                    color = TextPrimary,
                                    letterSpacing = 1.sp
                                )
                            }
                            Text(
                                text = "আপনার সর্বক্ষণের ব্যক্তিগত এআই বন্ধু",
                                fontSize = 12.sp,
                                color = CyanAccent
                            )
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(0x3306B6D4))
                                .padding(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "Android 16 Native",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = CyanAccent
                            )
                        }
                    }
                }
            }

            // Section 2: Big Voice Hub with Siri / Cyber Wave Visualizer (Staircase delay 100ms)
            item {
                StaircaseItem(visible = animateStaircase, delayMs = 120) {
                    FridayGlassCard(modifier = Modifier.fillMaxWidth()) {
                        Column(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = if (isListening) "ফ্রাইডে শুনছে… বলুন (Listening)" else "ট্যাপ করে কথা বলুন বা Hey Friday বলুন",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium,
                                color = if (isListening) CyanAccent else TextMuted
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            VoiceWaveformVisualizer(
                                isListening = isListening,
                                rmsLevel = rmsLevel,
                                modifier = Modifier.fillMaxWidth()
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            // Large Glowing Mic Toggle
                            Box(
                                modifier = Modifier
                                    .size(76.dp)
                                    .clip(CircleShape)
                                    .background(
                                        brush = Brush.linearGradient(
                                            colors = if (isListening) listOf(PinkAccent, PurpleAccent) else listOf(CyanAccent, PurpleAccent)
                                        )
                                    )
                                    .clickable { onToggleListening() },
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = if (isListening) Icons.Default.Mic else Icons.Default.MicOff,
                                    contentDescription = "Mic",
                                    tint = Color.White,
                                    modifier = Modifier.size(36.dp)
                                )
                            }

                            if (lastCommand.isNotEmpty()) {
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "লাস্ট কমান্ড: \"$lastCommand\"",
                                    fontSize = 12.sp,
                                    color = TextPrimary
                                )
                            }
                        }
                    }
                }
            }

            // Section 3: 15-AI Agent Parallel Race Hub (Staircase delay 180ms)
            item {
                StaircaseItem(visible = animateStaircase, delayMs = 180) {
                    FridayGlassCard(modifier = Modifier.fillMaxWidth()) {
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "১৫টি এআই এজেন্ট প্যারালাল রেস",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary
                                )
                                Text(
                                    text = "<120ms Latency",
                                    fontSize = 11.sp,
                                    color = Color(0xFF10B981),
                                    fontWeight = FontWeight.SemiBold
                                )
                            }

                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "১০-১৫টি শীর্ষস্থানীয় এআই এজেন্ট (Gemini, Claude, GPT, DeepSeek, Groq) একসাথে রেস করে দ্রুত উত্তর দেয়।",
                                fontSize = 12.sp,
                                color = TextMuted
                            )

                            Spacer(modifier = Modifier.height(10.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Button(
                                    onClick = { onTriggerRace("আজকের আবহাওয়া কেমন এবং দ্রুত কিছু টিপস দিন") },
                                    colors = ButtonDefaults.buttonColors(containerColor = CyanAccent),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text("রেস টেস্ট করুন", color = Color.Black, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }
                            }

                            if (activeWinner != null) {
                                Spacer(modifier = Modifier.height(10.dp))
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(Color(0x3310B981))
                                        .padding(10.dp)
                                ) {
                                    Column {
                                        Text(
                                            text = "🏆 বিজয়ী এজেন্ট: ${activeWinner.agentName} (${activeWinner.latencyMs}ms)",
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Color(0xFF34D399)
                                        )
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(
                                            text = activeWinner.text,
                                            fontSize = 12.sp,
                                            color = TextPrimary
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Section 4: Social Media Voice Control Grid (Staircase delay 240ms)
            item {
                StaircaseItem(visible = animateStaircase, delayMs = 240) {
                    FridayGlassCard(modifier = Modifier.fillMaxWidth()) {
                        Column {
                            Text(
                                text = "সোশ্যাল মিডিয়া ভয়েস ও ডিরেক্ট কন্ট্রোল",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Text(
                                text = "ভয়েস দিয়ে পোস্ট, স্টোরি, সার্চ ও লাইক করুন (FB, WhatsApp, YouTube, Insta, TikTok, Threads, X)",
                                fontSize = 12.sp,
                                color = TextMuted
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            val platforms = listOf(
                                SocialPlatform.FACEBOOK to "Facebook",
                                SocialPlatform.WHATSAPP to "WhatsApp",
                                SocialPlatform.YOUTUBE to "YouTube",
                                SocialPlatform.INSTAGRAM to "Instagram",
                                SocialPlatform.TIKTOK to "TikTok",
                                SocialPlatform.THREADS to "Threads",
                                SocialPlatform.X_TWITTER to "X (Twitter)"
                            )

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                platforms.take(4).forEach { (platform, name) ->
                                    SocialIconButton(
                                        name = name,
                                        onClick = { onSocialAction(SocialAction.LaunchApp(platform)) }
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                platforms.drop(4).forEach { (platform, name) ->
                                    SocialIconButton(
                                        name = name,
                                        onClick = { onSocialAction(SocialAction.LaunchApp(platform)) }
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Section 5: PC Remote Control Wi-Fi (Staircase delay 300ms)
            item {
                StaircaseItem(visible = animateStaircase, delayMs = 300) {
                    FridayGlassCard(modifier = Modifier.fillMaxWidth()) {
                        Column {
                            Text(
                                text = "পিসি রিমোট কন্ট্রোল (Wi-Fi)",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Spacer(modifier = Modifier.height(10.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                IconButton(onClick = { onPcCommand(PcCommand.VOLUME_UP) }) {
                                    Icon(Icons.Default.VolumeUp, "Vol Up", tint = CyanAccent)
                                }
                                IconButton(onClick = { onPcCommand(PcCommand.VOLUME_DOWN) }) {
                                    Icon(Icons.Default.VolumeDown, "Vol Down", tint = CyanAccent)
                                }
                                IconButton(onClick = { onPcCommand(PcCommand.MUTE) }) {
                                    Icon(Icons.Default.VolumeMute, "Mute", tint = PinkAccent)
                                }
                                IconButton(onClick = { onPcCommand(PcCommand.PLAY_PAUSE) }) {
                                    Icon(Icons.Default.PlayArrow, "Play/Pause", tint = PurpleAccent)
                                }
                                IconButton(onClick = { onPcCommand(PcCommand.LOCK) }) {
                                    Icon(Icons.Default.PowerSettingsNew, "Lock", tint = Color(0xFFEF4444))
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun StaircaseItem(
    visible: Boolean,
    delayMs: Int,
    content: @Composable () -> Unit
) {
    AnimatedVisibility(
        visible = visible,
        enter = fadeIn(animationSpec = tween(durationMillis = 350, delayMillis = delayMs)) +
                slideInVertically(
                    initialOffsetY = { 40 },
                    animationSpec = tween(durationMillis = 350, delayMillis = delayMs)
                )
    ) {
        content()
    }
}

@Composable
fun SocialIconButton(
    name: String,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(12.dp))
            .background(Color(0x2238BDF8))
            .clickable { onClick() }
            .padding(horizontal = 12.dp, vertical = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = name,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            color = TextPrimary
        )
    }
}
