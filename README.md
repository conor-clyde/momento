![MIT License](https://img.shields.io/badge/License-MIT-green)
![Expo](https://img.shields.io/badge/Expo-54-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81-blueviolet)

# 📸 Momento

<img src="assets/images/icon.png" alt="Momento App" width="120" align="center" />

A **mindfulness-focused mobile app** that helps users **capture and reflect on meaningful moments** through **photo journaling** and **mood tracking**. Built with **React Native and Expo**, demonstrating **full-stack mobile development** and thoughtful **UX design**.

---

## 📑 Table of Contents
- [Features](#-features)
- [App Screenshots](#-app-screenshots)
- [Tech Stack](#-tech-stack)
- [Quick Start](#quick-start-using-expo-go)
- [Project Structure](#-project-structure)
- [What I Learned](#-what-i-learned)
- [Future Improvements](#-future-improvements)
- [License](#-license)
- [Author](#-author)

---

## ✨ Features

- Capture moments using the device camera
- Attach moods and reflective notes
- Moment gallery, mood tracking, and statistics
- Clean and intuitive UI design
- Achievements and streaks to encourage mindful habits

## 📱 App Screenshots

**Home & Tabs**
| Home | Gallery | Statistics |
|------|---------|------------|
| <img src="assets/screenshots/Home.jpg" width="200" alt="Home Screen"> | <img src="assets/screenshots/Gallery.jpg" width="200" alt="Gallery Screen"> | <img src="assets/screenshots/Statistics.jpg" width="200" alt="Statistics Screen"> |

**Moment Screens**
| Camera | Add Moment | Edit Moment | View Moment |
|--------|------------|------------|-------------|
| <img src="assets/screenshots/Camera.jpg" width="200" alt="Camera Screen"> | <img src="assets/screenshots/AddMoment.jpg" width="200" alt="Add Moment Screen"> | <img src="assets/screenshots/Edit.jpg" width="200" alt="Edit Moment Screen"> | <img src="assets/screenshots/Moment.jpg" width="200" alt="View Moment Screen"> |

**Additional**
| Achievements |
|-------------|
| <img src="assets/screenshots/Achievements.jpg" width="200" alt="Achievements Screen"> |

*Screenshots shown in portrait mode, iPhone 14 Pro.*

## 🚀 Tech Stack

| Category         | Technology                |
|-----------------|---------------------------|
| Framework        | React Native with Expo    |
| Language         | TypeScript                |
| Navigation       | Expo Router (file-based)  |
| State Management | React Context             |
| Storage          | AsyncStorage              |
| Camera           | Expo Camera               |
| Styling          | Custom styles             |
| Icons            | Expo Vector Icons & Symbols |

## Quick Start (Using Expo Go)

1. **Clone the repository**
```bash
git clone https://github.com/conor-clyde/momento.git
cd momento
```

2. **Install dependencies**
```bash
npm install
```

3. **Install Expo Go on your device**
- **iOS**: Download from [App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: Download from [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

4. **Start the development server**
```bash
npm start
```

5. **Run on your device**
- After the server starts, scan the QR code with Expo Go on your phone

## 📂 Project Structure

```text
src/
├── app/                 # App screens (Expo Router)
│   ├── (tabs)/          # Main tab navigation
│   ├── camera.tsx       # Camera screen
│   ├── add.tsx          # Add moment screen
│   └── achievements.tsx # Achievements screen
├── components/          # Reusable UI components
│   ├── ui/              # Base UI components
│   ├── forms/           # Form components
│   └── layout/          # Layout components
├── constants/           # App constants and data
├── contexts/            # React Context providers
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## 📚 What I Learned

**Technical:**
- Built a multi-screen, cross-platform mobile app with React Native and Expo
- Managed navigation, global state, and device features like the camera
- Tackled challenges in asynchronous workflows and performance optimization

**UX & Design:**
- Designed a clean, intuitive, and responsive UI
- Created a scalable project structure with reusable TypeScript components
- Balanced technical functionality with a thoughtful user experience

---

## 🔮 Future Improvements
- Add images from phone gallery
- Haptic feedback & touch gestures
- User authentication & moment backup
- Social sharing & friending
- Enhanced accessibility & animations
- Advanced statistics and achievements

---

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Conor Clyde**
- LinkedIn: [linkedin.com/in/conorclyde](https://linkedin.com/in/conorclyde)
- Email: clydeconor@gmail.com

Built with ❤️ using React Native and Expo
