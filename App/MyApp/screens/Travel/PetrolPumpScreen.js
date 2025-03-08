import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Linking, StyleSheet, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function PetrolPumpsScreen() {
  const [petrolPumps, setPetrolPumps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetrolPumps = async () => {
      const url = `https://discover.search.hereapi.com/v1/discover?at=21.0077,75.5626&q=petrol pump&limit=10&apiKey=PSQL9IjSl3vts5U0otOTk76FteP_IeabyGj-sE9mx3o`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        // Extract relevant details
        const pumps = data.items.map(item => ({
          name: item.title,
          address: item.address.label,
          latitude: item.position.lat,
          longitude: item.position.lng,
          image: "https://imgs.search.brave.com/2sR0tFS5fcOhGb5R_qetAonELkf9RiMBCgMcW9aPHe8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM4/NzY4MTc1OS92ZWN0/b3IvZ2FzLXN0YXRp/b24taWNvbi1nYXNv/bGluZS12ZWN0b3Iu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PVRKYzJ2VXB6ZzE2/MGc3N1VNYy05azZi/a2JiU0lOY2dUeklp/ODFzOXF1SVU9", 
          mapsLink: `https://www.google.com/maps/search/?api=1&query=${item.position.lat},${item.position.lng}`
        }));

        setPetrolPumps(pumps);
      } catch (error) {
        console.error("Error fetching petrol pumps:", error);
      }

      setLoading(false);
    };

    fetchPetrolPumps();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Petrol Pumps</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={petrolPumps}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.address}>{item.address}</Text>
                <TouchableOpacity onPress={() => Linking.openURL(item.mapsLink)} style={styles.mapButton}>
                  <Icon name="google-maps" size={24} color="white" />
                  <Text style={styles.mapText}>Open in Maps</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: "#f8f8f8" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },

  row: {
    flexDirection: "row",
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

  image: { width: 80, height: 80, borderRadius: 8, marginRight: 15 },

  textContainer: { flex: 1, justifyContent: "center" },

  name: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  address: { fontSize: 14, color: "#555", marginBottom: 5 },

  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: 140,
  },

  mapText: { color: "white", fontSize: 14, marginLeft: 5 },
});
