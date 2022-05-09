import React, { Component } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator, AsyncStorage, Dimensions, Image, TextInput, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor, errorColor, borderLight, borderDark, sliderColor } from '../Utils/responsive';
import Modal from "react-native-modal";
import { labelText, SmallTextHeading } from '../Utils/commonStyles';
import MultiSlider from './react-native-multi-slider';
import { SafeAreaView } from 'react-navigation';
import MapView, { PROVIDER_GOOGLE, MapKit } from 'react-native-maps';
import { connect } from 'react-redux';
import * as locationAction from '../app_redux/actions/locationAction';



const RADIUS = 500;
const LATITUDE = 28.502935;
const LONGITUDE = 77.411315;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;//LATITUDE_DELTA * ASPECT_RATIO;
class FilterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterType: 'cuisines',
            CuisinesData: [
                {
                    status: true,
                    cuisinesType: "Chinese Cuisines",
                },
                {
                    status: false,
                    cuisinesType: "Indian Cuisines",
                },
                {
                    status: false,
                    cuisinesType: "Mexican Cuisines",
                },
                {
                    status: false,
                    cuisinesType: "Italian Cuisines",
                },
                {
                    status: false,
                    cuisinesType: "French Cuisines",
                },
                {
                    status: false,
                    cuisinesType: "Thai Cuisines",
                },
            ],
            region: {
                LATITUDE: 28.502935,
                LONGITUDE: 77.411315,
                LATITUDE_DELTA: 0.0922,
                LONGITUDE_DELTA: 0.0421,
            },
            DistanceKM: 15,
            priceRange:[2, 3]
        }
    }

    _cuisinesSelection(item, index) {
        //alert(index)
        var data = this.state.CuisinesData;
        data[index].status = !data[index].status;
        this.setState({
            CuisinesData: data
        })
    }

    _clearAllCuisines() {
        var data = this.state.CuisinesData;
        for (var i = 0; i <= data.length - 1; i++) {
            data[i].status = false;
        }
        this.setState({ CuisinesData: data })
    }

    // handle text input
    onChange(text, type, index) {

        //this pattern checks for emoji
        var pattern = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/
        if (type == "DistanceKM") {
            this.setState({
                DistanceKM: text.replace(/[^0-9]/g, ''),
                //errMessageArr: []
            });
        }
    }

    addNoPeople = () => {
        this.setState({
            DistanceKM: this.state.DistanceKM == '' ? 0 + 1 : parseInt(this.state.DistanceKM) + 1,
            // noOfPeopleErr: '',
            // errMessageArr: []
        })
    }

    rangeChange = (value) => {
       this.setState({
        priceRange: value
       },()=>console.warn('range value', this.state.priceRange))
    }



    render() {
        var location = this.props.location.location;
        //console.warn("pfkadsfdsajgs---------->",this.props.location.location);
        return (
            <Modal
                isVisible={this.props.FilterVisible}
                onSwipeComplete={() => this.props.modalGetClose(false)}
                swipeDirection={['down']}
                deviceWidth={wp('100%')}
                deviceHeight={hp('100%')}
                style={styles.modalContainerView}
            >

                <View style={styles.whiteContainerView}>
                    {/* Cross button view */}
                    <TouchableOpacity onPress={() => this.props.modalGetClose(false)}>
                        <Image source={require('../Assets/icons/cross.png')} />
                    </TouchableOpacity>
                    {/* filter button ViewS */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: hp('3%') }}>
                        <TouchableOpacity onPress={() => this.setState({ filterType: 'cuisines' })} style={[styles.buttonViews, { backgroundColor: this.state.filterType == 'cuisines' ? "#111111" : borderDark, }]}>
                            <Text style={[labelText, { fontFamily: fontFamily('bold'), color: this.state.filterType == 'cuisines' ? "#ffffff" : "#111111" }]}>Cuisines</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ filterType: 'price' })} style={[styles.buttonViews, { backgroundColor: this.state.filterType == 'price' ? "#111111" : borderDark, }]}>
                            <Text style={[labelText, { fontFamily: fontFamily('bold'), color: this.state.filterType == 'price' ? "#ffffff" : "#111111" }]}>Price</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ filterType: 'distance' })} style={[styles.buttonViews, { backgroundColor: this.state.filterType == 'distance' ? "#111111" : borderDark, }]}>
                            <Text style={[labelText, { fontFamily: fontFamily('bold'), color: this.state.filterType == 'distance' ? "#ffffff" : "#111111" }]}>Distance</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.filterType == 'cuisines' ?
                            <ScrollView showsVerticalScrollIndicator={false} >
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp('3%') }}>
                                    <Image resizeMode={'contain'} source={require('../Assets/icons/kitchen.png')} />
                                    <View style={{ marginHorizontal: wp('8%'), marginTop: hp('2%') }}>
                                        <Text style={[SmallTextHeading, { color: borderDark, textAlign: 'center' }]}>Choose from the below Cuisines</Text>
                                    </View>
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <TouchableOpacity onPress={() => this._clearAllCuisines()} style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: hp('0.5%'), backgroundColor: errorColor, width: wp('20%'), borderRadius: hp('2%'), }}>
                                        <Text style={[labelText, { fontFamily: fontFamily('bold'), color: "#ffffff" }]}>Clear all</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ alignItems: 'center', marginTop: hp('1%') }} >
                                    {
                                        this.state.CuisinesData.map((item, index) => {
                                            return (
                                                <View style={{ flexDirection: 'row', width: wp('80%'), borderRadius: hp('1%'), backgroundColor: borderLight, marginTop: hp('1%') }} >
                                                    <TouchableOpacity onPress={() => this._cuisinesSelection(item, index)} style={{ marginVertical: hp('.5%'), paddingHorizontal: wp('2%') }} >
                                                        <Image resizeMode={'contain'} source={item.status ? require('../Assets/icons/check_box_clr.png') : require('../Assets/icons/check_box.png')} />
                                                    </TouchableOpacity>
                                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                                        <Text numberOfLines={1} style={[SmallTextHeading, { fontFamily: fontFamily('bold') }]}>{item.cuisinesType}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </ScrollView>
                            :
                            this.state.filterType == "price" ?
                                <View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp('5%') }}>
                                        <Image resizeMode={'contain'} source={require('../Assets/icons/wallet.png')} />
                                        <View style={{ marginHorizontal: wp('8%'), marginTop: hp('2%') }}>
                                            <Text style={[SmallTextHeading, { color: borderDark, textAlign: 'center' }]}>Choose your price range from below</Text>
                                        </View>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', height: hp('25%') }}>
                                        <MultiSlider
                                            values={[2, 3]}
                                            sliderLength={hp('40%')}
                                            onValuesChange={(value) => { this.rangeChange(value) }}
                                            //onValuesChangeStart={(value) => { this.rangeChange(value) }}
                                            selectedStyle={{ backgroundColor: sliderColor, height: 15 }}
                                            unselectedStyle={{ backgroundColor: borderLight, height: 15 }}
                                            markerStyle={{ backgroundColor: sliderColor, height: 36, width: 36, borderRadius: 18, top: 5 }}
                                            //trackStyle={{ height: 30 }}
                                            min={1}
                                            max={5}
                                            step={1}
                                        />
                                        <View style={{ flexDirection: 'row', width: wp('100%'), paddingHorizontal: wp('15%'), justifyContent: 'space-between' }}>
                                            <Text style={[SmallTextHeading, { color: borderDark, textAlign: 'center' }]}>$</Text>
                                            <Text style={[SmallTextHeading, { color: borderDark, textAlign: 'center' }]}>$$</Text>
                                            <Text style={[SmallTextHeading, { color: borderDark, textAlign: 'center' }]}>$$$</Text>
                                            <Text style={[SmallTextHeading, { color: borderDark, textAlign: 'center' }]}>$$$$</Text>
                                            <Text style={[SmallTextHeading, { color: borderDark, textAlign: 'center' }]}>$$$$$</Text>
                                        </View>
                                    </View>
                                </View>
                                :
                                <View>
                                    <View style={{ marginHorizontal: wp('8%'), marginTop: hp('2%') }}>
                                        <Text style={[SmallTextHeading, { color: borderDark, textAlign: 'center' }]}>Choose your Maximum Distance </Text>
                                        <View style={{ height: hp('35%'), width: wp('80%'), marginTop: hp('2%'), elevation: 3, borderRadius: 10 }}>

                                            <MapView
                                                provider={Platform.OS == "android" ? PROVIDER_GOOGLE: MapKit} 
                                                //mapType={Platform.OS == "android" ? "none" : "standard"}// remove if not using Google Maps
                                                style={styles.map}
                                                region={{
                                                    latitude: location[0],
                                                    longitude: location[1],
                                                    latitudeDelta: 0.015,
                                                    longitudeDelta: 0.0121,
                                                }}
                                            //maxZoomLevel={15}
                                            // minZoomLevel={1}
                                            >
                                                <MapView.Marker
                                                    coordinate={{
                                                        latitude: location[0],
                                                        longitude: location[1],
                                                    }}
                                                //title={"title"}
                                                //description={"description"}
                                                />
                                                <MapView.Circle
                                                    //key={(location.lat + (location.lng)).toString()}
                                                    center={{
                                                        latitude: location[0],
                                                    longitude: location[1],
                                                    }}
                                                    radius={this.state.DistanceKM * 1000}
                                                    strokeWidth={1}
                                                    strokeColor={'#1a66ff'}
                                                    fillColor={'rgba(230,238,255,0.5)'}
                                                //onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
                                                />

                                            </MapView>
                                        </View>
                                        <View style={{ marginTop: hp('7%') }}>

                                            {/* <Text style={[labelText, { flexWrap: 'wrap' }]}>Select no.of people </Text> */}

                                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                                {/* Add Button */}
                                                <TouchableOpacity onPress={() => this.addNoPeople()} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image resizeMode="contain" style={{ height: 35, width: 35 }} source={require('../Assets/icons/add_green.png')} />
                                                </TouchableOpacity>
                                                <View >
                                                    <TextInput
                                                        style={[styles.counterTextInputView, SmallTextHeading, { color: errorColor, fontFamily: fontFamily('bold') }]}
                                                        value={this.state.DistanceKM.toString()}
                                                        keyboardType={'number-pad'}
                                                        maxLength={2}
                                                        onChangeText={(text) => this.onChange(text.trim(), "DistanceKM")}
                                                        //ref='people'
                                                        // onSubmitEditing={() => this.refs.people.focus()}
                                                        onFocus={() => this.setState({ DistanceKM: this.state.DistanceKM })}
                                                    />

                                                </View>
                                                <Text style={[SmallTextHeading, { flexWrap: 'wrap', marginLeft: wp('2%'), color: errorColor }]}>
                                                    KM
                                                    </Text>
                                                {/* minus Button */}
                                                <TouchableOpacity onPress={() => this.setState({ DistanceKM: this.state.DistanceKM == 0 ? this.state.DistanceKM : parseInt(this.state.DistanceKM) - 1, })} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image resizeMode="contain" style={{ height: 35, width: 35 }} source={require('../Assets/icons/minus_green.png')} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                    </View>
                                </View>

                    }

                    {/* Ok button */}
                    <TouchableOpacity onPress={
                        () => this.props.submitModalButton({
                            distance: this.state.DistanceKM,
                            price: [
                                this.state.priceRange[0] == "1"? "10-50":this.state.priceRange[0] == "2"? "100-250":this.state.priceRange[0] =="3"? "250-500":this.state.priceRange[0]=="4"?"500-1000":"1000:2000",
                                this.state.priceRange[1] == "1"? "10-50":this.state.priceRange[1] == "2"? "100-250":this.state.priceRange[1] =="3"? "250-500":this.state.priceRange[1]=="4"?"500-1000":"1000:2000"
                            ]
                        }, "b")} style={{
                            height: hp('10%'), width: wp('18%'), borderRadius: hp('6%'), position: 'absolute', zIndex: 5, bottom: 20, right: 15, elevation: 0, shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                        }}>
                        <Image source={require('../Assets/icons/checked.png')} resizeMode={'cover'} />
                    </TouchableOpacity>

                </View>

            </Modal>
        )
    }

}

const styles = StyleSheet.create({
    modalContainerView: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: hp('0%')
    },
    whiteContainerView: {
        height: hp('80%'),
        width: wp('100%'),
        paddingHorizontal: wp('3%'),
        paddingTop: hp('3%'),
        backgroundColor: "#ffffff",
        borderTopLeftRadius: hp('5%'),
        borderTopRightRadius: hp('5%')
    },
    buttonViews: {
        width: wp('28%'),
        borderRadius: hp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp('1%')
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    counterTextView: {
        backgroundColor: '#ffffff',
        borderWidth: wp('0.6%'),
        borderColor: '#111111',
        borderRadius: hp('2.2%'),
        height: hp('4.5%'),
        width: wp('14%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    counterTextInputView: {
        backgroundColor: '#ffffff',
        borderWidth: wp('0.6%'),
        borderColor: '#111111',
        borderRadius: hp('2.2%'),
        height: hp('6%'),
        width: wp('14%'),
        textAlign: 'center',

    },

})

export default connect(
    state => ({
        currentLocationData: state.SaveLocationReducer.locationData
    }), { ...locationAction })(FilterModal)