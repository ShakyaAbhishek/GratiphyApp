
import React from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator, AsyncStorage, Dimensions, Modal, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor, errorColor } from '../Utils/responsive';
import {labelText} from '../Utils/commonStyles';


export const Loader = ({ spinnerVisible, }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={spinnerVisible}
            // onRequestClose={() => {
            //     Alert.alert('Modal has been closed.');
            // }}
            >
            <View style={{ height: hp('100%'), width: wp('100%'), backgroundColor: "#00000090", justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ height: hp('15%'), width: wp('80%'), flexDirection: "row", alignItems: "center", justifyContent: 'center', backgroundColor: "#11111195", borderRadius: hp('1%') }}>
                    <ActivityIndicator size="large" color={"#ffffff"} />
                    <Text style={{ marginLeft: wp('5%'), fontFamily: fontFamily(), fontSize: fontSizes('title'), color: '#ffffff' }}>Please wait...</Text>
                </View>
            </View>
        </Modal>
    )
}

 // information modal
export const Toast = ({ visible, message, backColor }) => {
    return (

        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                console.log('Modal has been closed.');
            }}>
            <View style={{ height: hp('100%'), width: wp('100%') }} />
            <View style={{ position: "absolute", zIndex: 1, bottom: 0, height: hp('7%'), backgroundColor: backColor, width: wp('100%'), justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "white", fontSize: hp('2%'), textAlign: 'center' }}>{message}</Text>
            </View>
        </Modal>

    )
}