import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TourMap from '../views/TourMap';
import PlayRecordingScreen from '../views/PlayRecordingScreen';

const Stack = createStackNavigator();


function PlaybackNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName='TourMap' 

    >
      <Stack.Screen name="TourMap" component={TourMap}       
        options = {{
          header: () => null
        }}
      />

      <Stack.Screen 
        name="PlayRecordingScreen" 
        component={PlayRecordingScreen} 
        options = {{
          headerTitle : "Play Toer"
        }}
      />


    </Stack.Navigator>
  )
}

export default PlaybackNavigator;