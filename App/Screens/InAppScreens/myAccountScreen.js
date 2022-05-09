import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Switch, Platform, Picker, TextInput, Modal, TouchableHighlight, ImageBackground, AsyncStorage } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor, sliderColor, errorColor, borderLight, dateConverterOfMilli, ageValidation } from '../../Utils/responsive';
import Header from '../../Components/commonHeader';
import { Swiper, TitleBar, TabBar } from '../../Components/react-native-awesome-viewpager';
import DateTimePicker from "react-native-modal-datetime-picker";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail, validatePassword, validatePhoneNo, validateRestoCode } from '../../Services/validation';
import { Button1, Button2, ButtonText, ConatinerViewWithPadding, BigHeadingText, SmallTextHeading, TextInputViewWithImage, TextInputView, labelText, TextInputImage, textInputMargin, ConatinerViewWithoutPadding } from '../../Utils/commonStyles';
import { FlatList } from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import { Toast, Loader } from '../../Components/modals';
import { imageUrl, NodeAPIForm, NodeAPI } from '../../Services/apiServices';
import { connect } from 'react-redux';
import * as saveProfileAction from '../../app_redux/actions/SaveProfileDataAction';
import { NavigationEvents } from 'react-navigation';



// Action sheet view
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = ['Cancel', 'Camera', 'Gallery']
const title = 'Open Image from'

class MyAccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toastVisible: false,
      spinnerVisible: false,
      toastColor: '',
      toastMessage: '',
      Restocode: '',
      switchValue: false,
      userData: {},
      allData: {},
      ProfileImage: '',
      imageUpload: false, // false on upload time 
      imageType: '',
      edit: false,
      multipleImage: false,
      name: '',
      userName: '',
      email: '',
      emailErr: '',
      auth_token: '',
      errMessageArr: [],
      errMessageArr1: [],
      isVisible: false,
      addType: false,
      passwordHide: true,
      genderType: 'Male',
      genderSwitch: false,
      isDateTimePickerVisible: false,
      activeTab: "setdate",
      mode: 'date',
      DOB: '',
      notificationValue: true,
      rewards: "",
      rewardName: "",
      rewardImage: "",
    };

  }

  componentDidMount() {
    this._retrieveData();
  }

  // Date picker function
  showDateTimePicker(mode) {
    if (this.state.edit) {
      this.setState({ isDateTimePickerVisible: true, mode: mode, DOBErr: '', errMessageArr: [] });
    }
  }

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  handleDatePicked = (date) => {

    if (this.state.mode == 'date') {
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
    } else {
      this.setState({ time: new Date(date).toLocaleTimeString() })
    }
    this.hideDateTimePicker();
  };

  // Gender toggle Switch
  _handleToggleSwitch = () => {
    if (this.state.edit) {
      this.setState({
        genderSwitch: !this.state.genderSwitch
      })
    }
  }

  // Notification Toggle Switch
  _handleToggleSwitchNotification = () => {
    this.setState({
      notificationValue: !this.state.notificationValue
    })
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
  }

  // for image picker and image upload function
  showActionSheet(type) {
    console.warn('type===', type)
    if (type == 'profile') {
      this.setState({ imageType: 'profile', multipleImage: false, ResturentImageErr: '', errMessageArr: [] })
    }
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
        multiple: this.state.multipleImage,
        cropping: true,
        includeBase64: false
      }).then(image => {
        if (this.state.imageType === 'profile') {
          console.warn("inside profile")
          this.setState({
            ProfileImage: image,
            imageUpload: true
          })
        }
      }).catch((err) => {
      });
    } else if (i == 2) {
      ImagePicker.openPicker({
        width: 300,
        height: 300,
        compressImageQuality: 0.5,
        cropping: true,
        multiple: this.state.multipleImage,
        includeBase64: false
      }).then(image => {
        if (this.state.imageType === 'profile') {
          console.warn("inside profile", image)
          this.setState({
            ProfileImage: image,
            imageUpload: true
          })
        }
      }).catch((err) => {
      });
    }
  }


  // edit Profile button 
  _editProfile = () => {
    var data = this.state.edit;
    data = !data;
    this.setState({ edit: data })
  }

  // get profile data from the AsyncStroage
  _retrieveData = async () => {
    const auth_token = await AsyncStorage.getItem('auth_token');
    // var value = await AsyncStorage.getItem('profile_Data');
    var value = this.props.profileData;
    console.warn('value11====', auth_token);
    console.warn('valuefdsf====', value);
    if (value !== null) {
      value = value;
      var userData = value;
      var email = value.email;
      var profileImage = value.ProfileImage;
      var genderValue = value.gender == "Male" ? false : true;
      var name = value.name;
      var dob = value.dob;
      var userName = value.userName;
      var rewards = value.rewards;
      var rewardName = value.categoryName;
      var rewardImage = value.categoryImage;
      //alert(JSON.stringify(value))
      this.setState({
        spinnerVisible: false,
        imageUpload: false,
        userData: userData,
        email: email,
        name: name,
        ProfileImage: profileImage,
        DOB: dob,
        genderSwitch: genderValue,
        userName: userName,
        rewards: rewards,
        rewardName: rewardName,
        rewardImage: rewardImage,
        auth_token: auth_token,
      }, () => { console.warn('userData===', this.state.ProfileImage) })
    }
  }

  // Update Profile function 
  _updateProfile = () => {
    let {
      email,
      DOB,
      address,
      genderSwitch,
      errMessageArr,
    } = this.state;
    errMessageArr = [];
    var gender = genderSwitch ? "Female" : "Male"
    if (validateEmail(email).status !== true) {
      this.setState({
        errMessageArr: errMessageArr.push(validateEmail(email).message),
        emailErr: validateEmail(email).message
      })
    }
    if (DOB == '' || DOB === null || DOB === undefined) {
      this.setState({
        DOBErr: "*Please enter DOB",
        errMessageArr: errMessageArr.push("*Please enter DOB")
      })
    }
    setTimeout(() => {
      if (this.state.errMessageArr.length == 0) {
        this.setState({
          spinnerVisible: true
        })
        let form = new FormData();
        if (this.state.imageUpload) {
          let profileImage = [];
          profileImage.push(this.state.ProfileImage);
          profileImage &&
            profileImage.map(image => {
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
        else {
          form.append("ProfileImage", this.state.ProfileImage);
        }
        form.append("name", this.state.name);
        form.append("email", this.state.email);
        form.append("userName", this.state.userName);
        form.append("gender", gender);
        form.append("dob", this.state.DOB);
        console.log("FORMMMMMM=====>", form)
        return NodeAPIForm(form, "profileUpdateUser", 'PUT', this.state.auth_token)
          .then(response => {
            console.warn("response=====>", response);
            if (response.status === 200) {
              //AsyncStorage.removeItem('profile_Data');
              console.warn("yess i m in")
              this.setState({
                toastColor: sliderColor,
                toastMessage: response.message,
                toastVisible: true,
                imageUpload: false,
                ProfileImage: response.data.ProfileImage,
                email: response.data.email,
                name: response.data.name,
                userName: response.data.userName,
                DOB: response.data.dob
              })
              this.props.saveProfileData(JSON.stringify(response.data))
              // AsyncStorage.setItem("profile_Data", JSON.stringify(response.data))
              setTimeout(() => {
                this.setState({ toastVisible: false, spinnerVisible: false, edit: false })
                //this.props.navigation.navigate('LoginScreen')
              }, 200)

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

  refreshState() {
    this.setState({
      edit: false
    })
  }


  render() {
    const navigation = this.props.navigation;
    console.warn("address------>", this.props.profileData)
    return (
      <View style={ConatinerViewWithoutPadding}>
        <NavigationEvents
          onWillFocus={() =>
            this.refreshState()
          }
        />
        <Header navigation={navigation} title="My account" backButtonNavigation={true} />
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          mode={this.state.mode}
          maximumDate={new Date()}
        />
        <Loader spinnerVisible={this.state.spinnerVisible} />
        <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />
        <TitleBar
          initialPage={0}
          backgroundColor={backgroundColor}
          borderStyle={{ borderBottomColor: "#111111", borderBottomWidth: 5, }}
          style={styles.container}
          titles={['Profile', 'Settings']}>
          {/* main account view */}
          <View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Profile Image View */}
              <View style={{ height: hp('35%'), justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ height: hp('20%') }}>
                  <View style={{ height: 120, width: 120, borderRadius: 64, borderColor: "#cacaca", borderWidth: 1, justifyContent: 'center', alignItems: 'center', elevation: 5, marginBottom: hp('4%') }} >
                    <Image style={{ height: "100%", width: "100%", borderRadius: 60, }} resizeMode="cover" source={this.state.ProfileImage == '' ? require('../../Assets/profile.jpg') : this.state.imageUpload ? { uri: this.state.ProfileImage.path } : { uri: `${imageUrl}${this.state.ProfileImage}` }} />
                  </View>
                  {/* Image Edit Button View */}
                  {this.state.edit ?
                    <TouchableOpacity onPress={() => this.showActionSheet('profile')} style={{
                      bottom: '54%', left: '9%', elevation: 3, zIndex: 5, shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                    }}>
                      <Image resizeMode="contain" style={{ height: hp('13%'), width: wp('13%') }} source={require('../../Assets/icons/edit_black.png')} />
                    </TouchableOpacity>
                    : null
                  }
                </View>
                {/* User Name And Email And REVIEWS  */}
                <Text style={SmallTextHeading}>{this.state.name}</Text>
                <Text style={labelText}>{this.state.userName}</Text>
              </View>
              {/* badge and point View */}
              <View style={styles.BadgePointView}>
                <View style={styles.PointsView}>
                  <Text style={SmallTextHeading}>{this.state.rewards}</Text>
                  <Text style={labelText}>Total Points</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <Image resizeMode='contain' style={{ height: '70%', width: '80%' }} source={{ uri: `${imageUrl}${this.state.rewardImage}` }} />
                  </View>
                  <View style={{ flex: 2, justifyContent: 'center', }}>
                    <Text style={SmallTextHeading}>{this.state.rewardName}</Text>
                    <Text style={labelText}>Badge</Text>
                  </View>
                </View>
              </View>
              {/* input form view for profile */}
              <View style={{ flex: 1, backgroundColor: backgroundColor, marginHorizontal: wp('10%'), marginTop: hp('3%') }}>
                {/* User email Input VIew */}
                <View style={textInputMargin}>
                  <Text style={labelText}>Enter email</Text>
                  <View style={TextInputViewWithImage}>
                    <TextInput
                      style={TextInputView}
                      value={this.state.email}
                      editable={false}
                      placeholder="xxxx@app.com"
                      maxLength={56}
                      keyboardType={'email-address'}
                      onChangeText={(text) => this.onChange(text.trim(), "email")}
                      ref="email"
                      onSubmitEditing={() => this.refs.password.focus()}
                      onFocus={() => this.setState({ userEmailErr: '' })}
                    />
                    <Image resizeMode="contain" style={TextInputImage} source={require('../../Assets/icons/email.png')} />
                  </View>
                  {this.state.userEmailErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.userEmailErr}</Text>}
                </View>
                {/* User Gender Input VIew */}
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
                          editable={this.state.edit}
                          ios_backgroundColor='#00e76e'
                          onValueChange={this._handleToggleSwitch}
                          value={this.state.genderSwitch}
                        />
                      </View>
                      <Text style={labelText}>Female</Text>
                    </View>
                    <Image resizeMode="contain" style={TextInputImage} source={require('../../Assets/icons/gender.png')} />
                  </View>
                </View>
                {/* User Date of birth Input VIew */}
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
                {/* Save And Edit Button View */}
                <View style={{ margin: hp('5%') }}>
                  {
                    this.state.edit ?
                      <TouchableOpacity onPress={() => this._updateProfile()} style={[Button1]}>
                        <Text style={[ButtonText]}>Save</Text>
                      </TouchableOpacity>
                      :
                      <TouchableOpacity onPress={() => this._editProfile()} style={[Button2]}>
                        <Text style={[ButtonText]}>Edit</Text>
                      </TouchableOpacity>
                  }
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Settings screen view */}
          <View style={ConatinerViewWithoutPadding}>
            <View style={[ConatinerViewWithPadding, { paddingVertical: hp('2%') }]}>
              <View style={styles.settingProfileListView}>
                <View style={styles.settingListTextView}>
                  <Text style={[SmallTextHeading, { fontFamily: fontFamily() }]}>Change password</Text>
                </View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('ResetPassword', { emailId: this.state.email })} style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                  <Image resizeMode="contain" source={require('../../Assets/icons/right_arrow.png')} />
                </TouchableOpacity>
              </View>

              <View style={styles.settingProfileListView}>
                <View style={styles.settingListTextView}>
                  <Text style={[SmallTextHeading, { fontFamily: fontFamily() }]}>Notification</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={styles.genderSwitch}>
                    <Switch
                      style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                      trackColor={{ true: '#00e76e', false: '#00e76e' }}
                      thumbColor='#ffffff'
                      ios_backgroundColor='#00e76e'
                      onValueChange={this._handleToggleSwitchNotification}
                      value={this.state.notificationValue}
                    />
                  </View>
                </View>
              </View>

            </View>
          </View>
        </TitleBar>
        {/* ActionSheet View */}
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

export default connect(
  state => ({
    profileData: state.SaveProfileReducer.profileData
  }), { ...saveProfileAction })(MyAccountScreen)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    flexDirection: 'column',
  },
  modal: {
    flex: 1,
    //alignItems: 'center',
    backgroundColor: "#f8f8f8",
    padding: 10
  },
  text: {
    color: '#3f2949',
    marginTop: 10
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
  BadgePointView: {
    height: hp('10%'),
    flexDirection: 'row',
    borderColor: borderLight,
    borderWidth: 1
  },
  PointsView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: borderLight,
    borderRightWidth: 1
  },
  settingProfileListView: {
    flexDirection: 'row',
    height: hp('10%'),
    borderBottomColor: "#cacaca",
    borderBottomWidth: 1
  },
  settingListTextView: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'center',
  }
})