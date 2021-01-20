import { FileSystemUploadType, uploadAsync } from 'expo-file-system';
import React, { useState } from 'react';
import {Platform, View, StyleSheet, Button, Text, TextInput, Alert} from 'react-native'
import * as FileSystem from 'expo-file-system';
import { Formik, useFormik } from 'formik';
import * as yup from 'yup';

import Api from '../api/api';

function SaveRecordingScreen({ route, navigation }) {
  const {fileUri, history, distance} = route.params;

  const progressCallback = (loaded, total) => {
    console.log(loaded);
    console.log(total);
  };

  const upload = async (tour) => {
    try {
      console.log('upload called')
      
      let response = await FileSystem.uploadAsync(
        'https://toer.io/api/upload',
        fileUri,
        {
          uploadType: FileSystemUploadType.MULTIPART,
          fieldName: 'audioFile'
        }
      )

      const responseJson = JSON.parse(response.body);
      tour.fileId = responseJson.fileId;

      // Startpoint is geojson object in order to do server-side geo indexing.
      // This allows us to query routes in a given bounding box for example.
      tour.startPoint = {
        type : "Point",
        coordinates: [history[0].longitude, history[0].latitude]
      }
      tour.route = history;
      tour.distance = distance;
     

      response = await Api.createTour(tour);
      

      navigation.navigate('Success');
    
    } catch (err) {
      Alert.alert('something went wrong while looking for the playback file...');
      console.log(`Something went wrong while uploading: ${err}`)
    }
  }

  const submit = async (values) => {
    const tour = {};
    tour.title = values.title;
    tour.description =  values.description;
    tour.location = values.location;
    await upload(tour);
  }

  return (
    <Formik
      initialValues = {{
        title: '',
        description: '',
        location: ''
      }}
      onSubmit = { values => submit(values) }
      validationSchema = {
        yup.object().shape({
          title: yup
            .string()
            .required('Please, provide a title!'),
          description: yup
            .string()
            .required('Please provide a description'),
          location: yup
            .string()
            .required('Please provide a location'),   
          })
      }
    >
      {({ touched, isValid, setFieldTouched, errors, handleChange, handleSubmit, values }) => (
        <View>
          <TextInput
            placeholder = 'Title..'
            onChangeText = {handleChange('title')}
            onBlur={() => setFieldTouched('title')}
            value={values.title}
          />
          {touched.title && errors.title &&
            <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.title}</Text>
          }    
          <TextInput
            placeholder = 'Description..'
            onChangeText = {handleChange('description')}
            onBlur={() => setFieldTouched('description')}
            value={values.description}
          />
          {touched.description && errors.description &&
            <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.description}</Text>
          }    
          <TextInput
            placeholder = 'Location..'
            onChangeText = {handleChange('location')}
            onBlur={() => setFieldTouched('location')}
            value={values.location}
          />
          {touched.location && errors.location &&
            <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.location}</Text>
          }  

          <Button 
            onPress={handleSubmit} 
            disabled={!isValid}
            title="Submit" 
          />
        </View>
      )}

    </Formik>

  );
}


export default SaveRecordingScreen;