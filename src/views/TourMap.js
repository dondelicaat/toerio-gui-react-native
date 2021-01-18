import React, { useState, useEffect }  from 'react';
import {View, Text, StyleSheet} from 'react-native'
import {check, request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import MapView, { UrlTile, Polyline, Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import axios from 'axios';

import TourMarker from '../components/TourMarker';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
 });

function TourMap({ navigation }) {
  const [tours, setTours] = useState([]);
  const [center, setCenter] = useState({
    latitude: 53.21351,
    longitude: 6.68825,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121
  });


  // Todo: be sure to only fetch tours in view + limit of 10 ranked by some measure of relevance...
  const fetchTours = async () => {
    const resp = await axios.get('https://toer.io/api/tours');

    const tours = resp.data;
    setTours(tours)
  }


  useEffect(() => {
    getLocation();
    fetchTours();
  }, [])

  const getLocation = async () => {
    const geoPermission = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const permission = await check(geoPermission);
    if (permission != 'authorized') {
      await request(geoPermission)
    }

    Geolocation.getCurrentPosition((position) => {
      const region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121
      }
      
      setCenter(region)
    }, (err) => {
      console.log('failed to get position:', err.message);
    });
  }

  return (
    <View style={styles.container}>
    <MapView
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      region={center}
    >
      {
        tours.map( (tour, idx) => {
          return (
            <Marker 
                coordinate = { {
                                latitude: tour.startPoint.coordinates[1],
                                longitude: tour.startPoint.coordinates[0]
                              } }
                key = {`marker-${idx}`}
            >
              {/* <Callout
                onPress={ ()=>  console.log('pressed') }
              > */}
                <TourMarker 
                  tour = {tour}
                  navigation = { navigation } 
                
                />
              {/* </Callout> */}
                
            </Marker >
          )
        })
      }

      {
        tours.map( (tour, idx) => {
          if (!tour.route) {return}
          return (
            <Polyline 
                coordinates = {tour.route}
                key = {`tour-${idx}`}
                strokeColor = 'red'
                strokeWidth = {3}
            >
            </Polyline >
          )
        })
      }


    </MapView>
  </View>
  );
}


// Define stylesheets here.

export default TourMap

