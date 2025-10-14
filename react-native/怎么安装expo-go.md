好的 👍 我来一步步教你在 **Android Studio 的虚拟机 (AVD)** 中通过 **命令行** 安装并运行 **Expo（React Native 环境）**。

---

## 🧩 一、确认你已经安装好以下工具

| 工具               | 作用            | 检查命令              |
| ------------------ | --------------- | --------------------- |
| Node.js (LTS 推荐) | 运行 expo CLI   | `node -v`             |
| npm 或 pnpm        | 包管理器        | `npm -v`              |
| Android SDK + AVD  | 模拟器环境      | `emulator -list-avds` |
| Expo CLI           | Expo 命令行工具 | `npx expo -V`         |

---

## 🚀 二、安装 Expo CLI

> 推荐使用 `npx` 的临时运行方式（不污染全局环境）

```bash
npm install -g expo-cli
```

或者仅运行项目时再用：

```bash
npx create-expo-app myApp
```

> ⚠️ 如果网络慢，可使用淘宝镜像：

```bash
npm config set registry https://registry.npmmirror.com
```

---

## 📦 三、创建一个 Expo 项目

```bash
npx create-expo-app myApp
cd myApp
```

---

## ⚙️ 四、启动 Android 模拟器

1. 查看已有虚拟机：

   ```bash
   emulator -list-avds
   ```

   输出示例：

   ```
   Medium_Phone_API_34
   ```

2. 启动模拟器：

   ```bash
   emulator -avd Medium_Phone_API_34
   ```

   等待模拟器完全启动（看到桌面）。

---

## 🔥 五、在模拟器中运行 Expo 应用

当模拟器运行后，回到项目目录执行：

```bash
npx expo start --android
```

> 说明：
>
> - 这个命令会自动打开 Metro bundler。
> - 然后自动检测正在运行的 Android 模拟器，并安装 Expo Go 应用。
> - 再自动打开 Expo Go 并运行你的项目。

---

## 🧰 如果自动安装失败，可以手动安装 Expo Go

打开命令行，执行以下命令安装 **Expo Go APK**：

```bash
adb install path/to/ExpoGo.apk
```

你可以从官方地址下载最新版：
👉 [https://expo.dev/tools#client](https://expo.dev/tools#client)

下载后用 `adb` 安装，比如：

```bash
adb install ~/Downloads/ExpoGo.apk
```

---

## ✅ 六、确认运行成功

Expo 启动成功后终端会输出：

```
Starting project at ...
Starting Metro Bundler
› Metro waiting on exp://127.0.0.1:8081
› Opening on Android...
```

模拟器中会自动打开 **Expo Go** 并加载你的项目。

---

是否希望我帮你写一个 **一键启动脚本（Windows .bat / Linux .sh）**？
比如运行一次命令就能自动：

- 启动 AVD
- 启动 Expo
- 运行项目
