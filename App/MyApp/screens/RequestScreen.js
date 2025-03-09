import React, { useState, useEffect } from 'react';
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
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hodznxjxxcynikdxvyyl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZHpueGp4eGN5bmlrZHh2eXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0Njk1MjYsImV4cCI6MjA1NzA0NTUyNn0.qU5mrxx238NfhTkWuzdVFdyA3mgdlERb4tiShUkbW50'; // Replace with your actual anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('complaints') // Replace with your actual table name
      .select('*');

    if (error) {
      console.error('Error fetching requests:', error);
    } else {
      setRequests(data);
    }
    console.log(data);
  };

  const openDetails = (request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const handleAction = async (id, action) => {
    const { error } = await supabase
      .from('complaints') 
      .update({ status: action })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
    } else {
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === id ? { ...req, status: action } : req
        )
      );
    }
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
              <Image source={{ uri: item.image_url }} style={styles.image} />
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
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor : '#f8f9fa' },
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
  image: { width: 100, height: 100, borderRadius: 5, borderColor: 'black', borderWidth: 2 },
  
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
