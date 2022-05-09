import React, { Component } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator, AsyncStorage, Dimensions, Image, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor, errorColor, borderLight, borderDark, sliderColor } from '../Utils/responsive';
import Modal from "react-native-modal";
import { labelText, SmallTextHeading } from '../Utils/commonStyles';
import MultiSlider from './react-native-multi-slider';
import OTPTextView from 'react-native-otp-textinput';
import { SafeAreaView } from 'react-navigation';
import { Toast, Loader } from './modals';
import { imageUrl, NodeAPIForm, NodeAPI } from '../Services/apiServices';




export default class ClamDealModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text1: '',
            text2: '',
            text3: '',
            text4: '',
            toastVisible: false,
            spinnerVisible: false,
            toastColor: '',
            toastMessage: '',
        }
    }

    clamDealFun = async() => {
        this.setState({
            spinnerVisible: true
        })

        const { text1 = '', text2 = '', text3 = '', text4 = '' } = this.state;
        const variables = {
            dealId: this.props.dealId,
            code:`${text1} ${text2} ${text3} ${text4}`
        }
        await NodeAPI(variables, `claimDealRestro`, 'POST', this.props.auth_token)
            //${JSON.parse(dealsIDs)}
            .then(response => {
                console.warn("event deal 11123124234 ---------->", response)
                if (response.status === 200) {
                    setTimeout(() => {
                        this.setState({ spinnerVisible: false })
                        this.setState({ toastColor: sliderColor, toastMessage: response.message, toastVisible: true })
                        this.props.claimedDeal(false);
                        //this.props.navigation.navigate('DealSummaryScreen', { dealId: dealsIDs, redeemedID: response.data._id })
                    }, 2000)
                }
                else {
                    //alert("else")
                    this.setState({ toastColor: errorColor, toastMessage: response.message, toastVisible: true })
                    setTimeout(() => {
                        this.setState({ toastVisible: false, spinnerVisible: false })
                        //this.props.navigation.navigate('mainRoute')
                    }, 4000)
                }
            })
        // const { text1 = '', text2 = '', text3 = '', text4 = '' } = this.state;
        // Alert.alert(`${text1} ${text2} ${text3} ${text4}`, this.props.dealId);
    }

    render() {
        console.warn("iiiii---->>>ddddd--->>ClamVisible: ", this.props.ClamVisible)
        return (
            <Modal
                isVisible={this.props.ClamVisible}
                onSwipeComplete={() => this.props.modalGetClose(false)}
                swipeDirection={['down']}
                deviceWidth={wp('100%')}
                deviceHeight={hp('100%')}
                style={styles.modalContainerView}
            >

                <View style={styles.whiteContainerView}>
                    <Loader spinnerVisible={this.state.spinnerVisible} />
                    <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />
                    {/* Cross button view */}
                    <TouchableOpacity onPress={() => this.props.modalGetClose(false)}>
                        <Image source={require('../Assets/icons/cross.png')} />
                    </TouchableOpacity>
                    {/* filter button ViewS */}
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp('3%') }}>
                        <Image resizeMode={'contain'} source={require('../Assets/icons/clam.png')} />
                        <View style={{ marginHorizontal: wp('8%'), marginTop: hp('2%') }}>
                            <Text style={[SmallTextHeading, { color: borderDark, textAlign: 'center' }]}>Ask Restaurant to enter 4 Digit Verification Code</Text>
                        </View>
                    </View>
                    <View style={{ marginHorizontal: hp('8%') }}>
                        <OTPTextView
                            containerStyle={styles.textInputContainer}
                            handleTextChange={text => this.setState({ text1: text })}
                            inputCount={4}
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Ok button */}
                    <TouchableOpacity onPress={() => this.clamDealFun()} style={{
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
    textInputContainer: {
        marginBottom: 20,
    },

})
