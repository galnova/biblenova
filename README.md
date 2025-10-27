# 📦 BibleNova v1 – Ship Checklist (Android, bare RN)

## 0) Freeze Scope
- [ ] No new features. Only stability + polish.
- [ ] Note any “next project” ideas into a backlog file: BACKLOG.md

## 1) Versioning
- [ ] android/app/build.gradle → bump:
      defaultConfig {
        versionCode X   // +1
        versionName "1.0.X"
      }
- [ ] Create/Update CHANGELOG.md (Unreleased → 1.0.X)

## 2) Dependencies & Health
- [ ] npm ci
- [ ] npm outdated   // review
- [ ] npm audit fix --force (only if safe)
- [ ] npx react-native-clean-project (or `npx react-native clean`)
- [ ] Verify metro config present if needed (`@react-native/metro-config` installed)

## 3) App Identity
- [ ] App name (Android): android/app/src/main/res/values/strings.xml → app_name
- [ ] Package ID (if needed): android/app/build.gradle → applicationId "com.biblenova"
- [ ] App icon: place adaptive icons in android/app/src/main/res/mipmap-*/ic_launcher.*
- [ ] Splash screen (optional): use Android 12+ splash (ic_launcher_foreground) or custom LaunchScreen

## 4) Permissions
- [ ] AndroidManifest.xml → keep minimum (likely just INTERNET)
- [ ] Remove any unused/implicit permissions

## 5) Config & Secrets
- [ ] Ensure NO secrets committed. `.env` values for dev only.
- [ ] Add/confirm .gitignore for .env, build outputs, caches
- [ ] If using react-native-config, verify release works without bundling secrets

## 6) Proguard/Minify (optional but recommended)
- [ ] android/app/proguard-rules.pro → keep RN defaults
- [ ] build.gradle release:
      minifyEnabled true
      shrinkResources true
- [ ] Verify app still launches and fetches verses

## 7) Signing (Release)
- [ ] Create keystore (one-time):
      keytool -genkeypair -v -storetype PKCS12 -keystore bible-release.keystore -alias biblenova \
             -keyalg RSA -keysize 4096 -validity 36500
- [ ] Move `bible-release.keystore` → android/app/bible-release.keystore
- [ ] android/gradle.properties → add:
      MYAPP_UPLOAD_STORE_FILE=bible-release.keystore
      MYAPP_UPLOAD_KEY_ALIAS=biblenova
      MYAPP_UPLOAD_STORE_PASSWORD=********
      MYAPP_UPLOAD_KEY_PASSWORD=********
- [ ] android/app/build.gradle → inside android { signingConfigs { release {...} } buildTypes { release { signingConfig signingConfigs.release } } }
      signingConfigs {
        release {
          storeFile file(MYAPP_UPLOAD_STORE_FILE)
          storePassword MYAPP_UPLOAD_STORE_PASSWORD
          keyAlias MYAPP_UPLOAD_KEY_ALIAS
          keyPassword MYAPP_UPLOAD_KEY_PASSWORD
        }
      }

## 8) Build (Release)
- [ ] From /android:
      ./gradlew clean
      ./gradlew bundleRelease    # Play Store (AAB)
      ./gradlew assembleRelease  # Direct APK (optional)
- [ ] Output:
      AAB → android/app/build/outputs/bundle/release/app-release.aab
      APK → android/app/build/outputs/apk/release/app-release.apk

## 9) Smoke Test (Install release locally)
- [ ] adb install -r android/app/build/outputs/apk/release/app-release.apk
- [ ] Launch on device:
      - Navigate book → chapter → verses load from Bible API
      - Back/forward navigation OK
      - Offline state handled (simple message)
      - No redboxes/yellowboxes
      - Performance: first load <3s on mid device

## 10) Store Prep (Play Console)
- [ ] App listing: title, short/long descriptions, screenshots (phone), icon (512×512), feature graphic (1024×500)
- [ ] Privacy policy URL (static page: explains network request → bible-api.com; no personal data collected)
- [ ] Content rating questionnaire
- [ ] Target/compile SDK: use latest required by Play (update gradle if needed)
- [ ] Upload AAB, create production release, attach changelog for 1.0.X
- [ ] Start with staged rollout (e.g., 20–50%)

## 11) Repo Hygiene
- [ ] README: quick start, build steps, API note (Bible API), license
- [ ] LICENSE: choose (e.g., MIT)
- [ ] Tag release:
      git add -A && git commit -m "chore(release): v1.0.X"
      git tag v1.0.X
      git push && git push --tags
- [ ] Create GitHub Release, attach AAB/APK (optional)

## 12) Post-Release
- [ ] Monitor crash logs (Logcat manual or integrate Sentry next version)
- [ ] Record metrics to track next time (cold start, API errors)
- [ ] Move remaining ideas into BACKLOG.md and close this milestone


Open Android Studio and Run the Emulator

# 1. Install dependencies
npm install   # or: npm ci

# 2. Start Metro (JS bundler)
npx react-native start

# 3. In another terminal, run the app on Android emulator or USB device:
npx react-native run-android
