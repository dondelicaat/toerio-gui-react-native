/*
  Description:

  Todo:
    - Add slider: https://github.com/callstack/react-native-slider
    - Add map + gps location in playback on map. => gps {lat lon timestamp}
    - Loader button on the audio playback
*/

import React from 'react';
import {StyleSheet, View, Button, Text } from 'react-native'
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';

import Slider from '@react-native-community/slider';


function PlayRecordingScreen({ route }) {
  const [tour, setTour] = useState(route.params.tour);
  const [sound, setSound ] = useState();
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(true);

  const [center, setCenter] = useState({
    latitude: tour.startPoint.coordinates[1],
    longitude: tour.startPoint.coordinates[0],
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121
  });

  const initializeSoundObject = async () => {
    try {
      // This is over URL, for local file use file:/// link. That logic is for later.
      const fileLocation = `https://toer.io/api/tours/files/${tour.fileId}`;

      // Initialize the sound object.
      const sound = new Audio.Sound();
      // Set a function that is triggered when status update is called.
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      // Status update triggered every 10 ms.
      await sound.loadAsync({ uri: fileLocation });
      await sound.setProgressUpdateIntervalAsync(500);

      setSound(sound);
      setLoading(false);
    } catch (err) {
      console.log('Something went wrong loading the audiofile...', err);
    }
  }

  const onPlaybackStatusUpdate = (status) => {
    setPosition(status.positionMillis);
  }

  const startPlayback = async () => {
    try {
      await sound.playAsync();
      setPlaying(!playing);
    } catch (err) {
      console.log('Failed to start playing:', + err);
    }
  }

  const pausePlayback = async () => {
    await sound.pauseAsync();
    setPlaying(!playing);
  }

  const toggleAudioPlayback = async () => {
    if (playing) {
      await pausePlayback()
    } else {
      await startPlayback();
    };
  }



  useEffect(() => {
    // getLocation();
    initializeSoundObject();

    return () => {
      // cleanup... 
      console.log('unloading sound');
      // Only unload if it is defined.
      if (sound) {
        // Remove callback and unload data.
        sound.setOnPlaybackStatusUpdate(null);
        sound.unloadAsync();
      }
    };
  }, []);

  // const getLocation = async () => {
  //   const geoPermission = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

  //   const permission = await check(geoPermission);
  //   if (permission != 'authorized') {
  //     await request(geoPermission)
  //   }

  //   Geolocation.getCurrentPosition((position) => {
  //     const region = {
  //       latitude: position.coords.latitude,
  //       longitude: position.coords.longitude,
  //       latitudeDelta: 0.015,
  //       longitudeDelta: 0.0121
  //     }
      
  //     setCenter(region)
  //   }, (err) => {
  //     console.log('failed to get position:', err.message);
  //   });
  // }

  return (
    <View>
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region = {center}
        >
          <Polyline
            coordinates = {tour.route}
            strokeColor = 'red'
            strokeWidth = {3}
          />

        </MapView>
      </View>

      <View
        style={styles.row}
      >
        { loading && <Text>LOADING DATA....</Text>}
        <Button 
          onPress = {() => toggleAudioPlayback()}
          title = { playing ? 'Stop' : 'Start'}
          disabled = {loading}
        />
      </View>
      <View>
      <Slider
        style={{width: 200, height: 40}}
        minimumValue={0}
        maximumValue={tour.duration}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
      />
      </View>

    </View>
  );
}


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



 

export default PlayRecordingScreen;