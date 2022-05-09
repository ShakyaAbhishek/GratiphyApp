import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, Picker, TextInput, Modal, TouchableHighlight, ImageBackground, SafeAreaView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor } from '../Utils/responsive';
import { Button1, ButtonText, ConatinerViewWithPadding, BigHeadingText, SmallTextHeading, TextInputViewWithImage, TextInputView, labelText, TextInputImage, ConatinerViewWithoutPadding } from '../Utils/commonStyles';
import { imageUrl } from '../Services/apiServices';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
class CustomDrawer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            ProfileImage: ''
        };
        //this._retrieveData();
    }
    // componentDidUpdate(){
    //     this._retrieveData()
    //     console.warn("drawer")
    // }
    componentDidMount() {
        this.setState({
            ProfileImage: this.props.profileData.ProfileImage
        })
        this.focusListener = this.props.navigation.addListener("willFocus", () => {
            //console.warn("here inside drawer")
            this._retrieveData();
        });

    }
    _retrieveData = async () => {
        var value = await AsyncStorage.getItem('profile_Data');
        //console.warn('value11====', value);
        //console.warn('valuefdsf====', JSON.parse(value));
        if (value !== null) {
            value = this.props.profileData;
            var userData = value;
            var profileImage = value.ProfileImage
            //alert(JSON.stringify(value))
            this.setState({
                spinnerVisible: false,
                imageUpload: false,
                userData: userData,
                ProfileImage: profileImage
            })//, () => { console.warn('userData===', this.state.userData) }
        }
    }
    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    navigateToScreen = (route) => (
        () => {
            this.props.navigation.closeDrawer();
            const navigateAction = NavigationActions.navigate({
                routeName: route
            });
            this.props.navigation.dispatch(navigateAction);

        })

    async logout() {
        this.props.navigation.navigate('stack');
        await AsyncStorage.removeItem('auth_token');
    }

    render() {
        //console.warn("dsjhf", this.props.profileData)
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
                <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                    {/* <View style={{ height: hp('25%'), borderRadius: wp('15%'), width: wp('35%') }} >
                        <Image style={{ height: '100%', width: '100%' }} resizeMode="contain" source={require('../Assets/icons/dummy_image.png')} />
                    </View> */}
                    <View style={{ marginTop: 50, height: 120, width: 120, borderRadius: 64, borderColor: "#cacaca", borderWidth: 1, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, marginBottom: hp('4%') }} >
                        {/* <Text>{`${imageUrl}${this.props.profileData.ProfileImage}`}</Text> */}
                        <Image style={{ height: "100%", width: "100%", borderRadius: 60, }} resizeMode="cover" source={this.props.profileData.ProfileImage == '' ? require('../Assets/profile.jpg') : { uri: `${imageUrl}${this.props.profileData.ProfileImage}` }} />
                    </View>

                </View>
                <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={SmallTextHeading}>{this.props.profileData.name}</Text>
                    <Text style={labelText}>{this.props.profileData.email}</Text>
                </View>
                <View style={{ flex: 4 }}>
                    <View style={{ marginTop: hp('3%'), height: hp('15%'), flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={this.navigateToScreen('HomeScreen')}
                                style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image resizeMode="contain" source={require('../Assets/icons/my_intention.png')} />
                                <Text style={[labelText, { marginTop: hp('1%') }]}>My Intention</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={this.navigateToScreen('HomeScreen')} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image resizeMode="contain" source={require('../Assets/icons/deals.png')} />
                                <Text style={[labelText, { marginTop: hp('1%') }]}>Deals for me</Text>
                            </TouchableOpacity>
                            {/* onPress={this.navigateToScreen('DealsForMeScreen')} */}
                        </View>
                    </View>
                    <View style={{ height: hp('15%'), flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={this.navigateToScreen('HelpScreen')} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image resizeMode="contain" source={require('../Assets/icons/help.png')} />
                                <Text style={[labelText, { marginTop: hp('1%') }]}>Help</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={this.navigateToScreen('MyAccountScreen')} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image resizeMode="contain" source={require('../Assets/icons/my_account.png')} />
                                <Text style={[labelText, { marginTop: hp('1%') }]}>My account</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                    <View style={{ height: hp('15%'), flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={this.navigateToScreen('DealsHistoryScreen')} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image resizeMode="contain" source={require('../Assets/icons/my_deals.png')} />
                                <Text style={[labelText, { marginTop: hp('1%') }]}>Deals history</Text>
                            </TouchableOpacity>
                            {/* onPress={this.navigateToScreen('DealsHistoryScreen')} */}
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => this.logout()} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image resizeMode="contain" source={require('../Assets/icons/logout.png')} />
                                <Text style={[labelText, { marginTop: hp('1%') }]}>Logout</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
export default connect(
    state => ({
        profileData: state.SaveProfileReducer.profileData
    }), null
)(CustomDrawer)
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    headerContainer: {
        height: 150,
    },
    headerText: {
        color: '#fff8f8',
    },
    screenContainer: {
        paddingTop: 20,
        width: '100%',
    },
    screenStyle: {
        height: 30,
        marginTop: 2,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    screenTextStyle: {
        fontSize: 20,
        marginLeft: 20,
        textAlign: 'center'
    },
    selectedTextStyle: {
        fontWeight: 'bold',
        color: 'green'
    },
    activeBackgroundColor: {
        backgroundColor: 'red',
        //color: 'green'
    }
});