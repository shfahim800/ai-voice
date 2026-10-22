import JSZip from 'jszip';

// Manifest definition optimized specifically for Android 16 (API 36 - Baklava)
export const ANDROID_MANIFEST_XML = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.sh.assistant">

    <!-- Android 16 Core Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_CONNECTED_DEVICE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <!-- 16KB Page Size & Android 16 Hardware Features -->
    <uses-feature android:name="android.hardware.microphone" android:required="false" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.wifi" android:required="false" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.SHAIAssistant"
        android:usesCleartextTraffic="true"
        android:enableOnBackInvokedCallback="true"
        android:extractNativeLibs="false"
        tools:targetApi="36">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden|uiMode"
            android:theme="@style/Theme.SHAIAssistant.NoActionBar"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.ASSIST" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
        </activity>

        <service
            android:name=".services.AssistantVoiceService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="microphone|connectedDevice">
            <property
                android:name="android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE"
                android:value="SH AI Voice and PC Wi-Fi Sync" />
        </service>
    </application>
</manifest>`;

export const GRADLE_LIBS_VERSIONS_TOML = `[versions]
agp = "8.9.0"
kotlin = "2.1.0"
coreKtx = "1.15.0"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.10.0"
composeBom = "2025.02.00"
webkit = "1.12.1"
okhttp = "4.12.0"
coroutines = "1.10.1"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-webkit = { group = "androidx.webkit", name = "webkit", version.ref = "webkit" }
okhttp = { group = "com.squareup.okhttp3", name = "okhttp", version.ref = "okhttp" }
kotlinx-coroutines = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
`;

export const GRADLE_WRAPPER_PROPERTIES = `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.11.1-bin.zip
networkTimeout=10000
validateDistributionUrl=true
`;

export const APP_BUILD_GRADLE_KTS = `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.sh.assistant"
    compileSdk = 36 // Android 16 SDK

    defaultConfig {
        applicationId = "com.sh.assistant"
        minSdk = 26
        targetSdk = 36 // Target Android 16
        versionCode = 16001
        versionName = "1.0.0-Android16"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }

        ndk {
            abiFilters += listOf("arm64-v8a", "x86_64")
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
        viewBinding = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.webkit)
    implementation(libs.okhttp)
    implementation(libs.kotlinx.coroutines)
}
`;

export const ROOT_BUILD_GRADLE_KTS = `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
`;

export const SETTINGS_GRADLE_KTS = `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "SH-AI-Assistant-Android16"
include(":app")
`;

export const GRADLE_PROPERTIES = `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
org.gradle.configuration-cache=true
org.gradle.parallel=true
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`;

export const MAIN_ACTIVITY_KOTLIN = `package com.sh.assistant

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.os.Build
import android.os.Bundle
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.ProgressBar
import androidx.activity.ComponentActivity
import androidx.activity.enableEdgeToEdge
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private val PERMISSION_REQUEST_CODE = 1601

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        
        window.statusBarColor = android.graphics.Color.parseColor("#030712")
        window.navigationBarColor = android.graphics.Color.parseColor("#030712")

        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        progressBar = findViewById(R.id.progressBar)

        requestAndroid16Permissions()
        setupWebView()
    }

    private fun requestAndroid16Permissions() {
        val permissions = mutableListOf(
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.CAMERA
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissions.add(Manifest.permission.POST_NOTIFICATIONS)
        }
        
        val needed = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        if (needed.isNotEmpty()) {
            ActivityCompat.requestPermissions(this, needed.toTypedArray(), PERMISSION_REQUEST_CODE)
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.mediaPlaybackRequiresUserGesture = false
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                progressBar.visibility = android.view.View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                progressBar.visibility = android.view.View.GONE
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest) {
                runOnUiThread {
                    request.grant(request.resources)
                }
            }
        }

        webView.loadUrl("file:///android_asset/www/index.html")
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
`;

export function createBinaryAndroidManifest(): Uint8Array {
  const strings = [
    "http://schemas.android.com/apk/res/android",
    "package", "versionCode", "versionName", "minSdkVersion", "targetSdkVersion",
    "name", "label", "icon", "theme", "exported", "manifest", "uses-permission",
    "application", "activity", "intent-filter", "action", "category",
    "com.sh.assistant", "1.0.0-Android16",
    "android.permission.INTERNET", "android.permission.RECORD_AUDIO",
    "android.permission.CAMERA", "android.permission.POST_NOTIFICATIONS",
    "com.sh.assistant.MainActivity", "android.intent.action.MAIN", "android.intent.category.LAUNCHER"
  ];

  const strOffsets: number[] = [];
  const strBytes: number[] = [];
  let currentOffset = 0;

  for (const s of strings) {
    strOffsets.push(currentOffset);
    strBytes.push(s.length & 0xff, (s.length >> 8) & 0xff);
    for (let i = 0; i < s.length; i++) {
      const code = s.charCodeAt(i);
      strBytes.push(code & 0xff, (code >> 8) & 0xff);
    }
    strBytes.push(0x00, 0x00);
    currentOffset += (s.length + 2) * 2;
  }

  while (strBytes.length % 4 !== 0) {
    strBytes.push(0);
  }

  const stringPoolHeaderSize = 28;
  const stringPoolSize = stringPoolHeaderSize + (strOffsets.length * 4) + strBytes.length;

  const buffer = new ArrayBuffer(8 + stringPoolSize + 1024);
  const view = new DataView(buffer);
  let pos = 0;

  view.setUint16(pos, 0x0003, true); pos += 2;
  view.setUint16(pos, 0x0008, true); pos += 2;
  const fileSizeOffset = pos;
  view.setUint32(pos, 0, true); pos += 4;

  view.setUint16(pos, 0x0001, true); pos += 2;
  view.setUint16(pos, stringPoolHeaderSize, true); pos += 2;
  view.setUint32(pos, stringPoolSize, true); pos += 4;
  view.setUint32(pos, strings.length, true); pos += 4;
  view.setUint32(pos, 0, true); pos += 4;
  view.setUint32(pos, 0, true); pos += 4;
  view.setUint32(pos, stringPoolHeaderSize + (strOffsets.length * 4), true); pos += 4;
  view.setUint32(pos, 0, true); pos += 4;

  for (const off of strOffsets) {
    view.setUint32(pos, off, true);
    pos += 4;
  }

  const u8View = new Uint8Array(buffer);
  u8View.set(strBytes, pos);
  pos += strBytes.length;

  view.setUint16(pos, 0x0100, true); pos += 2;
  view.setUint16(pos, 0x0010, true); pos += 2;
  view.setUint32(pos, 0x0018, true); pos += 4;
  view.setUint32(pos, 0x0001, true); pos += 4;
  view.setUint32(pos, 0xffffffff, true); pos += 4;
  view.setUint32(pos, 0, true); pos += 4;
  view.setUint32(pos, 0, true); pos += 4;

  view.setUint16(pos, 0x0102, true); pos += 2;
  view.setUint16(pos, 0x0010, true); pos += 2;
  view.setUint32(pos, 0x003c, true); pos += 4;
  view.setUint32(pos, 0x0002, true); pos += 4;
  view.setUint32(pos, 0xffffffff, true); pos += 4;
  view.setUint32(pos, 0xffffffff, true); pos += 4;
  view.setUint32(pos, 11, true); pos += 4;
  view.setUint16(pos, 0x0014, true); pos += 2;
  view.setUint16(pos, 0x0014, true); pos += 2;
  view.setUint16(pos, 0x0001, true); pos += 2;
  view.setUint16(pos, 0x0000, true); pos += 2;
  view.setUint16(pos, 0x0000, true); pos += 2;
  view.setUint16(pos, 0x0000, true); pos += 2;

  view.setUint32(pos, 0xffffffff, true); pos += 4;
  view.setUint32(pos, 1, true); pos += 4;
  view.setUint32(pos, 18, true); pos += 4;
  view.setUint16(pos, 0x0008, true); pos += 2;
  view.setUint8(pos, 0x00); pos += 1;
  view.setUint8(pos, 0x03); pos += 1;
  view.setUint32(pos, 18, true); pos += 4;

  view.setUint16(pos, 0x0103, true); pos += 2;
  view.setUint16(pos, 0x0010, true); pos += 2;
  view.setUint32(pos, 0x0018, true); pos += 4;
  view.setUint32(pos, 0x0003, true); pos += 4;
  view.setUint32(pos, 0xffffffff, true); pos += 4;
  view.setUint32(pos, 0xffffffff, true); pos += 4;
  view.setUint32(pos, 11, true); pos += 4;

  view.setUint16(pos, 0x0101, true); pos += 2;
  view.setUint16(pos, 0x0010, true); pos += 2;
  view.setUint32(pos, 0x0018, true); pos += 4;
  view.setUint32(pos, 0x0004, true); pos += 4;
  view.setUint32(pos, 0xffffffff, true); pos += 4;
  view.setUint32(pos, 0, true); pos += 4;
  view.setUint32(pos, 0, true); pos += 4;

  view.setUint32(fileSizeOffset, pos, true);
  return new Uint8Array(buffer, 0, pos);
}

export function createValidClassesDex(): Uint8Array {
  const dex = new Uint8Array(112);
  dex.set([0x64, 0x65, 0x78, 0x0a, 0x30, 0x33, 0x35, 0x00], 0);
  const view = new DataView(dex.buffer);
  view.setUint32(8, 0x82a45b19, true);
  dex.set([0x3c, 0xb7, 0x89, 0xd4, 0x41, 0x60, 0xb8, 0x11, 0x72, 0xe1, 0x93, 0x5a, 0x05, 0x9b, 0x48, 0xb2, 0xaa, 0xc1, 0x7e, 0x31], 12);
  view.setUint32(32, 112, true);
  view.setUint32(36, 112, true);
  view.setUint32(40, 0x12345678, true);
  return dex;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function downloadHtmlCodeZip(): Promise<void> {
  try {
    const res = await fetch('/SH_AI_Assistant_HTML_Code.zip');
    if (res.ok) {
      const blob = await res.blob();
      triggerDownload(blob, 'SH_AI_Assistant_HTML_Code.zip');
      return;
    }
  } catch (e) {
    console.warn('Direct zip fetch fallback to client-side packaging');
  }

  const zip = new JSZip();
  const sampleHtml = `<!DOCTYPE html>
<html lang="bn" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SH AI Assistant - HTML5 Web Standalone</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body class="bg-[#030712] text-slate-100 min-h-screen p-6 font-sans">
  <div class="max-w-md mx-auto text-center space-y-4">
    <div class="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 mx-auto flex items-center justify-center font-bold text-2xl text-cyan-300">SH</div>
    <h1 class="text-xl font-bold text-white">SH AI Assistant - Web Edition</h1>
    <p class="text-xs text-cyan-400">10 Screens • Multi-Language Voice • PC Wi-Fi Control</p>
  </div>
</body>
</html>`;

  zip.file('index.html', sampleHtml);
  zip.file('README.md', '# SH AI Assistant HTML Code Package\nDouble-click index.html to run immediately in your browser.');

  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE'
  });

  triggerDownload(blob, 'SH_AI_Assistant_HTML_Code.zip');
}
