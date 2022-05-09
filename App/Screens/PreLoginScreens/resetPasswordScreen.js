import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../../Components/commonHeader';
import { validateEmail, validatePassword } from '../../Services/validation';
import { errorColor, sliderColor } from '../../Utils/responsive';
import { Button1, ButtonText, ConatinerViewWithPadding, SmallTextHeading, textInputMargin, TextInputViewWithImage, TextInputView, labelText, TextInputImage, ConatinerViewWithoutPadding } from '../../Utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NodeAPI } from '../../Services/apiServices';
import ActionSheet from 'react-native-actionsheet';
import { Toast, Loader } from '../../Components/modals';


const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = ['Cancel', 'Yes']
const title = 'Do you want to change the password? '
export default class ResetPasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Otp: '',
            otpErr: '',
            email: '',
            emailErr: '',
            Password: '',
            PasswordErr: '',
            ConfirmPassword: '',
            ConfirmPasswordErr: '',
            verifyStatus: false, // false require
            errMessageArr: [],
            passwordHide: true,
            ConfPasswordHide: true,
            toastColor: '',
            toastMessage: '',
            spinnerVisible: false,
            toastVisible: false,
        };
    }
    // handle text input
    onChange(text, type) {
        //this pattern checks for emoji
        var pattern = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/
        if (type === 'email') {
            if (!pattern.test(text)) {
                this.setState({
                    email: text.replace(/[^A-Za-z0-9@_.]/g, ''),
                    errMessageArr: []
                });
            }
        }
        if (type === 'Password') {
            this.setState({
                Password: text.replace(/[^A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[^_`{|}~]/g, ''),
                errMessageArr: [],
                PasswordErr: ''
            });
        }
        if (type == "Otp") {
            this.setState({
                Otp: text.replace(/[^0-9]/g, ''),
                //errMessageArr: []
            });
        }
        if (type === 'confirmPassword') {
            this.setState({
                ConfirmPassword: text.replace(/[^A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[^_`{|}~]/g, ''),
                errMessageArr: [],
                ConfirmPasswordErr: ''
            });
        }
    }

    VerifyOTP() {
        if (this.state.Otp == '' || this.state.Otp === null || this.state.Otp === undefined) {
            this.setState({
                otpErr: "*Please enter OTP",
                // errMessageArr: errMessageArr.push("*Please enter restaurent contact")
            })
        }
        else {
            var variables = {
                generateOTP: this.state.Otp
            }
            return NodeAPI(variables, "resetPassword", 'POST')
                .then(response => {
                    console.warn(response)

                    if (response.status == 200) {
                        //alert(JSON.stringify(response.message))
                        this.setState({ spinnerVisible: true })
                        setTimeout(() => {
                            this.setState({
                                spinnerVisible: false,
                                verifyStatus: true,
                                email: response.data.email
                            })
                        }, 200)
                    }
                    else {
                        this.setState({ toastColor: errorColor, toastMessage: response.message, toastVisible: true, spinnerVisible: true })
                        setTimeout(() => {
                            this.setState({ toastVisible: false, spinnerVisible: false })
                        }, 2000)
                    }

                })
        }
    }
    UpdatePassword() {
        let {
            errMessageArr,
            email,
            Password,
            ConfirmPassword
        } = this.state;
        errMessageArr = [];
        if (validateEmail(email).status !== true) {
            this.setState({
                emailErr: validateEmail(email).message
            })
        }
        if (validatePassword(Password).status !== true) {
            this.setState({
                errMessageArr: errMessageArr.push(validatePassword(Password).message),
                PasswordErr: validatePassword(Password).message
            })
        }
        if (Password != ConfirmPassword) {
            this.setState({
                errMessageArr: errMessageArr.push("*Password and confirm password does not match."),
                ConfirmPasswordErr: "*Password and confirm password does not match."
            })
        }
        setTimeout(() => {
            if (errMessageArr.length == 0) {
                this.ActionSheet.show()
            }
        }, 500)
    }

    handlePress(i) {
        if (i == 1) {
            var variables = {
                email: this.state.email.toLowerCase(),
                password: this.state.Password,
            }
            return NodeAPI(variables, "updatepassword", 'POST')
                .then(response => {
                    console.warn(response)
                    //this.setState({ spinnerVisible: true })
                    if (response.status === 200) {
                        this.setState({ toastColor: sliderColor, toastMessage: response.message, toastVisible: true, spinnerVisible: true })
                        setTimeout(() => {
                            this.setState({ toastVisible: false, spinnerVisible: false })
                            this.props.navigation.navigate("LoginScreen")
                        }, 2000)
                        //alert(response.msg)
                        //this.props.navigation.navigate("LoginScreen")
                    }
                    else {
                        this.setState({ toastColor: errorColor, toastMessage: "Please enter valid email.", toastVisible: true, spinnerVisible: true })
                        setTimeout(() => {
                            this.setState({ toastVisible: false, spinnerVisible: false })
                        }, 2000)
                    }
                })

        }
    }
    _showHide(type) {
        if (type == "password") {
            this.state.passwordHide = !this.state.passwordHide
            this.setState({ passwordHide: this.state.passwordHide })
        }
        if (type == "confirmPassword") {
            this.state.ConfPasswordHide = !this.state.ConfPasswordHide
            this.setState({ ConfPasswordHide: this.state.ConfPasswordHide })
        }
    }

    render() {
        const navigation = this.props.navigation;
        return (
            <View style={ConatinerViewWithoutPadding}>
                <Loader spinnerVisible={this.state.spinnerVisible} />
                <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />
                <Header navigation={navigation} title="Reset Password" backButtonNavigation={true} blankAuth={true} />
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={ConatinerViewWithPadding}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Image resizeMode="contain" style={{ height: hp('30%'), width: wp('30%') }} source={require('../../Assets/icons/forgot_password.png')} />
                    </View>
                    <View style={{ padding: wp('5%') }}>
                        <Text style={SmallTextHeading}>Reset your password?</Text>
                        {!this.state.verifyStatus ?
                            <View style={{ padding: wp('2%') }}>
                                <View style={{}}>
                                    <Text style={labelText}>Enter 6 digit code</Text>
                                    <View style={TextInputViewWithImage}>
                                        <TextInput
                                            style={TextInputView}
                                            value={this.state.Otp}
                                            maxLength={6}
                                            keyboardType={'number-pad'}
                                            placeholder="XXXXXX"
                                            onChangeText={(text) => this.onChange(text.trim(), "Otp")}
                                            onFocus={() => this.setState({ otpErr: '' })}
                                        />
                                    </View>
                                    {this.state.otpErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.otpErr}</Text>}
                                </View>

                                <TouchableOpacity onPress={() => this.VerifyOTP()} style={[Button1, { marginTop: hp('3%'), backgroundColor: this.state.verifyStatus ? "#24f495" : "#111111" }]}>
                                    <Text style={ButtonText}>Verify OTP</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View>
                                <View >
                                    <Text style={labelText}>Email id*</Text>
                                    <View style={TextInputViewWithImage}>
                                        <TextInput
                                            style={TextInputView}
                                            value={this.state.email}
                                            maxLength={56}
                                            editable={false}
                                            keyboardType={'email-address'}
                                            placeholder="xxxx@App.com"
                                            onChangeText={(text) => this.onChange(text.trim(), "email")}
                                            onSubmitEditing={() => this.refs.Password.focus()}
                                            onFocus={() => this.setState({ emailErr: '' })}
                                        />
                                        <Image resizeMode="contain" style={TextInputImage} source={require('../../Assets/icons/email.png')} />
                                    </View>
                                    {this.state.emailErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.emailErr}</Text>}
                                </View>
                                <View style={textInputMargin}>
                                    <Text style={labelText}>New Password*</Text>
                                    <View style={TextInputViewWithImage}>
                                        <TextInput
                                            style={TextInputView}
                                            value={this.state.Password}
                                            maxLength={20}
                                            secureTextEntry={this.state.passwordHide}
                                            keyboardType={'default'}
                                            onChangeText={(text) => this.onChange(text.trim(), "Password")}
                                            ref="password"
                                            onSubmitEditing={() => this.refs.confirmPassword.focus()}
                                            onFocus={() => this.setState({ RestaurantPasswordErr: '' })}
                                        />
                                        <TouchableOpacity onPress={() => this._showHide("password")}>
                                            <Image resizeMode="contain" style={[TextInputImage, { tintColor: '#cacaca' }]} source={this.state.passwordHide ? require('../../Assets/icons/hide_eye.png') : require('../../Assets/icons/eye.png')} />
                                        </TouchableOpacity>
                                    </View>
                                    {this.state.PasswordErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.PasswordErr}</Text>}
                                </View>
                                <View style={textInputMargin}>
                                    <Text style={labelText}>Confirm password*</Text>
                                    <View style={TextInputViewWithImage}>
                                        <TextInput
                                            style={TextInputView}
                                            value={this.state.ConfirmPassword}
                                            maxLength={20}
                                            secureTextEntry={this.state.ConfPasswordHide}
                                            keyboardType={'default'}
                                            onChangeText={(text) => this.onChange(text.trim(), "confirmPassword")}
                                            ref="confirmPassword"
                                            //onSubmitEditing={() => this.refs.Password.focus()}
                                            onFocus={() => this.setState({ ConfirmPasswordErr: '' })}
                                        />
                                        <TouchableOpacity onPress={() => this._showHide("confirmPassword")}>
                                            <Image resizeMode="contain" style={[TextInputImage, { tintColor: '#cacaca' }]} source={this.state.ConfPasswordHide ? require('../../Assets/icons/hide_eye.png') : require('../../Assets/icons/eye.png')} />
                                        </TouchableOpacity>
                                    </View>
                                    {this.state.ConfirmPasswordErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.ConfirmPasswordErr}</Text>}
                                </View>
                                <TouchableOpacity onPress={() => this.UpdatePassword()} style={[Button1, { marginTop: hp('5%') }]}>
                                    <Text style={ButtonText}>Update</Text>
                                </TouchableOpacity>
                            </View>
                        }

                    </View>

                </KeyboardAwareScrollView>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={title}
                    options={options}
                    cancelButtonIndex={CANCEL_INDEX}
                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={(index) => this.handlePress(index)}
                />
            </View>
        )
    }
}
