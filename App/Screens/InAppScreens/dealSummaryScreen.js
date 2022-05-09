//import liraries
import React, { Component } from 'react';
import { FlatList, ScrollView, View, Text,ActivityIndicator, StyleSheet, Image, TouchableOpacity, Picker, TextInput, Modal, TouchableHighlight, ImageBackground, Platform, StatusBar, AsyncStorage, Share } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor, errorColor, sliderColor, borderLight, borderDark } from '../../Utils/responsive';
import Header from '../../Components/commonHeader';
import { Button1, Button2, ButtonText, ConatinerViewWithPadding, BigHeadingText, SmallTextHeading, TextInputViewWithImage, TextInputView, labelText, TextInputImage, ConatinerViewWithoutPadding } from '../../Utils/commonStyles';
import { Toast, Loader } from '../../Components/modals';
import { NodeAPI, imageUrl } from '../../Services/apiServices';
import { NavigationEvents } from 'react-navigation';
import { openMap, createOpenLink } from 'react-native-open-maps';
import ClamDealModal from '../../Components/clamDealModal';
import { connect } from 'react-redux';
import * as locationAction from '../../app_redux/actions/locationAction';
import firebase from 'react-native-firebase';
import ErrorComponent from '../../Components/errorComponent';


const Dis = "Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. When an unknown printer took a galley of type specimen book. Lorem Ipsum is simply dummy text of th printing and typesetting industry. Loerm Ipsum has been the industry's standatd dummy text."

// const start = 'etah, UP, In'
// const end = 'GIP, Noida, In'
const travleType = 'public_transport'
// create a component
class DealSummaryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toastVisible: false,
            spinnerVisible: true,
            toastColor: '',
            toastMessage: '',
            ClamVisible: false,
            dealDetail: {},
            auth_token: ''

        };
    }


    dateConverterOfMilli(dateMilliSecond) {
        var date = new Date(dateMilliSecond)
        var year = date.getFullYear();
        var month = date.getMonth('MMMM');
        var day = date.getDate();
        date = (day < 10 ? '0' + day : day) + '/' + (month + 1 < 9 ? '0' + (month + 1) : (month + 1)) + '/' + year
        return date
    }
    timeConverterOfMilli(dateMilliSecond) {
        var date = new Date(dateMilliSecond)
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var second = date.getSeconds();
        time = (hour < 10 ? '0' + hour : hour) + ':' + (minutes < 10 ? '0' + minutes : minutes)
        return time
    }

    call = () => {
        this.props.navigation.navigate('AddDealScreen', { dealDetails: this.state.dealDetail, dealID: this.state.dealID, edit: true })
        // var data = this.state.edit;
        // data = !data;
        // this.setState({ edit: data })
    }

    ApiFunc = async () => {
        this.setState({
            spinnerVisible: true,
        })
        const value = await AsyncStorage.getItem('auth_token');
        var dealId = this.props.navigation.getParam('dealId', '');
        var redeemedID = this.props.navigation.getParam('redeemedID', '');
        this.setState({
            auth_token: value
        })
        const variables = {}
        await NodeAPI(variables, `dealDetailSummary/${dealId}/${redeemedID}`, 'GET')
            //${JSON.parse(dealsIDs)}
            .then(response => {
                console.warn("event summeryyy ---------->", response)
                if (response.status === 200) {
                    this.setState({
                        spinnerVisible: false,
                        dealDetail: response.dealDetailData, //----------- uncomment
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

    _claimDealapi1 = async () => {
        this.setState({
            spinnerVisible: true,
        })
        const variables = {
            dealId: this.state.dealDetail.dealId,
        }
        await NodeAPI(variables, `claimDeal`, 'POST', this.state.auth_token)
            //${JSON.parse(dealsIDs)}
            .then(response => {

                if (response.status === 200) {
                    console.warn("event summeryyy inside---------->", response)
                    this.setState({
                        spinnerVisible: false,
                        ClamVisible: true
                    }, () => { console.warn('staet.....>>>', this.state.ClamVisible) })
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
        //this.setState({ ClamVisible: true })
    }

    modalGetClose = (bool) => {
        this.setState({ ClamVisible: false })
       // this.props.navigation.navigate('HomeScreen')
    }
    claimedDeal = (bool) => {
        this.setState({ ClamVisible: false })
        this.props.navigation.navigate('HomeScreen')
    }

    //https://gratiphycustomer.page.link/share
    //com.gratiphycustomer
    onShare = async (id) => {
        console.warn('id', id)
        const link =
            Platform.OS === 'android' ? await new firebase.links.DynamicLink(`https://gratiphycustomer.page.link/share?&invitedby=${id}`, 'https://gratiphycustomer.page.link/share')
                .android.setPackageName('com.gratiphycustomer') :
                await new firebase.links.DynamicLink(`https://gratiphycustomer.page.link/share?&invitedby=${id}`, 'https://gratiphycustomer.page.link/share')
                    .ios.setBundleId('com.gratiphycustomer')
                    .ios.setAppStoreId('1477037442');
        firebase.links()
            .createDynamicLink(link)
            .then((url) => {
                console.log('url', url)
                try {
                    const result = Share.share({
                        message:
                            url
                    });

                    if (result.action === Share.sharedAction) {
                        if (result.activityType) {
                            // shared with activity type of result.activityType
                        } else {
                            // shared
                        }
                    } else if (result.action === Share.dismissedAction) {
                        // dismissed
                    }
                } catch (error) {
                    // alert(error.message);
                }
            });
    };

    render() {
        const navigation = this.props.navigation;
        if (this.props.currentLocationData != '') {
            var start = this.props.currentLocationData.formatted_address;
            console.warn("lllllll-------uuuu--->",this.props.currentLocationData.formatted_address)
        }

        var end = this.state.dealDetail.address;
       // console.warn('iiiiiiiilllll------>', this.props.currentLocationData.candidates[0].formatted_address)
        return (
            <View style={[ConatinerViewWithoutPadding, {}]}>
                <NavigationEvents
                    onWillFocus={() =>
                        this.ApiFunc()
                    }
                />
                <ClamDealModal ClamVisible={this.state.ClamVisible} modalGetClose={this.modalGetClose} claimedDeal={this.claimedDeal} dealId={this.state.dealDetail.dealId} auth_token={this.state.auth_token} />
                <View style={{ zIndex: 10, position: 'absolute' }}>
                    <Header navigation={navigation} title={"Summary"} backButtonNavigation={true} transparent={true} whiteIcon={Object.keys(this.state.dealDetail).length === 0 ? false : true} call={this.call} />
                </View>
                {
                    Object.keys(this.state.dealDetail).length === 0 ?
                        <View style={ConatinerViewWithoutPadding}>
                        {!this.state.spinnerVisible?<ErrorComponent />:
                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <ActivityIndicator size="large" color={"#111111"} />
                        </View>
                        }
                        </View> :
                        <ScrollView showsVerticalScrollIndicator={false} style={{}}>
                            <Loader spinnerVisible={this.state.spinnerVisible} />
                            <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />

                            <View>
                                <View style={{ height: hp('20%'), width: wp('100%'), position: 'absolute', zIndex: 10, top: 54 }} >
                                    <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: hp('5%') }}>
                                        <Text numberOfLines={1} style={{ fontFamily: fontFamily('bold'), fontSize: hp('3.5%'), color: "#ffffff" }}>{this.state.dealDetail.restaurantName}</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: hp('5%') }}>
                                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: hp('0.5%'), backgroundColor: errorColor, width: wp('40%'), borderRadius: hp('.5%'), }}>
                                            <Text numberOfLines={1} style={[labelText, { fontFamily: fontFamily('bold'), color: "#ffffff" }]}>{this.state.dealDetail.dealTitle} </Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                                <View style={{ height: hp('40%'), width: wp('100%'), position: 'absolute', zIndex: 1, backgroundColor: '#11111130' }} />
                                {/* <Image style={{ height: hp('40%'), width: wp('100%') }} source={{ uri: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' }} /> */}
                                <Image style={{ height: hp('40%'), width: wp('100%') }} source={this.state.dealDetail.dealImage == '' ? require('../../Assets/icons/dummy_image.png') : { uri: `${imageUrl}${this.state.dealDetail.dealImage}` }} />
                            </View>

                            <View style={styles.whiteFormView}>
                                <View style={{ padding: wp('5%') }}>
                                    {/* description view */}
                                    <View style={{ marginVertical: hp('2%'), borderBottomColor: '#cacaca', borderBottomWidth: 1 }}>
                                        <Text style={[labelText, { fontFamily: fontFamily('bold'), color: '#111111' }]}>Description:</Text>
                                        <Text style={[labelText, { fontFamily: fontFamily(), color: '#111111', marginTop: hp('1%'), marginBottom: hp('2%') }]}>{this.state.dealDetail.dealDescription}</Text>
                                    </View>
                                    {/* deal vlidity view */}
                                    <View style={{ marginVertical: hp('2%'), borderBottomColor: '#cacaca', borderBottomWidth: 0 }}>
                                        <Text style={[labelText, { fontFamily: fontFamily('bold'), color: '#111111' }]}>Deal Validity:</Text>
                                        <View style={{ flex: 1, flexDirection: 'row', }}>
                                            <Text style={labelText}>Until</Text>
                                            <View style={{ flex: 1.4, flexDirection: 'row', alignItems: 'center', marginHorizontal: wp('2%') }}>
                                                <Image resizeMode='contain' source={require('../../Assets/icons/calendar.png')} />
                                                <Text style={labelText}> {this.state.dealDetail.dealExpiryDate}</Text>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                <Image resizeMode='contain' source={require('../../Assets/icons/watch.png')} />
                                                <Text style={labelText}> {this.state.dealDetail.dealExpiryTime}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginVertical: hp('2%'), borderBottomColor: '#cacaca', borderBottomWidth: 0 }}>
                                        <View style={{ flex: 1, }}>
                                            <Text style={[labelText, { fontFamily: fontFamily('bold'), color: '#111111' }]}>Number of people: {this.state.dealDetail.guestNumber}</Text>
                                        </View>
                                        <View style={{ flex: 1, }}>
                                            <Text style={[labelText, { fontFamily: fontFamily('bold'), color: '#111111' }]}>Status: {this.state.dealDetail.status}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginVertical: hp('2%'), justifyContent: 'space-between', alignItems: 'center', borderBottomColor: '#cacaca', borderBottomWidth: 0 }}>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={createOpenLink({ travleType, start, end, zoom: 10 })}>
                                                <Image resizeMode={'contain'} source={require('../../Assets/icons/location.png')} />
                                            </TouchableOpacity>
                                            <Text style={{ fontFamily: fontFamily(), fontSize: hp('1.5%'), color: errorColor }}>View Directions</Text>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => this.onShare(this.state.dealDetail.dealId)}>
                                                <Image resizeMode={'contain'} source={require('../../Assets/icons/share.png')} />
                                            </TouchableOpacity>
                                            <Text style={{ fontFamily: fontFamily(), fontSize: hp('1.5%'), color: errorColor }}>Share</Text>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('RatingAndReviewsScreen', { dealId: this.state.dealDetail.dealId })}>
                                                <Image resizeMode={'contain'} source={require('../../Assets/icons/r8.png')} />
                                            </TouchableOpacity>
                                            <Text style={{ fontFamily: fontFamily(), fontSize: hp('1.5%'), color: errorColor }}>Write a Reviews</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => this._claimDealapi1()} style={[Button2, { marginHorizontal: wp('12%'), marginVertical: hp('1%') }]}>
                                <Text style={ButtonText}>Claim Deal</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={[Button1, { marginHorizontal: wp('12%'), marginVertical: hp('2%') }]}>
                                <Text style={ButtonText}>Cancel</Text>
                            </TouchableOpacity>

                        </ScrollView>
                }


            </View>
        );
    }
}


const styles = StyleSheet.create({
    whiteFormView: {
        top: -hp('10%'),
        backgroundColor: '#ffffff',
        borderRadius: wp('5%'),
        marginHorizontal: wp('5%'),
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    locationMenuView: {
        flexDirection: 'row',
        borderBottomColor: '#cacaca',
        borderBottomWidth: 1
    },
    headingFormView: {
        fontFamily: fontFamily('bold'),
        color: '#111111'
    },
    descriptionText: {
        fontFamily: fontFamily(),
        color: '#111111',
        marginTop: hp('1%')
    },
    personFonts: {
        fontFamily: fontFamily(),
        fontSize: hp('1.7%'),
        marginLeft: wp('1%'),
        color: "#111111"
    },
    subDealOfferView: {
        height: hp('15%')
    },
    imageBackgroundContaintView: {
        marginHorizontal: hp('3%'),
        marginTop: hp('.5%'),
        height: hp('14%')
    },
    offerFontText: {
        fontFamily: fontFamily('bold'),
        fontSize: hp('3.5%'),
        color: "#ffffff"
    }
})

//make this component available to the app
export default connect(
    state => ({
        currentLocationData: state.SaveLocationReducer.locationData
    }), { ...locationAction })(DealSummaryScreen)

