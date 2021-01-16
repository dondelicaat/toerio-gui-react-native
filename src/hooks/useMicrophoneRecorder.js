/*
  Todo: 
    - Also add microphone permission requests in this hook. => also do for useTracking hook.

*/

import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

const useMicrophoneRecorder = (recording, setToPause) => {
  const [timestamp, setTimestamp] = useState(0);
  const [recorder, setRecorder ] = useState()
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
      const res = await recorder.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recorder.startAsync();
      setRecorder(recorder)
    } catch (err) {
      console.log('Failed to start recording:', + err);
    }
  }

  const stopRecording = async () => {
    try {
      await recorder.stopAndUnloadAsync();
      const uri = recorder.getURI(); 
      setfileUri(uri)
      setRecorder(undefined)
    } catch (err) {
      console.log('Failed to stop recording' + err);
    }
  }

  const toggle = async () => {
    if (!recorder && recording) {
      console.log('start recording...')
      await startRecording();
    } else if (recorder) {

      if (!recording) {
        console.log('stop recording...')
        await stopRecording();
      } else {
        // Implies that someone set it to pause
        if (setToPause) {
          console.log('pause recording...')
          const status = await recorder.getStatusAsync()
          if (status.isRecording) { 
            await recorder.pauseAsync();
          }
        } else {
          console.log('resume recording...')
          const status = await recorder.getStatusAsync()
          if (!status.isRecording) { 
            await recorder.startAsync();
          }
        }
      }

      
    }
  }

  useEffect(() => {
    toggle();

    return () => {
      // cleanup... 
    };
  }, [recording, setToPause]);

  return { fileUri };
};


export default useMicrophoneRecorder;