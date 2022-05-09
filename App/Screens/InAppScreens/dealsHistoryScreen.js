//import liraries
import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Switch, Platform, Picker, TextInput, Modal, TouchableHighlight, ImageBackground, AsyncStorage } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor, sliderColor, errorColor, borderLight, dateConverterOfMilli, timeConverterOfMilli } from '../../Utils/responsive';
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
//{!this.state.spinnerVisible? <ErrorComponent/>:null}
// create a component
class DealsHistoryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toastVisible: false,
            spinnerVisible: true,
            toastColor: '',
            toastMessage: '',
            reedemedDatas: [],
            claimedDatas: [],
            auth_token: ''
        };
    }


    ApiFunc = async () => {
        this.setState({
            spinnerVisible: true
        })
        const value = await AsyncStorage.getItem('auth_token');
        this.setState({
            auth_token: value
        })
        await this.redeemedListFun();
        await this.claimedListFun();

    }

    async redeemedListFun() {
        const variables = {}
        console.warn('Redeemed Deal')
        await NodeAPI(variables, `redemedDeal`, 'GET', this.state.auth_token)
            //${JSON.parse(dealsIDs)}
            .then(response => {
                console.warn("redeemption screen data---------->", response)
                if (response.status === 200) {
                    this.setState({
                        //spinnerVisible: true,
                        reedemedDatas: response.mainData
                    })
                }
                else {
                    //alert("else")
                    // this.setState({ toastColor: errorColor, toastMessage: response.message, toastVisible: true })
                    setTimeout(() => {
                        this.setState({
                            toastVisible: false,
                            //spinnerVisible: false 
                        })
                        //this.props.navigation.navigate('mainRoute')
                    }, 2000)
                }
            })
    }

    async claimedListFun() {
        const variables = {}
        console.warn('claim Deal')
        await NodeAPI(variables, `claimDealList`, 'GET', this.state.auth_token)
            //${JSON.parse(dealsIDs)}
            .then(response => {
                console.warn("redeemption screen data---------->", response)
                if (response.status === 200) {
                    this.setState({
                        spinnerVisible: false,
                        claimedDatas: response.mainData
                    })
                }
                else {
                    //alert("else")
                    this.setState({
                        //toastColor: errorColor, 
                        //toastMessage: response.message, 
                        //toastVisible: true, 
                        spinnerVisible: false
                    })
                    setTimeout(() => {
                        this.setState({ toastVisible: false, })
                        //this.props.navigation.navigate('mainRoute')
                    }, 2000)
                }
            })
    }

    _reedemedListView(item, index) {
        return (
            <View style={styles.itemContainerView}>
                {/* deal Image View */}
                <View style={{ flex: 2 }}>
                    <TouchableOpacity style={styles.itemContainerImageView}>
                        <Image style={styles.dealImageView} source={item.dealImage == '' ? require('../../Assets/icons/dummy_image.png') : { uri: `${imageUrl}${item.dealImage}` }} resizeMode="cover" />
                    </TouchableOpacity>
                </View>
                {/* deal detail View */}
                <View style={{ flex: 3, marginTop: hp('1%') }}>
                    <Text numberOfLines={1} style={styles.dealRestoNameText}>{item.restaurantName}</Text>
                    {item.dealsStatus == 'Active' ?
                        <View>
                            <View style={styles.itemContainerTimeDateView}>
                                <Image resizeMode='contain' source={require('../../Assets/icons/watch.png')} />
                                <Text style={styles.itemContainerTimeDateText}>{item.dealExpiryTime} </Text>
                            </View>
                            <View style={styles.itemContainerTimeDateView}>
                                <Image resizeMode='contain' source={require('../../Assets/icons/calendar.png')} />
                                <Text style={styles.itemContainerTimeDateText}>{item.dealExpiryDate}</Text>
                            </View>
                        </View>
                        :
                        <View style={styles.itemContainerTimeDateView}>
                            <Image resizeMode='contain' source={require('../../Assets/icons/expired.png')} />
                            <Text style={[styles.itemContainerTimeDateText, { color: errorColor }]}>{item.dealsStatus} </Text>
                        </View>
                    }
                </View>
                {/* deal menu view View */}
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('DealSummaryScreen', { dealId: item.dealId, redeemedID: item.redeemedId }) }}>
                        <Image resizeMode={'contain'} source={require('../../Assets/icons/menu_2.png')} />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }


    _claimedListView(item, index) {
        return (
            <View style={styles.itemContainerView}>
                {/* deal Image View */}
                <View style={{ flex: 2 }}>
                    <TouchableOpacity style={styles.itemContainerImageView}>
                        <Image style={styles.dealImageView} source={item.dealImage == '' ? require('../../Assets/icons/dummy_image.png') : { uri: `${imageUrl}${item.dealImage}` }} resizeMode="cover" />
                    </TouchableOpacity>
                </View>
                {/* deal detail View */}
                <View style={{ flex: 3, marginTop: hp('1%'), marginLeft: wp('2%') }}>
                    <Text numberOfLines={1} style={styles.dealRestoNameText}>{item.restaurantName}</Text>
                    <View style={styles.itemContainerTimeDateView}>
                        <Image resizeMode='contain' source={require('../../Assets/icons/watch.png')} />
                        <Text style={styles.itemContainerTimeDateText}>{item.dealExpiryTime} </Text>
                    </View>
                    <View style={styles.itemContainerTimeDateView}>
                        <Image resizeMode='contain' source={require('../../Assets/icons/calendar.png')} />
                        <Text style={styles.itemContainerTimeDateText}>{item.dealExpiryDate}</Text>
                    </View>
                </View>
                {/* deal menu view View */}
                <View style={{ flex: 1.5, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('RatingAndReviewsScreen', { dealId: item.dealId, redeemedID: item.redeemedId }) }} >
                        <Image resizeMode={'contain'} source={require('../../Assets/icons/menu_2.png')} />
                    </TouchableOpacity>
                    <View style={styles.itemContainerTimeDateView}>
                        <Image resizeMode='contain' source={item.dealsStatus == "Expired" ? require('../../Assets/icons/expired.png') : require('../../Assets/icons/claimed.png')} />
                        <Text style={[styles.itemContainerTimeDateText, { color: item.dealsStatus == "Expired" ? errorColor : sliderColor }]}>{item.dealsStatus} </Text>
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
                        this.ApiFunc()
                    }
                />
                <Header navigation={navigation} icon={true} menuButton={true} />
                <Loader spinnerVisible={this.state.spinnerVisible} />
                <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />
                <TitleBar
                    initialPage={0}
                    backgroundColor={backgroundColor}
                    borderStyle={{ borderBottomColor: "#111111", borderBottomWidth: 5, }}
                    style={styles.container}
                    titles={['Redeemed', 'Claimed']}>
                    {/* Reedemed  view */}
                    <View style={ConatinerViewWithoutPadding}>
                        <View style={ConatinerViewWithPadding}>
                            {
                                this.state.reedemedDatas.length != 0 ?
                                    <FlatList
                                        data={this.state.reedemedDatas}
                                        extraData={this.state}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item, index }) => this._reedemedListView(item, index)}
                                    />
                                    :
                                    <View style={{ height: hp('80%') }}>
                                       {!this.state.spinnerVisible? <ErrorComponent/>:null}
                                    </View>
                            }
                        </View>
                    </View>

                    {/* Claimed view */}
                    <View style={ConatinerViewWithoutPadding}>
                        <View style={ConatinerViewWithPadding}>
                            {
                                this.state.claimedDatas.length != 0 ?
                                    <FlatList
                                        data={this.state.claimedDatas}
                                        extraData={this.state}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item, index }) => this._claimedListView(item, index)}
                                    />
                                    :
                                    <View style={{ height: hp('80%') }}>
                                    {!this.state.spinnerVisible? <ErrorComponent/>:null}
                                    </View>
                            }
                        </View>
                    </View>
                </TitleBar>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundColor,
        flexDirection: 'column',
    },
    itemContainerView: {
        height: hp('15%'),
        marginTop: hp('2%'),
        flexDirection: 'row',
        borderColor: '#cacaca',
        borderBottomWidth: hp('0.2%')
    },
    itemContainerImageView: {
        height: hp('12%'),
        width: wp('28%'),
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderColor: "#ffffff",
        borderWidth: hp('0.5%'),
        borderRadius: wp('5%')
    },
    itemContainerTimeDateView: {
        marginTop: hp('1%'),
        marginLeft: hp('0.5%'),
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemContainerTimeDateText: {
        marginLeft: wp('2%'),
        fontFamily: fontFamily(),
        fontSize: hp('1.9%'),
        color: '#111111'
    },
    dealImageView:{ 
        height: '100%', 
        width: '100%', 
        borderRadius: 15 
    },
    dealRestoNameText:{ 
        fontFamily: fontFamily('bold'), 
        fontSize: fontSizes('semiSmalltitle') 
    }
});

//make this component available to the app
export default DealsHistoryScreen;




// reedemedData: [
//     {
//         resturentName: 'Sandwhich Cafe',
//         time: "24:04",
//         date: "24/04/2019",
//         dealStatus: 'Active',
//     },
//     {
//         resturentName: 'Roseflower Cafe',
//         time: "24:04",
//         date: "24/04/2019",
//         dealStatus: 'Active',
//     },
//     {
//         resturentName: 'Night hub Cafe',
//         time: "24:04",
//         date: "24/04/2019",
//         dealStatus: 'Expired',
//     },
//     {
//         resturentName: 'Evening hub Cafe',
//         time: "24:04",
//         date: "24/04/2019",
//         dealStatus: 'Active',
//     },
//     {
//         resturentName: 'Roseflower Cafe',
//         time: "24:04",
//         date: "24/04/2019",
//         dealStatus: 'Expired',
//     },
//     {
//         resturentName: 'Sandwhich Cafe',
//         time: "24:04",
//         date: "24/04/2019",
//         dealStatus: 'Active',
//     },
//     {
//         resturentName: 'Sandwhich Cafe',
//         time: "24:04",
//         date: "24/04/2019",
//         dealStatus: 'Expired',
//     },
//     {
//         resturentName: 'Roseflower Cafe',
//         time: "24:04",
//         date: "24/04/2019",
//         dealStatus: 'Expired',
//     }

// ],
// claimedData: [
//     {
//         resturentName: 'Sandwhich Cafe',
//         time: "24:04",
//         date: "24/04/2019",
//         dealStatus: 'Claimed',
//     },
//     {
//         resturentName: 'Roseflower Cafe',
//         time: "24:04",
//         date: "24/04/2019",
//         dealStatus: 'Claimed',
//     },
//     {
//         resturentName: 'Night hub Cafe',
//         time: "24:04",
//         date: "24/04/2019",
//         dealStatus: 'Expired',
//     },
//     {
//         resturentName: 'Evening hub Cafe',
//         time: "24:04",
//         date: "24/04/2019",
//         dealStatus: 'Claimed',
//     },
//     {
//         resturentName: 'Roseflower Cafe',
//         time: "24:04",
//         date: "24/04/2019",
//         dealStatus: 'Expired',
//     },
//     {
//         resturentName: 'Sandwhich Cafe',
//         time: "24:04",
//         date: "24/04/2019",
//         dealStatus: 'Claimed',
//     },
//     {
//         resturentName: 'Sandwhich Cafe',
//         time: "24:04",
//         date: "24/04/2019",
//         dealStatus: 'Expired',
//     },
//     {
//         resturentName: 'Roseflower Cafe',
//         time: "24:04",
//         date: "24/04/2019",
//         dealStatus: 'Expired',
//     }

// ],