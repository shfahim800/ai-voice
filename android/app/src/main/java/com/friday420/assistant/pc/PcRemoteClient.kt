package com.friday420.assistant.pc

import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import org.json.JSONObject
import java.util.concurrent.TimeUnit

enum class PcCommand(val commandName: String) {
    VOLUME_UP("volume_up"),
    VOLUME_DOWN("volume_down"),
    MUTE("volume_mute"),
    PLAY_PAUSE("media_play_pause"),
    NEXT_TRACK("media_next"),
    PREV_TRACK("media_prev"),
    LOCK("pc_lock"),
    SLEEP("pc_sleep"),
    SHUTDOWN("pc_shutdown"),
    RESTART("pc_restart"),
    SCREENSHOT("take_screenshot")
}

/**
 * Native Android PC Remote Controller Client
 * Communicates with Friday PC Daemon via WebSocket and REST.
 */
class PcRemoteClient(private var pcHost: String = "192.168.1.100", private var pcPort: Int = 8765) {

    private val client = OkHttpClient.Builder()
        .connectTimeout(3, TimeUnit.SECONDS)
        .readTimeout(5, TimeUnit.SECONDS)
        .build()

    private var webSocket: WebSocket? = null
    var isConnected: Boolean = false
        private set

    fun updateHost(host: String, port: Int = 8765) {
        pcHost = host
        pcPort = port
        reconnectWebSocket()
    }

    fun reconnectWebSocket() {
        webSocket?.close(1000, "Reconnecting")
        val request = Request.Builder()
            .url("ws://$pcHost:$pcPort/ws")
            .build()

        webSocket = client.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                isConnected = true
                Log.i(TAG, "Connected to Friday PC Daemon at $pcHost:$pcPort")
            }

            override fun onMessage(webSocket: WebSocket, text: String) {
                Log.d(TAG, "PC Status update: $text")
            }

            override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
                isConnected = false
            }

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                isConnected = false
                Log.w(TAG, "PC WebSocket error: ${t.message}")
            }
        })
    }

    suspend fun sendCommand(command: PcCommand, extraParams: Map<String, Any> = emptyMap()): Boolean = withContext(Dispatchers.IO) {
        val payload = JSONObject().apply {
            put("action", command.commandName)
            put("timestamp", System.currentTimeMillis())
            extraParams.forEach { (k, v) -> put(k, v) }
        }

        // Try WebSocket first
        if (isConnected && webSocket?.send(payload.toString()) == true) {
            return@withContext true
        }

        // Fallback to HTTP POST
        try {
            val body = payload.toString().toRequestBody("application/json".toMediaType())
            val request = Request.Builder()
                .url("http://$pcHost:$pcPort/api/command")
                .post(body)
                .build()
            client.newCall(request).execute().use { resp ->
                resp.isSuccessful
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed sending command $command: ${e.message}")
            false
        }
    }

    companion object {
        private const val TAG = "PcRemoteClient"
    }
}
