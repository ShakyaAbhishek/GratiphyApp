import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../../Components/commonHeader';
import { fontFamily, fontSizes, button1Color, button2Color, backgroundColor, buttonTextColor, errorColor, sliderColor } from '../../Utils/responsive';
import { Button1, ButtonText, ConatinerViewWithPadding, SmallTextHeading, TextInputViewWithImage, textInputMargin, TextInputView, labelText, TextInputImage, ConatinerViewWithoutPadding } from '../../Utils/commonStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Toast, Loader } from '../../Components/modals';
import { validateEmail, validatePassword, validatePhoneNo, validateRestoCode } from '../../Services/validation';
import { NodeAPI } from '../../Services/apiServices';
import { connect } from 'react-redux';

class HelpScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            nameErr: '',
            email: '',
            emailErr: '',
            description: '',
            DescriptionErr: '',
            errMessageArr: [],
            toastVisible: false,
            spinnerVisible: false,
            auth_token: ''
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
        if (type == "Name") {
            this.setState({
                name: text,
                errMessageArr: []
            });
        }
        if (type == "Dis") {
            this.setState({
                description: text,
                errMessageArr: []
            });
        }
    }
    componentDidMount(){
        this._retrieveData();
    }
    
    _retrieveData = async () => {
        const auth_token = await AsyncStorage.getItem('auth_token');
        var value = this.props.profileData;
        console.warn('value11====', auth_token);
        console.warn('valuefdsf====', value);
        if (value !== null) {
          value = value;
          var email = value.email;
          var name = value.name;
          this.setState({
            email: email,
            name: name,
            auth_token: auth_token,
          })
        }
      }

    async Submit() {
        let {
            email,
            emailErr,
            name,
            nameErr,
            description,
            DescriptionErr,
            errMessageArr,
            auth_token
        } = this.state;
        errMessageArr = [];
        if (validateEmail(email).status !== true) {
            this.setState({
                errMessageArr: errMessageArr.push(validateEmail(email).message),
                emailErr: validateEmail(email).message
            })
        }
        if (name == '' || name === null || name === undefined) {
            this.setState({
                nameErr: "*Please enter  name",
                errMessageArr: errMessageArr.push("*Please enter  name")
            })
        }
        if (description.trim() == '' || description.trim() === null || description.trim() === undefined) {
            this.setState({
                DescriptionErr: "*Please enter description ",
                errMessageArr: errMessageArr.push("*Please enter description ")
            })
        }
        setTimeout(() => {
            if (this.state.errMessageArr.length == 0) {
                this.setState({
                    spinnerVisible: true
                })
                var variables = {
                    fullName: name,
                    description: description,
                    email: email.toLowerCase()
                }
                return NodeAPI(variables, 'help', 'POST', this.state.auth_token)
                    .then(response => {
                        console.warn(response);
                        //console.warn("warnnnn ",JSON.stringify(response));
                        //var data = JSON.stringify(response.message)
                        if (response.status == 202) {
                            //console.warn("inside")
                            this.setState({ toastColor: sliderColor, toastMessage: response.message, toastVisible: true, description:'' })
                            setTimeout(() => {
                                this.setState({ toastVisible: false, spinnerVisible: false })
                                this.props.navigation.navigate('HomeScreen')
                            }, 2000)

                        }
                        else {
                            this.setState({ toastColor: errorColor, toastMessage: response.message, toastVisible: true })
                            setTimeout(() => {
                                this.setState({ toastVisible: false, spinnerVisible: false })
                            }, 2000)
                            //alert(response.message)
                        }
                    })

            }
        }, 500)
    }
    render() {
        const navigation = this.props.navigation;
        console.warn('hhhhhhhh=--->', this.props.profileData)
        return (
            <View style={ConatinerViewWithoutPadding}>
                <Header navigation={navigation} title="Help" backButtonNavigation={true} />
                <Loader spinnerVisible={this.state.spinnerVisible} />
                <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={ConatinerViewWithPadding}>
                    <View style={{ height: hp('30%'), width: wp('90%'), justifyContent: 'center', alignItems: 'center' }}>
                        <Image resizeMode="contain" source={require('../../Assets/icons/headphone.png')} />
                    </View>
                    <View style={{ padding: wp('5%') }}>
                        <View style={{ padding: wp('2%') }}>
                            <View style={{}}>
                                <Text style={labelText}>Full name*</Text>
                                <View style={TextInputViewWithImage}>
                                    <TextInput
                                        style={TextInputView}
                                        value={this.state.name}
                                        placeholder="XYZ"
                                        editable= {false}
                                        keyboardType={'default'}
                                        maxLength={56}
                                        onChangeText={(text) => this.onChange(text.trim(), "Name")}
                                        //onSubmitEditing={() => this.refs.email.focus()}
                                        onFocus={() => this.setState({ nameErr: '' })}
                                    />
                                    <Image resizeMode="contain" style={TextInputImage} source={require('../../Assets/icons/people.png')} />
                                </View>
                                {this.state.nameErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.nameErr}</Text>}
                            </View>
                            <View style={textInputMargin}>
                                <Text style={labelText}>Email id*</Text>
                                <View style={TextInputViewWithImage}>
                                    <TextInput
                                        style={TextInputView}
                                        value={this.state.email}
                                        placeholder="xxxx@app.com"
                                        maxLength={56}
                                        editable= {false}
                                        keyboardType={'email-address'}
                                        onChangeText={(text) => this.onChange(text.trim(), "Email")}
                                        //ref="email"
                                        //onSubmitEditing={() => this.refs.discription.focus()}
                                        onFocus={() => this.setState({ emailErr: '' })}
                                    />
                                    <Image resizeMode="contain" style={TextInputImage} source={require('../../Assets/icons/email.png')} />
                                </View>
                                {this.state.emailErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.emailErr}</Text>}
                            </View>
                            <View style={textInputMargin}>
                                <Text style={labelText}>Description*</Text>
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
                                        //ref="discription"
                                        
                                        onChangeText={(text) => this.onChange(text, "Dis")}
                                        onFocus={() => this.setState({ DescriptionErr: '' })}
                                    />

                                    <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                        <Image resizeMode="contain" style={TextInputImage} source={require('../../Assets/icons/description.png')} />
                                    </View>
                                </View>
                                {this.state.DescriptionErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.DescriptionErr}</Text>}
                            </View>

                            <TouchableOpacity activeOpacity={0.9}  onPress={() => this.Submit()} style={[Button1, { marginTop: hp('5%') }]}>
                                <Text style={ButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </KeyboardAwareScrollView>
            </View>
        )
    }
}

export default connect(
    state => ({
        profileData: state.SaveProfileReducer.profileData
    }), null
)(HelpScreen)