import { NetInfo } from 'react-native';
// const baseUrl = 'http://10.0.2.219:5500/v1/resturant/';
// const imageUrl = "http://10.0.2.219:5500/"



const baseUrl = 'http://realtimedeals.n1.iworklab.com:3005/v1/resturant/';
const imageUrl = "http://realtimedeals.n1.iworklab.com:3005/"

//http://realtimedeals.d4.iworklab.com:8000/v1/resturant/forgotpassword

var NodeAPI = (variables, apiName, apiMethod, token) => {
    console.log("internetConnection===>" + navigator.onLine)
    // if (navigator.onLine) {
    var init = apiMethod == "GET" ? {
        method: "GET",

        headers: {
            'Authorization': token,
            "Content-Type": 'application/json'
        },
    } :
        apiMethod == "POST" ?
            {
                method: apiMethod,
                headers: {
                    'Authorization': token,
                    //'Content-Type': "multipart/form-data",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(variables),
            }
            :
            {
                method: apiMethod,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': token
                },
                body: JSON.stringify(variables),
            };
    console.warn('value===', baseUrl + apiName + JSON.stringify(init))
    console.log('value===', baseUrl + apiName + JSON.stringify(init))
    return fetch(baseUrl + apiName, init)
        .then(response => response.json()
            .then(responseData => {
                //console.warn("===" + JSON.stringify(responseData))
                return responseData;
            }))
        .catch(err => {
            return { message: "Server encountered a problem please retry." }
        });

}
var NodeAPIForm = (variables, apiName, apiMethod, token) => {
    console.log("internetConnection===>" + navigator.onLine)
    // if (navigator.onLine) {
    var init = apiMethod == "GET" ? {
        method: "GET",

        headers: {
            'Authorization': token,
            "Content-Type": 'application/json'
        },
    } :
    apiMethod == "POST" ?
    {
        method: apiMethod,
        headers: {
            'Authorization': token,
            'Content-Type': "multipart/form-data",
        },
        body: variables,
    }:{
        method: apiMethod,
        headers: {
            'Authorization': token,
            'Content-Type': "multipart/form-data",
        },
        body: variables,
    }
    console.warn('value form===', baseUrl + apiName + JSON.stringify(init))
    console.log('value form===', baseUrl + apiName + init)
    return fetch(baseUrl + apiName, init)
        .then(response => response.json()
            .then(responseData => {
                //console.warn("===" + JSON.stringify(responseData))
                return responseData;
            }))
        .catch(err => {
            console.warn("errr",err)
            return { message: " Server encountered a problem please retry ! " }
        });

}

function thirdPartyAPI(variables, url, apiMethod) {
    var init = apiMethod == "GET" ? {
        method: "GET"
    } :
        {
            method: apiMethod,
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(variables)
        }

    return fetch(url, init)
        .then(response => response.json()
            .then(responseData => {
                return responseData;
            }))
        .catch(err => {
            return { msg: "Server encountered a problem please retry." }
        });
}

export { NodeAPI, thirdPartyAPI, NodeAPIForm, imageUrl };

  //console.log(baseUrl + apiName + "===body" + JSON.stringify(init));
    //console.log("Request ==> " + init);
//with status code
    // .then(response => {
    //     const statusCode = response.status;
    //     const data = response.json();
    //     return Promise.all([statusCode, data]);
    //   })
    //without status code
    // .then(response => response.json()
    //         .then(responseData => {
    //             console.warn("===" + JSON.stringify(responseData))
    //             return responseData;
    //         }))