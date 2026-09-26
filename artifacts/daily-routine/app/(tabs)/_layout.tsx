import React from 'react';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';

function NativeTabLayout() { return <NativeTabs><NativeTabs.Trigger name="index"><NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} /><NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label></NativeTabs.Trigger><NativeTabs.Trigger name="month"><NativeTabs.Trigger.Icon sf={{ default: 'calendar', selected: 'calendar.circle.fill' }} /><NativeTabs.Trigger.Label>Month</NativeTabs.Trigger.Label></NativeTabs.Trigger><NativeTabs.Trigger name="add"><NativeTabs.Trigger.Icon sf={{ default: 'plus.circle', selected: 'plus.circle.fill' }} /><NativeTabs.Trigger.Label>Add</NativeTabs.Trigger.Label></NativeTabs.Trigger><NativeTabs.Trigger name="activity"><NativeTabs.Trigger.Icon sf={{ default: 'figure.run', selected: 'figure.run' }} /><NativeTabs.Trigger.Label>Activity</NativeTabs.Trigger.Label></NativeTabs.Trigger><NativeTabs.Trigger name="profile"><NativeTabs.Trigger.Icon sf={{ default: 'person', selected: 'person.fill' }} /><NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label></NativeTabs.Trigger></NativeTabs>; }

function ClassicTabLayout() {
  const colors = useColors(); const colorScheme = useColorScheme(); const isDark = colorScheme === 'dark'; const isIOS = Platform.OS === 'ios'; const isWeb = Platform.OS === 'web';
  return <Tabs screenOptions={{ tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.mutedForeground, headerShown: false, tabBarStyle: { position: 'absolute', backgroundColor: isIOS ? 'transparent' : colors.background, borderTopWidth: isWeb ? 1 : 0, borderTopColor: colors.border, elevation: 0, ...(isWeb ? { height: 84 } : {}) }, tabBarBackground: () => isIOS ? <BlurView intensity={100} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} /> : isWeb ? <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} /> : null }}><Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => isIOS ? <SymbolView name="house" tintColor={color} size={23} /> : <Feather name="home" size={21} color={color} /> }} /><Tabs.Screen name="month" options={{ title: 'Month', tabBarIcon: ({ color }) => isIOS ? <SymbolView name="calendar" tintColor={color} size={23} /> : <Feather name="calendar" size={21} color={color} /> }} /><Tabs.Screen name="add" options={{ title: 'Add', tabBarIcon: ({ color }) => isIOS ? <SymbolView name="plus.circle.fill" tintColor={color} size={28} /> : <Feather name="plus-circle" size={24} color={color} /> }} /><Tabs.Screen name="activity" options={{ title: 'Activity', tabBarIcon: ({ color }) => isIOS ? <SymbolView name="figure.run" tintColor={color} size={23} /> : <Feather name="activity" size={21} color={color} /> }} /><Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => isIOS ? <SymbolView name="person" tintColor={color} size={23} /> : <Feather name="user" size={21} color={color} /> }} /></Tabs>;
}

export default function TabLayout() { return isLiquidGlassAvailable() ? <NativeTabLayout /> : <ClassicTabLayout />; }
