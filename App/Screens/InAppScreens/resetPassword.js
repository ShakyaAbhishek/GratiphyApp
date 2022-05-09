//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, AsyncStorage } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../../Components/commonHeader';
import { validateEmail, validatePassword } from '../../Services/validation';
import { errorColor, sliderColor } from '../../Utils/responsive';
import { Button1, ButtonText, ConatinerViewWithPadding, SmallTextHeading, textInputMargin, TextInputViewWithImage, TextInputView, labelText, TextInputImage, ConatinerViewWithoutPadding, BigHeadingText } from '../../Utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NodeAPI } from '../../Services/apiServices';
import ActionSheet from 'react-native-actionsheet';
import { Toast, Loader } from '../../Components/modals';
import { NavigationEvents } from 'react-navigation';

// create a component
class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Otp: '',
            otpErr: '',
            email: '',
            emailErr: '',
            oldPassword: '',
            PasswordErr: '',
            newPassword: '',
            newPasswordErr: '',
            ConfirmPasswordErr: '',
            verifyStatus: false, // false require
            errMessageArr: [],
            passwordHide: true,
            ConfPasswordHide: true,
            toastColor: '',
            toastMessage: '',
            spinnerVisible: false,
            toastVisible: false,
            auth_token: ''
        };
        //this._retrieveData();
    }
    _retrieveData = async () => {
        var emailId = this.props.navigation.getParam('emailId', '');
        console.warn("email0000=====>", emailId);
        try {
          const value = await AsyncStorage.getItem('auth_token');
          if (value !== null) {
            this.setState({
              auth_token: value,
              email: emailId
            })
          }
        } catch (error) {
          // Error retrieving data
        }
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
                oldPassword: text.replace(/[^A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[^_`{|}~]/g, ''),
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
                newPassword: text.replace(/[^A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[^_`{|}~]/g, ''),
                errMessageArr: [],
                newPasswordErr: ''
            });
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

    UpdatePassword() {
        let {
            errMessageArr,
            email,
            oldPassword,
            newPassword
        } = this.state;
        errMessageArr = [];
        if (validateEmail(email).status !== true) {
            this.setState({
                emailErr: validateEmail(email).message
            })
        }
        if (validatePassword(oldPassword).status !== true) {
            this.setState({
                errMessageArr: errMessageArr.push(validatePassword(oldPassword).message),
                PasswordErr: validatePassword(oldPassword).message
            })
        }
        if (validatePassword(newPassword).status !== true) {
            this.setState({
                errMessageArr: errMessageArr.push(validatePassword(newPassword).message),
                newPasswordErr: validatePassword(newPassword).message
            })
        }
        // if (Password != ConfirmPassword) {
        //     this.setState({
        //         errMessageArr: errMessageArr.push("*Password and confirm password does not match."),
        //         ConfirmPasswordErr: "*Password and confirm password does not match."
        //     })
        // }
        setTimeout(() => {
            if (this.state.errMessageArr.length == 0) {
                var variables = {
                    email: this.state.email,
                    password: this.state.oldPassword,
                    newpassword: this.state.newPassword
                }
                return NodeAPI(variables, "changePassword", 'POST', this.state.auth_token)
                    .then(response => {
                        console.warn(response)
                        //this.setState({ spinnerVisible: true })
                        if (response.status === 200) {
                            this.setState({ toastColor: sliderColor, toastMessage: response.message, toastVisible: true, spinnerVisible: true })
                            setTimeout(() => {
                                this.setState({ toastVisible: false, spinnerVisible: false })
                                this.props.navigation.navigate("MyAccountScreen")
                            }, 2000)
                            //alert(response.msg)
                            //this.props.navigation.navigate("LoginScreen")
                        }
                        else {
                            this.setState({ toastColor: errorColor, toastMessage: response.message, toastVisible: true, spinnerVisible: true })
                            setTimeout(() => {
                                this.setState({ toastVisible: false, spinnerVisible: false })
                            }, 2000)
                        }
                    })
            }
        }, 500)
    }

    render() {
        const navigation = this.props.navigation;
        return (
            <View style={ConatinerViewWithoutPadding}>
                <NavigationEvents
                    onWillFocus={() =>
                        this._retrieveData()
                    }
                />
                <Loader spinnerVisible={this.state.spinnerVisible} />
                <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />
                <Header navigation={navigation} title="Change Password" backButtonNavigation={true} />
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={ConatinerViewWithPadding} >
                    {/* <View style={styles.HeadingView}>
                        <Text style={[BigHeadingText, { fontSize: hp('5%') }]} >Change Password</Text>
                    </View> */}
                    <View style={{marginTop:hp('10%')}} >
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
                        <Text style={labelText}>Old Password*</Text>
                        <View style={TextInputViewWithImage}>
                            <TextInput
                                style={TextInputView}
                                value={this.state.oldPassword}
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
                        <Text style={labelText}>New password*</Text>
                        <View style={TextInputViewWithImage}>
                            <TextInput
                                style={TextInputView}
                                value={this.state.NewPassword}
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
                        {this.state.newPasswordErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.newPasswordErr}</Text>}
                    </View>
                    <TouchableOpacity onPress={() => this.UpdatePassword()} style={[Button1, { marginTop: hp('5%') }]}>
                        <Text style={ButtonText}>Update</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default ResetPassword;
