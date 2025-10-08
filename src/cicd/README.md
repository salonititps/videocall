## 🤖 React Native Android CI/CD Workflow with GitHub Actions

This **GitHub Actions workflow** automates the **Android build process** for a React Native application. It handles:

- **Environment configuration**
- **Auto-incrementing versioning**
- **Dynamic app name customization**
- **Debug/Release APK builds**
- **Optional Firebase distribution**
- **Artifact uploads to GitHub**

It’s **environment-aware** (`dev`, `staging`, `production`), supports **manual triggers**, and packages builds with version and project name using **GitHub-hosted runners**.

---

### ✨ Features

- Supports **manual**, **push**, and **pull request** triggers
- **Auto-increments** `VERSION_CODE` and `VERSION_NAME`
- **Dynamic app name** update via `app_name` input
- Builds both **Debug** and **Release** APKs
- Optional **Firebase App Distribution**
- Secure handling of `.env` and **keystores** via **secrets**
- **Renames APKs** using project name + version
- **Uploads APKs** as **GitHub Artifacts**

---

### ⚡ Triggered By

- 🔁 **Push** to `main`
- 📬 **Pull Request** to `main`
- 🔘 **Manual Dispatch** (with input options via GitHub UI)

---

### 🧾 Inputs (for `workflow_dispatch`)

| Input Name               | Type   | Required | Default   | Description                                            |
| ------------------------ | ------ | -------- | --------- | ------------------------------------------------------ |
| `environment`            | choice | yes      | `dev`     | Target environment (`dev`, `staging`, `production`)    |
| `distribute_to_firebase` | choice | no       | `false`   | Whether to upload to Firebase (`true` / `false`)       |
| `app_name`               | string | no       | _(empty)_ | Custom app name (replaces `app_name` in `strings.xml`) |

---

### 🔐 Required Secrets

| Secret Name               | Description                                   |
| ------------------------- | --------------------------------------------- |
| `ENV_DEV_BASE64`          | Base64-encoded `.env` file for **dev**        |
| `ENV_STAGING_BASE64`      | Base64-encoded `.env` file for **staging**    |
| `ENV_PROD_BASE64`         | Base64-encoded `.env` file for **production** |
| `DEBUG_KEYSTORE_BASE64`   | Base64-encoded **debug keystore**             |
| `RELEASE_KEYSTORE_BASE64` | Base64-encoded **release keystore**           |
| `FIREBASE_TOKEN`          | Firebase CLI access token                     |

---

1. Firebase login : must have node >= 20

   1. If not firebase then first run below command
   npm install --global eas-cli

   2. To get firebase token
   firebase login:ci

2. Convert in base64

   base64 -i .env
   base64 -i android/app/debug.keystore -o debug.keystore.base64
   Upload this files in github secrets -> actions -> new repository secret via settings options

### 🧱 Workflow Steps Overview

1. **Environment Setup**

   - Checks out repository
   - Sets up **Node.js**, **Java**, and **Android SDK**
   - Installs NPM dependencies
   - Decodes `.env` file for selected environment

2. **Keystore Configuration**

   - Writes debug and release keystores into the Android project

3. **Versioning**

   - Reads current `VERSION_CODE` and `VERSION_NAME`
   - Increments **PATCH**, with logic to rollover to **MINOR** and **MAJOR**
   - Updates `gradle.properties`

4. **App Name Update** _(Optional)_

   - Updates `<string name="app_name">` in `strings.xml` if `app_name` input is provided

5. **Git Commit**

   - Commits updated `gradle.properties` and `strings.xml`
   - Appends `[skip ci]` to commit message to prevent CI loop

6. **Build APKs**

   - Runs `./gradlew assembleDebug` and `./gradlew assembleRelease`

7. **Firebase App Distribution** _(Optional)_

   - Uploads debug and release APKs using **Firebase CLI**

For writing code :
Go to Actions tab in git hub repo -> select new work flow -> set up new work flow by your self
Create .yml file in github repo main branch

- **Git repo** : https://github.com/salonititps/videocall.git
