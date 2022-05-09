import Geolocation from '@react-native-community/geolocation';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, Platform, TextInput, Modal, PermissionsAndroid, SafeAreaView, KeyboardAvoidingView } from 'react-native';


onLocationEnablePressed = async () => {
    if (Platform.OS === 'android') {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
            .then(async (data) => {
                console.warn("Enable loaction   ", data);
                if (data == 'enabled') {
                    await this.currentLocationFun();
                }
            }).catch(async (err) => {
                if (err.code == 'ERR00') {
                    await this.currentLocationFun();
                }
            });
    }
}

hasLocationPermission = async () => {
    if (Platform.OS === 'ios' ||
        (Platform.OS === 'android' && Platform.Version < 23)) {
        return true;
    }

    const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
        this.hasLocationPermission();
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        this.hasLocationPermission();
    }

    return this.hasLocationPermission();
}

var currentLocationFun = async() => {
    console.warn("in location")
    const hasLocationPermission = await this.hasLocationPermission();
    if (!hasLocationPermission) return;

    Geolocation.getCurrentPosition(
        position => {
            const initialPosition = JSON.stringify(position);
            console.warn("initialPosition 1", initialPosition);
            this.setState({ initialPosition });
        },
        error => {
            if (error.code == 2) {
                this.onLocationEnablePressed()
            }
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    this.watchID = Geolocation.watchPosition(async (position) => {
        var lastPosition = position;
        console.warn("lastPosition 1", lastPosition);
        return lastPosition;
        // await this.setState({
        //     currentLocation: {
        //         latitude: lastPosition.coords.latitude,
        //         longitude: lastPosition.coords.longitude,
        //     }
        // });
        //await this.locationText();
    },
        //error => Alert.alert('Error', JSON.stringify(error))
    );
}


export{ currentLocationFun}