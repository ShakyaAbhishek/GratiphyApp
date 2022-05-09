import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { backgroundColor } from '../../Utils/responsive';
import { Button1, Button2, ButtonText } from '../../Utils/commonStyles';

export default class LandingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.ContainerView}>
        <View style={styles.InsideView} >
          <Image source={require('../../Assets/logo.png')} />
          <View style={styles.ButtonView}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('LoginScreen')} style={[Button1,{marginTop: hp('5%')}]}>
              <Text style={ButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SignupScreen')} style={[Button2,{marginTop: hp('5%')}]}>
              <Text style={ButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ContainerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: backgroundColor
  },
  InsideView: {
    height: hp('50%'),
    width: wp('80%'),
    alignItems: 'center',
    paddingTop: hp('7%'),
  },
  ButtonView: {
    height: hp('30%'),
    width: wp('60%'),
    marginTop: hp('5%')
  }
});

