package com.friday420.assistant.service

import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.Bundle
import android.os.IBinder
import android.os.PowerManager
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.util.Log
import androidx.core.app.NotificationCompat
import com.friday420.assistant.FridayApplication
import com.friday420.assistant.MainActivity
import com.friday420.assistant.R
import java.util.Locale

/**
 * Friday 420 AI Background Voice Recognition Foreground Service
 * Listens for hotwords ("Friday", "ফ্রাইডে", "420", "বন্ধু") and dispatches assistant actions.
 */
class FridayVoiceForegroundService : Service(), RecognitionListener {

    private var speechRecognizer: SpeechRecognizer? = null
    private var recognizerIntent: Intent? = null
    private var wakeLock: PowerManager.WakeLock? = null
    private var isListening = false

    override fun onCreate() {
        super.onCreate()
        acquireWakeLock()
        initSpeechRecognizer()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = buildForegroundNotification()
        startForeground(NOTIFICATION_ID, notification)
        startContinuousListening()
        return START_STICKY
    }

    private fun buildForegroundNotification(): Notification {
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return NotificationCompat.Builder(this, FridayApplication.CHANNEL_ID)
            .setContentTitle(getString(R.string.app_name))
            .setContentText(getString(R.string.notification_active))
            .setSmallIcon(android.R.drawable.ic_btn_speak_now)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    private fun acquireWakeLock() {
        val powerManager = getSystemService(POWER_SERVICE) as? PowerManager
        wakeLock = powerManager?.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK,
            "Friday420::VoiceServiceWakeLock"
        )?.apply {
            setReferenceCounted(false)
            acquire(10 * 60 * 1000L) // 10 minutes timeout safe renewal
        }
    }

    private fun initSpeechRecognizer() {
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            Log.e(TAG, "SpeechRecognizer not available on this Android device")
            return
        }

        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this).apply {
            setRecognitionListener(this@FridayVoiceForegroundService)
        }

        recognizerIntent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "bn-BD")
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "bn-BD")
            putExtra(RecognizerIntent.EXTRA_SUPPORTED_LANGUAGES, arrayOf("bn-BD", "en-US"))
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
        }
    }

    private fun startContinuousListening() {
        if (isListening || speechRecognizer == null || recognizerIntent == null) return
        try {
            isListening = true
            speechRecognizer?.startListening(recognizerIntent)
            broadcastStatus("LISTENING")
        } catch (e: Exception) {
            Log.e(TAG, "Error starting voice recognition", e)
            isListening = false
        }
    }

    private fun restartListeningSafely() {
        isListening = false
        android.os.Handler(mainLooper).postDelayed({
            startContinuousListening()
        }, 500)
    }

    override fun onResults(results: Bundle?) {
        val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
        if (!matches.isNullOrEmpty()) {
            val spokenText = matches[0]
            Log.d(TAG, "Recognized spoken text: $spokenText")
            broadcastSpokenCommand(spokenText)
        }
        restartListeningSafely()
    }

    override fun onPartialResults(partialResults: Bundle?) {
        val matches = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
        if (!matches.isNullOrEmpty()) {
            broadcastPartialText(matches[0])
        }
    }

    override fun onError(error: Int) {
        Log.w(TAG, "Speech recognition error code: $error")
        restartListeningSafely()
    }

    override fun onReadyForSpeech(params: Bundle?) {
        broadcastStatus("READY")
    }

    override fun onBeginningOfSpeech() {
        broadcastStatus("SPEAKING")
    }

    override fun onRmsChanged(rmsdB: Float) {
        val intent = Intent(ACTION_VOICE_RMS).apply {
            putExtra(EXTRA_RMS, rmsdB)
        }
        sendBroadcast(intent)
    }

    override fun onBufferReceived(buffer: ByteArray?) {}
    override fun onEndOfSpeech() {
        broadcastStatus("PROCESSING")
    }

    override fun onEvent(eventType: Int, params: Bundle?) {}

    private fun broadcastSpokenCommand(command: String) {
        val intent = Intent(ACTION_VOICE_COMMAND).apply {
            putExtra(EXTRA_COMMAND_TEXT, command)
        }
        sendBroadcast(intent)
    }

    private fun broadcastPartialText(partial: String) {
        val intent = Intent(ACTION_VOICE_PARTIAL).apply {
            putExtra(EXTRA_PARTIAL_TEXT, partial)
        }
        sendBroadcast(intent)
    }

    private fun broadcastStatus(status: String) {
        val intent = Intent(ACTION_VOICE_STATUS).apply {
            putExtra(EXTRA_STATUS, status)
        }
        sendBroadcast(intent)
    }

    override fun onDestroy() {
        super.onDestroy()
        isListening = false
        speechRecognizer?.destroy()
        wakeLock?.let {
            if (it.isHeld) it.release()
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    companion object {
        const val NOTIFICATION_ID = 4201
        private const val TAG = "FridayVoiceService"

        const val ACTION_VOICE_COMMAND = "com.friday420.assistant.VOICE_COMMAND"
        const val ACTION_VOICE_PARTIAL = "com.friday420.assistant.VOICE_PARTIAL"
        const val ACTION_VOICE_STATUS = "com.friday420.assistant.VOICE_STATUS"
        const val ACTION_VOICE_RMS = "com.friday420.assistant.VOICE_RMS"

        const val EXTRA_COMMAND_TEXT = "extra_command_text"
        const val EXTRA_PARTIAL_TEXT = "extra_partial_text"
        const val EXTRA_STATUS = "extra_status"
        const val EXTRA_RMS = "extra_rms"
    }
}
