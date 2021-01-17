/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */



import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import RootNavigator from './src/navigation/RootNavigator';

import { createStackNavigator } from '@react-navigation/stack';


import SaveRecordingScreen from './src/views/SaveRecordingScreen';
const Stack = createStackNavigator();



const App: () => React$Node = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
{/* 
      <Stack.Navigator>
        <Stack.Screen name="SaveRecording" component={SaveRecordingScreen} />
      </Stack.Navigator> */}
    </NavigationContainer>
  );
};


export default App;
