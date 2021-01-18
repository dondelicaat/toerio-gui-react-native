import React from 'react';
import {Platform, View, StyleSheet, Button, Text} from 'react-native'
import { Callout } from 'react-native-maps';


function TourMarker({ tour, navigation }) {

  console.log(tour.description)
  console.log(navigation)
  
  return (
    <Callout
      onPress = {() => { navigation.navigate('PlayRecordingScreen', {tour: tour} ) }}
    >
      <View>
        <Text>
          {tour.title}
        </Text>
        <Text>{tour.description}</Text>
      </View>
    </Callout>
  );
}

export default TourMarker;