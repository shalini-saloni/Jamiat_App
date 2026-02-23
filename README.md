# Jamiat App

A modern React Native mobile application built with Expo that enables users to discover, support, and track the impact of charitable campaigns and social initiatives.

## Overview

Jamiat is a community-driven platform that connects donors with meaningful causes. Users can explore active campaigns, make donations, share impact stories, and track the real-world effect of their contributions.

## Features

- **Home Screen**: Dashboard showcasing featured campaigns and recent updates
- **Explore Screen**: Discover and browse available charitable campaigns
- **Campaigns**: Detailed campaign information with donation tracking
- **Donations**: Easy-to-use donation interface with multiple payment options
- **Stories**: Share and read impact stories from the community
- **Impact Tracking**: Visualize the real-world impact of your contributions
- **User Profiles**: Personalized profiles with donation history and preferences
- **Authentication**: Secure login and signup functionality
- **Real-time Updates**: Async storage for offline support

## Tech Stack

- **Framework**: React Native 0.81.5
- **Build Tool**: Expo 54.0.33
- **Navigation**: React Navigation (v7)
  - Stack Navigation
  - Bottom Tab Navigation
- **State Management**: React Context API
- **Storage**: Async Storage for persistent data
- **UI Components**: Expo Vector Icons
- **Animations**: React Native Reanimated, Gesture Handler
- **Styling**: Expo Linear Gradient

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Jamiat_App
   ```

2. **Install dependencies**
   ```bash
   cd jamiat
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   This opens the Expo CLI menu where you can:
   - Press `i` to open iOS simulator
   - Press `a` to open Android emulator
   - Press `w` to open web browser
   - Scan QR code with Expo Go app on your physical device

## Available Scripts

```bash
# Start the development server
npm start

# Start on Android emulator
npm run android

# Start on iOS simulator
npm run ios

# Start on web browser
npm run web
```

## Project Structure

```
Jamiat_App/
├── README.md
└── jamiat/
    ├── App.js                      # Main app component
    ├── app.json                    # Expo configuration
    ├── index.js                    # Entry point
    ├── package.json                # Project dependencies
    ├── package-lock.json           # Dependency lock file
    ├── .gitignore                  # Git ignore rules
    ├── assets/                     # Static assets
    │   ├── Assam_flood_relief.jpg
    │   ├── Clean_water_project.jpg
    │   ├── Clean_water_yemen.jpg
    │   ├── Community_kitchen.jpg
    │   ├── Education_for_all.jpeg
    │   ├── Medical_Aid_Gaza.jpg
    │   ├── Medical_aid.png
    │   ├── Ramadan_food_pack.jpeg
    │   └── Zakat_distribution.jpg
    ├── node_modules/               # Installed dependencies (generated)
    ├── .expo/                      # Expo configuration (generated)
    └── src/
        ├── context/
        │   └── AppContext.js       # Global state management with React Context
        ├── navigation/
        │   └── AppNavigator.js     # Navigation stack and tab configuration
        └── screens/
            ├── LoginScreen.js      # User authentication and login
            ├── SignupScreen.js     # User registration
            ├── HomeScreen.js       # Dashboard with featured campaigns
            ├── ExploreScreen.js    # Browse all campaigns
            ├── CampaignScreen.js   # Individual campaign details
            ├── DonationScreen.js   # Donation creation and processing
            ├── ImpactScreen.js     # Impact statistics and analytics
            ├── StoriesScreen.js    # List of community impact stories
            ├── StoryScreen.js      # Individual story view
            ├── ProfileScreen.js    # User profile and preferences
            └── EditProfileScreen.js # Profile editing interface
```

### Key Directories

- **assets/** - Images and media files used in campaigns and stories
- **src/context/** - Global application state management
- **src/navigation/** - Navigation structure (tab navigation, stack navigation)
- **src/screens/** - All UI screens of the application

## App Usage

### Login/Signup
- Launch the app and create an account or log in with existing credentials
- Profile information is securely stored locally

### Discover Campaigns
- Navigate to the Explore tab to browse available campaigns
- View detailed information including funding goals and impact metrics
- Filter and search for campaigns matching your interests

### Make a Donation
- Select a campaign and proceed to the Donation screen
- Choose donation amount and complete the transaction
- Receive confirmation and impact summary

### Share Your Impact
- Document your experience and impact stories
- Share with the community to inspire others
- View stories from other donors and community members

## Future Enhancements

- [ ] Payment gateway integration
- [ ] Social media sharing
- [ ] Push notifications for campaign updates
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Offline mode improvements
- [ ] Video support for stories
- [ ] Community forums

## Dependencies

Key dependencies include:
- `react-native` - Core framework
- `expo` - Development platform and build tools
- `@react-navigation/*` - Navigation libraries
- `@react-native-async-storage/async-storage` - Local data persistence
- `react-native-reanimated` - Smooth animations
- `expo-linear-gradient` - Gradient UI components

See `package.json` for complete dependency list.

