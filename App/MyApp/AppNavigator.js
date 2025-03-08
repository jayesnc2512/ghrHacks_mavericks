import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import EmployeeLogsScreen from './screens/EmployeeLogs'; 
import SettingsScreen from './screens/SettingsScreen';
import SensorsScreen from './screens/SensorsScreen';
import ComplaintScreen from './screens/ComplaintScreen';
import RequestScreen from './screens/RequestScreen';
import SafeExitScreen from './screens/SafeExitScreen';
const AppNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    Sensors: SensorsScreen,
    Dashboard: DashboardScreen,
    EmployeeLogs: EmployeeLogsScreen,
    Settings: SettingsScreen,
    RequestPending: RequestScreen,  // Admin-only screen
    Complaint: ComplaintScreen,  // User-only screen
    SafeExit: SafeExitScreen,
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      headerShown: false,
      headerStyle: {
        backgroundColor: '#1ABC9C',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

export default createAppContainer(AppNavigator);
