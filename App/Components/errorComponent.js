import React, { Component } from 'react';
import { FlatList, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Picker, TextInput, Modal, TouchableHighlight, ImageBackground, Platform, StatusBar, AsyncStorage, Share } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor, errorColor, sliderColor, borderLight, borderDark } from '../Utils/responsive';
import { Button1, Button2, ButtonText, ConatinerViewWithPadding, BigHeadingText, SmallTextHeading, TextInputViewWithImage, TextInputView, labelText, TextInputImage, ConatinerViewWithoutPadding } from '../Utils/commonStyles';



export default class ErrorComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <View style={[ConatinerViewWithPadding, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={{
            height: hp('40%'), width: wp('60%'), alignSelf: 'center', marginTop: hp('3%'), backgroundColor: '#ffffff', elevation: 3, borderRadius: 50, shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        }}>
            <Text style={[SmallTextHeading, { color: 'red', textAlign: 'center', marginTop: hp('5%') }]}>Oops!...</Text>
            <Image style={{ height: '40%', width: '90%', marginTop: hp('4%'), tintColor: '#111111' }} resizeMode={'contain'} source={require('../Assets/sad_emoji.png')} />
            <Text style={[SmallTextHeading, { color: 'red', textAlign: 'center', marginTop: hp('2%') }]}>NO DATA FOUND</Text>
        </View>
    </View>
    );
  }
}
