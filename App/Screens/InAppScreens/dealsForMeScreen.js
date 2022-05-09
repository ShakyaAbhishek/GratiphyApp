//import liraries
import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ActivityIndicator, PermissionsAndroid, AsyncStorage } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor, sliderColor, errorColor, borderLight, borderDark } from '../../Utils/responsive';
import Header from '../../Components/commonHeader';
import { Swiper, TitleBar, TabBar } from '../../Components/react-native-awesome-viewpager';
import { Button1, Button2, ButtonText, ConatinerViewWithPadding, BigHeadingText, SmallTextHeading, TextInputViewWithImage, TextInputView, labelText, TextInputImage, textInputMargin, ConatinerViewWithoutPadding } from '../../Utils/commonStyles';
import { FlatList } from 'react-native-gesture-handler';
import { Toast, Loader } from '../../Components/modals';
import FilterModal from '../../Components/filterFuctionModal';
import { imageUrl, NodeAPIForm, NodeAPI } from '../../Services/apiServices';
import { NavigationEvents } from 'react-navigation';
import { Rating, AirbnbRating } from 'react-native-ratings';
import ErrorComponent from '../../Components/errorComponent';
//{!this.state.spinnerVisible? <ErrorComponent/>:null}


// create a component
class DealsForMeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toastVisible: false,
            spinnerVisible: true,
            FilterVisible: false,
            toastColor: '',
            toastMessage: '',
            popularListDatas: [],
            featuredListDatas: [],
            allDealList: [],
            loading: false,
            updatesEnabled: false,
            location: [],
            currentLocation: {
                latitude: '',
                longitude: ''
            },
            //intenstion screen data
            address: '',
            noOfPeople: '',
            time: '',
            restaurantCount: '',
            auth_token:''
        };
    }

    async getAllDealsData() {
        var address = this.props.navigation.getParam('address', '');
        var noOfPeople = this.props.navigation.getParam('noOfPeople', '');
        var time = this.props.navigation.getParam('time', '');
        var foodType = this.props.navigation.getParam('foodType', '');
        const value = await AsyncStorage.getItem('auth_token');
        this.setState({
            address: address,
            noOfPeople: noOfPeople,
            time: time,
            foodType: foodType,
            auth_token: value
        }, () => console.warn('submil data get data', this.state.address, this.state.noOfPeople, this.state.time, this.state.foodType))
        //await this.currentLocationFun();
        setTimeout(async()=>{
            await this.getDeals();
        },100) 
        //await this.getFeaturedDeal();
        // await this.getDeals();
    }

    async getDeals() {
        this.setState({ spinnerVisible: true })
        let variables = {
            coordinates: this.state.address.location,
            peopleNumber: this.state.noOfPeople,
            expectedTime: this.state.time
        }
        return NodeAPI(variables, "dealListCustomer", 'POST', this.state.auth_token)
            .then(response => {
                console.warn("deals list----------------------->  =", response)
                if (response.status === 200) {
                    console.warn('respons data profile ====>', response)
                    this.setState({
                        //popularListDatas: response.popularDeals,
                        allDealList: response.allDeals,
                        popularListDatas: response.popularDeals,
                        featuredListDatas: response.featuredDeals,
                        restaurantCount: response.restaurantCount

                    })
                    setTimeout(() => {
                        this.setState({ spinnerVisible: false })
                    }, 3000)
                }
                else {
                    this.setState({ toastColor: errorColor, toastMessage: response.message, toastVisible: true })
                    setTimeout(() => {
                        this.setState({ toastVisible: false, spinnerVisible: false })
                        //this.props.navigation.navigate('mainRoute')
                    }, 4000)
                }

            })
    }

    modalGetClose = (bool) => {
        this.setState({ FilterVisible: false })
    }

    submitModalButton = (data, bool) => {
        this.setState({ spinnerVisible: true })
        let variables = {
            coordinates: this.state.address.location,
            peopleNumber: this.state.noOfPeople,
            expectedTime: this.state.time,
            price: data.price,
            distance: data.distance
        }
        return NodeAPI(variables, "dealListCustomer", 'POST', this.state.auth_token)
            .then(response => {
                console.warn("deals list----------------------->  =", response)
                if (response.status === 200) {
                    console.warn('respons data profile ====>', response)
                    this.setState({
                        //popularListDatas: response.popularDeals,
                        allDealList: response.allDeals,
                        popularListDatas: response.popularDeals,
                        featuredListDatas: response.featuredDeals,
                        restaurantCount: response.restaurantCount,
                        FilterVisible: false

                    })
                    setTimeout(() => {
                        this.setState({ spinnerVisible: false })
                    }, 500)
                }
                else {
                    //alert(response)
                    this.setState({ spinnerVisible: false })
                }

            })
    }


    // Horizontal flatlist function 
    _featuredList(item, index) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('DealDetailScreen', { eventId: item._id, intentionId: item.IntentionId })}>
                <View style={[styles.featuredListView, { marginRight: this.state.featuredListDatas.length - 1 == index ? hp('20%') : hp('0%') }]} >
                    <Image style={styles.shadowImageView} resizeMode={'cover'} source={require('../../Assets/icons/blur.png')} />
                    <Image style={styles.dealImageView} resizeMode={'cover'} source={item.dealImage == '' ? require('../../Assets/icons/dummy_image.png') : { uri: `${imageUrl}${item.dealImage}` }} />
                    {/* <Image style={styles.dealImageView} resizeMode={'cover'} source={{ uri: 'http://static.asiawebdirect.com/m/bangkok/portals/bangkok-com/homepage/food-top10/pagePropertiesImage/thai-som-tum.jpg.jpg' }} /> */}
                    <View style={styles.dealTextView}>
                        <Text style={[labelText, { color: "#ffffff", fontFamily: fontFamily('bold') }]}>{item.restaurentName}</Text>
                        <AirbnbRating
                            count={5}
                            defaultRating={item.rating}
                            isDisabled={true}
                            showRating={false}
                            starContainerStyle={{ backgroundColor: 'transparent' }}
                            size={hp('2%')}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    // Vertical popular flatlist function 
    _popularList(item, index) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('DealDetailScreen', { eventId: item._id, intentionId: item.IntentionId })}>
                <View style={styles.allPopContainerView}>
                    <Image style={styles.shadowImageView} resizeMode={'cover'} source={require('../../Assets/icons/blur.png')} />
                    <Image style={styles.dealImageView} resizeMode={'cover'} source={item.dealImage == '' ? require('../../Assets/icons/dummy_image.png') : { uri: `${imageUrl}${item.dealImage}` }} />
                    {/* <Image style={styles.dealImageView} resizeMode={'cover'} source={{ uri: 'http://static.asiawebdirect.com/m/bangkok/portals/bangkok-com/homepage/food-top10/pagePropertiesImage/thai-som-tum.jpg.jpg' }} /> */}
                    <ImageBackground resizeMode='contain' style={styles.offerImageView} source={require('../../Assets/icons/offer2.png')}>
                        <View style={styles.offerImageTextView} >
                            <Text numberOfLines={2} style={styles.offerImageText} >{item.dealTitle}</Text>
                        </View>
                    </ImageBackground>
                    <View style={styles.dealTextView}>
                        <Text style={[labelText, { color: "#ffffff", fontFamily: fontFamily('bold') }]}>{item.restaurantName}</Text>
                        <AirbnbRating
                            count={5}
                            defaultRating={item.rating}
                            isDisabled={true}
                            showRating={false}
                            starContainerStyle={{ backgroundColor: 'transparent' }}
                            size={hp('2.5%')}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    // Vertical popular flatlist function 
    _AllDealList(item, index) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('DealDetailScreen', { eventId: item._id, intentionId: item.IntentionId })}>
                <View style={styles.allPopContainerView}>
                    <Image style={styles.shadowImageView} resizeMode={'cover'} source={require('../../Assets/icons/blur.png')} />
                    <Image style={styles.dealImageView} resizeMode={'cover'} source={item.dealImage == '' ? require('../../Assets/icons/dummy_image.png') : { uri: `${imageUrl}${item.dealImage}` }} />
                    {/* <Image style={styles.dealImageView} resizeMode={'cover'} source={{ uri: 'http://static.asiawebdirect.com/m/bangkok/portals/bangkok-com/homepage/food-top10/pagePropertiesImage/thai-som-tum.jpg.jpg' }} /> */}
                    <ImageBackground resizeMode='contain' style={styles.offerImageView} source={require('../../Assets/icons/offer2.png')}>
                        <View style={styles.offerImageTextView} >
                            <Text numberOfLines={2} style={styles.offerImageText} >{item.dealTitle}</Text>
                        </View>
                    </ImageBackground>
                    <View style={styles.dealTextView}>
                        <Text style={[labelText, { color: "#ffffff", fontFamily: fontFamily('bold') }]}>{item.restaurantName}</Text>
                        <AirbnbRating
                            count={5}
                            defaultRating={item.rating}
                            isDisabled={true}
                            showRating={false}
                            starContainerStyle={{ backgroundColor: 'transparent' }}
                            size={hp('2.5%')}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    // renderFooter=()=>{
    //     return(
        // {
        //     this.state.isLoading ?
        //     <View style={styles.loader}>
        //     <ActivityIndicator size="large" color={"#111111"} />
        //  </View>
        //     :
        //     null
        // }
  
    //     )
    // };

    // hendleLoadMore=()=>{
    //     this.setState({
    //         page: this.state.page + 1
    //     }, ()=> this.load api)
    // }
   
    render() {
        const navigation = this.props.navigation;
        // console.warn("ffffffddddddd====>",this.state.popularListDatas.length)
        return (
            <View style={ConatinerViewWithoutPadding}>
                <NavigationEvents
                    onWillFocus={() =>
                        this.getAllDealsData()
                    }
                />
                <Header navigation={navigation} icon={true} menuButton={true} />
                <Loader spinnerVisible={this.state.spinnerVisible} />
                <FilterModal FilterVisible={this.state.FilterVisible} modalGetClose={this.modalGetClose} submitModalButton={this.submitModalButton} location={this.state.address} />
                <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />
                <TitleBar
                    initialPage={0}
                    backgroundColor={backgroundColor}
                    borderStyle={{ borderBottomColor: "#111111", borderBottomWidth: 5, }}
                    style={styles.container}
                    titles={['Deals for you', 'All Deals']}>
                    {/* Deals for me  view */}
                    <View >
                        {/* resto count View */}
                        <View style={styles.restoCountFilterView}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.restoCountView}>
                                    <Text style={styles.restoCountText}>{this.state.restaurantCount} Restaurants</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => { this.setState({ FilterVisible: true }) }}>
                                    <Image resizeMode={'contain'} source={require('../../Assets/icons/filter.png')} />
                                </TouchableOpacity>

                            </View>
                        </View>
                        <ScrollView style={{ flex: 1, paddingTop: hp('6%') }} showsVerticalScrollIndicator={false}>
                            {/* horizontal list featured list view */}
                            {this.state.featuredListDatas.length != 0
                                ?
                                <View style={{ height: hp('25%'), justifyContent: 'space-between' }}>
                                    <View style={{ marginHorizontal: wp('5%') }}>
                                        <Text style={[labelText, { fontFamily: fontFamily('bold'), marginLeft: hp('3%') }]}>Featured Deals</Text>
                                    </View>
                                    <FlatList
                                        style={{ width: wp('100%'), height: hp('28%'), marginTop: hp('0.7%') }}
                                        data={this.state.featuredListDatas}
                                        extraData={this.state}
                                        horizontal={true}
                                        // initialScrollIndex={Math.floor(this.state.featuredListData.length / 2)}
                                        contentContainerStyle={{ marginLeft: hp('10%') }}
                                        //initialScrollIndex={1}
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={({ item, index }) => this._featuredList(item, index)}
                                    />
                                </View>
                                :
                                null
                            }
                            {/* Vertical list popular list view */}

                            <View style={{ marginTop: wp('2%'), justifyContent: 'space-between' }}>
                                <View>
                                    <Text style={[labelText, { fontFamily: fontFamily('bold'), marginLeft: hp('5%') }]}>Popular Deals</Text>
                                </View>
                                {
                                    this.state.popularListDatas.length != 0
                                        ?
                                        <FlatList
                                            style={styles.verticalListView}
                                            data={this.state.popularListDatas}
                                            extraData={this.state}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item, index }) => this._popularList(item, index)}
                                            // onEndReached={this.hendleLoadMore}
                                            // onEndReachedThreshold={0}
                                            // ListFooterComponent={this.renderFooter}
                                        />
                                        :
                                        <View style={{ height: hp('60%') }}>
                                        {!this.state.spinnerVisible? <ErrorComponent/>:null}
                                        </View>
                                }
                            </View>
                        </ScrollView>
                    </View>

                    {/* All deals  view */}
                    <View >
                        {/* resto count View */}
                        <View style={styles.restoCountFilterView}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.restoCountView}>
                                    <Text style={styles.restoCountText}>{this.state.restaurantCount} Restaurants</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => { this.setState({ FilterVisible: true }) }}>
                                    <Image resizeMode={'contain'} source={require('../../Assets/icons/filter.png')} />
                                </TouchableOpacity>

                            </View>
                        </View>
                        <ScrollView style={{ flex: 1, paddingTop: hp('6%') }} showsVerticalScrollIndicator={false}>
                            {/* Vertical list popular list view */}
                            <View style={{ marginTop: wp('2%'), justifyContent: 'space-between' }}>
                                <View>
                                    <Text style={[labelText, { fontFamily: fontFamily('bold'), marginLeft: hp('5%') }]}>All Deals</Text>
                                </View>
                                {
                                    this.state.allDealList.length != 0
                                        ?
                                        <FlatList
                                            style={styles.verticalListView}
                                            data={this.state.allDealList}
                                            extraData={this.state}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item, index }) => this._AllDealList(item, index)}
                                        />
                                        :
                                        <View style={{ height: hp('60%') }}>
                                        {!this.state.spinnerVisible? <ErrorComponent/>:null}
                                        </View>
                                }
                            </View>
                        </ScrollView>
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
    restoCountFilterView: {
        flexDirection: 'row',
        marginTop: hp('0%'),
        alignItems: 'center',
        marginHorizontal: wp('5%'),
        position: 'absolute',
        zIndex: 10,
    },
    restoCountView: {
        height: hp('3%'),
        borderColor: borderDark,
        borderRadius: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor:borderLight,
        width: wp('40%')
    },
    restoCountText: {
        fontFamily: fontFamily('bold'),
        fontSize: fontSizes('verySmalltitle'),
        textAlign: 'center'
    },
    featuredListView: {
        height: hp('20%'),
        marginHorizontal: wp('2%'),
        width: wp('60%'),
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: hp('3%'),
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        alignSelf: 'center'
    },
    shadowImageView: {
        height: '100%',
        width: '100%',
        zIndex: 10,
        position: 'absolute',
        borderRadius: 20
    },
    dealImageView: {
        height: '100%',
        width: '100%',
        borderRadius: 20
    },
    dealTextView: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        zIndex: 10
    },
    offerImageView: {
        position: 'absolute',
        alignSelf: 'flex-end',
        height: hp('5%'),
        width: wp('21%'),
        right: 0,
        top: 40,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    offerImageTextView: {
        marginLeft: wp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 2
    },
    offerImageText:{ 
        color: '#ffffff', 
        fontSize: hp('1.5%'), 
        fontWeight: '500'
     },
    allPopContainerView:{
        height: hp('28%'), 
        width: wp('87%'), 
        margin: wp('2%'), 
        borderColor: '#ffffff', 
        borderWidth: 2, 
        borderRadius: hp('3%'), 
        elevation: 3, 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    verticalListView:{ 
        marginHorizontal: wp('5%'), 
        marginTop: hp('1%'), 
        marginBottom: hp('6%') 
    },
    loader:{
        marginTop:hp('2%'),
        alignItems:'center'
    }

});

//make this component available to the app
export default DealsForMeScreen;











// featuredListData: [
//     {
//         restaurentName: 'Sandwhich Cafe',
//         image: ''
//     },
//     {
//         restaurentName: 'Pizza Cafe',
//         image: ''
//     },
//     {
//         restaurentName: 'Rolls Cafe',
//         image: ''
//     },
//     {
//         restaurentName: 'Food Cafe',
//         image: ''
//     },
//     {
//         restaurentName: 'Coffee Cafe',
//         image: ''
//     },
//     {
//         restaurentName: 'Sutta Cafe',
//         image: ''
//     },
// ],
// popularListData: [
//     {
//         restaurentName: 'Sandwhich Cafe',
//         image: ''
//     },
//     {
//         restaurentName: 'Pizza Cafe',
//         image: ''
//     },
//     {
//         restaurentName: 'Rolls Cafe',
//         image: ''
//     },
//     {
//         restaurentName: 'Food Cafe',
//         image: ''
//     },
//     {
//         restaurentName: 'Coffee Cafe',
//         image: ''
//     },
//     {
//         restaurentName: 'Sutta Cafe',
//         image: ''
//     },
// ],