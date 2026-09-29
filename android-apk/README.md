# AI Gym Coach APK

Native Android WebView wrapper with the Next.js UI bundled in the APK.
Package: `vn.aigym.coach`, version 1.0.0, Android 7+ (min SDK 24), target SDK 35.
The wrapper uses `https://gym-tau-black.vercel.app` as its local UI origin.
The Render backend must allow this origin in `CORS_ORIGIN`.

## Build the frontend

From `ai-gym-coach`, on Linux with Node 20.9+:

```sh
npm ci
NEXT_PUBLIC_API_BASE_URL=https://gym-vmqu.onrender.com npm run build:android
```

The Android export creates `out/`. Normal `npm run build` keeps the existing
web deployment behavior. Changing the backend URL requires rebuilding the UI.

## Build the APK

Install Python 3, JDK 17, aapt2, zipalign and apksigner. Download the toolchain:

```sh
python3 android-apk/prepare-toolchain.py
python3 android-apk/build-apk.py
```

Output: `android-apk/dist/AI-Gym-Coach-1.0.0.apk`.
`JAVA_HOME` may select a JDK. Optional path overrides:
`GYM_ANDROID_TOOLCHAIN`, `GYM_ANDROID_SIGNING`, `GYM_WEB_EXPORT`.

For the existing phone build, reuse its retained tools and signing key:

```sh
GYM_ANDROID_TOOLCHAIN=/root/gym-apk/toolchain \
GYM_ANDROID_SIGNING=/root/gym-apk/signing \
GYM_WEB_EXPORT=/root/gym-apk/web/out \
python3 android-apk/build-apk.py
```

Signing keys and passwords are generated locally and ignored by Git.
Back them up privately; updates must use the same signing key and application ID.
Increment the manifest version and APK filename when publishing an update.
APK files, build output and downloaded tools are not committed.

## Verification and limits

The original build passed production compilation, TypeScript, packaged asset
checks, ZIP integrity, zipalign and APK v2/v3 signature verification.
The wrapper supports navigation/back, persistent web storage, cookies, image
selection and external links. Its UI is bundled; API features still need internet.
The original APK was not launched on a device. Render API requests timed out
during verification, so login, CORS and data persistence remain unverified.
