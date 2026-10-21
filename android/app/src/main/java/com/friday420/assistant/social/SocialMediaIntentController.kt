package com.friday420.assistant.social

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Log

enum class SocialPlatform(val platformName: String, val packageName: String, val scheme: String) {
    FACEBOOK("Facebook", "com.facebook.katana", "fb://"),
    WHATSAPP("WhatsApp", "com.whatsapp", "whatsapp://"),
    YOUTUBE("YouTube", "com.google.android.youtube", "vnd.youtube:"),
    INSTAGRAM("Instagram", "com.instagram.android", "instagram://"),
    TIKTOK("TikTok", "com.zhiliaoapp.musically", "snssdk1128://"),
    THREADS("Threads", "com.instagram.barcelona", "threads://"),
    X_TWITTER("X (Twitter)", "com.twitter.android", "twitter://")
}

sealed class SocialAction {
    data class PostText(val platform: SocialPlatform, val text: String) : SocialAction()
    data class SearchVideo(val platform: SocialPlatform, val query: String) : SocialAction()
    data class SendMessage(val platform: SocialPlatform, val recipient: String?, val message: String) : SocialAction()
    data class OpenProfile(val platform: SocialPlatform, val username: String) : SocialAction()
    data class ShareStory(val platform: SocialPlatform, val content: String) : SocialAction()
    data class LaunchApp(val platform: SocialPlatform) : SocialAction()
}

/**
 * Native Android SDK Social Media Intent & Voice Control Handler
 * Deep-links into Facebook, WhatsApp, YouTube, Instagram, TikTok, Threads, and X.
 */
class SocialMediaIntentController(private val context: Context) {

    fun executeAction(action: SocialAction): Boolean {
        return try {
            when (action) {
                is SocialAction.PostText -> handlePostText(action.platform, action.text)
                is SocialAction.SearchVideo -> handleSearchVideo(action.query)
                is SocialAction.SendMessage -> handleSendMessage(action.platform, action.recipient, action.message)
                is SocialAction.OpenProfile -> handleOpenProfile(action.platform, action.username)
                is SocialAction.ShareStory -> handleShareStory(action.platform, action.content)
                is SocialAction.LaunchApp -> launchPlatformApp(action.platform)
            }
            true
        } catch (e: Exception) {
            Log.e(TAG, "Failed to execute social media action: $action", e)
            false
        }
    }

    private fun handlePostText(platform: SocialPlatform, text: String) {
        val sendIntent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, text)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            setPackage(platform.packageName)
        }
        if (canResolve(sendIntent)) {
            context.startActivity(sendIntent)
        } else {
            // Web fallback
            val webUrl = when (platform) {
                SocialPlatform.FACEBOOK -> "https://www.facebook.com/sharer/sharer.php?u=${Uri.encode("https://friday420.ai")}&quote=${Uri.encode(text)}"
                SocialPlatform.X_TWITTER -> "https://twitter.com/intent/tweet?text=${Uri.encode(text)}"
                SocialPlatform.WHATSAPP -> "https://api.whatsapp.com/send?text=${Uri.encode(text)}"
                SocialPlatform.THREADS -> "https://www.threads.net/intent/post?text=${Uri.encode(text)}"
                else -> "https://www.google.com/search?q=${Uri.encode(text)}"
            }
            openBrowser(webUrl)
        }
    }

    private fun handleSearchVideo(query: String) {
        val appIntent = Intent(Intent.ACTION_SEARCH).apply {
            setPackage(SocialPlatform.YOUTUBE.packageName)
            putExtra("query", query)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        if (canResolve(appIntent)) {
            context.startActivity(appIntent)
        } else {
            val webIntent = Intent(
                Intent.ACTION_VIEW,
                Uri.parse("https://www.youtube.com/results?search_query=${Uri.encode(query)}")
            ).apply { flags = Intent.FLAG_ACTIVITY_NEW_TASK }
            context.startActivity(webIntent)
        }
    }

    private fun handleSendMessage(platform: SocialPlatform, recipient: String?, message: String) {
        if (platform == SocialPlatform.WHATSAPP) {
            val phone = recipient?.replace(Regex("[^0-9]"), "") ?: ""
            val url = if (phone.isNotEmpty()) {
                "https://api.whatsapp.com/send?phone=$phone&text=${Uri.encode(message)}"
            } else {
                "https://api.whatsapp.com/send?text=${Uri.encode(message)}"
            }
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                setPackage(SocialPlatform.WHATSAPP.packageName)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            if (canResolve(intent)) {
                context.startActivity(intent)
            } else {
                openBrowser(url)
            }
        } else {
            handlePostText(platform, message)
        }
    }

    private fun handleOpenProfile(platform: SocialPlatform, username: String) {
        val (appUri, webUri) = when (platform) {
            SocialPlatform.INSTAGRAM -> "instagram://user?username=$username" to "https://instagram.com/$username"
            SocialPlatform.FACEBOOK -> "fb://profile/$username" to "https://facebook.com/$username"
            SocialPlatform.TIKTOK -> "snssdk1128://user/profile/$username" to "https://tiktok.com/@$username"
            SocialPlatform.X_TWITTER -> "twitter://user?screen_name=$username" to "https://twitter.com/$username"
            SocialPlatform.THREADS -> "threads://user/$username" to "https://threads.net/@$username"
            else -> "" to "https://google.com/search?q=$username"
        }

        val appIntent = Intent(Intent.ACTION_VIEW, Uri.parse(appUri)).apply {
            setPackage(platform.packageName)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        if (canResolve(appIntent)) {
            context.startActivity(appIntent)
        } else {
            openBrowser(webUri)
        }
    }

    private fun handleShareStory(platform: SocialPlatform, content: String) {
        // Native story share intent
        val storyIntent = Intent("com.instagram.share.ADD_TO_STORY").apply {
            setPackage(platform.packageName)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        if (canResolve(storyIntent)) {
            context.startActivity(storyIntent)
        } else {
            handlePostText(platform, content)
        }
    }

    fun launchPlatformApp(platform: SocialPlatform) {
        val launchIntent = context.packageManager.getLaunchIntentForPackage(platform.packageName)
        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(launchIntent)
        } else {
            val fallbackUrl = when (platform) {
                SocialPlatform.FACEBOOK -> "https://facebook.com"
                SocialPlatform.WHATSAPP -> "https://web.whatsapp.com"
                SocialPlatform.YOUTUBE -> "https://youtube.com"
                SocialPlatform.INSTAGRAM -> "https://instagram.com"
                SocialPlatform.TIKTOK -> "https://tiktok.com"
                SocialPlatform.THREADS -> "https://threads.net"
                SocialPlatform.X_TWITTER -> "https://x.com"
            }
            openBrowser(fallbackUrl)
        }
    }

    /**
     * Parses spoken voice command in Bengali or English into an executable SocialAction
     */
    fun parseVoiceCommand(spokenText: String): SocialAction? {
        val text = spokenText.lowercase().trim()

        // YouTube search
        if (text.contains("ইউটিউব") || text.contains("youtube")) {
            val query = text.replace(Regex("(ইউটিউবে|ইউটিউব|youtube|গান চালাও|ভিডিও দেখাও|play|search)"), "").trim()
            return SocialAction.SearchVideo(SocialPlatform.YOUTUBE, if (query.isEmpty()) "Bangla trending music" else query)
        }

        // WhatsApp message
        if (text.contains("হোয়াটসঅ্যাপ") || text.contains("whatsapp")) {
            val msg = text.replace(Regex("(হোয়াটসঅ্যাপে|হোয়াটসঅ্যাপ|whatsapp|মেসেজ পাঠাও|send message to)"), "").trim()
            return SocialAction.SendMessage(SocialPlatform.WHATSAPP, null, if (msg.isEmpty()) "Hello from Friday 420 AI" else msg)
        }

        // Facebook post
        if (text.contains("ফেসবুক") || text.contains("facebook")) {
            val post = text.replace(Regex("(ফেসবুকে|ফেসবুক|facebook|পোস্ট করো|post|share)"), "").trim()
            return SocialAction.PostText(SocialPlatform.FACEBOOK, if (post.isEmpty()) "Posted with Friday 420 AI Voice Assistant" else post)
        }

        // Instagram story / open
        if (text.contains("ইনস্টাগ্রাম") || text.contains("instagram")) {
            return if (text.contains("স্টোরি") || text.contains("story")) {
                SocialAction.ShareStory(SocialPlatform.INSTAGRAM, "Friday 420 AI story update")
            } else {
                SocialAction.LaunchApp(SocialPlatform.INSTAGRAM)
            }
        }

        // TikTok
        if (text.contains("টিকটক") || text.contains("tiktok")) {
            return SocialAction.LaunchApp(SocialPlatform.TIKTOK)
        }

        // Threads
        if (text.contains("থ্রেডস") || text.contains("threads")) {
            val threadMsg = text.replace(Regex("(থ্রেডসে|থ্রেডস|threads|post)"), "").trim()
            return SocialAction.PostText(SocialPlatform.THREADS, if (threadMsg.isEmpty()) "Sharing thoughts via Friday 420" else threadMsg)
        }

        // X / Twitter
        if (text.contains("টুইটার") || text.contains("twitter") || text.contains("tweet")) {
            val tweetMsg = text.replace(Regex("(টুইটারে|টুইটার|twitter|tweet|post)"), "").trim()
            return SocialAction.PostText(SocialPlatform.X_TWITTER, if (tweetMsg.isEmpty()) "Tweeted via Friday 420 AI Assistant" else tweetMsg)
        }

        return null
    }

    private fun canResolve(intent: Intent): Boolean {
        return intent.resolveActivity(context.packageManager) != null
    }

    private fun openBrowser(url: String) {
        val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        context.startActivity(browserIntent)
    }

    companion object {
        private const val TAG = "SocialMediaIntentCtrl"
    }
}
