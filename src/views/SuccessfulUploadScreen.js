import React, { useEffect } from 'react';
import {Platform, View, StyleSheet, Button, Text} from 'react-native'


function SuccessfulUploadScreen({ route, navigation }) {

  useEffect(() => {
    
    // setTimeout(() => { navigation.navigate('home')}, 1000)

    return () => {
    }
  }, [])

  return (
    <View>
      <Text>SUCCESS</Text>
    </View>
  );
}

export default SuccessfulUploadScreen;