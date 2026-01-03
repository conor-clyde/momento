![MIT License](https://img.shields.io/badge/License-MIT-green)
![Expo](https://img.shields.io/badge/Expo-54-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81-blueviolet)

# Momento
<img src="assets/images/icon.png" alt="Momento App" width="120" align="center" />
Momento is a mindfulness-focused mobile application that helps users capture, reflect on, and build awareness of meaningful everyday moments through photo journaling and mood tracking.
<br/> <br/>

Built with React Native and Expo, this project demonstrates production-quality mobile development, thoughtful UX design, and clean, maintainable TypeScript architecture.

---

## Table of Contents
- [Features](#-features)
- [App Screenshots](#-app-screenshots)
- [Tech Stack](#-tech-stack)
- [Quick Start](#quick-start-using-expo-go)
- [Project Structure](#-project-structure)
- [What I Learned](#-what-i-learned)
- [Future Improvements](#-future-improvements)
- [License](#license)
- [Author](#author)

---

## ✨ Features

- Capture moments using the device camera
- Attach moods and reflective notes to each moment
- Browse moments in a gallery view
- Mood trends and basic statistics
- Achievements and streaks to encourage mindful habits
-	Clean, intuitive, mobile-first UI

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

3. **Install Expo Go on your mobile device**
- **iOS**: Download from [App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: Download from [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

4. **Start the development server**
```bash
npm start
```

5. **Run on your device**
-	Scan the QR code with Expo Go once the server starts

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

## Technical Highlights
-	Modular, reusable component architecture
-	File-based routing using Expo Router
- Centralized global state with React Context
-	Async data persistence with AsyncStorage
-	Clean separation of UI, logic, and state
-	Prepared builds using EAS

## What I learned
**Technical**
- Built a multi-screen, cross-platform mobile app from the ground up
- Integrated native device features such as the camera
- Managed async workflows and local persistence
- Structured a scalable React Native codebase using TypeScript

**UX & Design**
- Designed a clean, intuitive, and mobile-friendly UI
- Balanced feature complexity with simplicity and usability
- Focused on habit-building UX patterns (streaks, achievements)

---

## 🔮 Future Improvements
- Import images from the device gallery
- Haptic feedback and gesture interactions
- User authentication & cloud backup
- Social sharing & friending
- Accessibility improvements and animations
- Advanced statistics and insights

---

## License

This project is licensed under the MIT License.

## Author

**Conor Clyde**
- LinkedIn: [linkedin.com/in/conorclyde](https://linkedin.com/in/conorclyde)
- Email: clydeconor@gmail.com

Built with ❤️ using React Native and Expo
