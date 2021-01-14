import React, { useState, useEffect }  from 'react';
import {Platform, View, StyleSheet, Button} from 'react-native'
import MapView, { UrlTile, Geojson, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import AudioRecord from 'react-native-audio-record';
import { Buffer } from 'buffer';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

import { Alert } from 'react-native';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

const geolocationConfig = {
  skipPermissionRequests : false,
  authorizationLevel : "whenInUse"
}

const microphoneOptions = {
  sampleRate: 16000,  // default 44100
  channels: 1,        // 1 or 2, default 1
  bitsPerSample: 16,  // 8 or 16, default 16
  audioSource: 6,     // android only (see below)
  wavFile: 'recording.wav' // default 'audio.wav'
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '60%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
 });

function RecordScreen() {
  const [tour, setTour] = useState(null);
  const [recording, setRecording] = useState(false)
  const [center, setCenter] = useState({
    latitude: 53.66,
    longitude: 6.66,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121
  });

  AudioRecord.init(microphoneOptions);

  AudioRecord.on('data', data => {
    const chunk = Buffer.from(data, 'base64');
    console.log(chunk)
    // base64-encoded audio data chunks
  });
  

  const getLocation = async () => {
    const geoPermission = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const permission = await check(geoPermission);
    if (permission != 'authorized') {
      await request(geoPermission)
    }

    Geolocation.getCurrentPosition((position) => {
      const region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121
      }
      
      setCenter(region)
    }, (err) => {
      console.log('failed to get position:', err.message);
    });
  }

  const start = async () => {
    const microphonePermission = Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;
    const coarsePermission = PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION;
    const backgroundPermission = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_ALWAYS : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;
    
    const coarseLocationPermission = await check(coarsePermission);
    const micPermission = await check(microphonePermission);
    const backPermission = await check(backgroundPermission);

    console.log('check permissions')
    console.log(micPermission)
    if (micPermission != 'granted') {
      console.log('request mic')
      await request(micPermission);
      return;
    };
    if (coarseLocationPermission != 'granted') {
      console.log('request coarse')
      await request(coarsePermission)
      return;
    }
    if (backPermission != 'granted') {
      console.log('request background')

      // Explains to the user why we want their location.
      const rationale = {
        title: 'Location tracking',
        message: 'This feature has to be enabled in order to track your location with locked screen.',
      }

      await request(backgroundPermission, rationale);
      return;
    } 
    
    console.log('start recording.')
    setRecording(true);
    console.log('audiorecorderd before start:', AudioRecord);
    AudioRecord.start();
    // Alert user that permission is required
    return;
  
  };

  const stop = async () => {
    if (!recording) return;
    console.log('stop record');
    let audioFile = await AudioRecord.stop();
    setRecording(false);
    console.log('audioFile', audioFile);
  };

  useEffect(() => {
    // Has to be useEffect since otherwise get in render-loop.
    
    getLocation();
  }, [])
  
  return (
    <View>
    <View style={styles.container}>
    <MapView
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      region={center}
    >
      { tour && 
        <Geojson
          geojson = {tour}
          strokeColor="red"
          fillColor="green"
          strokeWidth={2}
        />
      }

    </MapView>
  </View>

        <View style={styles.row}>
                <Button onPress={start} title="Record" disabled={recording} />
                <Button onPress={stop} title="Stop" disabled={!recording} />
        </View>

  </View>
  );
}


// Define stylesheets here.

export default RecordScreen

