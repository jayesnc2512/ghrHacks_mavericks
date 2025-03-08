import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const imageMap = {
  'site1-fireexit2': require('../assets/site1-fireexit2.png'),
  'site3-fireexit1': require('../assets/site3-fireexit1.png'),
};

export default function SafetyExitScreen() {
  const [source, setSource] = useState('site1');
  const [destination, setDestination] = useState('fireexit1');
  const [selectedImage, setSelectedImage] = useState(null);

  const places = ['site1', 'site2', 'site3', 'storagearea', 'ventilation'];
  const exits = ['fireexit1', 'fireexit2'];

  const handleScan = () => {
    const imageName = `${source}-${destination}`;
    setSelectedImage(imageMap[imageName] || null);
  };

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <Image source={selectedImage} style={styles.image} />
      ) : (
        <Text style={styles.placeholder}>No Path Selected</Text>
      )}

      <View style={styles.pickerContainer}>
        <View style={styles.pickerColumn}>
          <Text style={styles.title}>Source</Text>
          <ScrollView style={styles.scrollPicker}>
            {places.map((place) => (
              <TouchableOpacity
                key={place}
                onPress={() => setSource(place)}
                style={[styles.pickerItem, source === place && styles.selected]}
              >
                <Text style={[styles.pickerText, source === place && styles.selectedText]}>{place}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.pickerColumn}>
          <Text style={styles.title}>Destination</Text>
          <ScrollView style={styles.scrollPicker}>
            {exits.map((exit) => (
              <TouchableOpacity
                key={exit}
                onPress={() => setDestination(exit)}
                style={[styles.pickerItem, destination === exit && styles.selected]}
              >
                <Text style={[styles.pickerText, destination === exit && styles.selectedText]}>{exit}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <TouchableOpacity onPress={handleScan} style={styles.scanButton}>
        <Text style={styles.scanButtonText}>Scan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' },
  image: { width: 400, height: 220, borderRadius: 8, borderWidth: 2, borderColor: 'black', marginBottom: 20 },
  placeholder: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  pickerContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20 },
  pickerColumn: { alignItems: 'center', width: '45%' },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  scrollPicker: { height: 150, width: '100%', backgroundColor: 'white', padding: 10, borderRadius: 10, elevation: 3 },
  pickerItem: { paddingVertical: 10, alignItems: 'center', borderRadius: 5 },
  pickerText: { fontSize: 18, textAlign: 'center' },
  selected: { backgroundColor: '#5f5f5f' },
  selectedText: { color: 'white', fontWeight: 'bold' },
  scanButton: { marginTop: 20, backgroundColor: '#3498db', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  scanButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
