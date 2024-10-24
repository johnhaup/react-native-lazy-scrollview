import React from 'react';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{ headerBackTitleVisible: false, headerTintColor: '#000' }}
    >
      <Stack.Screen
        name="scrollviews/vertical"
        options={{ title: 'Vertical Lazy' }}
      />
      <Stack.Screen
        name="scrollviews/flatlist"
        options={{ title: 'Lazy FlatList' }}
      />
      <Stack.Screen
        name="scrollviews/horizontal"
        options={{ title: 'Horizontal Lazy' }}
      />
      <Stack.Screen
        name="scrollviews/nocontext"
        options={{ title: 'No Lazy' }}
      />
    </Stack>
  );
}
