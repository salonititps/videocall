## In-App Updater for Android CLI

This implementation provides **version checking and force update** functionality for a React Native app using the [`react-native-version-check`](https://github.com/kimxogus/react-native-version-check) library.

It supports two main approaches:

1. Checking the **latest version directly** from the **Play Store** or **App Store**
2. Fetching version info from a **custom backend**, which can **enforce forced updates**

This solution is ideal for **production apps** where users need to stay on the **latest stable version**.

---

### ✨ Features

- **Check current app version** using `react-native-version-check`
- Fetch latest version from **Google Play Store** or **Apple App Store**
- Optionally fetch version info from a **custom backend endpoint**
- **Enforce non-cancelable force update** modals when required
- Redirect users to the **correct store URL** to update the app
- Compatible with **both Android and iOS**

## Expo EAS Build & Update Workflow

### Steps

1. **Create a new project in Expo**

2. **Install Expo CLI**

   ```bash
   npm install --global eas-cli
   ```

3. **Login to Expo CLI on your local**

   ```bash
   eas login
   ```

4. **Initialise EAS in your app and link project to your EAS dashboard**

   ```bash
   eas init
   ```

5. **To install expo updates package and also add configuration to your app.json**

   ```bash
   eas update:configure
   ```

6. **Create an `eas.json` file in your root directory**

   ```bash
   eas build:configure
   ```

7. **Create a build for preview (staging)**

   ```bash
   eas build --profile preview
   ```

8. **Download that preview APK on your device**

9. **Now, apply any changes in your `.js` or `.ts` files which contain only JavaScript code**

10. **After changes, push your update**

```bash
eas update --channel preview --platform android --message "Update 2"
```

11. **Reload your app**
