import { FileSystemUploadType, uploadAsync } from 'expo-file-system';
import React from 'react';
import {Platform, View, StyleSheet, Button, Text} from 'react-native'
import * as FileSystem from 'expo-file-system';

import Api from '../api/api';

function SaveRecordingScreen({ route, navigation }) {
  const {fileUri, history, distance} = route.params;


  const progressCallback = (loaded, total) => {
    console.log(loaded);
    console.log(total);
  };

  const upload = async () => {
    try {
      console.log('upload called')
      
      let response = await FileSystem.uploadAsync(
        'https://toer.io/api/upload',
        fileUri,
        {
          uploadType: FileSystemUploadType.MULTIPART,
          fieldName: 'audioFile'
        }
      )
      const fileId = response.body.fileId

      const tour = {}
      tour.route = history;
      tour.distance = distance;
      tour.fileId = fileId;
      
      response = await Api.createTour(tour);
      // navigate to my tours...
      console.log(response);

      navigation.navigate('Success');
    
    } catch (err) {
      console.log(`Something went wrong while uploading: ${err}`)
    }
  }

  return (
    <View>
      <Text>{fileUri}</Text>
      <Text>{distance}</Text>
      <Text>{history.length}</Text>
      <Text>moi</Text>

      <Button 
        onPress = {upload}
        title="Save"
      >
      </ Button>
    </View>
  );
}

export default SaveRecordingScreen;