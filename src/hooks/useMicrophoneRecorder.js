/*
  Todo: 
    - Also add microphone permission requests in this hook. => also do for useTracking hook.

*/

import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

const useMicrophoneRecorder = (recording) => {
  const [timestamp, setTimestamp] = useState(0);
  const [recorder, setRecorder ] = useState(null)
  const [fileUri, setfileUri] = useState(null);


  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        staysActiveInBackground : true,
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 

      console.log('Start recording...')
      const recorder = new Audio.Recording();
      await recorder.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recorder.startAsync();
      setRecorder(recorder)
    } catch (err) {
      console.log('Failed to start recording:', + err.message);
    }
  }

  const stopRecording = async () => {
    try {
      console.log('stopping recording');
      await recorder.stopAndUnloadAsync();
      const uri = recorder.getURI(); 
      setRecorder(undefined);
      setfileUri(uri)
      console.log('Recording stopped and stored at', uri);
    } catch (err) {
      console.log('Failed to stop recording' + err);
    }
  }

  useEffect(() => {
    console.log('RECORDING STATE:', recording);
    // Recorder can also be undefined..
    if (!recording) {
      // If recorder for some reason failed and is undefined than simply return
      if (!recorder) { return; }
      stopRecording();

    // Else if not recording start it.
    } else {
      startRecording();
    }

    
    
    return () => {
      // cleanup... 
    };
  }, [recording]);

  return { fileUri };
};


export default useMicrophoneRecorder;