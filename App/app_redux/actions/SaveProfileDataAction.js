export function saveProfileData(data) {
    //console.warn('data', data)
    return dispatch=>{
        dispatch({ type: 'GET_PROFILE', data })
    }
               
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
