import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Appbar, Drawer, Menu, Button, IconButton } from 'react-native-paper';
import { DrawerLayout } from 'react-native-gesture-handler';
import Charts from './components/Charts';
import { registerForPushNotificationsAsync, sendPushNotification } from './components/NotificationUtils';
import AsyncStorage from '@react-native-community/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function DashboardScreen({ navigation }) {
  const drawer = useRef(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  // Dropdown filter states
  const [timeRange, setTimeRange] = useState('Daily'); // Default to 'Daily'
  const [isTimeMenuVisible, setIsTimeMenuVisible] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      setUserEmail(email);
      // console.log("email",email);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    async function setup() {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
    }
    setup();

    const ws = new WebSocket("wss://your-websocket-url");
    ws.onopen = () => console.log('Connected to WebSocket server');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.title && data.message) {
        setAlertMessage(data.message);
        if (expoPushToken) {
          sendPushNotification(data.title, data.message); 
        }
      }
    };
    ws.onerror = (error) => console.error('WebSocket error', error);
    ws.onclose = () => console.log('WebSocket connection closed');

    return () => ws.close();
  }, [expoPushToken]);
//
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received:', notification);
    });

    return () => subscription.remove();
  }, []);

  const renderDrawerContent = () => (
    <View style={styles.drawerContent}>
      <Drawer.Section style={styles.sidebarTitle}>
        <Text style={styles.sidebarTitleText}>सुrakshak Ai</Text>
        <Drawer.Item label="Dashboard" onPress={() => navigation.navigate('Dashboard')} />
        <Drawer.Item label="Sensors List" onPress={() => navigation.navigate('Sensors')} />
        {userEmail === 'admin' ? (
          <Drawer.Item label="Request Pending" onPress={() => navigation.navigate('RequestPending')} />
        ) : (
          <Drawer.Item label="Complaint" onPress={() => navigation.navigate('Complaint')} />
        )}
        <Drawer.Item label="Employee Logs" onPress={() => navigation.navigate('EmployeeLogs')} />
        <Drawer.Item label="Safe Exit" onPress={() => navigation.navigate('SafeExit')} />
        <Drawer.Item label="Settings" onPress={() => navigation.navigate('Settings')} />
      </Drawer.Section>
      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <DrawerLayout
      ref={drawer}
      drawerWidth={250}
      drawerPosition="left"
      renderNavigationView={renderDrawerContent}
    >
      <View style={styles.mainContainer}>
        <Appbar.Header style={{ backgroundColor: '#1ABC9C' }}>
          <Appbar.Action icon="menu" onPress={() => drawer.current.openDrawer()} />
          <Appbar.Content title="Dashboard" />
        </Appbar.Header>

        {alertMessage && <Text style={styles.alert}>Alert: {alertMessage}</Text>}

        <View style={styles.filterContainer}>
          {/* Time Range Dropdown with Icon */}
          <Menu
            visible={isTimeMenuVisible}
            onDismiss={() => setIsTimeMenuVisible(false)}
            anchor={
              <Button mode="outlined" onPress={() => setIsTimeMenuVisible(true)} icon="calendar">
                {timeRange}
              </Button>
            }
          >
            <Menu.Item onPress={() => { setTimeRange('Hourly'); setIsTimeMenuVisible(false); }} title="Hourly" />
            <Menu.Item onPress={() => { setTimeRange('Daily'); setIsTimeMenuVisible(false); }} title="Daily" />
            <Menu.Item onPress={() => { setTimeRange('Weekly'); setIsTimeMenuVisible(false); }} title="Weekly" />
          </Menu>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {/* AQI Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>AQI</Text>
            <Charts timeRange={timeRange} dataType="AQI" />
          </View>

          {/* Temperature Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Temperature</Text>
            <Charts timeRange={timeRange} dataType="Temperature" />
          </View>

          {/* Noise Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Noise</Text>
            <Charts timeRange={timeRange} dataType="Noise" />
          </View>

          {/* Gas Concentration Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Gas Concentration</Text>
            <Charts timeRange={timeRange} dataType="Gas Concentration" />
          </View>
        </ScrollView>
      </View>
    </DrawerLayout>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 40,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollContainer: {
    padding: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#e0f7fa',
  },
  chartContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sidebarTitle: {
    marginTop: 20,
  },
  sidebarTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#E74C3C',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginRight: 10,
  },
  logoutText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  alert: {
    color: '#E74C3C',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
});
