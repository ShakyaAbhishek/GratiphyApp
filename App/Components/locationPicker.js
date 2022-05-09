import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, Platform, TextInput, Modal, PermissionsAndroid, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, errorColor, sliderColor, timeConverterOfMilli } from '../Utils/responsive';
import Header from './commonHeader';
import DateTimePicker from "react-native-modal-datetime-picker";
import { Button1, ButtonText, ConatinerViewWithPadding, BigHeadingText, textInputMargin, SmallTextHeading, TextInputViewWithImage, TextInputView, labelText, TextInputImage, ConatinerViewWithoutPadding, rowContentCenter } from '../Utils/commonStyles';
import { NodeAPI } from '../Services/apiServices';
import { Dropdown } from 'react-native-material-dropdown';
import * as saveProfileAction from '../app_redux/actions/SaveProfileDataAction';
import * as locationAction from '../app_redux/actions/locationAction';
import { connect } from "react-redux";
import { Toast, Loader } from './modals';
import LocationView from "./react-native-location-view";
import Geolocation from '@react-native-community/geolocation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationEvents } from 'react-navigation';
import firebase from 'react-native-firebase';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';


export const LocationPicker= (isVisible, closeModal, initialLocations) => {
      return (
      <View style={ConatinerViewWithoutPadding}>
        <Modal
          animationType={"fade"}
          hardwareAccelerated
          visible={isVisible}
          transparent={true}
          onRequestClose={() => { console.log("Modal has been closed.") }}>
          {/*All views of Modal*/}
          {/*Animation can be slide, slide, none*/}
          <SafeAreaView style={styles.modal}>
            <KeyboardAvoidingView>
              <View style={{ height: hp('95%'), width: wp('99%') }}>
                <LocationView
                  apiKey={"AIzaSyB9vC55lgpt2ymmljWWXt579lReV2nW3IY"}
                  markerColor={'transparent'}
                  onLocationSelect={(address) => {
                    // this.setState({
                    //   address: {
                    //     formatted_address: address.address,
                    //     location: [
                    //       address.latitude,
                    //       address.longitude
                    //     ]
                    //   },
                    //   addressErr: '',
                    //   isVisible: false,
                    //   addType: true
                    // }, () => { console.warn("address------>", this.state.address) });
                  }}
                  initialLocation={{
                   initialLocations
                  }}
                />
              </View>
              <TouchableOpacity onPress={closeModal} style={{ position: 'absolute', top: 10, right: 5 }}>
                <Image source={require('../Assets/icons/cancel.png')} />
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }


const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#11111190'
      },
})