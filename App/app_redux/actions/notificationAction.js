export function saveNotificationData() {
    //console.warn('data', data)
    return dispatch=>{
        dispatch({ type: 'notification', badgeFunction })
    }
               
}
import { Text, View, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import{NodeAPI} from '../../Services/apiServices';
let badgeFunction = async () => {
    const value = await AsyncStorage.getItem('auth_token');
    // this.setState({
    //     auth_token: value,
    //     spinnerVisible: true
    // })
    const variables = {}
    var badge = 0

    NodeAPI(variables, `notification`, 'GET', value)
        //${JSON.parse(dealsIDs)}
        .then(response => {
            console.warn("notification from header summeryyy ---------->", response.mainData.length)
            if (response.status === 200) {
                badge=response;
                // this.setState({
                //     spinnerVisible: false,
                //     notificationData: response.mainData, //----------- uncomment
                //     //subDeals: response.dealDetailData.subDeal,
                //     //locationCoordinates: response.dealDetailData.location.coordinates,
                //     //menuImageData: menuImage
                // }, () => console.log('stae arr--->', this.state.menuImageData))
            }
        })
        return badge
}

// export function saveProfileData(data) {
//     return dispatch => {
//         dispatch({ type: 'SET_LOADER_TRAINING', payload: true })
//         fetch('https://c5cqk977.caspio.com/rest/v2/tables/Address/records?q.select=CountryName&q.groupBy=CountryName&q.limit=1000', {
//             method: 'GET',
//             headers: {
//                 "accept": "application/json",
//                 "Authorization": "Bearer" + ' ' + token
//             },
//         })
//             .then(response => response.json())
//             .then(responseData => {
//                 dispatch({ type: 'SET_LOADER_TRAINING', payload: false })
//                 dispatch({ type: 'GET_COUNTRY', responseData })
//             }
//             )

//             .catch(err => console.warn(err))

//     }
// }
