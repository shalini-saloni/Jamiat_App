import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

import { useApp } from '../context/AppContext';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ImpactScreen from '../screens/ImpactScreen';
import DonationScreen from '../screens/DonationScreen';
import CampaignScreen from '../screens/CampaignScreen';
import StoryScreen from '../screens/StoryScreen';
import StoriesScreen from '../screens/StoriesScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TAB_CONFIG = {
  Home:     { active: 'home',       inactive: 'home-outline',      label: 'Home' },
  Explore:  { active: 'compass',    inactive: 'compass-outline',   label: 'Explore' },
  Donate:   { active: 'heart',      inactive: 'heart-outline',     label: 'Donate' },
  MyImpact: { active: 'bar-chart',  inactive: 'bar-chart-outline', label: 'My Impact' },
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1B8A4C',
        tabBarInactiveTintColor: '#AAAAAA',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#EEEEEE',
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color }) => {
          const cfg = TAB_CONFIG[route.name];
          const iconName = focused ? cfg.active : cfg.inactive;
          return <Ionicons name={iconName} size={23} color={color} />;
        },
        tabBarLabel: TAB_CONFIG[route.name]?.label || route.name,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Donate" component={DonationScreen} />
      <Tab.Screen name="MyImpact" component={ImpactScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Campaign" component={CampaignScreen} />
      <Stack.Screen name="Donation" component={DonationScreen} />
      <Stack.Screen name="MyImpact" component={ImpactScreen} />
      <Stack.Screen name="Story" component={StoryScreen} />
      <Stack.Screen name="Stories" component={StoriesScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useApp();
  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
