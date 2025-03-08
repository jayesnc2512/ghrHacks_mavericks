import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Appbar, List, Divider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

export default function SettingsScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const departments = ['Department1', 'Department2', 'Department3'];

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#1ABC9C' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <View style={styles.content}>
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Profile</List.Subheader>
          <View style={styles.profileContainer}>
            <Text style={styles.profileText}>Savio Dias</Text>
            <Text style={styles.profileText}>savio@gmail.com</Text>
          </View>
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Notifications</List.Subheader>

          <View style={styles.settingsRow}>
            <Text style={styles.settingsText}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
            />
          </View>

          {notificationsEnabled && (
            <View style={styles.settingsRow}>
              <Text style={styles.settingsText}>Disable by Department</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedDepartment}
                  onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Department" value="" />
                  {departments.map((department, index) => (
                    <Picker.Item key={index} label={department} value={department} />
                  ))}
                </Picker>
              </View>
            </View>
          )}
        </List.Section>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  content: {
    padding: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  profileContainer: {
    padding: 15,
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    marginBottom: 15,
  },
  profileText: {
    fontSize: 18,
    color: '#34495E',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  settingsText: {
    fontSize: 16,
    color: '#34495E',
  },
  pickerContainer: {
    width: '50%',
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
