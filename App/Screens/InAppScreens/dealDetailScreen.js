import React, { Component } from 'react';
import { FlatList, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity,ActivityIndicator, Picker, TextInput, Modal, TouchableHighlight, ImageBackground, Platform, StatusBar, AsyncStorage } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor, errorColor, sliderColor, borderLight, borderDark } from '../../Utils/responsive';
import Header from '../../Components/commonHeader';
import { Button1, ButtonText, ConatinerViewWithPadding, BigHeadingText, SmallTextHeading, TextInputViewWithImage, TextInputView, labelText, TextInputImage, ConatinerViewWithoutPadding } from '../../Utils/commonStyles';
import { Toast, Loader } from '../../Components/modals';
import { NodeAPI, imageUrl } from '../../Services/apiServices';
import { NavigationEvents } from 'react-navigation';
import { ImageModal } from '../../Components/imageViewModal';
import { Rating, AirbnbRating } from 'react-native-ratings';
import openMap from 'react-native-open-maps';
import ErrorComponent from '../../Components/errorComponent';
//{!this.state.spinnerVisible? <ErrorComponent/>:null}

export default class DealDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dealID: '',
            dealDetail: {},
            toastVisible: false,
            spinnerVisible: false,
            toastColor: '',
            toastMessage: '',
            imageModalOpen: false,
            subDeals: [],
            locationCoordinates: [],
            dealTime: {},
            address: '',
            edit: false,
            menuImageData: [],
            intentionId: ''
        };
    }

    ratingCompleted(rating) {
        console.log(`Rating is: ${rating}`);
    }
    // handle text input
    onChange(text, type, index) {

        //this pattern checks for emoji
        var pattern = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/
        if (type == "subdealTitle") {
            let data = this.state.dealDetail.subDeal;
            data[index].subDealTitle = text;
            // data[index].subDealTitleErr = '';
            this.setState({ subDeal: data })
        }
        if (type == "subdealDescription") {
            let data = this.state.dealDetail.subDeal;
            data[index].subDealDescription = text;
            // data[index].subDealDiscriptionErr = '';
            this.setState({ subDeal: data })
        }
    }

    async ApiFunc() {
        this.setState({
            spinnerVisible: true
        })
        const dealID = this.props.navigation.getParam('eventId', '')
        const intentionId = this.props.navigation.getParam('intentionId', '')
        const value = await AsyncStorage.getItem('auth_token');
        //alert(JSON.stringify(dealID))
        var dealsIDs = JSON.stringify(dealID)
        this.setState({ dealID: JSON.parse(dealsIDs), auth_token: value })
        const variables = {}
        await NodeAPI(variables, `dealDetailCustomer/${JSON.parse(dealsIDs)}/${intentionId}`, 'GET')
            //${JSON.parse(dealsIDs)}
            .then(response => {
                console.warn("event deal ---------->", response)
                var menuImage = [];
                var menuImagedata = response.dealDetailData.MenuImage;
                menuImagedata.length >= 0 ?
                    menuImagedata.map(item => {
                        var itemObj = {
                            url: `${imageUrl}${item}`
                        }
                        menuImage.push(itemObj)
                        //console.warn(item);
                    }) :
                    null;
                if (response.status === 200) {
                    this.setState({
                        spinnerVisible: false,
                        dealDetail: response.dealDetailData,
                        subDeals: response.dealDetailData.subDeal,
                        locationCoordinates: response.dealDetailData.location.coordinates,
                        menuImageData: menuImage,
                        intentionId: intentionId
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

    redeemedDeal = async () => {
        this.setState({
            spinnerVisible: true
        })
        var dealsIDs = this.state.dealDetail.dealId;
        var restaurentId = this.state.dealDetail.resturantId;
        var intentionId = this.state.intentionId;
        const variables = {
            dealId: dealsIDs,
            restaurantId: restaurentId,
            IntentionId: intentionId
        }
        await NodeAPI(variables, `redemedDeal`, 'POST', this.state.auth_token)
            //${JSON.parse(dealsIDs)}
            .then(response => {
                console.warn("event deal 11123124234 ---------->", response)
                if (response.status === 200) {
                    setTimeout(() => {
                        this.setState({ spinnerVisible: false })
                        this.props.navigation.navigate('DealSummaryScreen', { dealId: dealsIDs, redeemedID: response.data._id })
                    }, 2000)
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


    _goToLocation(location) {
        //alert('dd')
        console.warn("----------lllll", location)
        openMap({ latitude: location[0], longitude: location[1], zoom: 18 });
    }
    //<Header navigation={navigation} title="Deal Names" backButtonNavigation={true} rightIcon={true} transparent={true} whiteIcon={true} />
    render() {
        const navigation = this.props.navigation;
        return (
            <View style={[ConatinerViewWithoutPadding, {}]}>
                <NavigationEvents
                    onWillFocus={() =>
                        this.ApiFunc()
                    }
                />
                <View style={{ zIndex: 10, position: 'absolute' }}>
                    <Header navigation={navigation} title={''} backButtonNavigation={true} transparent={true} whiteIcon={true} call={this.call} />
                </View>
                {
                    Object.keys(this.state.dealDetail).length === 0 ? 
                    <View style={{flex:1}}>
                    {!this.state.spinnerVisible? <ErrorComponent/>:
                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <ActivityIndicator size="large" color={"#111111"} />
                        </View>
                        }
                    </View>
                   :              
                <ScrollView style={{}}>
                    <Loader spinnerVisible={this.state.spinnerVisible} />
                    <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />
                    <ImageModal imageModal={this.state.imageModalOpen} menuImages={this.state.menuImageData} close={() => this.setState({ imageModalOpen: false })} />
                    <View>
                        <View style={{ height: hp('20%'), width: wp('100%'), position: 'absolute', zIndex: 10, top: 54 }} >
                            <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: wp('5%') }}>
                                <Text style={{ textAlign: 'left', fontFamily: fontFamily('bold'), fontSize: hp('3.5%'), color: "#ffffff" }}>The </Text>
                                <Text style={{ fontFamily: fontFamily('bold'), fontSize: hp('3.8%'), color: "#ffffff", marginLeft: wp('10%') }}>{this.state.dealDetail.restaurantName}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginHorizontal: wp('5%') }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <AirbnbRating
                                        count={5}
                                        defaultRating={this.state.dealDetail.rewards}
                                        isDisabled={true}
                                        showRating={false}
                                        onFinishRating={(value) => {
                                            console.warn("vvvvvv----->", value)
                                        }}
                                        starContainerStyle={{ backgroundColor: 'transparent' }}
                                        size={hp('3%')}
                                    />

                                    <Text style={{ marginLeft: wp('2%'), marginTop: hp('.5%'), fontFamily: fontFamily('bold'), fontSize: hp('2%'), color: '#ffffff' }}>{this.state.dealDetail.rewards} ({this.state.dealDetail.ratingCount})</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('RatingAndReviewsScreen', { dealId: this.state.dealDetail.dealId })} style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: hp('0.5%'), backgroundColor: "#11111190", width: wp('30%'), borderRadius: hp('2%'), }}>
                                        <Text style={[labelText, { fontFamily: fontFamily('bold'), color: "#ffffff" }]}>All Reviews</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                        <View style={{ height: hp('40%'), width: wp('100%'), position: 'absolute', zIndex: 1, backgroundColor: '#11111130' }} />
                        {/* <Image style={{ height: hp('40%'), width: wp('100%') }} source={{ uri: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' }} /> */}
                        <Image style={{ height: hp('40%'), width: wp('100%') }} source={this.state.dealDetail.dealImage == '' ? require('../../Assets/icons/dummy_image.png') : { uri: `${imageUrl}${this.state.dealDetail.dealImage}` }} />
                    </View>

                    <View style={styles.whiteFormView}>
                        <View style={{ margin: wp('5%') }}>
                            {/* location view */}
                            <View style={styles.locationMenuView}>
                                <View style={{ flex: 2, marginBottom: hp('2%') }}>
                                    <Text style={[labelText, styles.headingFormView]}>Location:</Text>
                                    <Text numberOfLines={3} style={[labelText, styles.descriptionText]}>{this.state.dealDetail.address}</Text>
                                </View>
                                <View style={{ flex: 0.6, alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => this._goToLocation(this.state.locationCoordinates)}>
                                        <Image style={{ marginBottom: hp('2%') }} resizeMode={'contain'} source={require('../../Assets/icons/location.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* description view */}
                            <View style={{ marginVertical: hp('2%'), borderBottomColor: '#cacaca', borderBottomWidth: 1 }}>
                                <Text style={[labelText, { fontFamily: fontFamily('bold'), color: '#111111' }]}>Description:</Text>
                                <Text style={[labelText, { fontFamily: fontFamily(), color: '#111111', marginTop: hp('1%'), marginBottom: hp('2%') }]}>{this.state.dealDetail.dealDescription}</Text>
                            </View>
                            {/* menu view */}
                            <View style={[styles.locationMenuView, { borderBottomWidth: 0 }]}>
                                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', marginBottom: hp('2%') }}>
                                    <Text style={[labelText, styles.headingFormView]}>Explore our wide range of dishes</Text>
                                </View>
                                <View style={{ flex: 0.6, alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => this.setState({ imageModalOpen: true })}>
                                        <Image style={{ marginBottom: hp('2%') }} resizeMode={'contain'} source={require('../../Assets/icons/dishes.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* expire time and no of people */}
                    {/* <View style={{ top: -hp('2%'), marginHorizontal: wp('10%'), flexDirection: 'row', zIndex: 10, elevation: 10 }}>
                        <View style={{ flex: 2 }}>
                            <Text style={styles.headingFormView}> Until {this.state.dealDetail.dealExpiryDate}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                            <Image resizeMode={'contain'} style={{ tintColor: '#111111' }} source={require('../../Assets/icons/people.png')} />
                            <Text style={styles.personFonts}>{this.state.dealDetail.peopleLimit} Person</Text>
                        </View>
                    </View> */}
                    {/* deals sub deal */}
                    <View style={[styles.whiteFormView, { top: -hp('3%'), paddingVertical: hp('2%') }]}>

                        {

                            this.state.subDeals.map((item, index) => {
                                return (
                                    <View>
                                        <ImageBackground style={[styles.subDealOfferView, { marginTop: index == 0 ? hp('0%') : hp('2%') }]} resizeMode={'contain'} source={index == 0 ? require("../../Assets/icons/coupon_1.png") : index == 1 ? require("../../Assets/icons/coupon_2.png") : require("../../Assets/icons/coupon_3.png")} >
                                            <View style={styles.imageBackgroundContaintView}>
                                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text numberOfLines={1} style={styles.offerFontText}>{item.subDealTitle}</Text>
                                                    </View>
                                                    <View style={{ flex: 1.6, alignItems: 'center', marginTop: hp('1%')}}>
                                                        <Text numberOfLines={1} style={[styles.personFonts, { color: "#ffffff" }]}>Until {this.state.dealDetail.dealExpiryDate}</Text>
                                                        <View style={{ flexDirection: 'row', marginTop:hp('0.5%') }}>
                                                            <Image resizeMode={'contain'} style={{ tintColor: '#FFFFFF' }} source={require('../../Assets/icons/people.png')} />
                                                            <View style={{ height: hp('3%'), width: wp('20%'), marginLeft:hp('1%'), borderWidth: 1, borderColor: '#ffffff', justifyContent:'center', alignItems:'center' }}>
                                                                <Text style={[styles.personFonts,{color:"#ffffff"}]}>{this.state.dealDetail.guestNumber} People</Text>
                                                            </View>
                                                        </View>

                                                    </View>
                                                </View>
                                                <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: wp('1.5%') }}>
                                                    <Text numberOfLines={2} style={[styles.personFonts, { color: "#ffffff" }]}>{item.subDealDescription}</Text>

                                                </View>
                                            </View>
                                        </ImageBackground>
                                    </View>
                                )
                            })
                        }
                    </View>
                    {/* term and CONDITIONS */}
                    <View style={{ marginHorizontal: wp('10%'), marginTop: hp('2%') }}>
                        <Text style={[labelText, { fontFamily: fontFamily('bold'), color: '#111111' }]}>TERMS AND CONDITIONS:</Text>
                        <Text style={[labelText, { fontFamily: fontFamily(), color: '#111111', marginTop: hp('2%'), textAlign: 'auto' }]}>{this.state.dealDetail.termsAndCondition}</Text>
                    </View>

                    <TouchableOpacity onPress={() => { this.redeemedDeal() }} style={[Button1, { marginHorizontal: wp('12%'), marginVertical: hp('5%') }]}>
                        <Text style={ButtonText}>Redeem</Text>
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
        zIndex: 5
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