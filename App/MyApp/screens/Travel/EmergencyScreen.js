import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Emergency contacts data
const emergencyContacts = [
  { name: "🚔 Police", number: "100" },
  { name: "🚑 Ambulance", number: "108" },
  { name: "🔥 Fire Brigade", number: "101" },
];

export default function EmergencyScreen() {
  // Function to make a call
  const makeCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Contacts</Text>

      {emergencyContacts.map((contact, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.text}>{contact.name}: {contact.number}</Text>
          <TouchableOpacity style={styles.callButton} onPress={() => makeCall(contact.number)}>
            <Icon name="phone" size={20} color="white" />
            <Text style={styles.callText}>Call</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f8f8f8" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15, textAlign: "center" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  text: { fontSize: 18, fontWeight: "500" },

  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },

  callText: { color: "white", fontSize: 16, marginLeft: 5 },
});
