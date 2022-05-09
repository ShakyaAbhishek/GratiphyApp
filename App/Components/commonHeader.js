import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { fontFamily, fontSizes, button1Color, button2Color, backgroundColor, buttonTextColor, borderLight, errorColor } from '../Utils/responsive';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { elevationShadow } from '../Utils/commonStyles';
import { imageUrl, NodeAPIForm, NodeAPI } from '../Services/apiServices';
import * as notificationAction from '../app_redux/actions/notificationAction';
import { connect } from "react-redux";

var badge= '';
const badgeFunction = async () => {
    const value = await AsyncStorage.getItem('auth_token');
    // this.setState({
    //     auth_token: value,
    //     spinnerVisible: true
    // })
    const variables = {}
    await NodeAPI(variables, `notification`, 'GET', value)
        //${JSON.parse(dealsIDs)}
        .then(response => {
            console.warn("notification from header summeryyy ---------->", response.mainData.length)
            if (response.status === 200) {
                badge=response.mainData.length;
                // this.setState({
                //     spinnerVisible: false,
                //     notificationData: response.mainData, //----------- uncomment
                //     //subDeals: response.dealDetailData.subDeal,
                //     //locationCoordinates: response.dealDetailData.location.coordinates,
                //     //menuImageData: menuImage
                // }, () => console.log('stae arr--->', this.state.menuImageData))
            }
        })
}



const Header = ({ navigation, title, icon, backButtonNavigation, menuButton, rightIcon, transparent, whiteIcon, call, blankAuth }) => {

    return (
        <View style={{ height: hp('8%'), width: wp('100%'), backgroundColor: transparent ? "transparent" : backgroundColor, justifyContent: "space-between", alignItems: "center", flexDirection: 'row', borderBottomWidth: transparent ? 0 : .5, borderBottomColor: borderLight }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {backButtonNavigation ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() =>
                            setTimeout(() => {
                                navigation.goBack()
                            }, 400)}
                            style={{ height: hp('8%'), width: wp('5%'), borderRadius: hp('2%'), alignItems: 'center', justifyContent: 'center', marginHorizontal: 2 }}>
                            <Image resizeMode='contain'
                                style={{ tintColor: whiteIcon ? '#ffffff' : '#111111' }}
                                source={require('../Assets/icons/back_arrow.png')} />
                        </TouchableOpacity>
                    </View>
                    : null
                }
                {
                    menuButton ? <View style={{ flex: 1, }}>
                        <TouchableOpacity onPress={() =>
                            navigation.openDrawer()}
                            style={{flex:1, borderRadius: hp('2%'), alignItems: 'center', justifyContent: 'center', marginHorizontal: 2 }}>
                            <Image resizeMode='contain'

                                source={require('../Assets/icons/menu.png')} />
                        </TouchableOpacity>
                    </View> : null
                }
                {
                    icon ?
                        <View style={{ flex: 5, justifyContent: 'center' }}>
                            <Image resizeMode='contain' style={{ height: hp('4.5%'), width: wp('35%') }} source={require("../Assets/logo.png")} />
                        </View>
                        :
                        <View
                            style={{ flex: 5, paddingLeft: !backButtonNavigation ? 15 : null, justifyContent: 'center' }}>
                            <Text numberOfLines={1} style={{ fontFamily: fontFamily('bold'), fontSize: fontSizes('title'), color: whiteIcon ? '#ffffff' : '#111111' }}>{title}</Text>
                        </View>

                }
                {
                    rightIcon ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity onPress={call}>
                                <Image resizeMode='contain' style={{ tintColor: whiteIcon ? '#ffffff' : '#111111' }} source={require("../Assets/icons/edit_white.png")} />
                            </TouchableOpacity>
                        </View>
                        :
                        null
                }
                {
                    blankAuth ?
                        null
                        :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={{ height: hp('8%'), justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('NotificationScreeen')}>
                                <View>
                                    <Image style={{ tintColor: whiteIcon ? '#ffffff' : '#111111' }} resizeMode='contain' source={require("../Assets/icons/bell.png")} />
                                    <View style={{ position:'absolute', height: 18, width: 18, backgroundColor: errorColor, borderRadius: 9, left:18, bottom:10, justifyContent:'center', alignItems:'center' }}>
                                        <Text style={{fontSize:8, fontFamily:fontFamily(),color:"#ffffff"}}>
                                            {/* {setInterval(()=>{badgeFunction()},5000)} */}
                                            {/* {badgeFunction()} */}
                                            {/* {badge} */}
                                            1
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                }
                {/* onPress={() => navigation.navigate('NotificationScreeen')} */}
                {/* <Text>{arrr}</Text> */}
            </View>
        </View>
    )
}
export default Header;

// export default connect(
//     state => ({
//       notificationData: state.SaveNotificationReducer.notificationData.mainData
//     }), { ...notificationAction }
//   )(Header)