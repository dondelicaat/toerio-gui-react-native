import haversine from 'haversine'

function getDistanceFromLatLonInMeter(
  lastLatitude,
  lastLongitude,
  newLatitude,
  newLongitude,
) {

  const start = { 
    latitude: lastLatitude,
    longitude : lastLongitude
  }

  const end =  {
    latitude: newLatitude,
    longitude : newLongitude
  }

  const distance = haversine(start, end, {unit : 'meter'})

  return distance;
}



export { getDistanceFromLatLonInMeter };