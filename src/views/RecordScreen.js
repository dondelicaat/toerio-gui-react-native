import React, { useState, useEffect }  from 'react';
import {Platform, View, StyleSheet, Button} from 'react-native'
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {check, request, PERMISSIONS} from 'react-native-permissions';

import useTracking from '../hooks/useTracking';

import { Audio } from 'expo-av';

import useMicrophoneRecorder from '../hooks/useMicrophoneRecorder'

import recordStateEnum from '../utils/recordStateEnum'
import * as FileSystem from 'expo-file-system';

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




function RecordScreen({ navigation }) {
  const [pause, setPause] = useState(false)
  const [recordState, setRecordState] = useState(recordStateEnum.stopped)
  const [fixedCenter, setFixedCenter] = useState(true)

  const [center, setCenter] = useState({
    latitude: 53.66,
    longitude: 6.66,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121
  });

  const { location, history, distance } = useTracking(recordState);
  const { fileUri } = useMicrophoneRecorder(recordState);

  const start = async () => {
    const microphonePermission = Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;
    const coarsePermission = PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION;
    const backgroundPermission = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_ALWAYS : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;
    
    const coarseLocationPermission = await check(coarsePermission);
    const micPermission = await check(microphonePermission);
    const backPermission = await check(backgroundPermission);

    if (micPermission != 'granted') {
      await Audio.requestPermissionsAsync();
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
    console.log('permissions have been checked. Set recording to true.')

    setRecordState(recordStateEnum.recording)
    return;
  
  };

  const finish = async () => {
    setRecordState(recordStateEnum.stopped);
    setPause(false);
    

    navigation.navigate('SaveRecording', {
      fileUri: fileUri,
      history: history,
      distance: distance
    });

    // Now we have all the state:
    // history + audiofile
    // After finish click send user to form to finish the recording.
  };

  const toggle = async () => {
    if (!pause) {
      setRecordState(recordStateEnum.paused);
      setPause(true)
    } else {
      setRecordState(recordStateEnum.resumed);
      setPause(false)
    }
    
  };


  useEffect(() => {

    // Tracks the location otherwise it is only set once.
    if (fixedCenter) {
      setCenter({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121
      })
    }


    return () => {
    }
  }, [location])

  // This useEffect hook has no dependencies and just used for initial location.
  // subsequent location updates are resolved via the useTracking hook with other use effect. 
  useEffect(() => {
    getLocation();
  }, [])


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

      {
        recordState === recordStateEnum.stopped ?
          <View style={styles.row}>
            <Button onPress={start} title="Start" />
          </View>
        :
          <View style={styles.row}>
            <Button onPress={toggle} title={pause ? 'Resume' : 'Pause'} />
            <Button onPress={finish} title="Finish" />
          </View>
      }


  </View>
  );
}


// Define stylesheets here.

export default RecordScreen

