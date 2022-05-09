//import liraries
import React, { Component } from 'react';
import { FlatList, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity,ActivityIndicator, Picker, TextInput, Modal, TouchableHighlight, ImageBackground, Platform, StatusBar, AsyncStorage } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor, errorColor, sliderColor, borderLight, borderDark } from '../../Utils/responsive';
import Header from '../../Components/commonHeader';
import { Button1, Button2, ButtonText, ConatinerViewWithPadding, BigHeadingText, SmallTextHeading, TextInputViewWithImage, TextInputView, labelText, TextInputImage, ConatinerViewWithoutPadding } from '../../Utils/commonStyles';
import { Toast, Loader } from '../../Components/modals';
import { NodeAPI, imageUrl } from '../../Services/apiServices';
import { NavigationEvents } from 'react-navigation';
import RatingAndReviewModal from '../../Components/ratingAndReviewModal';
import { Rating, AirbnbRating } from 'react-native-ratings';
import ErrorComponent from '../../Components/errorComponent';
//{!this.state.spinnerVisible? <ErrorComponent/>:null}


const Dis = "Lorem Ipsum is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. When an unknown printer took a galley of type specimen book. Lorem Ipsum is simply dummy text of th printing and typesetting industry. Loerm Ipsum has been the industry's standatd dummy text."
// create a component
class RatingAndReviewsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toastVisible: false,
            spinnerVisible: false,
            ratingFilterVisible: false,
            toastColor: '',
            toastMessage: '',
            auth_token: '',
            dealID: '',
            restaurentData: '',
            ReviewData: [
                // {
                //     reviewerName: 'JONAS ANDREWS',
                //     time: "11:02",
                //     date: '11/09/2020',
                //     description: "Lorem ipsum is simply ddummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s."
                // },
                // {
                //     reviewerName: 'PHILIP ANDREWS',
                //     time: "11:02",
                //     date: '11/09/2020',
                //     description: "Lorem ipsum is simply ddummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s."
                // },
                // {
                //     reviewerName: 'JONAS MATHEW',
                //     time: "11:02",
                //     date: '11/09/2020',
                //     description: "Lorem ipsum is simply ddummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s."
                // },
                // {
                //     reviewerName: 'ANDREWS',
                //     time: "11:02",
                //     date: '11/09/2020',
                //     description: "Lorem ipsum is simply ddummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s."
                // },
                // {
                //     reviewerName: 'JONAS',
                //     time: "11:02",
                //     date: '11/09/2020',
                //     description: "Lorem ipsum is simply ddummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s."
                // },
                // {
                //     reviewerName: 'PHILIP',
                //     time: "11:02",
                //     date: '11/09/2020',
                //     description: "Lorem ipsum is simply ddummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s."
                // },
                // {
                //     reviewerName: 'DAVID ANDREWS',
                //     time: "11:02",
                //     date: '11/09/2020',
                //     description: "Lorem ipsum is simply ddummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s."
                // }
            ],
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

    ApiFunc = async () => {
        const dealID = this.props.navigation.getParam('dealId', '')
        this.setState({
            spinnerVisible: true,
            dealID: dealID
        })
        const value = await AsyncStorage.getItem('auth_token');
        this.setState({
            //spinnerVisible: false,
            auth_token: value
        })
        const variables = {}
        await NodeAPI(variables, `ReviewList/${this.state.dealID}`, 'GET', this.state.auth_token)
            //${JSON.parse(dealsIDs)}
            .then(response => {
                console.warn("review screen data---------->", response)
                if (response.status === 200) {
                    this.setState({
                        spinnerVisible: false,
                        ReviewData: response.ratingData,
                        restaurentData: response.restroData
                    })
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

    modalGetClose = async () => {
        await this.ApiFunc();
        this.setState({ ratingFilterVisible: false })
    }

    // rating Screen list 
    _reviewList(item, index) {
        return (
            <View style={{ marginTop: hp('1.2%'), borderColor: '#cacaca', borderBottomWidth: hp('0.2%') }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1.6 }}>
                        <Text numberOfLines={1} style={{ fontFamily: fontFamily('bold'), fontSize: hp('2%'), color: '#111111' }}>{item.personName}</Text>
                    </View>
                    <View style={{ flex: 1, }}>
                        <AirbnbRating
                            count={5}
                            defaultRating={item.rating}
                            isDisabled={true}
                            showRating={false}
                            onFinishRating={(value) => {
                                console.warn("vvvvvv----->", value)
                            }}
                            starContainerStyle={{ backgroundColor: 'transparent' }}
                            size={hp('3%')}
                        />
                    </View>
                </View>
                <View style={{ width: wp('50%'), flexDirection: 'row', marginTop: hp('0.5%') }}>
                    <View style={{ flex: 1.4, flexDirection: 'row', alignItems: 'center' }}>
                        <Image resizeMode='contain' source={require('../../Assets/icons/calendar.png')} />
                        <Text style={{ marginLeft: hp('1.5%'), fontFamily: fontFamily(), fontSize: hp('1.9%'), color: '#111111' }}>{this.dateConverterOfMilli(item.createdAt)}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Image resizeMode='contain' source={require('../../Assets/icons/watch.png')} />
                        <Text style={{ marginLeft: hp('1.5%'), fontFamily: fontFamily(), fontSize: hp('1.9%'), color: '#111111' }}>{this.timeConverterOfMilli(item.createdAt)}</Text>
                    </View>
                </View>
                <View style={{ marginVertical: hp('1%') }}>
                    <Text numberOfLines={4} style={{ fontFamily: fontFamily(), fontSize: hp('1.8%'), color: '#111111' }}>{item.reviews}</Text>
                </View>
            </View>
        )
    }

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
                    <Header navigation={navigation} title={"Rating and Reviews"} backButtonNavigation={true} transparent={true} whiteIcon={true} call={this.call} />
                </View>
                <RatingAndReviewModal ratingFilterVisible={this.state.ratingFilterVisible} modalGetClose={this.modalGetClose} auth_token={this.state.auth_token} dealId={this.state.dealID} />
                {
                    Object.keys(this.state.restaurentData).length === 0 ? 
                    <View style={{flex:1}}>
                    {!this.state.spinnerVisible? <ErrorComponent/>:
                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <ActivityIndicator size="large" color={"#111111"} />
                        </View>
                        }
                    </View>
                    :
                
                <ScrollView showsVerticalScrollIndicator={false} style={{}}>
                    <Loader spinnerVisible={this.state.spinnerVisible} />
                    <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />

                    <View>
                        <View style={{ height: hp('20%'), width: wp('100%'), position: 'absolute', zIndex: 10, top: 54 }} >
                            <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: hp('5%') }}>
                                <Text numberOfLines={1} style={{ fontFamily: fontFamily('bold'), fontSize: hp('2.5%'), color: "#ffffff" }}>The</Text>
                                <Text numberOfLines={1} style={{ fontFamily: fontFamily('bold'), fontSize: hp('3.5%'), color: "#ffffff" }}>{this.state.restaurentData.restaurantName}</Text>
                                <View style={{ marginTop: hp('2%'), flexDirection: 'row', alignItems: 'center' }}>
                                    <AirbnbRating
                                        count={5}
                                        defaultRating={this.state.restaurentData.rewards}
                                        isDisabled={true}
                                        showRating={false}
                                        onFinishRating={(value) => {
                                            console.warn("vvvvvv----->", value)
                                        }}
                                        starContainerStyle={{ backgroundColor: 'transparent' }}
                                        size={hp('3%')}
                                    />

                                    <Text style={[labelText, { color: "#ffffff", marginLeft: hp('1%') }]}>0 ({this.state.ReviewData.length})</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ height: hp('30%'), width: wp('100%'), position: 'absolute', zIndex: 1, backgroundColor: '#11111170' }} />
                        {/* <Image style={{ height: hp('30%'), width: wp('100%'), zIndex: -1, }} source={{ uri: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' }} /> */}
                        <Image style={{ height: hp('30%'), width: wp('100%') }} source={this.state.restaurentData.dealImage == '' ? require('../../Assets/icons/dummy_image.png') : { uri: `${imageUrl}${this.state.restaurentData.dealImage}` }} />
                        <TouchableOpacity onPress={() => this.setState({ ratingFilterVisible: true })} style={{ position: 'absolute', zIndex: 5, bottom: '-20%', right: '5%' }} >
                            <Image source={require('../../Assets/icons/editor_1.png')} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.whiteFormView, { backgroundColor: this.state.ReviewData.length != 0 ? '#ffffff' : 'transparent', elevation: this.state.ReviewData.length != 0 ? 3 : 0 }]}>
                        <View style={{ padding: wp('5%') }}>
                            {/* description view */}
                            {this.state.ReviewData.length != 0
                                ?
                                <FlatList
                                    data={this.state.ReviewData}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) => this._reviewList(item, index)}
                                />
                                :
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
                                    <Image style={{ height: '40%', width: '90%', marginTop: hp('4%'), tintColor: '#111111' }} resizeMode={'contain'} source={require('../../Assets/sad_emoji.png')} />
                                    <Text style={[SmallTextHeading, { color: 'red', textAlign: 'center', marginTop: hp('2%') }]}>NO DATA FOUND</Text>
                                </View>
                            }

                        </View>
                    </View>


                </ScrollView>
            }

            </View>
        );
    }
}


const styles = StyleSheet.create({
    whiteFormView: {
        //top: hp('0%'),
        marginVertical: hp('5%'),
        borderRadius: wp('5%'),
        marginHorizontal: wp('5%'),

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
export default RatingAndReviewsScreen;
