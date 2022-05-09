export function saveLocationData(data) {
    console.warn('location   ---- data', data)
    return dispatch=>{
        dispatch({ type: 'GET_LOCATION', data })
    }
               
}


// export function currentLocation() {
//     return dispatch => {
//         // dispatch({ type: 'SET_LOADER_TRAINING', payload: true })
//     //     fetch('https://c5cqk977.caspio.com/rest/v2/tables/Address/records?q.select=CountryName&q.groupBy=CountryName&q.limit=1000', {
//     //         method: 'GET',
//     //         headers: {
//     //             "accept": "application/json",
//     //             "Authorization": "Bearer" + ' ' + token
//     //         },
//     //     })
//     //         .then(response => response.json())
//     //         .then(responseData => {
//     //             dispatch({ type: 'SET_LOADER_TRAINING', payload: false })
//     //             dispatch({ type: 'GET_COUNTRY', responseData })
//     //         }
//     //         )

//     //         .catch(err => console.warn(err))

//     // }
//     hasLocationPermission = async () => {
//         if (Platform.OS === 'ios' ||
//           (Platform.OS === 'android' && Platform.Version < 23)) {
//           return true;
//         }
    
//         const hasPermission = await PermissionsAndroid.check(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//         );
    
//         if (hasPermission) return true;
    
//         const status = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//         );
    
//         if (status === PermissionsAndroid.RESULTS.GRANTED) return true;
    
//         if (status === PermissionsAndroid.RESULTS.DENIED) {
//           this.hasLocationPermission();
//         }
//         return false;
//       }
    
//       async currentLocationFun() {
//         const hasLocationPermission = await this.hasLocationPermission();
//         if (!hasLocationPermission) return;
//         Geolocation.getCurrentPosition(
//           position => {
//             const initialPosition = JSON.stringify(position);
//             console.warn("initialPosition 1", initialPosition);
//             this.setState({ initialPosition });
//           },
//           // error => Alert.alert('Error', JSON.stringify(error)),
//           { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
//         );
//         this.watchID = Geolocation.watchPosition(position => {
//           var lastPosition = position;
//           console.warn("lastPosition 1", lastPosition);
    
//           this.setState({
//             currentLocation: {
//               latitude: lastPosition.coords.latitude,
//               longitude: lastPosition.coords.longitude,
//             },
//             spinnerVisible: false,
//           });
//         });
//       }
    
//       componentWillUnmount() {
//         this.watchID != null && Geolocation.clearWatch(this.watchID);
//       }
// }
