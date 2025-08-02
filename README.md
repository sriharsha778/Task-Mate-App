# 📱 Task Mate - DailyTaskMate App

**Task Mate** is a productivity-focused mobile app that helps you manage your daily tasks effectively. Built using **React Native** and **Expo**, it allows users to create, categorize, and schedule tasks with features like priority selection, recurring daily tasks, and local notifications.

---

## 🔗 Live Build (APK)

👉 [Download the Latest APK from Expo](https://expo.dev/accounts/harshasaisri484/projects/DailyTaskMate/builds/d337960e-2c3c-4a67-9e02-557f6046ef8a)

---

## ✨ Features

- ✅ Add, update, and delete tasks
- 🗂️ Categorize tasks: Personal, Work, Learn
- 🔔 Task priority selection: High, Medium, Low
- ⏰ Set deadline with date & time pickers
- 🔁 Support for daily recurring tasks
- 📦 Local storage using AsyncStorage
- 📱 Optimized for Android devices

---

## 🚀 Installation & Setup

### 📦 Prerequisites

- Node.js (v18+)
- Expo CLI: `npm install -g expo-cli`
- Git
- Android Studio (for emulator) or a physical Android device

### 🛠️ Steps

```bash
# Clone the repo
git clone https://github.com/sriharsha778/Task-Mate-App.git
cd Task-Mate-App

# Install dependencies
npm install

# Start Expo
npx expo start
For Android testing, connect a physical device via USB or start an emulator via Android Studio.

🏗️ Build Instructions (Expo EAS)
bash
Copy
Edit
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build APK
eas build --platform android --profile preview
```


📁 Folder Structure

Task-Mate-App/  
├── app/                    # Screens and navigation  
├── components/             # Reusable UI components  
├── contexts/               # Theme and global state providers  
├── storage/                # Local storage (AsyncStorage)  
├── utils/                  # Utility functions (e.g., ID generation)  
├── assets/                 # Fonts, images, icons  
├── App.tsx                 # Root app  
├── app.json                # Expo config  
├── README.md
└── ...  
###  ⚙️ Technologies Used
-  React Native

-  Expo

-  Expo Router

-  AsyncStorage

-  React Native Picker

-  React Native DateTimePicker


###  📄 License
This project is licensed under the MIT License.

🙋‍♂️ Author  
Sri Harsha Sai
[🔗 GitHub](https://github.com/sriharsha778)

Thanks for checking out Task Mate! Feel free to star ⭐ the repository if you found it helpful.
