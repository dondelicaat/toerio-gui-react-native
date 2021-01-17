/*
  Todo: 
    - Also add microphone permission requests in this hook. => also do for useTracking hook.

*/

import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import recordStateEnum from '../utils/recordStateEnum'



const useMicrophoneRecorder = (recordState) => {
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
    switch (recordState) {
      case recordStateEnum.recording: {
        console.log('start audio recording...')
        await startRecording();
        break;
      }

      case recordStateEnum.paused: {
        console.log('pause audio recording...')

        const status = await recorder.getStatusAsync()
        if (status.isRecording) { 
          await recorder.pauseAsync();
        }

        break; 
      }

      case recordStateEnum.resumed: {
        console.log('resume audio recording...')
        const status = await recorder.getStatusAsync()
        if (!status.isRecording) { 
          await recorder.startAsync();
        }

        break;
      }

      case recordStateEnum.stopped: {
        if (recorder) {
          console.log('stop audio recording...')
          await stopRecording();
        } else 
          return
        break;
      }

      default: 
        console.log('should not fall through...')
        throw new Error('unknown option...')
    } 

  }

  useEffect(() => {
    toggle();

    return () => {
      // cleanup... 
    };
  }, [recordState]);

  return { fileUri };
};


export default useMicrophoneRecorder;