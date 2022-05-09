import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class SplashScreen extends Component {
  componentDidMount() {
    this.ChangeScreen()
  }
  ChangeScreen() {
    setTimeout(() => { this.props.navigation.navigate('LandingScreen') }, 2000);
  }
  render() {
    return (
      <View style={styles.ContainerView} >
        <Image style={styles.ImageView} resizeMode="cover" source={require('../../Assets/splash_screen1.png')} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  ContainerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageView: {
    height: hp('100%'),
    width: wp('100%')
  }
})