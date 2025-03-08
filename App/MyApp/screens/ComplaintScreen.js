import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Button,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'react-native';

export default class App extends Component {
  state = {
    image: null,
    name: '',
    email: '',
    issueType: 'helmet',
    description: '',
    uploading: false,
  };

  componentDidMount = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera roll permissions are needed to select an image.');
    }
  };

  pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        base64: true,
      });

      if (!result.canceled) {
        this.setState({ image: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };

  uploadImage = async () => {
    const { image, description } = this.state;
    if (!image) {
      Alert.alert('No Image Selected', 'Please select an image before uploading.');
      return;
    }

    this.setState({ uploading: true });

    let apiUrl = 'https://api.cloudinary.com/v1_1/dlkofhmff/image/upload';
    let formData = new FormData();
    formData.append('file', {
      uri: image,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    formData.append('upload_preset', 'ghrhack'); // Replace with your Cloudinary upload preset
    formData.append('api_key', '859128195969699'); // Replace with your Cloudinary API key
    formData.append('context', `description=${description}`);

    try {
      let response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      let data = await response.json();
      console.log('Uploaded Image URL:', data.secure_url);
      Alert.alert('Success', 'Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'Something went wrong while uploading.');
    } finally {
      this.setState({ uploading: false });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Submit a Complaint</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={this.state.name}
          onChangeText={(text) => this.setState({ name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={this.state.email}
          onChangeText={(text) => this.setState({ email: text })}
          keyboardType="email-address"
        />

        <Picker
          selectedValue={this.state.issueType}
          onValueChange={(itemValue) => this.setState({ issueType: itemValue })}
          style={styles.picker}
        >
          <Picker.Item label="Helmet" value="helmet" />
          <Picker.Item label="Vest" value="vest" />
          <Picker.Item label="Gloves" value="gloves" />
          <Picker.Item label="Mask" value="mask" />
          <Picker.Item label="Goggles" value="goggles" />
        </Picker>

        <TextInput
          style={styles.textArea}
          placeholder="Describe the issue..."
          value={this.state.description}
          onChangeText={(text) => this.setState({ description: text })}
          multiline
        />

        {/* Image Picker with Button Placeholder */}
        <TouchableOpacity onPress={this.pickImage} style={styles.imageContainer}>
          {this.state.image ? (
            <Image source={{ uri: this.state.image }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>+ Add Image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Upload Button */}
        {this.state.uploading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Upload to Cloudinary" onPress={this.uploadImage} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight || 0,
    backgroundColor: '#ecf0f1',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  textArea: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 10,
  },
  imageContainer: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  placeholder: {
    backgroundColor: '#ddd',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  placeholderText: {
    color: '#555',
    fontSize: 16,
  },
});

