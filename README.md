# 📸 Momento

A beautiful, thoughtful mood tracking and journaling app that helps you capture and reflect on your little moments. Built with React Native and Expo.

![Momento App](assets/images/icon.png)

## ✨ Features

- **📷 Photo Capture**: Capture photos directly in-app to document your moments
- **😊 Mood Tracking**: Track your emotional state with 18 carefully selected mood options
- **📝 Journaling**: Add notes and reflections to your captured moments
- **🏆 Achievement System**: Unlock achievements based on streaks, milestones, and habits
- **📊 Statistics**: View insights about your mood patterns and journaling habits
- **📅 Daily Streaks**: Build consistency with daily moment capture tracking
- **🎨 Beautiful UI**: Clean, intuitive design with smooth animations

## 🚀 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context
- **Storage**: AsyncStorage for local data persistence
- **Camera**: Expo Camera for photo capture
- **Styling**: Custom theme system with responsive design
- **Icons**: Expo Vector Icons & Symbols

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/momento.git
   cd momento
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - For iOS: `npm run ios`
   - For Android: `npm run android`
   - For Web: `npm run web`

## 📱 Usage

1. **Capture a Moment**: Tap the camera button to take a photo
2. **Add Your Mood**: Select from 18 mood options that reflect your current state
3. **Write Your Thoughts**: Add optional notes about your moment
4. **View Your Gallery**: Browse all your captured moments in the gallery tab
5. **Track Progress**: Check your statistics and unlock achievements
6. **Build Streaks**: Try to capture moments daily to maintain your streak

## 🎯 App Philosophy

Momento believes that every moment, no matter how small, deserves to be captured and remembered. Whether it's a joyful celebration, a quiet moment of reflection, or even difficult emotions that need processing - all experiences shape who we are.

The app focuses on:
- **Accessibility**: Simple, intuitive interface accessible to everyone
- **Privacy**: All data stays on your device
- **Mindfulness**: Encouraging regular reflection and self-awareness
- **Positivity**: Celebrating both positive and challenging moments equally

## 📂 Project Structure

```
src/
├── app/                 # App screens (using Expo Router)
│   ├── (tabs)/         # Main tab navigation
│   ├── camera.tsx      # Camera screen
│   ├── add.tsx         # Add moment screen
│   └── achievements.tsx # Achievements screen
├── components/         # Reusable UI components
│   ├── ui/            # Basic UI components
│   ├── forms/         # Form components
│   └── layout/        # Layout components
├── constants/         # App constants and data
├── contexts/          # React contexts for state management
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## 🔧 Development

- **Linting**: ESLint with Expo configuration
- **TypeScript**: Full TypeScript support
- **Hot Reload**: Live development with Expo Dev Client
- **Cross-platform**: iOS, Android, and Web support

## 🤝 Contributing

This is a portfolio project created to showcase mobile development skills. While it's primarily a demonstration project, feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Conor Clyde**
- Portfolio: [Your Portfolio Website]
- LinkedIn: [Your LinkedIn]
- Email: [Your Email]

---

*Built with ❤️ using React Native and Expo*
