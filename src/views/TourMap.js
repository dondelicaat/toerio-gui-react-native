import React, { useState, useEffect }  from 'react';
import {View, Text, StyleSheet} from 'react-native'
import MapView, { UrlTile, Geojson, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';


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

function TourMap() {
  const [tours, setTours] = useState(null);
  const [center, setCenter] = useState({lat: 53.23, lon: 6.68});
  const [tourMarkers, setTourMarkers] = useState([]);


  // Todo: be sure to only fetch tours in view + limit of 10 ranked by some measure of relevance...
  const fetchTours = async () => {
    const resp = await axios.get('https://toer.io/api/tours');

    const tours = resp.data;

    const tourFeatures = {
      type:"FeatureCollection",
      features: tours
    };

    const markers = [];
    tours.forEach( (tour) => {
      const marker = {
        // Mongo and mapviewer have latLon convensions reversed..
        lat : tour.properties.startPoint[1],
        lon : tour.properties.startPoint[0],
        id : tour._id
      };
      markers.push(marker);
    });
    
    setTourMarkers(markers);
    setTours(tourFeatures);
  }

  useEffect(() => {
    fetchTours();
  }, [])
  
  return (
    <View style={styles.container}>
    <MapView
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      region={{
        latitude: 53.21351,
        longitude: 6.68825,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121
      }}
    >
      {
        tourMarkers.map( (marker, idx) => {
          return (
            <Marker 
                coordinate = { {latitude: marker.lat, longitude: marker.lon} }
                key = {`marker-${idx}`}
            >
            </Marker >
          )
        })
      }

      { tours && 
        <Geojson
          geojson = {tours}
          strokeColor="red"
          fillColor="green"
          strokeWidth={2}
        />
      }

    </MapView>
  </View>
  );
}


// Define stylesheets here.

export default TourMap

