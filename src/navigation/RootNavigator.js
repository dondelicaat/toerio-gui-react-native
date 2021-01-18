import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import FoundationIcon from 'react-native-vector-icons/Foundation'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../views/home';
import TourMap from '../views/TourMap';
import RecordingNavigator from './RecordingNavigator';
import PlaybackNavigator from './PlaybackNavigator';





const Tab = createBottomTabNavigator();


function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'PlaybackNavigator') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'RecordingNavigator') {
            return <FoundationIcon name={'record'} size = {20} />
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={20} />;
        },
      })}

      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        showLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        name="RecordingNavigator"
        component={RecordingNavigator}
        options={{
          tabBarVisible: false
        }}
      />
      <Tab.Screen
        name="PlaybackNavigator"
        component={PlaybackNavigator}
      />

    </Tab.Navigator>
  )
}

export default RootNavigator;