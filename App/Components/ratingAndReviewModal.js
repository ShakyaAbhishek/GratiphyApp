//import liraries
import React, { Component } from 'react';
import { View, Text, Alert, StyleSheet, Modal, ActivityIndicator, AsyncStorage, Dimensions, Image, TextInput, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor, errorColor, borderLight, borderDark, sliderColor } from '../Utils/responsive';
// import Modal from "react-native-modal";
import { Rating, AirbnbRating } from 'react-native-ratings';
import { labelText, SmallTextHeading, textInputMargin, TextInputImage, Button1, ButtonText } from '../Utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MultiSlider from './react-native-multi-slider';
import { SafeAreaView } from 'react-navigation';
import { Toast, Loader } from './modals';
import { NavigationEvents } from 'react-navigation';
import { imageUrl, NodeAPIForm, NodeAPI } from '../Services/apiServices';

// create a component
class RatingAndReviewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            ratings: '',
            toastVisible: false,
            spinnerVisible: false,
            toastColor: '',
            toastMessage: '',
        }
    }

    ratingCompleted(rating) {
        console.log(`Rating is: ${rating}`);
        this.setState({
            ratings: rating
        })
    }
    clearState() {
        this.setState({
            toastColor: '',
            toastMessage: '',
        })
    }


    // handle text input
    onChange(text, type) {
        //this pattern checks for emoji
        var pattern = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/

        if (type == "Dis") {
            this.setState({
                description: text,
                //errMessageArr: []
            });
        }
    }

    submitFunction = async () => {

        this.setState({
            spinnerVisible: false
        })

        const { ratings, description } = this.state;
        if (description == '' || description == undefined || description == null) {
            this.setState({
                DescriptionErr: 'please enter the Review '
            })
        }
        else {


            const variables = {
                dealId: this.props.dealId,
                reviews: description,
                rating: ratings
            }
            await NodeAPI(variables, `createReview`, 'POST', this.props.auth_token)
                //${JSON.parse(dealsIDs)}
                .then(response => {
                    console.warn(" 11123124234 ---------->", response)
                    if (response.status === 200) {
                        setTimeout(() => {
                            this.setState({
                                spinnerVisible: false, description: '',
                                ratings: '',
                            })
                            // this.setState({ toastColor: sliderColor, toastMessage: response.message, toastVisible: true })
                            this.props.modalGetClose(false);
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
        }
        // console.warn("rate" + this.state.ratings + "des" + this.state.description)
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.ratingFilterVisible}

            >
                <View style={{ height: hp('100%'), width: wp('100%'), backgroundColor: "#00000090", justifyContent: 'center', alignItems: 'center' }}>
                    <NavigationEvents
                        onWillFocus={() =>
                            this.clearState()
                        }
                    />
                    <Loader spinnerVisible={this.state.spinnerVisible} />
                    <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />
                    <View style={styles.whiteContainerView}>
                        <TouchableOpacity onPress={() => this.props.modalGetClose(false)}>
                            <Image source={require('../Assets/icons/cross.png')} />
                        </TouchableOpacity>
                        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

                            <View style={{ height: hp('73%'), }}>

                                <AirbnbRating
                                    count={5}
                                    reviews={["Bad", "OK", "Good", "Very Good", "Wow"]}
                                    defaultRating={1}
                                    // selectedColor={'red'}
                                    // reviewColor={'red'}
                                    // showRating={true}
                                    onFinishRating={(value) => {
                                        this.setState({
                                            ratings: value
                                        })
                                    }}
                                    starContainerStyle={{ backgroundColor: 'transparent' }}
                                    size={40}
                                />

                                <View style={textInputMargin}>
                                    <Text style={labelText}>Review*</Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        borderBottomColor: "#111111",
                                        borderBottomWidth: 2
                                    }} >

                                        <TextInput
                                            style={{ flex: 1, justifyContent: 'flex-start', fontFamily: fontFamily(), fontSize: fontSizes('smalltitle') }}
                                            multiline={true}
                                            value={this.state.description}
                                            numberOfLines={4}
                                            maxLength={150}
                                            keyboardType={'default'}
                                            ref="discription"
                                            onChangeText={(text) => this.onChange(text, "Dis")}
                                            onFocus={() => this.setState({ DescriptionErr: '' })}
                                        />

                                        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                            <Image resizeMode="contain" style={TextInputImage} source={require('../Assets/icons/description.png')} />
                                        </View>
                                    </View>
                                    {this.state.DescriptionErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.DescriptionErr}</Text>}
                                </View>

                                <TouchableOpacity onPress={() => this.submitFunction()} style={[Button1, { marginHorizontal: wp('8%'), marginVertical: hp('5%') }]}>
                                    <Text style={ButtonText}>Submit </Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </View>
            </Modal>
        )
    }

}

const styles = StyleSheet.create({
    modalContainerView: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: hp('0%'),

    },
    whiteContainerView: {
        height: hp('60%'),
        width: wp('95%'),
        paddingHorizontal: wp('3%'),
        paddingTop: hp('3%'),
        backgroundColor: "#ffffff",
        borderRadius: hp('5%'),
        //borderTopRightRadius: hp('5%')
    },
    buttonViews: {
        width: wp('28%'),
        borderRadius: hp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp('1%')
    }

})
//make this component available to the app
export default RatingAndReviewModal;
