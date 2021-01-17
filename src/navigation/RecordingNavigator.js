import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import RecordScreen from '../views/RecordScreen';
import SaveRecordingScreen from '../views/SaveRecordingScreen';
import SuccessfulUploadScreen from '../views/SuccessfulUploadScreen';

const Stack = createStackNavigator();


function RecordingNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName='Record' 

    >
      <Stack.Screen name="Record" component={RecordScreen}       
        options = {{
          header: () => null
        }}
      />

      <Stack.Screen 
        name="SaveRecording" 
        component={SaveRecordingScreen} 
        options = {{
          headerTitle : "Save Toer"
        }}
      />

      <Stack.Screen name="Success" component={SuccessfulUploadScreen}       
        options = {{
          header: () => null
        }}
      />

    </Stack.Navigator>
  )
}

export default RecordingNavigator;