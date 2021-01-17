import React from 'react';

import HomeScreen from '../views/home'
import RecordScreen from '../views/RecordScreen'
import TourMap from '../views/TourMap'

import Icon from 'react-native-vector-icons/Ionicons';
import FoundationIcon from 'react-native-vector-icons/Foundation'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();


function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'TourMap') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Record') {
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
        name="Record"
        component={RecordScreen}
      />
      <Tab.Screen
        name="TourMap"
        component={TourMap}
      />

    </Tab.Navigator>
  )
}

export default RootNavigator;