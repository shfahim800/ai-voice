package com.friday420.assistant

import android.Manifest
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.friday420.assistant.ai.AgentResponse
import com.friday420.assistant.ai.ApiRaceHub
import com.friday420.assistant.pc.PcCommand
import com.friday420.assistant.pc.PcRemoteClient
import com.friday420.assistant.service.FridayTtsEngine
import com.friday420.assistant.service.FridayVoiceForegroundService
import com.friday420.assistant.social.SocialAction
import com.friday420.assistant.social.SocialMediaIntentController
import com.friday420.assistant.ui.screens.MainAssistantScreen
import com.friday420.assistant.ui.theme.Friday420Theme
import kotlinx.coroutines.launch

/**
 * Friday 420 AI Assistant - Native Android SDK Main Activity (Kotlin + Jetpack Compose)
 * Integrates Background Voice Recognition, 15-AI Parallel Race, Social Media Deep Links,
 * and PC Wi-Fi Remote.
 */
class MainActivity : ComponentActivity() {

    private lateinit var ttsEngine: FridayTtsEngine
    private lateinit var raceHub: ApiRaceHub
    private lateinit var socialController: SocialMediaIntentController
    private lateinit var pcClient: PcRemoteClient

    private var isListening by mutableStateOf(false)
    private var voiceStatus by mutableStateOf("READY")
    private var rmsLevel by mutableFloatStateOf(0f)
    private var lastCommand by mutableStateOf("")
    private var activeWinner by mutableStateOf<AgentResponse?>(null)

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val audioGranted = permissions[Manifest.permission.RECORD_AUDIO] == true
        if (audioGranted) {
            startVoiceService()
        }
    }

    private val voiceReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            when (intent?.action) {
                FridayVoiceForegroundService.ACTION_VOICE_COMMAND -> {
                    val cmd = intent.getStringExtra(FridayVoiceForegroundService.EXTRA_COMMAND_TEXT) ?: ""
                    handleSpokenVoiceCommand(cmd)
                }
                FridayVoiceForegroundService.ACTION_VOICE_STATUS -> {
                    voiceStatus = intent.getStringExtra(FridayVoiceForegroundService.EXTRA_STATUS) ?: "READY"
                    isListening = voiceStatus == "LISTENING" || voiceStatus == "SPEAKING"
                }
                FridayVoiceForegroundService.ACTION_VOICE_RMS -> {
                    rmsLevel = intent.getFloatExtra(FridayVoiceForegroundService.EXTRA_RMS, 0f)
                }
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize Native Core Subsystems
        ttsEngine = FridayTtsEngine(this)
        raceHub = ApiRaceHub()
        socialController = SocialMediaIntentController(this)
        pcClient = PcRemoteClient()

        requestRequiredPermissions()

        setContent {
            Friday420Theme {
                MainAssistantScreen(
                    isListening = isListening,
                    voiceStatus = voiceStatus,
                    rmsLevel = rmsLevel,
                    lastCommand = lastCommand,
                    activeWinner = activeWinner,
                    onToggleListening = { toggleVoiceService() },
                    onTriggerRace = { prompt -> runAiRace(prompt) },
                    onSocialAction = { action -> socialController.executeAction(action) },
                    onPcCommand = { cmd -> lifecycleScope.launch { pcClient.sendCommand(cmd) } },
                    onSelectPreset = { preset -> ttsEngine.currentPreset = preset }
                )
            }
        }
    }

    private fun requestRequiredPermissions() {
        val permissions = mutableListOf(Manifest.permission.RECORD_AUDIO)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissions.add(Manifest.permission.POST_NOTIFICATIONS)
        }

        val missing = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }

        if (missing.isNotEmpty()) {
            permissionLauncher.launch(missing.toTypedArray())
        } else {
            startVoiceService()
        }
    }

    private fun startVoiceService() {
        val serviceIntent = Intent(this, FridayVoiceForegroundService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }
        isListening = true
    }

    private fun stopVoiceService() {
        val serviceIntent = Intent(this, FridayVoiceForegroundService::class.java)
        stopService(serviceIntent)
        isListening = false
    }

    private fun toggleVoiceService() {
        if (isListening) {
            stopVoiceService()
        } else {
            startVoiceService()
        }
    }

    private fun handleSpokenVoiceCommand(spokenText: String) {
        lastCommand = spokenText

        // 1. Check if spoken command matches a social action
        val socialAction = socialController.parseVoiceCommand(spokenText)
        if (socialAction != null) {
            socialController.executeAction(socialAction)
            ttsEngine.speak("সোশ্যাল মিডিয়া কমান্ড এক্সিকিউট করা হচ্ছে!")
            return
        }

        // 2. Otherwise run 15-Agent AI Race for lightning fast response
        runAiRace(spokenText)
    }

    private fun runAiRace(prompt: String) {
        lifecycleScope.launch {
            raceHub.raceQuery(
                prompt = prompt,
                scope = lifecycleScope,
                onWinner = { winner ->
                    activeWinner = winner
                    ttsEngine.speak(winner.text)
                }
            )
        }
    }

    override fun onResume() {
        super.onResume()
        val filter = IntentFilter().apply {
            addAction(FridayVoiceForegroundService.ACTION_VOICE_COMMAND)
            addAction(FridayVoiceForegroundService.ACTION_VOICE_STATUS)
            addAction(FridayVoiceForegroundService.ACTION_VOICE_RMS)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(voiceReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
        } else {
            registerReceiver(voiceReceiver, filter)
        }
    }

    override fun onPause() {
        super.onPause()
        try {
            unregisterReceiver(voiceReceiver)
        } catch (_: Exception) {}
    }

    override fun onDestroy() {
        super.onDestroy()
        ttsEngine.shutdown()
    }
}
