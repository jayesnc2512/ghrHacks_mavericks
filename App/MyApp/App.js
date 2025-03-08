import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import AppNavigator from './AppNavigator';
import * as Notifications from 'expo-notifications';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (

    <View style={styles.container}>
          <PaperProvider>

      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
      <AppNavigator />
      </PaperProvider>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
