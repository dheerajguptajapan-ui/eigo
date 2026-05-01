import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, BookOpen, Repeat, MessageCircle, Settings as SettingsIcon } from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ReviewScreen from '../screens/ReviewScreen';
import ChatScreen from '../screens/ChatScreen';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Placeholder screens
const SkillTree = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>スキルツリー</Text></View>;
const Review = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>復習</Text></View>;
const AIConversation = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>AI会話練習</Text></View>;
const Settings = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>設定</Text></View>;

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ホーム') return <Home size={size} color={color} />;
          if (route.name === 'スキル') return <BookOpen size={size} color={color} />;
          if (route.name === '復習') return <Repeat size={size} color={color} />;
          if (route.name === '会話') return <MessageCircle size={size} color={color} />;
          if (route.name === '設定') return <SettingsIcon size={size} color={color} />;

          return null;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          backgroundColor: '#fff',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="ホーム" component={HomeScreen} />
      <Tab.Screen name="スキル" component={SkillTree} />
      <Tab.Screen name="復習" component={ReviewScreen} />
      <Tab.Screen name="会話" component={ChatScreen} />
      <Tab.Screen name="設定" component={Settings} />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  const isAuthenticated = true; // Placeholder for auth logic

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <Stack.Screen name="Main" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
