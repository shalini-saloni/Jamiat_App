import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

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
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Home:     focused ? 'home'       : 'home-outline',
            Explore:  focused ? 'compass'    : 'compass-outline',
            MyImpact: focused ? 'bar-chart'  : 'bar-chart-outline',
            Profile:  focused ? 'person'     : 'person-outline',
          };
          return <Ionicons name={icons[route.name] || 'ellipse'} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"     component={HomeScreen}    options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Explore"  component={ExploreScreen} options={{ tabBarLabel: 'Campaigns' }} />
      <Tab.Screen name="MyImpact" component={ImpactScreen}  options={{ tabBarLabel: 'My Impact' }} />
      <Tab.Screen name="Profile"  component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"  component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs"        component={TabNavigator} />
      <Stack.Screen name="Campaign"    component={CampaignScreen} />
      <Stack.Screen name="Donation"    component={DonationScreen} />
      <Stack.Screen name="MyImpact"    component={ImpactScreen} />
      <Stack.Screen name="Story"       component={StoryScreen} />
      <Stack.Screen name="Stories"     component={StoriesScreen} />
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
