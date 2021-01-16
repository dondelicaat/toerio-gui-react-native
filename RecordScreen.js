import React, { useState, useEffect }  from 'react';
import {Platform, View, StyleSheet, Button} from 'react-native'
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { Buffer } from 'buffer';
import {check, request, PERMISSIONS} from 'react-native-permissions';

import useTracking from './src/hooks/useTracking';

import useMicrophoneRecorder from './src/hooks/useMicrophoneRecorder'


const styles = StyleSheet.create({
  container: {
    height: '80%',
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
  const [points, setPoints] = useState([]);
  const [recording, setRecording] = useState(false)
  const [center, setCenter] = useState({
    latitude: 53.66,
    longitude: 6.66,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121
  });

  const { location, history, distance } = useTracking(recording)
  useMicrophoneRecorder(recording)


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

    if (micPermission != 'granted') {
      await request(micPermission);
      return;
    };
    if (coarseLocationPermission != 'granted') {
      await request(coarsePermission)
      return;
    }
    if (backPermission != 'granted') {
      // Explains to the user why we want their location.
      const rationale = {
        title: 'Location tracking',
        message: 'This feature has to be enabled in order to track your location with locked screen.',
      }

      await request(backgroundPermission, rationale);
      return;
    } 
    
    setRecording(true);
    return;
  
  };

  const stop = async () => {
    if (!recording) return;
    setRecording(false);
    
  };


  useEffect(() => {
    // Has to be useEffect since otherwise get in render-loop.
    getLocation();    
    return () => {
    }
  }, [])

  
  return (
    <View>
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={center}
        >
          <Polyline
            coordinates = {history}
            strokeColor = 'red'
            strokeWidth = {3}
          />

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

