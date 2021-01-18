import React from 'react';
import {StyleSheet, View, Button, Text } from 'react-native'
import MapView from 'react-native-maps';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

function PlayRecordingScreen({ route }) {
  const [tour, setTour] = useState(route.params.tour);
  const [sound, setSound ] = useState();
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(true);

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
    initializeSoundObject();

    return () => {
      // cleanup... 
      console.log('unloading sound');
      // Only unload if it is defined.
      if (sound) 
        sound.unloadAsync();
    };
  }, []);

  return (
    <View>
      <Button 
        onPress = {() => toggleAudioPlayback()}
        title = { playing ? 'Stop' : 'Start'}
        disabled = {loading}
      />
      <Text>{position}</Text>
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