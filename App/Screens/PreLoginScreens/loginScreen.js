import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, AsyncStorage, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, errorColor } from '../../Utils/responsive';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail, validatePassword } from '../../Services/validation';
import { Button1, ButtonText, ConatinerViewWithPadding, BigHeadingText, textInputMargin, SmallTextHeading, TextInputViewWithImage, TextInputView, labelText, TextInputImage, ConatinerViewWithoutPadding } from '../../Utils/commonStyles';
import { NodeAPI } from '../../Services/apiServices';
import { NavigationEvents } from 'react-navigation';
import { Toast, Loader } from '../../Components/modals';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';
import {
  LoginButton, AccessToken, LoginManager, GraphRequestManager,
  GraphRequest

} from 'react-native-fbsdk';


export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      RememberMe: false,
      spinnerVisible: false,
      email: '',
      emailErr: '',
      password: '',
      passwordErr: '',
      errMessageArr: [],
      passwordHide: true,
      toastVisible: false,
      facebookResult: '',
      fcm_token: ''
    };
  }

  async componentDidMount() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    this.setState({
      fcm_token: fcmToken
    },()=>console.warn("tokenlll ----- >", this.state.fcm_token))
    await this._configureGoogleSignIn();
  }

  _configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId: '227309121620-5h8n72t488ui8kghp0q6sls3071luujk.apps.googleusercontent.com',
      // iosClientId: '499150292135-3bk5tt7stfvbckm8is8uamte7eq69o2i.apps.googleusercontent.com',
      offlineAccess: false,
    });
  }

  fcm_TokenFun = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    this.setState({
      fcm_token: fcmToken
    },()=>console.warn("tokenlll ----- >", this.state.fcm_token))
  }

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.warn('User Info --> ', userInfo)
      const socialData = userInfo
      let variables = { userInfo, fcm_token: this.state.fcm_token, socialType: 'google' }
      this.setState({
        spinnerVisible: true
      })
      return NodeAPI(variables, "googleAuthUser", 'POST')
        .then(response => {
          console.warn("Google resource=-===>", response)
          if (response.status === 200) {
            AsyncStorage.setItem("auth_token", response.token)
            setTimeout(() => {
              this.props.navigation.navigate('mainRoute')
              this.setState({
                spinnerVisible: false
              })
            }, 1000);
          }
          if (response.status === 400) {
            // alert(response.message)
            this.setState({ toastColor: errorColor, toastMessage: response.message, toastVisible: true })
            setTimeout(() => {
              this.setState({ toastVisible: false, spinnerVisible: false })
            }, 3000)
          }
        })
      //alert(JSON.stringify(userInfo))
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // sign in was cancelled
        Alert.alert('cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation in progress already
        Alert.alert('in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('play services not available or outdated');
      } else {
        Alert.alert('Something went wrong', error.toString());
      }
    }
  };


  faceBookLogin = async () => {
    try {
      let result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email"
      ]);
      if (!result || result.isCancelled) {
        return;
      }
      let token = await AccessToken.getCurrentAccessToken();
      console.log("access Token--->", token)
      const infoRequest = new GraphRequest(
        "/me?fields=id,email,name,picture",
        null,
        async (error, result) => {
          // call for facebook login
          if (result) {
            console.warn("reeeeeeeeee====>", result)
            await this.setState({ facebookResult: result });
            // const givenName = result.name.split(" ")[0];
            // const familyName = result.name.split(" ")[1];
            let data = {
              // first_name: givenName,
              name: result.name,
              // last_name: familyName,
              socialType: "facebook",
              socialId: result.id,
              email: result.email,
              fcm_token: this.state.fcm_token
              // deviceToken: DeviceInfo.getUniqueID()
            };
            // this.setState({ showLoader: true });
            // this.props.socialData(data);
            this.facebookLoginApi(data)
            console.warn(data)
          }
        }
      );
      new GraphRequestManager().addRequest(infoRequest).start();
      await LoginManager.logOut();
    } catch (error) {

      console.warn('err', error)
      // do nothing
    }
  };
  facebookLoginApi = (userData) => {
    console.warn('inside funccccccccc')
    this.setState({
      spinnerVisible: true
    })
    let variables = { userData, socialType: 'facebook' }
    return NodeAPI(variables, "facebookAuthUser", 'POST')
      .then(response => {
        console.warn("Google resource=-===>", response)
        if (response.status === 200) {
          AsyncStorage.setItem("auth_token", response.token)
          setTimeout(() => {
            this.props.navigation.navigate('mainRoute')
            this.setState({
              spinnerVisible: false
            })
          }, 1000);
        }
        if (response.status === 400) {
          // else {
          //alert(response.message)
          this.setState({ toastColor: errorColor, toastMessage: response.message, toastVisible: true })
          setTimeout(() => {
            this.setState({ toastVisible: false, spinnerVisible: false })
            // this.props.navigation.navigate('SignupScreen', { socialData: variables })
            //this.props.navigation.navigate('mainRoute')
          }, 2000)
        }
      })
  }


  _rememberMe() {
    this.state.RememberMe = !this.state.RememberMe
    this.setState({ RememberMe: this.state.RememberMe })
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

    } if (type === 'password') {
      this.setState({
        password: text.replace(/[^A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[^_`{|}~]/g, ''),
        errMessageArr: []
      });
    }
  }

  login() {
    let {
      errMessageArr,
      email,
      password
    } = this.state;
    errMessageArr = [];

    if (validateEmail(email).status !== true) {
      this.setState({
        errMessageArr: errMessageArr.push(validateEmail(email).message),
        emailErr: validateEmail(email).message
      })
    }
    if (validatePassword(password).status !== true) {
      this.setState({
        errMessageArr: errMessageArr.push(validatePassword(password).message),
        passwordErr: validatePassword(password).message
      })
    }
    setTimeout(() => {
      if (this.state.errMessageArr.length == 0) {
        this.setState({
          spinnerVisible: true
        })
        var variables = {
          email: this.state.email.toLowerCase(),
          password: this.state.password,
          fcm_token: this.state.fcm_token,
          userType: 'USER'
        }
        return NodeAPI(variables, "login", 'POST')
          .then(response => {
            console.warn(response)
            if (response.status === 200) {
              AsyncStorage.setItem("auth_token", response.token)
              let variables = {}
              return NodeAPI(variables, "profileUser", 'GET', response.token)
                .then(response => {
                  console.warn("reeeeee profile at login=", response)
                  if (response.status === 200) {
                    console.warn('respons data ====>', response)
                    AsyncStorage.setItem("profile_Data", JSON.stringify(response.data))
                    //AsyncStorage.setItem("profile_Data", response.data)
                    setTimeout(() => {
                      this.props.navigation.navigate('mainRoute')
                      this.setState({
                        spinnerVisible: false
                      })
                    }, 1000);
                  }
                  else {
                    this.setState({ toastColor: errorColor, toastMessage: response.message, toastVisible: true })
                    setTimeout(() => {
                      this.setState({ toastVisible: false, spinnerVisible: false })
                      //this.props.navigation.navigate('mainRoute')
                    }, 2000)
                  }

                }).catch(err => {
                  return { message: "Server encountered a problem please retry." }
                });
            }
            else {
              //alert(response.message)
              this.setState({ toastColor: errorColor, toastMessage: response.message, toastVisible: true })
              setTimeout(() => {
                this.setState({ toastVisible: false, spinnerVisible: false })
                //this.props.navigation.navigate('mainRoute')
              }, 2000)
            }
          })
      }
    }, 500)
  }

  _showHide() {
    this.state.passwordHide = !this.state.passwordHide
    this.setState({ passwordHide: this.state.passwordHide })
  }

  render() {
    return (
      <View style={ConatinerViewWithoutPadding}>
        <NavigationEvents
          onWillFocus={() =>
            this.fcm_TokenFun()
          }
        />
        <Loader spinnerVisible={this.state.spinnerVisible} />
        <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />
        <View style={ConatinerViewWithPadding}>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.HeadingView}>
              <Text style={BigHeadingText} >Login</Text>
            </View>
            <View style={styles.LoginFormView}>
              <View>
                <Text style={SmallTextHeading}>Sign into your account</Text>
                <View style={{ padding: hp('1.5%') }}>
                  <View >
                    <Text style={labelText}>Email id*</Text>
                    <View style={TextInputViewWithImage}>
                      <TextInput
                        style={TextInputView}
                        value={this.state.email}
                        maxLength={56}
                        keyboardType={'email-address'}
                        placeholder="xxxx@app.com"
                        onChangeText={(text) => this.onChange(text.trim(), "email")}
                        onSubmitEditing={() => this.refs.Password.focus()}
                        onFocus={() => this.setState({ emailErr: '' })}
                      />
                      <Image resizeMode="contain" style={TextInputImage} source={require('../../Assets/icons/email.png')} />
                    </View>
                    {this.state.emailErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.emailErr}</Text>}
                  </View>
                  <View style={textInputMargin}>
                    <Text style={labelText}>Password*</Text>
                    <View style={TextInputViewWithImage}>
                      <TextInput
                        style={TextInputView}
                        placeholder="••••••••••"
                        value={this.state.password}
                        maxLength={20}
                        keyboardType={'default'}
                        ref="Password"
                        onChangeText={(text) => this.onChange(text.trim(), "password")}
                        secureTextEntry={this.state.passwordHide}
                        onFocus={() => this.setState({ passwordErr: '' })}
                      />
                      <TouchableOpacity onPress={() => this._showHide()}>
                        <Image resizeMode="contain" style={[TextInputImage, { tintColor: '#cacaca' }]} source={this.state.passwordHide ? require('../../Assets/icons/hide_eye.png') : require('../../Assets/icons/eye.png')} />
                      </TouchableOpacity>
                    </View>
                    {this.state.passwordErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.passwordErr}</Text>}
                  </View>
                  <View style={styles.ButtonsView}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        {/* <TouchableOpacity onPress={() => this._rememberMe()}>
                          <Image style={TextInputImage} resizeMode="contain" source={this.state.RememberMe ? require('../../Assets/icons/select.png') : require('../../Assets/icons/deselect.png')} />
                        </TouchableOpacity> */}
                      </View>
                      {/* <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: wp('2%') }}>
                        <Text style={labelText}>Remember me</Text>
                      </View> */}
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPasswordScreen')}>
                        <Text style={[labelText, { textAlign: 'right' }]}>Forgot Password?</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => this.login()} style={Button1}>
                    <Text style={ButtonText}>Login</Text>
                  </TouchableOpacity>
                  <View style={{ marginVertical: hp('2%') }}>
                    <Text style={[labelText, { textAlign: 'center', fontFamily: fontFamily('bold'), color: '#111111' }]}>Or Register using social media</Text>
                    <View style={{ flexDirection: 'row', marginTop: hp("3%"), }}>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.faceBookLogin()} >
                          <Image resizeMode="contain" source={require('../../Assets/icons/facebook.png')} />
                        </TouchableOpacity>
                      </View>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this._signIn()} >
                          <Image resizeMode="contain" source={require('../../Assets/icons/google.png')} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('SignupScreen')} >
                <Text style={[labelText, { textAlign: 'center', fontFamily: fontFamily('bold'), color: '#111111' }]}>Don't have an account? SIGN UP</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  HeadingView: {
    height: hp('30%'),
    justifyContent: 'center',
  },
  LoginFormView: {
    height: hp('70%'),
    paddingHorizontal: wp('5%')
  },
  ButtonsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('2%')
  }
})