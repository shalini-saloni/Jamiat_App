import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

import { useApp } from '../context/AppContext';

import LoginScreen    from '../screens/LoginScreen';
import SignupScreen   from '../screens/SignupScreen';
import HomeScreen     from '../screens/HomeScreen';
import ExploreScreen  from '../screens/ExploreScreen';
import ImpactScreen   from '../screens/ImpactScreen';
import DonationScreen from '../screens/DonationScreen';
import CampaignScreen from '../screens/CampaignScreen';
import StoryScreen    from '../screens/StoryScreen';
import StoriesScreen  from '../screens/StoriesScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ProfileScreen  from '../screens/ProfileScreen';

const Tab  = createBottomTabNavigator();
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
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 14,
          shadowColor: '#000',
          shadowOpacity: 0.09,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color }) => {
          // Per-tab icon definitions
          const cfg = {
            Home:      { lib: 'ion',  name: focused ? 'home'           : 'home-outline' },
            Project:   { lib: 'fa5',  name: focused ? 'layer-group'    : 'layer-group' },
            OurImpact: { lib: 'ion',  name: focused ? 'bar-chart'      : 'bar-chart-outline' },
            Profile:   { lib: 'ion',  name: focused ? 'person'         : 'person-outline' },
            Donate:    { lib: 'ion',  name: focused ? 'heart'          : 'heart-outline' },
          };
          const c = cfg[route.name];
          if (!c) return <Ionicons name="ellipse" size={22} color={color} />;
          return c.lib === 'fa5'
            ? <FontAwesome5 name={c.name} size={20} color={color} />
            : <Ionicons     name={c.name} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"      component={HomeScreen}     options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Project"   component={ExploreScreen}  options={{ tabBarLabel: 'Project' }} />
      <Tab.Screen name="OurImpact" component={ImpactScreen}   options={{ tabBarLabel: 'Our Impact' }} />
      <Tab.Screen name="Profile"   component={ProfileScreen}  options={{ tabBarLabel: 'Profile' }} />
      <Tab.Screen
        name="Donate"
        component={DonationScreen}
        options={{
          tabBarLabel: 'Donate',
          tabBarActiveTintColor: '#fff',
          tabBarIcon: ({ focused }) => (
            <View style={[tabStyles.donateBubble, focused && tabStyles.donateBubbleActive]}>
              <Ionicons name="heart" size={20} color="#fff" />
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 10, fontWeight: '700', color: focused ? '#1B8A4C' : '#aaa', marginTop: 2 }}>
              Donate
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const tabStyles = StyleSheet.create({
  donateBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    shadowColor: '#1B8A4C',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  donateBubbleActive: {
    backgroundColor: '#1B8A4C',
    shadowOpacity: 0.5,
  },
});

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
      <Stack.Screen name="Explore"     component={ExploreScreen} />
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