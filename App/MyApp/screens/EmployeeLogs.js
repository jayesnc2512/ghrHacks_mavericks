import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Appbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const employeeLogsData = [
  { id: '1', empId: 'E123', logDetails: 'Logged in from new device', status: true, timestamp: '2024-09-14 08:30 AM' },
  { id: '2', empId: 'E124', logDetails: 'Password reset', status: false, timestamp: '2024-09-14 09:00 AM' },
  { id: '3', empId: 'E125', logDetails: 'Failed login attempt', status: false, timestamp: '2024-09-14 09:30 AM' },
  // Add more logs as needed
];

export default function EmployeeLogsScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.empId}</Text>
      <Text style={styles.cell}>{item.logDetails}</Text>
      <View style={styles.statusCell}>
        {item.status ? (
          <MaterialCommunityIcons name="checkbox-marked-circle" size={24} color="green" />
        ) : (
          <MaterialCommunityIcons name="close-circle" size={24} color="red" />
        )}
      </View>
      <Text style={styles.cell}>{item.timestamp}</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerCell}>Emp ID</Text>
      <Text style={styles.headerCell}>Log Details</Text>
      <Text style={styles.headerCell}>Status</Text>
      <Text style={styles.headerCell}>Timestamp</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#1ABC9C' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Employee Logs" />
      </Appbar.Header>

      <View style={styles.content}>
        {renderHeader()}
        <FlatList
          data={employeeLogsData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
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
    flex: 1,
    margin: 10,
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#dcdcdc',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  headerCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  statusCell: {
    width: 30,
    alignItems: 'center',
  },
});
