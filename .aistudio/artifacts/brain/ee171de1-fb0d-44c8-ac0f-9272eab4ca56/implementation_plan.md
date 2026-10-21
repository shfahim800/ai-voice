# Implementation Plan: PC Control, Open-Source Agent Hub, iOS 26 Liquid Blur & Auto-Updates

This plan details the architecture and step-by-step additions to empower the assistant with Wi-Fi PC Control (virtual trackpad, interactive keyboard, bidirectional file transfer), an Open-Source / Multi-Agent API Hub, Apple iOS 26 Liquid Blur aesthetic redesign, silent automatic software updates, and new future-ready plugins.

---

## 1. Feature Architecture & User Review

### A. Wi-Fi PC Control Suite
- **Interactive Virtual Trackpad**: Touch gestures for single tap (left click), two-finger tap (right click), two-finger drag (scroll), press-and-hold (drag & drop), and cursor sensitivity sliders.
- **Full PC Keyboard**: On-screen keyboard bar featuring `Esc`, `Tab`, `Ctrl`, `Alt`, `Shift`, `Win / Super`, function keys (`F1-F12`), `Enter`, `Backspace`, and hotkey shortcuts (`Ctrl+C`, `Ctrl+V`, `Alt+Tab`, `Win+D`, `Ctrl+Shift+Esc`, `Win+L`).
- **Bidirectional File Transfer**: Drag-and-drop / file selector zone to transfer files between mobile and PC over local Wi-Fi with instant transfer queue, progress bars, and download triggers.
- **Remote Quick Deck & Media Controls**: Volume master slider, mute, play/pause, next/previous track, lock workstation, sleep, restart, and simulated LAN connection state with QR code pairing.

### B. Open-Source AI & Multi-Agent API Hub
- Connect free & open-source AI endpoints:
  - **Ollama**: Localhost (`http://localhost:11434`) or LAN server with model discovery (`llama3`, `mistral`, `deepseek-r1`, `qwen2.5-coder`).
  - **Hugging Face Inference API**: Free community model tokens with zero-config fallbacks.
  - **OpenRouter & Free LLM Endpoints**: Free tier open-source model routing.
  - **Custom Agent Webhooks**: Connect custom n8n / LangChain / AutoGPT webhook agents with real-time prompt test console.
  - Seamlessly switch between Google Gemini and any connected open-source agent for voice or chat responses.

### C. Apple iOS 26 Liquid Blur Design Language
- **Liquid Glass Backdrops**: Deep multi-tier blur (`backdrop-blur-3xl bg-white/15 dark:bg-black/35`), ultra-crisp specular borders (`border-white/25`), and fluid bounce interactions.
- **Apple Squircles & Icon Models**: Distinct iOS-proportioned squircles (`rounded-[26px]`), vibrant inner-glow gradients, Apple-style badge counters, and glossy reflections.
- **Dynamic Dock**: Bottom floating Apple dock with icon magnification on hover/touch and smooth spring transitions.
- **Dynamic Island / Status Bar**: Glass pill widget displaying active Wi-Fi PC connection, battery, active AI agent, and silent update notifications.

### D. Automated Silent Software Updates
- **Silent Background Updater**: Auto-polls update manifest in the background without disturbing the user.
- **Auto-Download & Delta Install**: Automatic silent downloading of updates with an unobtrusive Dynamic Island notification.
- **Smart Preferences**: Toggles for "Automatic Background Updates", "Auto-Install Patches on Wi-Fi", and "Release Channels" (Stable, Beta, Canary).
- **Changelog Explorer**: View past updates, current build hash, and manual "Check Now" button.

### E. New Future Software Plugins
- **Hardware Telemetry Monitor**: Real-time simulated CPU load, GPU temperature, RAM consumption, and Wi-Fi throughput.
- **Cloud Clipboard Sync**: Instant bidirectional clipboard synchronizer between phone and PC.
- **AI Automation Runner**: Workflow triggers for PC scripts and automated repetitive tasks.

---

## 2. Proposed File Changes

| File | Purpose |
|------|---------|
| `src/types/assistant.ts` | Add types for PC control commands, file transfers, Open-Source API configs, agent status, and update settings. |
| `src/services/apiHubService.ts` | Service managing Ollama, Hugging Face, OpenRouter, and custom agent webhook connections and test requests. |
| `src/services/pcControlService.ts` | Service handling Wi-Fi simulated/local socket events, trackpad events, hotkeys, file transfer queue, and PC system controls. |
| `src/services/autoUpdateService.ts` | Background scheduler for silent update checks, auto-download simulation, and patch application. |
| `src/services/themeService.ts` | Add the refined `ios-26-liquid` flagship theme with custom CSS properties, blur filters, and Apple typography cues. |
| `src/components/screens/PcControlScreen.tsx` | Overhaul with full virtual trackpad, keyboard bar, drag-and-drop file transfer hub, and media controls. |
| `src/components/screens/ApiHubScreen.tsx` | Dedicated screen to configure, test, and activate Open-Source APIs and autonomous agents. |
| `src/components/screens/SoftwareUpdateScreen.tsx` | Add automatic background update engine, settings toggles, channel switchers, and auto-install banner. |
| `src/components/screens/PluginsScreen.tsx` | Add Hardware Telemetry Monitor, Cloud Clipboard, and AI Workflow plugins. |
| `src/components/screens/HomeScreen.tsx` | Redesign with Apple iOS 26 squircle grid, dynamic floating dock, and quick glance widgets. |
| `src/components/screens/AiSettingsScreen.tsx` | Integrate active provider switcher (Gemini vs. Ollama vs. Hugging Face vs. Custom Agent). |
| `src/App.tsx` | Register the new `'api-hub'` screen navigation and background auto-update listener. |

---

## 3. Verification & Testing

1. **Compilation**: Run `compile_applet` and `lint_applet` to ensure zero TypeScript errors or lint issues.
2. **PC Control Verification**:
   - Verify trackpad touch and drag gesture coordinates and sensitivity controls.
   - Verify keyboard keys, modifiers, and shortcut hotkeys.
   - Test file upload/drop simulator queue with progress and completion.
3. **API Hub Verification**:
   - Verify Ollama, Hugging Face, OpenRouter, and Custom Webhook test connections and model selection.
   - Verify agent response output in test console.
4. **iOS 26 Liquid Blur**:
   - Verify squircle styling, frosted glass cards, dynamic dock layout, and theme switching.
5. **Auto-Updater**:
   - Verify silent background check toggle, auto-download simulation, and update banner.
