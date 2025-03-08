import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const dummyRequests = [
  {
    id: '1',
    name: 'John Doe',
    email: 'johndoe@example.com',
    issueType: 'Helmet',
    description: 'Helmet strap is broken.',
    image: 'https://imgs.search.brave.com/p9MTsJn-hHBJEak8wypQVuoDMUSzWaP9OlYXS7OrdKU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by95/ZWxsb3ctaGFyZC1w/bGFzdGljLWNvbnN0/cnVjdGlvbi1oZWxt/ZXQtd2hpdGUtYmFj/a2dyb3VuZF8xMjMy/LTMxMjEuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZA',
    status: 'pending',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'janesmith@example.com',
    issueType: 'Gloves',
    description: 'Gloves have a hole in them.',
    image: 'https://imgs.search.brave.com/vmrkd_N7xXNn6fKGunMTRiSr13Oa2igREjkPSAxMN4o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by93YXRlcnByb29m/LWdsb3Zlcy13aW50/ZXItc3BvcnRfMTE1/OTE5LTgwMS5qcGc_/c2VtdD1haXNfaHli/cmlk',
    status: 'pending',
  },
];

export default function AdminRequests() {
  const [requests, setRequests] = useState(dummyRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openDetails = (request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const handleAction = (id, action) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id ? { ...req, status: action } : req
      )
    );
    setModalVisible(false);
  };

  const getRowStyle = (status) => {
    if (status === 'accepted') return { backgroundColor: '#d4edda' }; // Green
    if (status === 'rejected') return { backgroundColor: '#f8d7da' }; // Red
    return {}; // Default
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Requests</Text>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openDetails(item)}>
            <View style={[styles.row, getRowStyle(item.status)]}>
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <Text style={styles.issueType}>{item.issueType}</Text>
              </View>
              <Image source={{ uri: item.image }} style={styles.image} />
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Complaint Details Modal */}
      {selectedRequest && (
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Complaint Details</Text>
              
              <TextInput style={styles.input} value={selectedRequest.name} editable={false} />
              <TextInput style={styles.input} value={selectedRequest.email} editable={false} />
              
              <Picker selectedValue={selectedRequest.issueType} enabled={false}>
                <Picker.Item label="Helmet" value="helmet" />
                <Picker.Item label="Vest" value="vest" />
                <Picker.Item label="Gloves" value="gloves" />
                <Picker.Item label="Mask" value="mask" />
                <Picker.Item label="Goggles" value="goggles" />
              </Picker>

              <TextInput style={styles.textArea} value={selectedRequest.description} multiline editable={false} />

              <Image source={{ uri: selectedRequest.image }} style={styles.modalImage} />

              {/* Accept & Reject Buttons */}
              <View style={styles.buttonContainer}>
                <Button title="Reject" color="red" onPress={() => handleAction(selectedRequest.id, 'rejected')} />
                <Button title="Accept" color="green" onPress={() => handleAction(selectedRequest.id, 'accepted')} />
              </View>

              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop:60, backgroundColor: '#f8f9fa' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    elevation: 3,
  },
  textContainer: { flex: 1, paddingRight: 10 },
  name: { fontSize: 16, fontWeight: 'bold' },
  email: { fontSize: 14, color: 'gray' },
  issueType: { fontSize: 14, fontStyle: 'italic' },
  image: { width: 100, height: 100, borderRadius: 5,borderColor:'black',borderWidth: 2},
  
  modalContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  input: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, marginBottom: 10 },
  textArea: { width: '100%', height: 60, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, textAlignVertical: 'top', marginBottom: 10 },
  modalImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
});
