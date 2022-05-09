import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../../Components/commonHeader';
import { validateEmail } from '../../Services/validation';
import { errorColor, sliderColor } from '../../Utils/responsive';
import { Button1, ButtonText, ConatinerViewWithPadding, SmallTextHeading, TextInputViewWithImage, TextInputView, labelText, TextInputImage, ConatinerViewWithoutPadding } from '../../Utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NodeAPI } from '../../Services/apiServices';
import { Toast, Loader } from '../../Components/modals';



export default class ForgotPasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            emailErr: '',
            toastColor: '',
            toastMessage: '',
            toastVisible: false,
            spinnerVisible: false
        };
    }

    // handle text input
    onChange(text, type) {
        //this pattern checks for emoji
        var pattern = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/
        if (type === 'Email') {
            if (!pattern.test(text)) {
                this.setState({
                    email: text.replace(/[^A-Za-z0-9@_.]/g, ''),
                    errMessageArr: []
                });
            }
        }
    }

    submit() {
        if (validateEmail(this.state.email).status !== true) {
            this.setState({
                emailErr: validateEmail(this.state.email).message
            })
        }
        else {
            //this.props.navigation.navigate('ResetPasswordScreen')
            //alert('your otp send on your mail id')
            var variables = {
                email: this.state.email.toLowerCase()
            }
            return NodeAPI(variables, "forgotpassword", 'POST')
                .then(response => {
                    //console.warn("reeeeee =",response)
                    if (response.status === 200) {
                        this.setState({ toastColor: sliderColor, toastMessage: response.message, toastVisible: true, spinnerVisible: true })
                        setTimeout(() => {
                            this.setState({ toastVisible: false, spinnerVisible: false })
                            this.props.navigation.navigate('ResetPasswordScreen')
                        }, 2000)
                    }
                    else {
                        this.setState({ toastColor: errorColor, toastMessage: response.message, toastVisible: true, spinnerVisible: true })
                        setTimeout(() => {
                            this.setState({ toastVisible: false, spinnerVisible: false })
                        }, 2000)
                        //alert(response)
                    }

                })
        }
    }

    render() {
        const navigation = this.props.navigation;
        return (
            <View style={ConatinerViewWithoutPadding}>
                <Loader spinnerVisible={this.state.spinnerVisible} />
                <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />
                <Header navigation={navigation} title="Forgot password" backButtonNavigation={true}  blankAuth={true}/>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={ConatinerViewWithPadding}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Image resizeMode="contain" style={{ height: hp('30%'), width: wp('30%') }} source={require('../../Assets/icons/forgot_password.png')} />
                    </View>
                    <View style={{ padding: wp('5%') }}>
                        <Text style={SmallTextHeading}>Forgot your password?</Text>
                        <View style={{ padding: wp('2%') }}>
                            <View style={{}}>
                                <Text style={labelText}>Email id*</Text>
                                <View style={TextInputViewWithImage}>
                                    <TextInput
                                        style={TextInputView}
                                        value={this.state.email}
                                        maxLength={56}
                                        keyboardType={'email-address'}
                                        placeholder="xxxApp.com"
                                        onChangeText={(text) => this.onChange(text.trim(), "Email")}
                                        onFocus={() => this.setState({ emailErr: '' })}
                                    />
                                    <Image resizeMode="contain" style={TextInputImage} source={require('../../Assets/icons/email.png')} />
                                </View>
                                {this.state.emailErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.emailErr}</Text>}
                            </View>

                            <TouchableOpacity onPress={() => this.submit()} style={[Button1, { marginTop: hp('5%') }]}>
                                <Text style={ButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </KeyboardAwareScrollView>
            </View>
        )
    }
}