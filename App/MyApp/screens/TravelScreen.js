import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Travel Guide</Text>
      
      {/* Row with two buttons */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("PetrolPump")}>
          <Icon name="gas-station" size={40} color="white" />
          <Text style={styles.buttonText}>Petrol Pumps</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Emergency")}>
          <Icon name="ambulance" size={40} color="white" />
          <Text style={styles.buttonText}>Emergency</Text>
        </TouchableOpacity>
      </View>

      {/* Single button centered in second row */}
      <TouchableOpacity style={[styles.button, styles.centerButton]} onPress={() => navigation.navigate("SafeMode")}>
        <Icon name="shield-lock" size={40} color="white" />
        <Text style={styles.buttonText}>Safe Mode</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  
  row: { flexDirection: "row", gap: 15 },
  
  button: {
    backgroundColor: "#007BFF",
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  centerButton: { marginTop: 20 },

  buttonText: { color: "white", fontSize: 16, marginTop: 5 },
});
