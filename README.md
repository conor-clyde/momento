# 📸 Momento

A mindful-focused mobile app that helps users capture and reflect on meaningful moments through photo journaling and mood tracking. Built as a full React Native application with Expo, demonstrating full-stack mobile development and thoughtful UX design.

<img src="assets/images/icon.png" alt="Momento App" width="120" />

## ✨ Features

- Capture moments using the device camera
- Attach moods and reflective notes
- Moment gallery, mood tracking, and statistics
- Clean and intuitive UI design
- Achievements and streaks to build mindful habits

## 📱 App Screenshots

### **Home and Tab Screens**
| Home | Gallery | Statistics |
|------|---------|------------|
| <img src="assets/screenshots/Home.jpg" width="200" alt="Home Screen"> | <img src="assets/screenshots/Gallery.jpg" width="200" alt="Gallery Screen"> | <img src="assets/screenshots/Statistics.jpg" width="200" alt="Statistics Screen">|

### **Moment Screens**
| Camera | Add Moment | Edit Moment | View Moment |
|--------|------------|------------|-------------|
| <img src="assets/screenshots/Camera.jpg" width="200" alt="Camera Screen"> | <img src="assets/screenshots/AddMoment.jpg" width="200" alt="Add Moment Screen"> | <img src="assets/screenshots/Edit.jpg" width="200" alt="Edit Moment Screen"> | <img src="assets/screenshots/Moment.jpg" width="200" alt="View Moment Screen"> |

### **Additional**
| Achievements|
|-------------|
| <img src="assets/screenshots/Achivements.jpg" width="200" alt="Achievements Screen"> |

## 🚀 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context
- **Storage**: AsyncStorage (local persistence)
- **Camera**: Expo Camera
- **Styling**: Custom styling
- **Icons**: Expo Vector Icons & Symbols

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
Learned how to use React Native to build a multi-screen, cross-platform mobile application from the ground up, managing navigation, global state, and device features like the camera, while balancing technical functionality with thoughtful UX design. Along the way, I tackled challenges in asynchronous workflows, performance optimization, and UX/UI refinement, delivering a polished, user-friendly experience and designing a scalable project structure with reusable, maintainable TypeScript components.

## 🔮 Future Improvements
- Allow adding image from phone camera roll/gallery
- Haptic feedback, touch gestures
- Authentication and moment backup
- Friending and sharing between users on different accounts
- Improved accessibility and animations
- Improved statistics and achivements

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Conor Clyde
- LinkedIn: linkedin.com/in/conorclyde/
- Email: clydeconor@gmail.com

Built with ❤️ using React Native and Expo
