/*
  Todo: 
    - Also add microphone permission requests in this hook. => also do for useTracking hook.

*/

import {useEffect, useState} from 'react';


const useTracking = (isActive) => {
  const [location, setLocation] = useState(defaultLocation);
  const [chunks, setChunks] = useState([]);
  const [distance, setDistance] = useState(0);

  console.log('USE TRACKING RENDERED')

  useEffect(() => {
    
    return () => {
      console.log('Removing all listeners');
    };
  }, [isActive]);

  return {location, history, distance};
};

export default useTracking;