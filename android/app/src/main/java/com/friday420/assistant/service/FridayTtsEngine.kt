package com.friday420.assistant.service

import android.content.Context
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import java.util.Locale

/**
 * Native Android SDK TextToSpeech wrapper with Bengali and English support,
 * custom voice presets (Friday 420 Friendly, Turbo Fast, Cyber Echo, Studio Pro).
 */
class FridayTtsEngine(
    private val context: Context,
    private val onInitComplete: ((Boolean) -> Unit)? = null
) : TextToSpeech.OnInitListener {

    private var tts: TextToSpeech? = TextToSpeech(context, this)
    private var isReady = false

    var currentPreset: VoicePreset = VoicePreset.FRIDAY_FRIENDLY
        set(value) {
            field = value
            applyPreset(value)
        }

    enum class VoicePreset(val title: String, val pitch: Float, val speed: Float) {
        FRIDAY_FRIENDLY("Friday 420 (Friendly)", 1.05f, 1.15f),
        TURBO_FAST("Turbo 420 (Fast)", 1.10f, 1.45f),
        JARVIS_PRO("Friday Cyber (Jarvis)", 0.88f, 1.05f),
        CHILL_MATE("Bangla Bondhu", 1.0f, 1.0f)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            // Attempt to configure Bengali locale first with English fallback
            val bnLocale = Locale("bn", "BD")
            val result = tts?.setLanguage(bnLocale)
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                val inBn = Locale("bn", "IN")
                val inResult = tts?.setLanguage(inBn)
                if (inResult == TextToSpeech.LANG_MISSING_DATA || inResult == TextToSpeech.LANG_NOT_SUPPORTED) {
                    tts?.language = Locale.US
                }
            }
            applyPreset(currentPreset)
            isReady = true
            onInitComplete?.invoke(true)
        } else {
            Log.e(TAG, "TTS Initialization failed: $status")
            isReady = false
            onInitComplete?.invoke(false)
        }
    }

    private fun applyPreset(preset: VoicePreset) {
        tts?.setPitch(preset.pitch)
        tts?.setSpeechRate(preset.speed)
    }

    fun speak(text: String, onFinished: (() -> Unit)? = null) {
        if (!isReady || tts == null) return

        tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
            override fun onStart(utteranceId: String?) {}
            override fun onDone(utteranceId: String?) {
                onFinished?.invoke()
            }
            override fun onError(utteranceId: String?) {}
        })

        val params = Bundle().apply {
            putString(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, "friday_reply_${System.currentTimeMillis()}")
        }
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, params, "friday_reply")
    }

    fun stop() {
        tts?.stop()
    }

    fun shutdown() {
        tts?.stop()
        tts?.shutdown()
        tts = null
        isReady = false
    }

    companion object {
        private const val TAG = "FridayTtsEngine"
    }
}
