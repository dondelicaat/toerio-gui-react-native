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




const App: () => React$Node = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};


export default App;
