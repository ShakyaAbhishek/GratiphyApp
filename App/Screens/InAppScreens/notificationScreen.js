//import liraries
import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Switch, Platform, Picker, TextInput, Modal, TouchableHighlight, ImageBackground, AsyncStorage } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor, sliderColor, errorColor, borderLight, borderDark, dateConverterOfMilli } from '../../Utils/responsive';
import Header from '../../Components/commonHeader';
import { Swiper, TitleBar, TabBar } from '../../Components/react-native-awesome-viewpager';
import DateTimePicker from "react-native-modal-datetime-picker";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail, validatePassword, validatePhoneNo, validateRestoCode } from '../../Services/validation';
import { Button1, Button2, ButtonText, ConatinerViewWithPadding, BigHeadingText, SmallTextHeading, TextInputViewWithImage, TextInputView, labelText, TextInputImage, textInputMargin, ConatinerViewWithoutPadding } from '../../Utils/commonStyles';
import { FlatList } from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import { Toast, Loader } from '../../Components/modals';
import { NavigationEvents } from 'react-navigation';
import { imageUrl, NodeAPIForm, NodeAPI } from '../../Services/apiServices';
import ErrorComponent from '../../Components/errorComponent';

// create a component
class NotificationScreeen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toastVisible: false,
            spinnerVisible: true,
            toastColor: '',
            toastMessage: '',
            auth_token: '',
            notificationData: []
        }
    }
   

    noticationData = async () => {
        const value = await AsyncStorage.getItem('auth_token');
        this.setState({
            auth_token: value,
        })
        const variables = {}
        await NodeAPI(variables, `notification`, 'GET', this.state.auth_token)
            //${JSON.parse(dealsIDs)}
            .then(response => {
                console.warn("notification summeryyy ---------->", response)
                if (response.status === 200) {
                    this.setState({
                        spinnerVisible: false,
                        notificationData: response.mainData, //----------- uncomment
                        //subDeals: response.dealDetailData.subDeal,
                        //locationCoordinates: response.dealDetailData.location.coordinates,
                        //menuImageData: menuImage
                    }, () => console.log('stae arr--->', this.state.menuImageData))
                }
                else {
                    //alert("else")
                    this.setState({ toastColor: errorColor, toastMessage: response.message, toastVisible: true })
                    setTimeout(() => {
                        this.setState({ toastVisible: false, spinnerVisible: false })
                        //this.props.navigation.navigate('mainRoute')
                    }, 2000)
                }
            })
    }


    _renderList(item, index) {
        return (
            <View style={styles.notificationContainerView}>
                {/* <View style={styles.imageContainerView}>
                    <View style={styles.imageView}>
                        <Image resizeMode="cover" style={{ height: '100%', width: '100%' }} source={require('../../Assets/icons/g.png')} />
                    </View>
                </View> */}
                <View style={{ flex: 1, marginHorizontal: wp('5%'), alignItems: 'baseline', justifyContent: 'center' }}>
                    <Text numberOfLines={5} style={[labelText, { fontWeight: 'bold' }]}>{item.message}</Text>
                    <View style={{ flexDirection: 'row', marginTop: '2%', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                            <Image resizeMode='contain' source={require('../../Assets/icons/watch.png')} />
                            <Text numberOfLines={1} style={styles.dateTimeFont}>{item.time}</Text>
                        </View>
                        <View style={{ flex: 1.4, flexDirection: 'row', alignItems: 'center', }}>
                            <Image resizeMode='contain' source={require('../../Assets/icons/calendar.png')} />
                            <Text numberOfLines={1} style={styles.dateTimeFont}>{item.date}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const navigation = this.props.navigation;
        return (
            <View style={ConatinerViewWithoutPadding}>
                <NavigationEvents
                    onWillFocus={() =>
                        this.noticationData()
                    }
                />
                <Header navigation={navigation} title="Notifications" backButtonNavigation={true} blankAuth={true} />
                <Loader spinnerVisible={this.state.spinnerVisible} />
                <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />
                <View style={ConatinerViewWithPadding}>
                    {
                        this.state.notificationData.length != 0 ?
                            <FlatList
                                data={this.state.notificationData}
                                showsVerticalScrollIndicator={false}
                                extraData={this.state}
                                renderItem={({ item, index }) => this._renderList(item, index)}
                            /> :
                            <View style={[ConatinerViewWithPadding, { justifyContent: 'center', alignItems: 'center' }]}>
                                {!this.state.spinnerVisible?<ErrorComponent/>: null}
                            </View>
                    }

                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    notificationContainerView: {
        flexDirection: 'row',
        padding: hp('1%'),
        //height: hp('15%'),
        backgroundColor: '#ffffff',
        marginVertical: hp('1%'),
        marginHorizontal: wp('1%'),
        borderRadius: hp('2%'),
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    imageContainerView: {
        flex: 1,
        alignItems: 'center',
        marginTop: '5%'
    },
    imageView: {
        height: '55%',
        width: '60%',
        borderRadius: 50,
        borderColor: borderLight,
        borderWidth: 1
    },
    dateTimeFont: {
        fontFamily: fontFamily('bold'),
        fontSize: hp('1.8%'),
        color: '#111111',
        marginLeft: '5%'
    }

});

//make this component available to the app
export default NotificationScreeen;



 // async componentDidMount() {
    //     // let fcmToken = await AsyncStorage.getItem('fcmToken');
    //     const value = await AsyncStorage.getItem('auth_token');
    //     this.setState({
    //         auth_token: value,
    //         spinnerVisible: false
    //     })
    //     const variables = {}
    //     await NodeAPI(variables, `notification`, 'GET', this.state.auth_token)
    //         //${JSON.parse(dealsIDs)}
    //         .then(response => {
    //             console.warn("notification summeryyy ---------->", response)
    //             if (response.status === 200) {
    //                 this.setState({
    //                     spinnerVisible: false,
    //                     notificationData: response.mainData, //----------- uncomment
    //                     //subDeals: response.dealDetailData.subDeal,
    //                     //locationCoordinates: response.dealDetailData.location.coordinates,
    //                     //menuImageData: menuImage
    //                 }, () => console.log('stae arr--->', this.state.menuImageData))
    //             }
    //             else {
    //                 //alert("else")
    //                 this.setState({ toastColor: errorColor, toastMessage: response.message, toastVisible: true })
    //                 setTimeout(() => {
    //                     this.setState({ toastVisible: false, spinnerVisible: false })
    //                     //this.props.navigation.navigate('mainRoute')
    //                 }, 2000)
    //             }
    //         })
    // }


// {
                //     notificationType: "PASSWORD",
                //     message: "Your Password Has Been Updated",
                //     isSeen: false,
                //     date: "09/09/2019",
                //     time: "11:42"
                // },
                // {
                //     notificationa: "You've earned 25 points !",
                //     time: "22:04",
                //     date: "22/04/19"
                // },
                // {
                //     notificationa: "You've earned 25 points !",
                //     time: "22:04",
                //     date: "22/04/19"
                // },
                // {
                //     notificationa: "You've earned 25 points !",
                //     time: "22:04",
                //     date: "22/04/19"
                // },
                // {
                //     notificationa: "You've earned 25 points !",
                //     time: "22:04",
                //     date: "22/04/19"
                // },
                // {
                //     notificationa: "You've earned 25 points !",
                //     time: "22:04",
                //     date: "22/04/19"
                // },
                // {
                //     notificationa: "You've earned 25 points !",
                //     time: "22:04",
                //     date: "22/04/19"
                // },
                // {
                //     notificationa: "You've earned 25 points !",
                //     time: "22:04",
                //     date: "22/04/19"
                // },
                // {
                //     notificationa: "You've earned 25 points !",
                //     time: "22:04",
                //     date: "22/04/19"
                // },
                // {
                //     notificationa: "You've earned 25 points !",
                //     time: "22:04",
                //     date: "22/04/19"
                // },