import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ImageBackground, FlatList, Platform, Switch } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor, errorColor, sliderColor, button2Color, dateConverterOfMilli, ageValidation } from '../../Utils/responsive';
import { Dropdown } from 'react-native-material-dropdown';
import { validateEmail, validatePassword, validatePhoneNo, validateRestoCode } from '../../Services/validation';
import { NodeAPI, NodeAPIForm } from '../../Services/apiServices';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button1, ButtonText, ConatinerViewWithPadding, BigHeadingText, textInputMargin, SmallTextHeading, TextInputViewWithImage, ConatinerViewWithoutPadding, TextInputView, labelText, TextInputImage } from '../../Utils/commonStyles';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import { Toast, Loader } from '../../Components/modals';
import Tooltip from 'react-native-walkthrough-tooltip';
import DateTimePicker from "react-native-modal-datetime-picker";


const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = ['Cancel', 'Camera', 'Gallery']
const title = 'Open Image from'
const passwordInfo = '*Password must be 8-13 characters long, must have 1 lowercase, 1 uppercase, 1 number & a special character eg. !@#$%^&.'
export default class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      priceCategoryDetail: false,
      passwordDetail: false,
      userName: '',
      userNameErr: '',
      fullName: '',
      fullNameErr: '',
      userEmail: '',
      userEmailErr: '',
      genderType: 'Male',
      switchValue: false,
      isDateTimePickerVisible: false,
      activeTab: "setdate",
      mode: 'date',
      DOB: '',
      DOBErr: '',
      password: '',
      passwordErr: '',
      confirmPassword: '',
      confirmPasswordErr: '',
      errModalMessage: '',
      ProfileImage: '',
      ProfileImageErr: '',
      errMessageArr: [],
      passwordHide: true,
      ConfPasswordHide: true,
      toastColor: '',
      toastMessage: '',
      toastVisible: false,
      spinnerVisible: false,
      socialData: ''
    };
  }

  componentDidMount() {
    // var socialData = this.props.navigation.getParam('socialData', '')
    // console.warn("helllooooo======>", socialData)
    // if (socialData != '') {
    //   if (socialData.socialType == "facebook") {
    //     this.setState({ socialData: socialData, userEmail: socialData.userData.email, userName: socialData.userData.name })
    //   }
    //   else {
    //     this.setState({ socialData: socialData, userEmail: socialData.userInfo.user.email, userName: socialData.userInfo.user.name })
    //   }
    // }

  }

  _info = () => {
    this.state.passwordDetail = !this.state.passwordDetail
    this.setState({ passwordDetail: this.state.passwordDetail })
  }
  // for image picker
  showActionSheet() {
    this.setState({ ProfileImageErr: '', errMessageArr: [] })
    this.ActionSheet.show()
  }

  handlePress(i) {
    this.setState({
      selected: i
    })
    if (i == 1) {
      ImagePicker.openCamera({
        width: 300,
        height: 300,
        compressImageQuality: 0.5,
        cropping: true,
        includeBase64: false
      }).then(image => {
        console.log('---------->profile', image)
        this.setState({
          ProfileImage: image,
        })
      }).catch((err) => {
        console.warn(err)
      });
    } else if (i == 2) {
      ImagePicker.openPicker({
        width: 300,
        height: 300,
        compressImageQuality: 0.5,
        cropping: true,
        includeBase64: false
      }).then(image => {
        console.log('---------->', image)
        console.log('---------->profile', image)
        this.setState({
          ProfileImage: image,
        })
      }).catch((err) => {
        // alert(err.message);
      });
    }
  }

  // handle text input
  onChange(text, type) {
    //this pattern checks for emoji
    var pattern = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/
    if (type === 'Email') {
      if (!pattern.test(text)) {
        this.setState({
          userEmail: text.replace(/[^A-Za-z0-9@_.]/g, ''),
          errMessageArr: []
        });
      }

    }
    if (type === 'Password') {
      this.setState({
        password: text.replace(/[^A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[^_`{|}~]/g, ''),
        errMessageArr: []
      });
    }
    if (type === 'confirmPassword') {
      this.setState({
        confirmPassword: text.replace(/[^A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[^_`{|}~]/g, ''),
        errMessageArr: []
      });
    }
    if (type == "Name") {
      this.setState({
        userName: text.trim(),
        errMessageArr: []
      });
    }
    if (type == "fullName") {
      this.setState({
        fullName: text,
        errMessageArr: []
      });
    }
  }
  //.replace(/[^A-Za-z ]/g, ''),

  _handleToggleSwitch = () => {
    this.setState({
      switchValue: !this.state.switchValue
    }, () => {
      this.state.switchValue ? this.setState({ genderType: "Female" }) : this.setState({ genderType: "male" })
    })

  }

  showDateTimePicker(mode) {
    //alert(mode)
    this.setState({ isDateTimePickerVisible: true, mode: mode, DOBErr: '', errMessageArr: [] });
  }

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  handleDatePicked = (date) => {
    //console.warn('A date has been picked: ', date);
    if (this.state.mode == 'date') {
      //alert( new Date(date).toLocaleDateString())
      if (ageValidation(date) >= 18) {
        var fromatedDate = dateConverterOfMilli(new Date(date).toISOString())
        //console.warn(" DOB1111=====>",ageValidation(fromatedDate))
        this.setState({ DOB: fromatedDate })
      }
      else {
        this.setState({
          DOBErr: "*User should be atleast 18+",
          errMessageArr: this.state.errMessageArr.push("*User should be atleast 18+")
        })
      }
      // var fromatedDate = dateConverterOfMilli(new Date(date).toISOString()) 
      // this.setState({ DOB: fromatedDate })
    } else {
      this.setState({ time: new Date(date).toLocaleTimeString() })
      //alert( new Date(date).toLocaleTimeString())
    }

    this.hideDateTimePicker();

  };


  signup() {
    let {
      errMessageArr,
      userName,
      fullName,
      userEmail,
      DOB,
      password,
      confirmPassword,
      ProfileImage
    } = this.state;
    errMessageArr = [];

    // start
    // if (ProfileImage == '' || ProfileImage === null || ProfileImage === undefined) {
    //   this.setState({
    //     ResturantImageErr: "*Please select restaurent image",
    //     errMessageArr: errMessageArr.push("*Please select restaurent image")
    //   })
    // }
    if (userName == '' || userName === null || userName === undefined) {
      this.setState({
        userNameErr: "*Please enter  username",
        errMessageArr: errMessageArr.push("*Please enter username")
      })
    }
    if (fullName == '' || fullName === null || fullName === undefined) {
      this.setState({
        fullNameErr: "*Please enter name",
        errMessageArr: errMessageArr.push("*Please enter name")
      })
    }
    if (validateEmail(userEmail).status !== true) {
      this.setState({
        errMessageArr: errMessageArr.push(validateEmail(userEmail).message),
        userEmailErr: validateEmail(userEmail).message
      })
    }
    if (DOB == '' || DOB === null || DOB === undefined) {
      this.setState({
        DOBErr: "*Please enter date of birth",
        errMessageArr: errMessageArr.push("*Please enter date of birth")
      })
    }
    if (validatePassword(password).status !== true) {
      this.setState({
        errMessageArr: errMessageArr.push(validatePassword(password).message),
        passwordErr: validatePassword(password).message
      })
    }
    if (password != confirmPassword) {
      this.setState({
        errMessageArr: errMessageArr.push("*Password and confirm password does not match."),
        confirmPasswordErr: "*Password and confirm password does not match."
      })
    }
    setTimeout(() => {
      if (this.state.errMessageArr.length == 0) {
        this.setState({
          spinnerVisible: true
        })
        let form = new FormData();
        if (this.state.ProfileImage != '') {
          let restImage = [];
          restImage.push(this.state.ProfileImage);
          restImage &&
            restImage.map(image => {
              let parts = image.path.split("/");
              let uri =
                Platform.OS === "android"
                  ? image.path
                  : image.path.replace("file://", "");
              let name = parts[parts.length - 1];
              let type = image.mime;

              var file = {
                uri,
                name,
                type
              };
              form.append("ProfileImage", file);
              // form.append("subDeals[]", this.state.dealsArr[0]);
              // console.warn('deal', file)
            });
        }

        form.append("userType", "USER");
        form.append("userName", this.state.userName);
        form.append("name", this.state.fullName)
        form.append("email", this.state.userEmail);
        form.append("gender", this.state.genderType);
        form.append("dob", this.state.DOB);
        form.append("socialData", '');
        // form.append("termsAndCondition", "test");
        form.append("password", this.state.password);
        // form.append("socialData", JSON.stringify(this.state.socialData));
        console.log("FORMMMMMM=====>", form)
        return NodeAPIForm(form, "signup", 'POST')
          .then(response => {
            console.warn("response=====>", response);
            if (response.status === 200) {
              this.setState({ toastColor: sliderColor, toastMessage: response.message, toastVisible: true })
              setTimeout(() => {
                this.setState({ toastVisible: false, spinnerVisible: false })
                this.props.navigation.navigate('LoginScreen')
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

  _showHide(type) {
    if (type == "restoCode") {
      this.state.restoCodeHide = !this.state.restoCodeHide
      this.setState({ restoCodeHide: this.state.restoCodeHide })
    }
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
    return (
      <View style={ConatinerViewWithoutPadding}>
        <Loader spinnerVisible={this.state.spinnerVisible} />
        <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          mode={this.state.mode}
          // minimumDate={new Date()}
          maximumDate={new Date()}
        />
        <View style={ConatinerViewWithPadding}>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.HeadingView}>
              <Text style={BigHeadingText} >Sign Up</Text>
            </View>
            <View style={styles.LoginFormView}>
              <View style={{ height: hp("20%"), justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: 130, justifyContent: 'center', alignItems: 'center' }} >
                  <TouchableOpacity onPress={() => this.showActionSheet()} style={{
                    top: '28%', left: '38%', elevation: 3, zIndex: 5, shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }}>
                    <Image resizeMode='contain' source={require('../../Assets/icons/add.png')} />
                  </TouchableOpacity>
                  <View style={{
                    height: 120, width: 120, borderRadius: 64, borderColor: "#cacaca", borderWidth: 1, justifyContent: 'center', alignItems: 'center', elevation: 3, marginBottom: hp('4%'), shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }} >
                    <Image style={{ height: "100%", width: "100%", borderRadius: 60, }} resizeMode="cover" source={this.state.ProfileImage == '' ? require('../../Assets/profile.jpg') : { uri: this.state.ProfileImage.path }} />
                  </View>
                </View>

                {/* {this.state.ResturantImageErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.ResturantImageErr}</Text>} */}
              </View>
              <Text style={[SmallTextHeading, { textAlign: 'center' }]}>Create an account</Text>
              <View style={{ padding: hp('1%'), marginTop: hp('1%') }}>
                <View style={{}}>
                  <Text style={labelText}>Username*</Text>
                  <View style={TextInputViewWithImage}>
                    <TextInput
                      style={TextInputView}
                      value={this.state.userName}
                      //placeholder="Restaurant name"
                      maxLength={56}
                      keyboardType={'default'}
                      onChangeText={(text) => this.onChange(text, "Name")}
                      onSubmitEditing={() => this.refs.fullName.focus()}
                      onFocus={() => this.setState({ userNameErr: '' })}
                    />
                    <Image resizeMode="contain" style={TextInputImage} source={require('../../Assets/icons/u_name.png')} />
                  </View>
                  {this.state.userNameErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.userNameErr}</Text>}
                </View>
                <View style={textInputMargin}>
                  <Text style={labelText}>Full name*</Text>
                  <View style={TextInputViewWithImage}>
                    <TextInput
                      style={TextInputView}
                      value={this.state.fullName}
                      placeholder=""
                      maxLength={56}
                      keyboardType={'default'}
                      onChangeText={(text) => this.onChange(text, "fullName")}
                      ref="fullName"
                      onSubmitEditing={() => this.refs.email.focus()}
                      onFocus={() => this.setState({ fullNameErr: '' })}
                    />
                    <Image resizeMode="contain" style={TextInputImage} source={require('../../Assets/icons/people.png')} />
                  </View>
                  {this.state.fullNameErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.fullNameErr}</Text>}
                </View>
                <View style={textInputMargin}>
                  <Text style={labelText}>Enter email</Text>
                  <View style={TextInputViewWithImage}>
                    <TextInput
                      style={TextInputView}
                      value={this.state.userEmail}
                      placeholder="xxxx@app.com"
                      maxLength={56}
                      keyboardType={'email-address'}
                      onChangeText={(text) => this.onChange(text.trim(), "Email")}
                      ref="email"
                      onSubmitEditing={() => this.refs.password.focus()}
                      onFocus={() => this.setState({ userEmailErr: '' })}
                    />
                    <Image resizeMode="contain" style={TextInputImage} source={require('../../Assets/icons/email.png')} />
                  </View>
                  {this.state.userEmailErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.userEmailErr}</Text>}
                </View>
                <View style={textInputMargin}>
                  <Text style={labelText}>Gender*</Text>
                  <View style={TextInputViewWithImage}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                      <Text style={labelText}>Male</Text>
                      <View style={styles.genderSwitch}>
                        <Switch
                          style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                          trackColor={{ true: '#00e76e', false: '#00e76e' }}
                          thumbColor='#ffffff'
                          ios_backgroundColor='#00e76e'
                          onValueChange={this._handleToggleSwitch}
                          value={this.state.switchValue}
                        />
                      </View>
                      <Text style={labelText}>Female</Text>
                    </View>
                    <Image resizeMode="contain" style={TextInputImage} source={require('../../Assets/icons/gender.png')} />
                  </View>
                  {/* {this.state.userEmailErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.userEmailErr}</Text>} */}
                </View>
                <View style={textInputMargin}>
                  <Text style={labelText}>Date of Birth*</Text>
                  <View style={TextInputViewWithImage}>
                    <View style={styles.dateTimeView}>
                      <TouchableOpacity style={styles.dateTimePicker} onPress={() => this.showDateTimePicker('date')}>
                        {
                          this.state.DOB == '' ?
                            <Text style={styles.timeDateFontPlace} >dd/mm/yyyy</Text>
                            :
                            <Text style={styles.timeDateFont}>{this.state.DOB}</Text>
                        }
                      </TouchableOpacity>
                    </View>
                    <Image resizeMode="contain" style={[TextInputImage, { tintColor: "#c0c0c0" }]} source={require('../../Assets/icons/calendar.png')} />
                  </View>
                  {this.state.DOBErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.DOBErr}</Text>}
                </View>
                <View style={textInputMargin}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={labelText}>Password</Text>
                    <Tooltip
                      animated
                      isVisible={this.state.passwordDetail}
                      content={<Text style={{ color: 'white' }} >{passwordInfo}</Text>}
                      contentStyle={{ width: 300, height: 80, backgroundColor: 'black' }}
                      placement="top"
                      onClose={() => this.setState({ passwordDetail: false })}
                    >
                      <TouchableOpacity onPress={() => this._info()}>
                        <Image resizeMode='contain' style={{ marginLeft: wp('1%') }} source={require('../../Assets/icons/information.png')} />
                      </TouchableOpacity>
                    </Tooltip>

                  </View>
                  <View style={TextInputViewWithImage}>
                    <TextInput
                      style={TextInputView}
                      placeholder="••••••••••"
                      value={this.state.password}
                      maxLength={20}
                      secureTextEntry={this.state.passwordHide}
                      keyboardType={'default'}
                      onChangeText={(text) => this.onChange(text.trim(), "Password")}
                      ref="password"
                      onSubmitEditing={() => this.refs.confirmPassword.focus()}
                      onFocus={() => this.setState({ passwordErr: '' })}
                    />
                    <TouchableOpacity onPress={() => this._showHide("password")}>
                      <Image resizeMode="contain" style={[TextInputImage, { tintColor: '#cacaca' }]} source={this.state.passwordHide ? require('../../Assets/icons/hide_eye.png') : require('../../Assets/icons/eye.png')} />
                    </TouchableOpacity>
                  </View>
                  {this.state.passwordErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.passwordErr}</Text>}
                </View>
                <View style={textInputMargin}>
                  <Text style={labelText}>Confirm password*</Text>
                  <View style={TextInputViewWithImage}>
                    <TextInput
                      style={TextInputView}
                      placeholder="••••••••••"
                      value={this.state.confirmPassword}
                      maxLength={20}
                      secureTextEntry={this.state.ConfPasswordHide}
                      keyboardType={'default'}
                      onChangeText={(text) => this.onChange(text.trim(), "confirmPassword")}
                      ref="confirmPassword"
                      //onSubmitEditing={() => this.refs.Password.focus()}
                      onFocus={() => this.setState({ confirmPasswordErr: '' })}
                    />
                    <TouchableOpacity onPress={() => this._showHide("confirmPassword")}>
                      <Image resizeMode="contain" style={[TextInputImage, { tintColor: '#cacaca' }]} source={this.state.ConfPasswordHide ? require('../../Assets/icons/hide_eye.png') : require('../../Assets/icons/eye.png')} />
                    </TouchableOpacity>
                  </View>
                  {this.state.confirmPasswordErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.confirmPasswordErr}</Text>}
                </View>

                <TouchableOpacity onPress={() => this.signup()} style={[Button1, { marginTop: hp('5%') }]}>
                  <Text style={ButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: hp('5%') }} >
                <Text style={[labelText, { textAlign: 'center', fontFamily: fontFamily('bold'), color: '#111111' }]}>Already have an account?</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('LoginScreen')} >
                  <Text style={[labelText, { textAlign: 'center', fontFamily: fontFamily('bold'), color: button2Color }]}> Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={title}
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={(index) => this.handlePress(index)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  HeadingView: {
    height: hp("15%"),
    marginTop: 5,
    justifyContent: 'center',
  },
  LoginFormView: {
    flex: 1,
    paddingHorizontal: wp('5%')
  },
  genderSwitch: {
    backgroundColor: '#00e76e',
    borderRadius: hp('20%'),
    marginHorizontal: 10,
  },
  dateTimeView: {
    flex: 1,
    // borderBottomWidth: 2,
    // borderBottomColor: "#111111"
  },
  dateTimePicker: {
    height: hp('6%'),
    justifyContent: 'center'
  },
  timeDateFont: {
    fontSize: hp('2%'),
    color: '#111111'
  },
  timeDateFontPlace: {
    fontSize: hp('2%'),
    color: '#c0c0c0'
  },
})