import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Appbar } from 'react-native-paper';

const cameraData = [
  { id: 'CAM001', name: 'Front Gate', status: 'active' },
  { id: 'CAM002', name: 'Backyard', status: 'inactive' },
  { id: 'CAM003', name: 'Lobby', status: 'error' },
  { id: 'CAM004', name: 'Parking Lot', status: 'loading' },
];

export default function SensorsScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    setHasPermission(true);
  }, []);

  if (hasPermission === null) return <Text>Checking camera status...</Text>;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  const getCameraIcon = (status) => {
    switch (status) {
      case 'active': return { name: 'videocam', color: '#2ecc71' };
      case 'inactive': return { name: 'videocam-off', color: '#e67e22' };
      case 'error': return { name: 'error-outline', color: '#e74c3c' };
      case 'loading': return { name: 'hourglass-empty', color: '#f1c40f' };
      default: return { name: 'help-outline', color: '#95a5a6' };
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#1ABC9C' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Sensors" />
      </Appbar.Header>

      <View style={styles.row}>
        <View style={styles.box}>
          <MaterialIcons name="air" size={32} color="#3498db" />
          <Text style={styles.title}>Air Quality</Text>
          <Text style={styles.data}>AQI: 52</Text>
        </View>

        <View style={styles.box}>
          <MaterialIcons name="thermostat" size={32} color="#e74c3c" />
          <Text style={styles.title}>Temperature</Text>
          <Text style={styles.data}>27°C</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.box}>
          <MaterialIcons name="volume-up" size={32} color="#2ecc71" />
          <Text style={styles.title}>Noise Level</Text>
          <Text style={styles.data}>65 dB</Text>
          <Text style={styles.threshold}>Threshold: 70 dB</Text>
        </View>

        <View style={styles.box}>
          <MaterialIcons name="cloud" size={32} color="#9b59b6" />
          <Text style={styles.title}>Gas Concentration</Text>
          <Text style={styles.data}>CO2: 400 ppm</Text>
          <Text style={styles.data}>NO2: 20 ppb</Text>
        </View>
      </View>

      {/* Camera Status Grid */}
      <View style={styles.cameraSection}>
        <Text style={styles.cameraTitle}>Camera Status</Text>
        <View style={styles.cameraGrid}>
          {cameraData.map((camera) => {
            const icon = getCameraIcon(camera.status);
            return (
              <View key={camera.id} style={styles.cameraBox}>
                <MaterialIcons name={icon.name} size={40} color={icon.color} />
                <Text style={styles.cameraName}>{camera.name}</Text>
                <Text style={styles.cameraId}>{camera.id}</Text>
                <Text style={[styles.cameraStatus, { color: icon.color }]}>
                  {camera.status.toUpperCase()}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  box: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', marginTop: 8 },
  data: { fontSize: 14, color: '#34495e', marginTop: 4 },
  threshold: { fontSize: 12, color: '#e74c3c', marginTop: 4 },

  cameraSection: { marginVertical: 16, paddingHorizontal: 16 },
  cameraTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 8 },
  cameraGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cameraBox: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  cameraName: { fontSize: 14, fontWeight: 'bold', color: '#2C3E50', marginTop: 6 },
  cameraId: { fontSize: 12, color: '#7f8c8d' },
  cameraStatus: { fontSize: 13, fontWeight: 'bold', marginTop: 4 },
});
