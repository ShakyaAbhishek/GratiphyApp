faceBookLogin() {
    LoginManager.logInWithPermissions(["public_profile", 'email']).then(
      function (result) {
        if (result.isCancelled) {
          console.warn("Login cancelled");
        } else {
          console.warn(
            "Login success with permissions: " +
            JSON.stringify(result)
          );
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              console.warn("ddddddd=====>", data)
              LoginManager.logOut()
              var current_access_token = data.accessToken.toString();
              //alert(data.accessToken.toString())
              fetch('https://graph.facebook.com/v2.5/me?fields=email,name,picture&access_token=' + data.accessToken)
                .then((response) => { return response.json() })
                .then((json) => {
                  console.warn("facebook response-->" + JSON.stringify(json))
                  //this.facebookLoginApi()
                })
                .catch(() => {
                  reject('ERROR GETTING DATA FROM FACEBOOK.')
                })
            }
          )
        }
      },
      function (error) {
        console.warn("Login fail with error: " + error);
      }
    );
  }












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

        let menuImage = this.state.MenuImage;
        menuImage &&
          menuImage.map(image => {
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
            form.append("MenuImage", file);
          });
        let restoImage = this.state.ResturantImage;
        restoImage &&
          restoImage.map(image => {
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
            form.append("ResturantImage", file);
          });
        form.append("name", this.state.userData.name);
        form.append("email", this.state.email);
        form.append("contactNumber", this.state.contactNumber);
        form.append("address", JSON.stringify(this.state.address));
        console.log("FORMMMMMM=====>", form)
        return NodeAPIForm(form, "profileUpdate", 'PUT', this.state.auth_token)
          .then(response => {
            console.warn("response=====>", response);
            if (response.status === 200) {
              this.setState({ toastColor: sliderColor, toastMessage: response.message, toastVisible: true })
              setTimeout(() => {
                this.setState({ toastVisible: false, spinnerVisible: false, edit: false })
                //this.props.navigation.navigate('LoginScreen')
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

// add deals
import React, { Component } from 'react';
import { Platform, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Picker, TextInput, FlatList, Modal, TouchableHighlight, ImageBackground, AsyncStorage } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor, errorColor, sliderColor } from '../../Utils/responsive';
import { Dropdown } from 'react-native-material-dropdown';
import Header from '../../Components/commonHeader';
import DateTimePicker from "react-native-modal-datetime-picker";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import { Button1, ButtonText, ConatinerViewWithPadding, BigHeadingText, textInputMargin, SmallTextHeading, TextInputViewWithImage, TextInputView, labelText, TextInputImage, ConatinerViewWithoutPadding } from '../../Utils/commonStyles';
import { Toast, Loader } from '../../Components/modals';
import { NodeAPI } from '../../Services/apiServices';


const dealType = [
    {
        label: "50%",
        value: "50%"
    },
    {
        label: "40%",
        value: "40%"
    },
    {
        label: "60%",
        value: "60%"
    }
]
// Action sheet view
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = ['Cancel', 'Camera', 'Gallery']
const title = 'Open Image from'

export default class AddDealScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toastVisible: false,
            spinnerVisible: false,
            isDateTimePickerVisible: false,
            activeTab: "setdate",
            mode: 'date',
            toastColor: '',
            toastMessage: '',
            auth_token: '',
            dealImage: [],
            ImagePath: '',
            dealImageErr: '',
            gdealTitle: 'cvnkzxcnkvc',
            gdealTitleErr: '',
            gdealDiscription: 'vcxzvxcvzx',
            gdealDiscriptionErr: '',
            gdealTerms: 'vcxzvzcxvzcx',
            gdealTermsErr: '',
            dealExpiryDate: '2019-07-16T17:39:58.207Z',
            dealExpiryDateErr: '',
            dealExpiryTime: '2019-07-16T17:39:58.207Z',
            dealExpiryTimeErr: '',
            availableCoupon: 3,
            availableCouponErr: '',
            peopleLimit: 4,
            peopleLimitErr: '',
            subDeal: 1,
            dealsArr: [
                {
                    subDealTitle: '40%',
                    subDealType: 'fdsfs',
                    subDealDiscription: 'fsdfds',
                }
            ],

            errMessageArr: [],
        };

    }

    // handle text input
    onChange(text, type, index) {

        //this pattern checks for emoji
        var pattern = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/
        if (type == "GdealType") {
            this.setState({
                gdealTitle: text,
                errMessageArr: []
            });
        }
        if (type == "Gdiscription") {
            this.setState({
                gdealDiscription: text,
                errMessageArr: []
            });
        }
        if (type == "GdealTerms") {
            this.setState({
                gdealTerms: text,
                errMessageArr: []
            });
        }
        if (type == "subdealTitle") {
            let data = this.state.dealsArr;
            data[index].subDealTitle = text;
            data[index].subDealTitleErr = '';
            this.setState({ dealsArr: data })
        }
        if (type == "subdealDescription") {
            let data = this.state.dealsArr;
            data[index].subDealDiscription = text;
            data[index].subDealDiscriptionErr = '';
            this.setState({ dealsArr: data })
        }
    }

    // time picker and date picker
    showDateTimePicker(mode) {
        this.setState({ isDateTimePickerVisible: true, mode: mode });
    }
    hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
    handleDatePicked = (date) => {
        if (this.state.mode == 'date') {
            this.setState({ dealExpiryDate: new Date(date).toLocaleDateString(), dealExpiryDateErr: '', errMessageArr: [] })
        } else {
            this.setState({ dealExpiryTime: new Date(date).toLocaleTimeString(), dealExpiryTimeErr: '', errMessageArr: [] })
        }
        this.hideDateTimePicker();
    };


    //image picker handler by action sheet
    handlePress(i) {
        this.setState({
            selected: i
        })
        // i ==1 for the open the camera
        if (i == 1) {
            ImagePicker.openCamera({
                width: 300,
                height: 200,
                compressImageQuality: 0.5,
                cropping: true,
                includeBase64: false
            }).then(image => {
                //console.warn([image])
                this.setState({
                    dealImage: [image],
                    ImagePath: image.path,
                    dealImageErr: '',
                    errMessageArr: []
                })
            }).catch((err) => {
            });
        }
        // i==2 for the gallery open
        else if (i == 2) {
            ImagePicker.openPicker({
                width: 300,
                height: 200,
                compressImageQuality: 0.5,
                cropping: true,
                includeBase64: false
            }).then(image => {
                //console.warn([image])
                this.setState({
                    dealImage: [image],
                    ImagePath: image.path,
                    dealImageErr: '',
                    errMessageArr: []
                })
            }).catch((err) => {
            });
        }
    }

    _addSubDeal() {
        //dealsArr.push(newDeal)
        let data = this.state.dealsArr;
        if (data.length < 3) {
            data.push({
                subDealTitle: '',
                subDealType: '',
                subDealDiscription: '',
            });
            this.setState({ dealsArr: data })
        }
        else {
            alert('you can add only 3 sub deals')
        }
    }

    componentDidMount() {
        this.tokensss();
    }

    tokensss = async () => {
        try {
            const value = await AsyncStorage.getItem('auth_token');
            if (value !== null) {
                this.setState({
                    auth_token: value
                })
            }
        } catch (error) {
            // Error retrieving data
        }
    }

    postDeal() {

        let {
            auth_token,
            dealImage,
            dealImageErr,
            gdealTitle,
            gdealTitleErr,
            gdealDiscription,
            gdealDiscriptionErr,
            gdealTerms,
            gdealTermsErr,
            dealExpiryDate,
            dealExpiryDateErr,
            dealExpiryTime,
            dealExpiryTimeErr,
            availableCoupon,
            availableCouponErr,
            peopleLimit,
            peopleLimitErr,
            errMessageArr,
        } = this.state;
        errMessageArr = [];

        if (dealImage == '' || dealImage === null || dealImage === undefined) {
            this.setState({
                dealImageErr: "*Please enter image",
                errMessageArr: errMessageArr.push("*Please enter image")
            })
        }
        if (gdealTitle == '' || gdealTitle === null || gdealTitle === undefined) {
            this.setState({
                gdealTitleErr: "*Please enter deal title",
                errMessageArr: errMessageArr.push("*Please enter deal title")
            })
        }
        if (gdealDiscription == '' || gdealDiscription === null || gdealDiscription === undefined) {
            this.setState({
                gdealDiscriptionErr: "*Please enter deal discription",
                errMessageArr: errMessageArr.push("*Please enter deal discription")
            })
        }
        if (gdealDiscription == '' || gdealDiscription === null || gdealDiscription === undefined) {
            this.setState({
                gdealDiscriptionErr: "*Please enter deal discription",
                errMessageArr: errMessageArr.push("*Please enter deal discription")
            })
        }
        if (gdealTerms == '' || gdealTerms === null || gdealTerms === undefined) {
            this.setState({
                gdealTermsErr: "*Please enter deal terms and conditions",
                errMessageArr: errMessageArr.push("*Please enter deal terms and conditions")
            })
        }
        if (dealExpiryDate == '' || dealExpiryDate === null || dealExpiryDate === undefined) {
            this.setState({
                dealExpiryDateErr: "*Please enter deal expiry date ",
                errMessageArr: errMessageArr.push("*Please enter deal expiry date")
            })
        }
        if (dealExpiryTime == '' || dealExpiryTime === null || dealExpiryTime === undefined) {
            this.setState({
                dealExpiryTimeErr: "*Please enter deal expiry time ",
                errMessageArr: errMessageArr.push("*Please enter deal expiry time")
            })
        }
        if (availableCoupon == 0) {
            this.setState({
                availableCouponErr: "*Please enter coupon ",
                errMessageArr: errMessageArr.push("*Please enter coupon")
            })
        }
        if (peopleLimit == 0) {
            this.setState({
                peopleLimitErr: "*Please enter people per coupon ",
                errMessageArr: errMessageArr.push("*Please enter people per coupon")
            })
        }
        setTimeout(() => {
            if (this.state.errMessageArr.length == 0) {
                this.setState({
                    spinnerVisible: true
                })
                let form = new FormData();
                let imageDeal = dealImage;
                imageDeal &&
                    imageDeal.map(image => {
                        let parts = image.path.split("/");
                        let uri =
                            Platform.OS === "android"
                                ? image.path
                                : image.path.replace("file://", "");
                        let name = parts[parts.length - 1];
                        let type = image.mime;

                        const file = {
                            uri,
                            name,
                            type
                        };
                        form.append("dealImage", file);
                    });
                form.append("dealTittle", gdealTitle);
                form.append("dealDescription", gdealDiscription);
                form.append("termsAndCondition", gdealTerms);
                form.append("dealExpiryDate", dealExpiryDate);
                form.append("dealExpiryTime", dealExpiryTime);
                form.append("availableCoupon", availableCoupon);
                form.append("peopleLimit", peopleLimit);
                form.append("subDeals", this.state.dealsArr);
                //form.append("dealImage", dealImage);
                // var variables = {
                //     dealTittle: gdealTitle,
                //     dealDescription: gdealDiscription,
                //     termsAndCondition: gdealTerms,
                //     dealExpiryDate: dealExpiryDate,
                //     dealExpiryTime: dealExpiryTime,
                //     availableCoupon: availableCoupon,
                //     peopleLimit: peopleLimit,
                //     subDeals: this.state.dealsArr,
                //     dealImage: dealImage
                // }
                return NodeAPI(form, "createDeal", 'POST', auth_token)
                    .then(response => {
                        //console.warn(JSON.stringify(response))
                        if (response.status === 200) {
                            //console.warn(response.message)
                            this.setState({ toastColor: sliderColor, toastMessage: response.message, toastVisible: true, })
                            setTimeout(() => {
                                this.setState({ toastVisible: false, spinnerVisible: false })
                            }, 2000)
                            this.props.navigation.navigate('mainRoute');
                        }
                        else {
                            //alert(response.message)
                            this.setState({ toastColor: errorColor, toastMessage: response.message, toastVisible: true, })
                            setTimeout(() => {
                                this.setState({ toastVisible: false, spinnerVisible: false })
                                //this.props.navigation.navigate('mainRoute')
                            }, 2000)
                        }
                    })
            }
        }, 500)
    }
    render() {
        // navigation use for the coustom header
        const navigation = this.props.navigation;
        // const newArray = new Array(this.state.subDeal)
        // console.warn(newArray)
        return (
            <View style={ConatinerViewWithoutPadding}>
                <Header navigation={navigation} title="Create deal" backButtonNavigation={true} />

                <Loader spinnerVisible={this.state.spinnerVisible} />
                <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />
                {/* data and time picker modal */}
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    mode={this.state.mode}
                />
                {/* form view */}
                <ScrollView showsVerticalScrollIndicator={false} style={ConatinerViewWithPadding}>
                    {/* deal image view */}
                    <View style={{}}>
                        <View style={{ height: hp('25%'), borderRadius: wp('5%'), marginHorizontal: wp('3%') }}>
                            <Image style={{ height: "100%", width: '100%', borderRadius: hp('2%') }} resizeMode="cover" source={this.state.ImagePath == '' ? require('../../Assets/icons/dummy_image3x.png') : { uri: this.state.ImagePath }} />
                        </View>
                        <TouchableOpacity onPress={() => this.ActionSheet.show()} style={{ position: 'absolute', zIndex: 10, right: wp('-1%'), top: hp('20.5%') }}>
                            <Image resizeMode="contain" source={require('../../Assets/icons/uploading.png')} />
                        </TouchableOpacity>
                    </View>
                    {this.state.dealImageErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.dealImageErr}</Text>}
                    {/* text inputes View */}
                    <View style={{ margin: wp('5%') }}>
                        <View >
                            <Text style={labelText}>Enter deal title</Text>
                            <View style={TextInputViewWithImage}>
                                <TextInput
                                    style={TextInputView}
                                    value={this.state.gdealTitle}
                                    keyboardType={'default'}
                                    maxLength={60}
                                    onChangeText={(text) => this.onChange(text, "GdealType")}
                                    onSubmitEditing={() => this.refs.description.focus()}
                                    onFocus={() => this.setState({ gdealTitleErr: '' })}
                                />
                            </View>
                            {this.state.gdealTitleErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.gdealTitleErr}</Text>}
                        </View>
                        <View style={textInputMargin}>
                            <Text style={labelText}>Enter deal description*</Text>
                            <View style={{ flexDirection: 'row', borderBottomColor: "#111111", borderBottomWidth: 2 }} >
                                <TextInput
                                    style={{ flex: 1, height: hp('10%'), fontFamily: fontFamily(), fontSize: fontSizes('smalltitle') }}
                                    multiline={true}
                                    numberOfLines={4}
                                    value={this.state.gdealDiscription}
                                    keyboardType={'default'}
                                    maxLength={150}
                                    onChangeText={(text) => this.onChange(text, "Gdiscription")}
                                    onSubmitEditing={() => this.refs.terms.focus()}
                                    ref='description'
                                    onFocus={() => this.setState({ gdealDiscriptionErr: '' })}
                                />
                            </View>
                            {this.state.gdealDiscriptionErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.gdealDiscriptionErr}</Text>}
                        </View>
                        <View style={textInputMargin}>
                            <Text style={labelText}>Enter terms and conditions</Text>
                            <View style={{ flexDirection: 'row', borderBottomColor: "#111111", borderBottomWidth: 2 }} >
                                <TextInput
                                    style={{ flex: 1, height: hp('10%'), fontFamily: fontFamily(), fontSize: fontSizes('smalltitle') }}
                                    multiline={true}
                                    numberOfLines={4}
                                    value={this.state.gdealTerms}
                                    keyboardType={'default'}
                                    maxLength={150}
                                    onChangeText={(text) => this.onChange(text, "GdealTerms")}
                                    onSubmitEditing={() => this.refs.date.focus()}
                                    ref='terms'
                                    onFocus={() => this.setState({ gdealTermsErr: '' })}
                                />
                            </View>
                            {this.state.gdealTermsErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.gdealTermsErr}</Text>}
                        </View>
                        <View style={textInputMargin} >
                            <Text style={labelText}>Deal expiry date</Text>
                            <View style={{ flex: 1, borderBottomWidth: 2, borderBottomColor: "#111111" }}>
                                <TouchableOpacity style={{ height: hp('6%'), justifyContent: 'center' }} onPress={() => this.showDateTimePicker('date')}>

                                    <Text style={{ fontSize: hp('2%'), color: '#111111' }}>{this.state.dealExpiryDate}</Text>
                                </TouchableOpacity>
                            </View>
                            {this.state.dealExpiryDateErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.dealExpiryDateErr}</Text>}
                        </View>
                        <View style={textInputMargin}>
                            <Text style={labelText}>Deal expiry time</Text>
                            <View style={{ flex: 1, borderBottomWidth: 2, borderBottomColor: "#111111" }}>
                                <TouchableOpacity style={{ height: hp('6%'), justifyContent: 'center' }} onPress={() => this.showDateTimePicker('time')}>

                                    <Text style={{ fontSize: hp('2%'), color: '#111111' }}>{this.state.dealExpiryTime}</Text>
                                </TouchableOpacity>
                            </View>
                            {this.state.dealExpiryTimeErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.dealExpiryTimeErr}</Text>}
                        </View>
                        {/* counter View 1 */}
                        <View style={[textInputMargin, { flexDirection: 'row' }]}>
                            <View style={{ flex: 1.5, justifyContent: 'center' }}>
                                <Text style={[labelText, { flexWrap: 'wrap' }]}>Select Available coupon </Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                {/* Add Button */}
                                <TouchableOpacity onPress={() => this.setState({ availableCoupon: this.state.availableCoupon + 1, availableCouponErr: '', errMessageArr: [] })} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image resizeMode="contain" source={require('../../Assets/icons/add_green.png')} />
                                </TouchableOpacity>
                                <ImageBackground style={{ height: '20%' }} resizeMode="contain" source={require('../../Assets/icons/unknown_1.png')} style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={labelText} >{this.state.availableCoupon < 10 ? '0' + this.state.availableCoupon : this.state.availableCoupon}</Text>
                                </ImageBackground>
                                {/* minus Button */}
                                <TouchableOpacity onPress={() => this.setState({ availableCoupon: this.state.availableCoupon == 0 ? this.state.availableCoupon : this.state.availableCoupon - 1, availableCouponErr: '', errMessageArr: [] })} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image resizeMode="contain" source={require('../../Assets/icons/minus_green.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.state.availableCouponErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.availableCouponErr}</Text>}
                        {/* counter View 2 */}
                        <View style={[textInputMargin, { flexDirection: 'row' }]}>
                            <View style={{ flex: 1.5, justifyContent: 'center' }}>
                                <Text style={labelText}>Select limit of people per coupon </Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                {/* Add Button */}
                                <TouchableOpacity onPress={() => this.setState({ peopleLimit: this.state.peopleLimit + 1, peopleLimitErr: '', errMessageArr: [] })} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image resizeMode="contain" source={require('../../Assets/icons/add_green.png')} />
                                </TouchableOpacity>
                                <ImageBackground style={{ height: '1%', backgroundColor: 'red' }} resizeMode="contain" source={require('../../Assets/icons/unknown_1.png')} style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={labelText} >{this.state.peopleLimit < 10 ? '0' + this.state.peopleLimit : this.state.peopleLimit}</Text>
                                </ImageBackground>
                                {/* minus Button */}
                                <TouchableOpacity onPress={() => this.setState({ peopleLimit: this.state.peopleLimit == 0 ? this.state.peopleLimit : this.state.peopleLimit - 1, peopleLimitErr: '', errMessageArr: [] })} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image resizeMode="contain" source={require('../../Assets/icons/minus_green.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.state.peopleLimitErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.peopleLimitErr}</Text>}
                    </View>
                    {/* Sub Deal form View */}

                    <View style={{}}>

                        {/* <FlatList
                            data={this.state.dealsArr}
                            extraData={this.state}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => this._subDealList(item, index)

                            }
                        /> */}

                        {
                            this.state.dealsArr.map((item, index) => {
                                return (
                                    <View style={{ backgroundColor: '#ffffff', margin: hp('1%'), padding: hp('2%'), borderRadius: wp('5%') }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 1, marginHorizontal: wp('2%') }}>
                                                <Text style={labelText}>Deal type </Text>
                                                <View style={{ flex: 1, borderBottomWidth: 2, borderBottomColor: "#111111" }}>
                                                    <Dropdown
                                                        data={dealType}
                                                        placeholder="50%"
                                                        fontSize={hp('2%')}
                                                        labelFontSize={0}
                                                        fontSize={hp('2%')}
                                                        rippleOpacity={0}
                                                        containerStyle={{ height: hp('6%') }}
                                                        dropdownOffset={{ top: hp('2%') }}
                                                        onChangeText={(value) => {
                                                            let data = this.state.dealsArr;
                                                            data[index].subDealType = value;
                                                            data[index].subDealTypeErr = '';
                                                            this.setState({ dealsArr: data })
                                                        }}
                                                        pickerStyle={{ marginTop: hp('10%'), marginLeft: hp('1.5%'), borderRadius: hp("1%") }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={labelText}>Deal title</Text>
                                                <View style={TextInputViewWithImage}>
                                                    <TextInput
                                                        style={TextInputView}
                                                        value={item.subDealTitle}
                                                        keyboardType={'default'}
                                                        maxLength={60}
                                                        onChangeText={(text) => this.onChange(text, "subdealTitle", index)}
                                                        onSubmitEditing={() => this.refs.des1.focus()}
                                                    //onFocus={() => this.setState({ subDealTitleErr: '' })}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                        {this.state.subDealTypeErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.subDealTypeErr}</Text>}
                                        {this.state.subDealTitleErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.subDealTitleErr}</Text>}

                                        <View style={{ marginVertical: hp('3%') }}>
                                            <Text style={labelText}>Description*</Text>
                                            <View style={{ flexDirection: 'row', borderBottomColor: "#111111", borderBottomWidth: 2 }} >
                                                <TextInput
                                                    style={{ flex: 1, height: hp('10%'), justifyContent: 'flex-start', fontFamily: fontFamily(), fontSize: fontSizes('smalltitle') }}
                                                    multiline={true}
                                                    numberOfLines={3}
                                                    value={item.subDealDiscription}
                                                    keyboardType={'default'}
                                                    maxLength={150}
                                                    onChangeText={(text) => this.onChange(text, "subdealDescription", index)}
                                                    //onSubmitEditing={() => this.refs.description.focus()}
                                                    ref='des1'
                                                //onFocus={() => this.setState({ subDealDiscriptionErr: '' })}
                                                />
                                            </View>
                                            {this.state.subDealDiscriptionErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.subDealDiscriptionErr}</Text>}

                                        </View>
                                    </View>
                                )
                            })
                        }

                        <TouchableOpacity onPress={() => this._addSubDeal()} style={{ zIndex: 10, left: '84%', bottom: '11.5%' }}>
                            <Image resizeMode="contain" source={require('../../Assets/icons/add_grey.png')} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => this.postDeal()} style={[Button1, { marginHorizontal: wp('8%'), marginBottom: hp('5%') }]}>
                        <Text style={ButtonText}>Post Deal</Text>
                    </TouchableOpacity>
                </ScrollView>
                {/* action sheet view modal */}
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





////         
// import React, { Component } from 'react';
// import { Platform, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Picker, TextInput, FlatList, Modal, TouchableHighlight, ImageBackground, AsyncStorage } from 'react-native';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { fontFamily, fontSizes, backgroundColor, errorColor, sliderColor } from '../../Utils/responsive';
// import { Dropdown } from 'react-native-material-dropdown';
// import Header from '../../Components/commonHeader';
// import DateTimePicker from "react-native-modal-datetime-picker";
// import MultiSlider from '@ptomasroos/react-native-multi-slider';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import ImagePicker from 'react-native-image-crop-picker';
// import ActionSheet from 'react-native-actionsheet';
// import { Button1, ButtonText, ConatinerViewWithPadding, BigHeadingText, textInputMargin, SmallTextHeading, TextInputViewWithImage, TextInputView, labelText, TextInputImage, ConatinerViewWithoutPadding } from '../../Utils/commonStyles';
// import { Toast, Loader } from '../../Components/modals';
// import { NodeAPI } from '../../Services/apiServices';



// const dealType = [
//     {
//         label: "50%",
//         value: "50%"
//     },
//     {
//         label: "40%",
//         value: "40%"
//     },
//     {
//         label: "60%",
//         value: "60%"
//     }
// ]
// // Action sheet view
// const CANCEL_INDEX = 0
// const DESTRUCTIVE_INDEX = 4
// const options = ['Cancel', 'Camera', 'Gallery']
// const title = 'Open Image from'

// export default class AddDealScreen extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             toastVisible: false,
//             spinnerVisible: false,
//             isDateTimePickerVisible: false,
//             activeTab: "setdate",
//             mode: 'date',
//             toastColor: '',
//             toastMessage: '',
//             auth_token: '',
//             dealImage: '',
//             ImagePath: '',
//             dealImageErr: '',
//             gdealTitle: '',
//             gdealTitleErr: '',
//             gdealDiscription: '',
//             gdealDiscriptionErr: '',
//             gdealTerms: '',
//             gdealTermsErr: '',
//             dealExpiryDate: '',
//             dealExpiryDateErr: '',
//             dealExpiryTime: '',
//             dealExpiryTimeErr: '',
//             availableCoupon: 0,
//             availableCouponErr: '',
//             peopleLimit: 0,
//             peopleLimitErr: '',
//             subDealTitleErr: '',
//             subDealTypeErr: '',
//             subDealDiscriptionErr: '',
//             subDeal: 0,
//             dealsArr: [
//                 {
//                     subDealTitle: '',
//                     subDealType: '',
//                     subDealDescription: '',
//                 }
//             ],

//             errMessageArr: [],
//         };

//     }

//     // handle text input
//     onChange(text, type, index) {

//         //this pattern checks for emoji
//         var pattern = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/
//         if (type == "GdealType") {
//             this.setState({
//                 gdealTitle: text,
//                 errMessageArr: []
//             });
//         }
//         if (type == "Gdiscription") {
//             this.setState({
//                 gdealDiscription: text,
//                 errMessageArr: []
//             });
//         }
//         if (type == "GdealTerms") {
//             this.setState({
//                 gdealTerms: text,
//                 errMessageArr: []
//             });
//         }
//         if (type == "subdealTitle") {
//             let data = this.state.dealsArr;
//             data[index].subDealTitle = text;
//             // data[index].subDealTitleErr = '';
//             this.setState({ dealsArr: data })
//         }
//         if (type == "subdealDescription") {
//             let data = this.state.dealsArr;
//             data[index].subDealDescription = text;
//             // data[index].subDealDiscriptionErr = '';
//             this.setState({ dealsArr: data })
//         }
//     }

//     dateConverterOfMilli(dateMilliSecond) {
//         if (dateMilliSecond != '') {
//             var date = new Date(dateMilliSecond)
//             var year = date.getFullYear();
//             var month = date.getMonth();
//             var day = date.getDate();
//             date = year + '/' + month + '/' + (day < 10 ? '0' + day : day)
//             return date
//         }

//     }
//     timeConverterOfMilli(dateMilliSecond) {
//         if (dateMilliSecond != '') {
//             var date = new Date(dateMilliSecond)
//             var hour = date.getHours();
//             var minutes = date.getMinutes();
//             var second = date.getSeconds();
//             time = (hour < 10 ? '0' + hour : hour) + ':' + (minutes < 10 ? '0' + minutes : minutes)
//             return time
//         }

//     }
//     // time picker and date picker
//     // showDateTimePicker = (date) => {
//     //     //console.warn('A date has been picked: ', date);
//     //     if (this.state.mode == 'date') {
//     //         //alert( new Date(date).toLocaleDateString())
//     //         this.setState({ date: new Date(date).toISOString() })
//     //     } else {
//     //         this.setState({ dealExpiryTime: new Date(date).toISOString() })
//     //         //alert( new Date(date).toLocaleTimeString())
//     //     }

//     //     this.hideDateTimePicker();

//     // };

//     showDateTimePicker(mode) {
//         this.setState({ isDateTimePickerVisible: true, mode: mode });
//     }
//     hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
//     handleDatePicked = (date) => {
//         if (this.state.mode == 'date') {
//             this.setState({ dealExpiryDate: new Date(date).toISOString(), dealExpiryDateErr: '', errMessageArr: [] })
//         } else {
//             this.setState({ dealExpiryTime: new Date(date).toISOString(), dealExpiryTimeErr: '', errMessageArr: [] })
//         }
//         this.hideDateTimePicker();
//     };

//     //image picker handler by action sheet
//     handlePress(i) {
//         this.setState({
//             selected: i
//         })
//         // i ==1 for the open the camera
//         if (i == 1) {
//             ImagePicker.openCamera({
//                 width: 300,
//                 height: 200,
//                 compressImageQuality: 0.5,
//                 cropping: true,
//                 includeBase64: false
//             }).then(image => {
//                 //console.warn(image)
//                 this.setState({
//                     dealImage: image,
//                     ImagePath: image.path,
//                     dealImageErr: '',
//                     errMessageArr: []
//                 })
//             }).catch((err) => {
//             });
//         }
//         // i==2 for the gallery open
//         else if (i == 2) {
//             ImagePicker.openPicker({
//                 width: 300,
//                 height: 200,
//                 compressImageQuality: 0.5,
//                 cropping: true,
//                 includeBase64: false
//             }).then(image => {
//                 //console.warn(image)
//                 this.setState({
//                     dealImage: image,
//                     ImagePath: image.path,
//                     dealImageErr: '',
//                     errMessageArr: []
//                 })
//             }).catch((err) => {
//             });
//         }
//     }

//     _addSubDeal() {
//         //dealsArr.push(newDeal)
//         let data = this.state.dealsArr;
//         let { subDeal, errMessageArr } = this.state;
//         errMessageArr = [];
//         if (data[subDeal].subDealType == '' || data[subDeal].subDealType === null || data[subDeal].subDealType === undefined) {
//             this.setState({
//                 subDealTypeErr: "*Please enter deal type ",
//                 errMessageArr: errMessageArr.push("*Please enter deal type")
//             })
//         }
//         if (data[subDeal].subDealTitle == '' || data[subDeal].subDealTitle === null || data[subDeal].subDealTitle === undefined) {
//             this.setState({
//                 subDealTitleErr: "*Please enter deal title ",
//                 errMessageArr: errMessageArr.push("*Please enter deal title")
//             })
//         }
//         if (data[subDeal].subDealDescription == '' || data[subDeal].subDealDescription === null || data[subDeal].subDealDescription === undefined) {
//             this.setState({
//                 subDealDiscriptionErr: "*Please enter deal discription ",
//                 errMessageArr: errMessageArr.push("*Please enter deal discription")
//             })
//         }
//         if (errMessageArr.length == 0) {
//             if (data.length < 3) {
//                 data.push({
//                     subDealTitle: '',
//                     subDealType: '',
//                     subDealDescription: '',
//                 });
//                 this.setState({
//                     dealsArr: data,
//                     subDeal: subDeal + 1
//                 })
//             }
//             else {
//                 alert('you can add only 3 sub deals')
//             }
//         }

//     }

//     componentDidMount() {
//         this.tokensss();
//     }

//     tokensss = async () => {
//         try {
//             const value = await AsyncStorage.getItem('auth_token');
//             if (value !== null) {
//                 this.setState({
//                     auth_token: value
//                 })
//             }
//         } catch (error) {
//             // Error retrieving data
//         }
//     }

//     postDeal() {

//         let {
//             auth_token,
//             dealImage,
//             dealImageErr,
//             gdealTitle,
//             gdealTitleErr,
//             gdealDiscription,
//             gdealDiscriptionErr,
//             gdealTerms,
//             gdealTermsErr,
//             dealExpiryDate,
//             dealExpiryDateErr,
//             dealExpiryTime,
//             dealExpiryTimeErr,
//             availableCoupon,
//             availableCouponErr,
//             peopleLimit,
//             peopleLimitErr,
//             subDeal,
//             dealsArr,
//             errMessageArr,
//         } = this.state;
//         errMessageArr = [];

//         if (dealImage == '' || dealImage === null || dealImage === undefined) {
//             this.setState({
//                 dealImageErr: "*Please enter image",
//                 errMessageArr: errMessageArr.push("*Please enter image")
//             })
//         }
//         if (gdealTitle == '' || gdealTitle === null || gdealTitle === undefined) {
//             this.setState({
//                 gdealTitleErr: "*Please enter deal title",
//                 errMessageArr: errMessageArr.push("*Please enter deal title")
//             })
//         }
//         if (gdealDiscription == '' || gdealDiscription === null || gdealDiscription === undefined) {
//             this.setState({
//                 gdealDiscriptionErr: "*Please enter deal discription",
//                 errMessageArr: errMessageArr.push("*Please enter deal discription")
//             })
//         }
//         if (gdealDiscription == '' || gdealDiscription === null || gdealDiscription === undefined) {
//             this.setState({
//                 gdealDiscriptionErr: "*Please enter deal discription",
//                 errMessageArr: errMessageArr.push("*Please enter deal discription")
//             })
//         }
//         if (gdealTerms == '' || gdealTerms === null || gdealTerms === undefined) {
//             this.setState({
//                 gdealTermsErr: "*Please enter deal terms and conditions",
//                 errMessageArr: errMessageArr.push("*Please enter deal terms and conditions")
//             })
//         }
//         if (dealExpiryDate == '' || dealExpiryDate === null || dealExpiryDate === undefined) {
//             this.setState({
//                 dealExpiryDateErr: "*Please enter deal expiry date ",
//                 errMessageArr: errMessageArr.push("*Please enter deal expiry date")
//             })
//         }
//         if (dealExpiryTime == '' || dealExpiryTime === null || dealExpiryTime === undefined) {
//             this.setState({
//                 dealExpiryTimeErr: "*Please enter deal expiry time ",
//                 errMessageArr: errMessageArr.push("*Please enter deal expiry time")
//             })
//         }
//         if (availableCoupon == 0) {
//             this.setState({
//                 availableCouponErr: "*Please enter coupon ",
//                 errMessageArr: errMessageArr.push("*Please enter coupon")
//             })
//         }
//         if (peopleLimit == 0) {
//             this.setState({
//                 peopleLimitErr: "*Please enter people per coupon ",
//                 errMessageArr: errMessageArr.push("*Please enter people per coupon")
//             })
//         }
//         if (dealsArr[subDeal].subDealType == '' || dealsArr[subDeal].subDealType === null || dealsArr[subDeal].subDealType === undefined) {
//             this.setState({
//                 subDealTypeErr: "*Please enter deal type ",
//                 errMessageArr: errMessageArr.push("*Please enter deal type")
//             })
//         }
//         if (dealsArr[subDeal].subDealTitle == '' || dealsArr[subDeal].subDealTitle === null || dealsArr[subDeal].subDealTitle === undefined) {
//             this.setState({
//                 subDealTitleErr: "*Please enter deal title ",
//                 errMessageArr: errMessageArr.push("*Please enter deal title")
//             })
//         }
//         if (dealsArr[subDeal].subDealDescription == '' || dealsArr[subDeal].subDealDescription === null || dealsArr[subDeal].subDealDescription === undefined) {
//             this.setState({
//                 subDealDiscriptionErr: "*Please enter deal discription ",
//                 errMessageArr: errMessageArr.push("*Please enter deal discription")
//             })
//         }
//         setTimeout(() => {
//             if (this.state.errMessageArr.length == 0) {
//                 this.setState({
//                     spinnerVisible: true
//                 })
//                 var variables = {
//                     dealTitle: gdealTitle,
//                     dealDescription: gdealDiscription,
//                     termsAndCondition: gdealTerms,
//                     dealExpiryDate: dealExpiryDate,
//                     dealExpiryTime: dealExpiryTime,
//                     availableCoupon: availableCoupon,
//                     peopleLimit: peopleLimit,
//                     subDeal: this.state.dealsArr,
//                     dealImage: dealImage
//                 }
//                 return NodeAPI(variables, "createDeal", 'POST', auth_token)
//                     .then(response => {
//                         //console.warn(JSON.stringify(response))
//                         if (response.status === 200) {
//                             //console.warn(response.message)
//                             this.setState({ toastColor: sliderColor, toastMessage: response.message, toastVisible: true, })
//                             setTimeout(() => {
//                                 this.setState({ toastVisible: false, spinnerVisible: false })
//                             }, 2000)
//                             this.props.navigation.navigate('MyDealsScreen');
//                         }
//                         else {
//                             //alert(response.message)
//                             this.setState({ toastColor: errorColor, toastMessage: response.message, toastVisible: true, })
//                             setTimeout(() => {
//                                 this.setState({ toastVisible: false, spinnerVisible: false })
//                                 //this.props.navigation.navigate('mainRoute')
//                             }, 2000)
//                         }
//                     })
//             }
//         }, 500)
//     }
//     render() {
//         // navigation use for the coustom header
//         const navigation = this.props.navigation;
//         // const newArray = new Array(this.state.subDeal)
//         // console.warn(newArray)
//         return (
//             <View style={ConatinerViewWithoutPadding}>
//                 <Header navigation={navigation} title="Create deal" backButtonNavigation={true} />

//                 <Loader spinnerVisible={this.state.spinnerVisible} />
//                 <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />
//                 {/* data and time picker modal */}
//                 <DateTimePicker
//                     isVisible={this.state.isDateTimePickerVisible}
//                     onConfirm={this.handleDatePicked}
//                     onCancel={this.hideDateTimePicker}
//                     mode={this.state.mode}
//                     minimumDate={new Date()}
//                 />
//                 {/* form view */}
//                 <ScrollView showsVerticalScrollIndicator={false} style={ConatinerViewWithPadding}>
//                     {/* deal image view */}
//                     <View style={{}}>
//                         <View style={{ height: hp('25%'), borderRadius: wp('5%'), marginHorizontal: wp('3%') }}>
//                             <Image style={{ height: "100%", width: '100%', borderRadius: hp('2%') }} resizeMode="cover" source={this.state.ImagePath == '' ? require('../../Assets/icons/dummy_image3x.png') : { uri: this.state.ImagePath }} />
//                         </View>
//                         <TouchableOpacity onPress={() => this.ActionSheet.show()} style={{ position: 'absolute', zIndex: 10, right: wp('-1%'), top: hp('20.5%') }}>
//                             <Image resizeMode="contain" source={require('../../Assets/icons/uploading.png')} />
//                         </TouchableOpacity>
//                     </View>
//                     {this.state.dealImageErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.dealImageErr}</Text>}
//                     {/* text inputes View */}
//                     <View style={{ margin: wp('5%') }}>
//                         <View >
//                             <Text style={labelText}>Enter deal title</Text>
//                             <View style={TextInputViewWithImage}>
//                                 <TextInput
//                                     style={TextInputView}
//                                     value={this.state.gdealTitle}
//                                     keyboardType={'default'}
//                                     maxLength={60}
//                                     onChangeText={(text) => this.onChange(text, "GdealType")}
//                                     onSubmitEditing={() => this.refs.description.focus()}
//                                     onFocus={() => this.setState({ gdealTitleErr: '' })}
//                                 />
//                             </View>
//                             {this.state.gdealTitleErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.gdealTitleErr}</Text>}
//                         </View>
//                         <View style={textInputMargin}>
//                             <Text style={labelText}>Enter deal description*</Text>
//                             <View style={{ flexDirection: 'row', borderBottomColor: "#111111", borderBottomWidth: 2 }} >
//                                 <TextInput
//                                     style={{ flex: 1, height: hp('10%'), fontFamily: fontFamily(), fontSize: fontSizes('smalltitle') }}
//                                     multiline={true}
//                                     numberOfLines={4}
//                                     value={this.state.gdealDiscription}
//                                     keyboardType={'default'}
//                                     maxLength={150}
//                                     onChangeText={(text) => this.onChange(text, "Gdiscription")}
//                                     onSubmitEditing={() => this.refs.terms.focus()}
//                                     ref='description'
//                                     onFocus={() => this.setState({ gdealDiscriptionErr: '' })}
//                                 />
//                             </View>
//                             {this.state.gdealDiscriptionErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.gdealDiscriptionErr}</Text>}
//                         </View>
//                         <View style={textInputMargin}>
//                             <Text style={labelText}>Enter terms and conditions</Text>
//                             <View style={{ flexDirection: 'row', borderBottomColor: "#111111", borderBottomWidth: 2 }} >
//                                 <TextInput
//                                     style={{ flex: 1, height: hp('10%'), fontFamily: fontFamily(), fontSize: fontSizes('smalltitle') }}
//                                     multiline={true}
//                                     numberOfLines={4}
//                                     value={this.state.gdealTerms}
//                                     keyboardType={'default'}
//                                     maxLength={150}
//                                     onChangeText={(text) => this.onChange(text, "GdealTerms")}
//                                     //onSubmitEditing={() => this.refs.date.focus()}
//                                     ref='terms'
//                                     onFocus={() => this.setState({ gdealTermsErr: '' })}
//                                 />
//                             </View>
//                             {this.state.gdealTermsErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.gdealTermsErr}</Text>}
//                         </View>
//                         <View style={textInputMargin} >
//                             <Text style={labelText}>Deal expiry date</Text>
//                             <View style={{ flex: 1, borderBottomWidth: 2, borderBottomColor: "#111111" }}>
//                                 <TouchableOpacity style={{ height: hp('6%'), justifyContent: 'center' }} onPress={() => this.showDateTimePicker('date')}>

//                                     <Text style={{ fontSize: hp('2%'), color: '#111111' }}>{this.dateConverterOfMilli(this.state.dealExpiryDate)}</Text>
//                                 </TouchableOpacity>
//                             </View>
//                             {this.state.dealExpiryDateErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.dealExpiryDateErr}</Text>}
//                         </View>
//                         <View style={textInputMargin}>
//                             <Text style={labelText}>Deal expiry time</Text>
//                             <View style={{ flex: 1, borderBottomWidth: 2, borderBottomColor: "#111111" }}>
//                                 <TouchableOpacity style={{ height: hp('6%'), justifyContent: 'center' }} onPress={() => this.showDateTimePicker('time')}>

//                                     <Text style={{ fontSize: hp('2%'), color: '#111111' }}>{this.timeConverterOfMilli(this.state.dealExpiryTime)}</Text>
//                                 </TouchableOpacity>
//                             </View>
//                             {this.state.dealExpiryTimeErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.dealExpiryTimeErr}</Text>}
//                         </View>
//                         {/* counter View 1 */}
//                         <View style={[textInputMargin, { flexDirection: 'row' }]}>
//                             <View style={{ flex: 1.5, justifyContent: 'center' }}>
//                                 <Text style={[labelText, { flexWrap: 'wrap' }]}>Select Available coupon </Text>
//                             </View>
//                             <View style={{ flex: 1, flexDirection: 'row' }}>
//                                 {/* Add Button */}
//                                 <TouchableOpacity onPress={() => this.setState({ availableCoupon: this.state.availableCoupon + 1, availableCouponErr: '', errMessageArr: [] })} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                                     <Image resizeMode="contain" source={require('../../Assets/icons/add_green.png')} />
//                                 </TouchableOpacity>
//                                 <ImageBackground  resizeMode="center" source={require('../../Assets/icons/unknown_1.png')} style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
//                                     <Text style={labelText} >{this.state.availableCoupon < 10 ? '0' + this.state.availableCoupon : this.state.availableCoupon}</Text>
//                                 </ImageBackground>
//                                 {/* minus Button */}
//                                 <TouchableOpacity onPress={() => this.setState({ availableCoupon: this.state.availableCoupon == 0 ? this.state.availableCoupon : this.state.availableCoupon - 1, availableCouponErr: '', errMessageArr: [] })} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                                     <Image resizeMode="contain" source={require('../../Assets/icons/minus_green.png')} />
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                         {this.state.availableCouponErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.availableCouponErr}</Text>}
//                         {/* counter View 2 */}
//                         <View style={[textInputMargin, { flexDirection: 'row' }]}>
//                             <View style={{ flex: 1.5, justifyContent: 'center' }}>
//                                 <Text style={labelText}>Select limit of people per coupon </Text>
//                             </View>
//                             <View style={{ flex: 1, flexDirection: 'row' }}>
//                                 {/* Add Button */}
//                                 <TouchableOpacity onPress={() => this.setState({ peopleLimit: this.state.peopleLimit + 1, peopleLimitErr: '', errMessageArr: [] })} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                                     <Image resizeMode="center" source={require('../../Assets/icons/add_green.png')} />
//                                 </TouchableOpacity>
//                                 <ImageBackground  resizeMode="contain" source={require('../../Assets/icons/unknown_1.png')} style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
//                                     <Text style={labelText} >{this.state.peopleLimit < 10 ? '0' + this.state.peopleLimit : this.state.peopleLimit}</Text>
//                                 </ImageBackground>
//                                 {/* minus Button */}
//                                 <TouchableOpacity onPress={() => this.setState({ peopleLimit: this.state.peopleLimit == 0 ? this.state.peopleLimit : this.state.peopleLimit - 1, peopleLimitErr: '', errMessageArr: [] })} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                                     <Image resizeMode="contain" source={require('../../Assets/icons/minus_green.png')} />
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                         {this.state.peopleLimitErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.peopleLimitErr}</Text>}
//                     </View>
//                     {/* Sub Deal form View */}

//                     <View style={{}}>

//                         {/* <FlatList
//                             data={this.state.dealsArr}
//                             extraData={this.state}
//                             showsVerticalScrollIndicator={false}
//                             renderItem={({ item, index }) => this._subDealList(item, index)

//                             }
//                         /> */}

//                         {
//                             this.state.dealsArr.map((item, index) => {
//                                 return (
//                                     <View style={{ backgroundColor: '#ffffff', margin: hp('1%'), padding: hp('2%'), borderRadius: wp('5%') }}>
//                                         <View style={{ flexDirection: 'row' }}>
//                                             <View style={{ flex: 1, marginHorizontal: wp('2%') }}>
//                                                 <Text style={labelText}>Deal type </Text>
//                                                 <View style={{ flex: 1, borderBottomWidth: 2, borderBottomColor: "#111111" }}>
//                                                     <Dropdown
//                                                         data={dealType}
//                                                         placeholder="50%"
//                                                         fontSize={hp('2%')}
//                                                         labelFontSize={0}
//                                                         fontSize={hp('2%')}
//                                                         rippleOpacity={0}
//                                                         containerStyle={{ height: hp('6%') }}
//                                                         dropdownOffset={{ top: hp('2%') }}
//                                                         onFocus={() => this.setState({ subDealTypeErr: '', errMessageArr: [] })}
//                                                         onChangeText={(value) => {
//                                                             let data = this.state.dealsArr;
//                                                             data[index].subDealType = value;
//                                                             // data[index].subDealTypeErr = '';
//                                                             this.setState({ dealsArr: data })
//                                                         }}
//                                                         pickerStyle={{ marginTop: hp('10%'), marginLeft: hp('1.5%'), borderRadius: hp("1%") }}
//                                                     />
//                                                 </View>
//                                             </View>
//                                             <View style={{ flex: 1 }}>
//                                                 <Text style={labelText}>Deal title</Text>
//                                                 <View style={TextInputViewWithImage}>
//                                                     <TextInput
//                                                         style={TextInputView}
//                                                         value={item.subDealTitle}
//                                                         keyboardType={'default'}
//                                                         maxLength={60}
//                                                         onChangeText={(text) => this.onChange(text, "subdealTitle", index)}
//                                                         onSubmitEditing={() => this.refs.des1.focus()}
//                                                         onFocus={() => this.setState({ subDealTitleErr: '', errMessageArr: [] })}
//                                                     //onFocus={() => this.setState({ subDealTitleErr: '' })}
//                                                     />
//                                                 </View>
//                                             </View>
//                                         </View>
//                                         {this.state.subDealTypeErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.subDealTypeErr}</Text>}
//                                         {this.state.subDealTitleErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.subDealTitleErr}</Text>}

//                                         <View style={{ marginVertical: hp('3%') }}>
//                                             <Text style={labelText}>Description*</Text>
//                                             <View style={{ flexDirection: 'row', borderBottomColor: "#111111", borderBottomWidth: 2 }} >
//                                                 <TextInput
//                                                     style={{ flex: 1, height: hp('10%'), justifyContent: 'flex-start', fontFamily: fontFamily(), fontSize: fontSizes('smalltitle') }}
//                                                     multiline={true}
//                                                     numberOfLines={3}
//                                                     value={item.subDealDescription}
//                                                     keyboardType={'default'}
//                                                     maxLength={150}
//                                                     onChangeText={(text) => this.onChange(text, "subdealDescription", index)}
//                                                     onFocus={() => this.setState({ subDealDiscriptionErr: '', errMessageArr: [] })}
//                                                     //onSubmitEditing={() => this.refs.description.focus()}
//                                                     ref='des1'
//                                                 //onFocus={() => this.setState({ subDealDiscriptionErr: '' })}
//                                                 />
//                                             </View>
//                                             {this.state.subDealDiscriptionErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.subDealDiscriptionErr}</Text>}

//                                         </View>
//                                     </View>
//                                 )
//                             })
//                         }

//                         <TouchableOpacity onPress={() => this._addSubDeal()} style={{ zIndex: 10, left: '84%', bottom: '11.5%' }}>
//                             <Image resizeMode="contain" source={require('../../Assets/icons/add_grey.png')} />
//                         </TouchableOpacity>
//                     </View>

//                     <TouchableOpacity onPress={() => this.postDeal()} style={[Button1, { marginHorizontal: wp('8%'), marginBottom: hp('5%') }]}>
//                         <Text style={ButtonText}>Post Deal</Text>
//                     </TouchableOpacity>
//                 </ScrollView>
//                 {/* action sheet view modal */}
//                 <ActionSheet
//                     ref={o => this.ActionSheet = o}
//                     title={title}
//                     options={options}
//                     cancelButtonIndex={CANCEL_INDEX}
//                     destructiveButtonIndex={DESTRUCTIVE_INDEX}
//                     onPress={(index) => this.handlePress(index)}
//                 />
//             </View>
//         );
//     }
// }



/// SFJHKDSHGFDHKGHFD
import React, { Component } from 'react';
import { Platform, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Picker, TextInput, FlatList, Modal, TouchableHighlight, ImageBackground, AsyncStorage } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor, errorColor, sliderColor } from '../../Utils/responsive';
import { Dropdown } from 'react-native-material-dropdown';
import Header from '../../Components/commonHeader';
import DateTimePicker from "react-native-modal-datetime-picker";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import { Button1, ButtonText, ConatinerViewWithPadding, BigHeadingText, textInputMargin, SmallTextHeading, TextInputViewWithImage, TextInputView, labelText, TextInputImage, ConatinerViewWithoutPadding } from '../../Utils/commonStyles';
import { Toast, Loader } from '../../Components/modals';
import { NodeAPI } from '../../Services/apiServices';


const dealType = [
    {
        label: "50%",
        value: "50%"
    },
    {
        label: "40%",
        value: "40%"
    },
    {
        label: "60%",
        value: "60%"
    }
]
// Action sheet view
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = ['Cancel', 'Camera', 'Gallery']
const title = 'Open Image from'

export default class AddDealScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toastVisible: false,
            spinnerVisible: false,
            isDateTimePickerVisible: false,
            activeTab: "setdate",
            mode: 'date',
            toastColor: '',
            toastMessage: '',
            auth_token: '',
            dealImage: [],
            ImagePath: '',
            dealImageErr: '',
            gdealTitle: 'cvnkzxcnkvc',
            gdealTitleErr: '',
            gdealDiscription: 'vcxzvxcvzx',
            gdealDiscriptionErr: '',
            gdealTerms: 'vcxzvzcxvzcx',
            gdealTermsErr: '',
            dealExpiryDate: '2019-07-16T17:39:58.207Z',
            dealExpiryDateErr: '',
            dealExpiryTime: '2019-07-16T17:39:58.207Z',
            dealExpiryTimeErr: '',
            availableCoupon: 3,
            availableCouponErr: '',
            peopleLimit: 4,
            peopleLimitErr: '',
            subDeal: 1,
            dealsArr: [
                {
                    subDealTitle: '40%',
                    subDealType: 'fdsfs',
                    subDealDiscription: 'fsdfds',
                }
            ],

            errMessageArr: [],
        };

    }

    // handle text input
    onChange(text, type, index) {

        //this pattern checks for emoji
        var pattern = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/
        if (type == "GdealType") {
            this.setState({
                gdealTitle: text,
                errMessageArr: []
            });
        }
        if (type == "Gdiscription") {
            this.setState({
                gdealDiscription: text,
                errMessageArr: []
            });
        }
        if (type == "GdealTerms") {
            this.setState({
                gdealTerms: text,
                errMessageArr: []
            });
        }
        if (type == "subdealTitle") {
            let data = this.state.dealsArr;
            data[index].subDealTitle = text;
            data[index].subDealTitleErr = '';
            this.setState({ dealsArr: data })
        }
        if (type == "subdealDescription") {
            let data = this.state.dealsArr;
            data[index].subDealDiscription = text;
            data[index].subDealDiscriptionErr = '';
            this.setState({ dealsArr: data })
        }
    }

    // time picker and date picker
    showDateTimePicker(mode) {
        this.setState({ isDateTimePickerVisible: true, mode: mode });
    }
    hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
    handleDatePicked = (date) => {
        if (this.state.mode == 'date') {
            this.setState({ dealExpiryDate: new Date(date).toLocaleDateString(), dealExpiryDateErr: '', errMessageArr: [] })
        } else {
            this.setState({ dealExpiryTime: new Date(date).toLocaleTimeString(), dealExpiryTimeErr: '', errMessageArr: [] })
        }
        this.hideDateTimePicker();
    };


    //image picker handler by action sheet
    handlePress(i) {
        this.setState({
            selected: i
        })
        // i ==1 for the open the camera
        if (i == 1) {
            ImagePicker.openCamera({
                width: 300,
                height: 200,
                compressImageQuality: 0.5,
                cropping: true,
                includeBase64: false
            }).then(image => {
                console.warn([image])
                this.setState({
                    dealImage: [image],
                    ImagePath: image.path,
                    dealImageErr: '',
                    errMessageArr: []
                })
            }).catch((err) => {
            });
        }
        // i==2 for the gallery open
        else if (i == 2) {
            ImagePicker.openPicker({
                width: 300,
                height: 200,
                compressImageQuality: 0.5,
                cropping: true,
                includeBase64: false
            }).then(image => {
                console.warn([image])
                this.setState({
                    dealImage: [image],
                    ImagePath: image.path,
                    dealImageErr: '',
                    errMessageArr: []
                })
            }).catch((err) => {
            });
        }
    }

    _addSubDeal() {
        //dealsArr.push(newDeal)
        let data = this.state.dealsArr;
        if (data.length < 3) {
            data.push({
                subDealTitle: '',
                subDealType: '',
                subDealDiscription: '',
            });
            this.setState({ dealsArr: data })
        }
        else {
            alert('you can add only 3 sub deals')
        }
    }

    componentDidMount() {
        this.tokensss();
    }

    tokensss = async () => {
        try {
            const value = await AsyncStorage.getItem('auth_token');
            if (value !== null) {
                this.setState({
                    auth_token: value
                })
            }
        } catch (error) {
            // Error retrieving data
        }
    }

    postDeal() {

        let {
            auth_token,
            dealImage,
            dealImageErr,
            gdealTitle,
            gdealTitleErr,
            gdealDiscription,
            gdealDiscriptionErr,
            gdealTerms,
            gdealTermsErr,
            dealExpiryDate,
            dealExpiryDateErr,
            dealExpiryTime,
            dealExpiryTimeErr,
            availableCoupon,
            availableCouponErr,
            peopleLimit,
            peopleLimitErr,
            errMessageArr,
        } = this.state;
        errMessageArr = [];

        if (dealImage == '' || dealImage === null || dealImage === undefined) {
            this.setState({
                dealImageErr: "*Please enter image",
                errMessageArr: errMessageArr.push("*Please enter image")
            })
        }
        if (gdealTitle == '' || gdealTitle === null || gdealTitle === undefined) {
            this.setState({
                gdealTitleErr: "*Please enter deal title",
                errMessageArr: errMessageArr.push("*Please enter deal title")
            })
        }
        if (gdealDiscription == '' || gdealDiscription === null || gdealDiscription === undefined) {
            this.setState({
                gdealDiscriptionErr: "*Please enter deal discription",
                errMessageArr: errMessageArr.push("*Please enter deal discription")
            })
        }
        if (gdealDiscription == '' || gdealDiscription === null || gdealDiscription === undefined) {
            this.setState({
                gdealDiscriptionErr: "*Please enter deal discription",
                errMessageArr: errMessageArr.push("*Please enter deal discription")
            })
        }
        if (gdealTerms == '' || gdealTerms === null || gdealTerms === undefined) {
            this.setState({
                gdealTermsErr: "*Please enter deal terms and conditions",
                errMessageArr: errMessageArr.push("*Please enter deal terms and conditions")
            })
        }
        if (dealExpiryDate == '' || dealExpiryDate === null || dealExpiryDate === undefined) {
            this.setState({
                dealExpiryDateErr: "*Please enter deal expiry date ",
                errMessageArr: errMessageArr.push("*Please enter deal expiry date")
            })
        }
        if (dealExpiryTime == '' || dealExpiryTime === null || dealExpiryTime === undefined) {
            this.setState({
                dealExpiryTimeErr: "*Please enter deal expiry time ",
                errMessageArr: errMessageArr.push("*Please enter deal expiry time")
            })
        }
        if (availableCoupon == 0) {
            this.setState({
                availableCouponErr: "*Please enter coupon ",
                errMessageArr: errMessageArr.push("*Please enter coupon")
            })
        }
        if (peopleLimit == 0) {
            this.setState({
                peopleLimitErr: "*Please enter people per coupon ",
                errMessageArr: errMessageArr.push("*Please enter people per coupon")
            })
        }
        setTimeout(() => {
            if (this.state.errMessageArr.length == 0) {
                this.setState({
                    spinnerVisible: true
                })
                let form = new FormData();
                let imageDeal = dealImage;
                imageDeal &&
                    imageDeal.map(image => {
                        let parts = image.path.split("/");
                        let uri =
                            Platform.OS === "android"
                                ? image.path
                                : image.path.replace("file://", "");
                        let name = parts[parts.length - 1];
                        let type = image.mime;

                        const file = {
                            uri,
                            name,
                            type
                        };
                        form.append("dealImage", file);
                        console.warn('deal', file)
                    });
                form.append("dealTittle", gdealTitle);
                form.append("dealDescription", gdealDiscription);
                form.append("termsAndCondition", gdealTerms);
                form.append("dealExpiryDate", dealExpiryDate);
                form.append("dealExpiryTime", dealExpiryTime);
                form.append("availableCoupon", availableCoupon);
                form.append("peopleLimit", peopleLimit);
                form.append("subDeals", this.state.dealsArr);

                //form.append("dealImage", dealImage);
                // var variables = {
                //     dealTittle: gdealTitle,
                //     dealDescription: gdealDiscription,
                //     termsAndCondition: gdealTerms,
                //     dealExpiryDate: dealExpiryDate,
                //     dealExpiryTime: dealExpiryTime,
                //     availableCoupon: availableCoupon,
                //     peopleLimit: peopleLimit,
                //     subDeals: this.state.dealsArr,
                //     dealImage: dealImage
                // }
                return NodeAPI(form, "createDeal", 'POST', auth_token)
                    .then(response => {
                        console.warn(JSON.stringify(response))
                        if (response.status === 200) {
                            //console.warn(response.message)
                            this.setState({ toastColor: sliderColor, toastMessage: response.message, toastVisible: true, })
                            setTimeout(() => {
                                this.setState({ toastVisible: false, spinnerVisible: false })
                            }, 2000)
                            this.props.navigation.navigate('mainRoute');
                        }
                        else {
                            //alert(response.message)
                            this.setState({ toastColor: errorColor, toastMessage: response.message, toastVisible: true, })
                            setTimeout(() => {
                                this.setState({ toastVisible: false, spinnerVisible: false })
                                //this.props.navigation.navigate('mainRoute')
                            }, 2000)
                        }
                    })
            }
        }, 500)
    }
    render() {
        // navigation use for the coustom header
        const navigation = this.props.navigation;
        // const newArray = new Array(this.state.subDeal)
        // console.warn(newArray)
        return (
            <View style={ConatinerViewWithoutPadding}>
                <Header navigation={navigation} title="Create deal" backButtonNavigation={true} />

                <Loader spinnerVisible={this.state.spinnerVisible} />
                <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />
                {/* data and time picker modal */}
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    mode={this.state.mode}
                />
                {/* form view */}
                <ScrollView showsVerticalScrollIndicator={false} style={ConatinerViewWithPadding}>
                    {/* deal image view */}
                    <View style={{}}>
                        <View style={{ height: hp('25%'), borderRadius: wp('5%'), marginHorizontal: wp('3%') }}>
                            <Image style={{ height: "100%", width: '100%', borderRadius: hp('2%') }} resizeMode="cover" source={this.state.ImagePath == '' ? require('../../Assets/icons/dummy_image3x.png') : { uri: this.state.ImagePath }} />
                        </View>
                        <TouchableOpacity onPress={() => this.ActionSheet.show()} style={{ position: 'absolute', zIndex: 10, right: wp('-1%'), top: hp('20.5%') }}>
                            <Image resizeMode="contain" source={require('../../Assets/icons/uploading.png')} />
                        </TouchableOpacity>
                    </View>
                    {this.state.dealImageErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.dealImageErr}</Text>}
                    {/* text inputes View */}
                    <View style={{ margin: wp('5%') }}>
                        <View >
                            <Text style={labelText}>Enter deal title</Text>
                            <View style={TextInputViewWithImage}>
                                <TextInput
                                    style={TextInputView}
                                    value={this.state.gdealTitle}
                                    keyboardType={'default'}
                                    maxLength={60}
                                    onChangeText={(text) => this.onChange(text, "GdealType")}
                                    onSubmitEditing={() => this.refs.description.focus()}
                                    onFocus={() => this.setState({ gdealTitleErr: '' })}
                                />
                            </View>
                            {this.state.gdealTitleErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.gdealTitleErr}</Text>}
                        </View>
                        <View style={textInputMargin}>
                            <Text style={labelText}>Enter deal description*</Text>
                            <View style={{ flexDirection: 'row', borderBottomColor: "#111111", borderBottomWidth: 2 }} >
                                <TextInput
                                    style={{ flex: 1, height: hp('10%'), fontFamily: fontFamily(), fontSize: fontSizes('smalltitle') }}
                                    multiline={true}
                                    numberOfLines={4}
                                    value={this.state.gdealDiscription}
                                    keyboardType={'default'}
                                    maxLength={150}
                                    onChangeText={(text) => this.onChange(text, "Gdiscription")}
                                    onSubmitEditing={() => this.refs.terms.focus()}
                                    ref='description'
                                    onFocus={() => this.setState({ gdealDiscriptionErr: '' })}
                                />
                            </View>
                            {this.state.gdealDiscriptionErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.gdealDiscriptionErr}</Text>}
                        </View>
                        <View style={textInputMargin}>
                            <Text style={labelText}>Enter terms and conditions</Text>
                            <View style={{ flexDirection: 'row', borderBottomColor: "#111111", borderBottomWidth: 2 }} >
                                <TextInput
                                    style={{ flex: 1, height: hp('10%'), fontFamily: fontFamily(), fontSize: fontSizes('smalltitle') }}
                                    multiline={true}
                                    numberOfLines={4}
                                    value={this.state.gdealTerms}
                                    keyboardType={'default'}
                                    maxLength={150}
                                    onChangeText={(text) => this.onChange(text, "GdealTerms")}
                                    onSubmitEditing={() => this.refs.date.focus()}
                                    ref='terms'
                                    onFocus={() => this.setState({ gdealTermsErr: '' })}
                                />
                            </View>
                            {this.state.gdealTermsErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.gdealTermsErr}</Text>}
                        </View>
                        <View style={textInputMargin} >
                            <Text style={labelText}>Deal expiry date</Text>
                            <View style={{ flex: 1, borderBottomWidth: 2, borderBottomColor: "#111111" }}>
                                <TouchableOpacity style={{ height: hp('6%'), justifyContent: 'center' }} onPress={() => this.showDateTimePicker('date')}>

                                    <Text style={{ fontSize: hp('2%'), color: '#111111' }}>{this.state.dealExpiryDate}</Text>
                                </TouchableOpacity>
                            </View>
                            {this.state.dealExpiryDateErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.dealExpiryDateErr}</Text>}
                        </View>
                        <View style={textInputMargin}>
                            <Text style={labelText}>Deal expiry time</Text>
                            <View style={{ flex: 1, borderBottomWidth: 2, borderBottomColor: "#111111" }}>
                                <TouchableOpacity style={{ height: hp('6%'), justifyContent: 'center' }} onPress={() => this.showDateTimePicker('time')}>

                                    <Text style={{ fontSize: hp('2%'), color: '#111111' }}>{this.state.dealExpiryTime}</Text>
                                </TouchableOpacity>
                            </View>
                            {this.state.dealExpiryTimeErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.dealExpiryTimeErr}</Text>}
                        </View>
                        {/* counter View 1 */}
                        <View style={[textInputMargin, { flexDirection: 'row' }]}>
                            <View style={{ flex: 1.5, justifyContent: 'center' }}>
                                <Text style={[labelText, { flexWrap: 'wrap' }]}>Select Available coupon </Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                {/* Add Button */}
                                <TouchableOpacity onPress={() => this.setState({ availableCoupon: this.state.availableCoupon + 1, availableCouponErr: '', errMessageArr: [] })} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image resizeMode="contain" source={require('../../Assets/icons/add_green.png')} />
                                </TouchableOpacity>
                                <ImageBackground style={{ height: '20%' }} resizeMode="contain" source={require('../../Assets/icons/unknown_1.png')} style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={labelText} >{this.state.availableCoupon < 10 ? '0' + this.state.availableCoupon : this.state.availableCoupon}</Text>
                                </ImageBackground>
                                {/* minus Button */}
                                <TouchableOpacity onPress={() => this.setState({ availableCoupon: this.state.availableCoupon == 0 ? this.state.availableCoupon : this.state.availableCoupon - 1, availableCouponErr: '', errMessageArr: [] })} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image resizeMode="contain" source={require('../../Assets/icons/minus_green.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.state.availableCouponErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.availableCouponErr}</Text>}
                        {/* counter View 2 */}
                        <View style={[textInputMargin, { flexDirection: 'row' }]}>
                            <View style={{ flex: 1.5, justifyContent: 'center' }}>
                                <Text style={labelText}>Select limit of people per coupon </Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                {/* Add Button */}
                                <TouchableOpacity onPress={() => this.setState({ peopleLimit: this.state.peopleLimit + 1, peopleLimitErr: '', errMessageArr: [] })} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image resizeMode="contain" source={require('../../Assets/icons/add_green.png')} />
                                </TouchableOpacity>
                                <ImageBackground style={{ height: '1%', backgroundColor: 'red' }} resizeMode="contain" source={require('../../Assets/icons/unknown_1.png')} style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={labelText} >{this.state.peopleLimit < 10 ? '0' + this.state.peopleLimit : this.state.peopleLimit}</Text>
                                </ImageBackground>
                                {/* minus Button */}
                                <TouchableOpacity onPress={() => this.setState({ peopleLimit: this.state.peopleLimit == 0 ? this.state.peopleLimit : this.state.peopleLimit - 1, peopleLimitErr: '', errMessageArr: [] })} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image resizeMode="contain" source={require('../../Assets/icons/minus_green.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.state.peopleLimitErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.peopleLimitErr}</Text>}
                    </View>
                    {/* Sub Deal form View */}

                    <View style={{}}>

                        {/* <FlatList
                            data={this.state.dealsArr}
                            extraData={this.state}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => this._subDealList(item, index)

                            }
                        /> */}

                        {
                            this.state.dealsArr.map((item, index) => {
                                return (
                                    <View style={{ backgroundColor: '#ffffff', margin: hp('1%'), padding: hp('2%'), borderRadius: wp('5%') }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 1, marginHorizontal: wp('2%') }}>
                                                <Text style={labelText}>Deal type </Text>
                                                <View style={{ flex: 1, borderBottomWidth: 2, borderBottomColor: "#111111" }}>
                                                    <Dropdown
                                                        data={dealType}
                                                        placeholder="50%"
                                                        fontSize={hp('2%')}
                                                        labelFontSize={0}
                                                        fontSize={hp('2%')}
                                                        rippleOpacity={0}
                                                        containerStyle={{ height: hp('6%') }}
                                                        dropdownOffset={{ top: hp('2%') }}
                                                        onChangeText={(value) => {
                                                            let data = this.state.dealsArr;
                                                            data[index].subDealType = value;
                                                            data[index].subDealTypeErr = '';
                                                            this.setState({ dealsArr: data })
                                                        }}
                                                        pickerStyle={{ marginTop: hp('10%'), marginLeft: hp('1.5%'), borderRadius: hp("1%") }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={labelText}>Deal title</Text>
                                                <View style={TextInputViewWithImage}>
                                                    <TextInput
                                                        style={TextInputView}
                                                        value={item.subDealTitle}
                                                        keyboardType={'default'}
                                                        maxLength={60}
                                                        onChangeText={(text) => this.onChange(text, "subdealTitle", index)}
                                                        onSubmitEditing={() => this.refs.des1.focus()}
                                                    //onFocus={() => this.setState({ subDealTitleErr: '' })}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                        {this.state.subDealTypeErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.subDealTypeErr}</Text>}
                                        {this.state.subDealTitleErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.subDealTitleErr}</Text>}

                                        <View style={{ marginVertical: hp('3%') }}>
                                            <Text style={labelText}>Description*</Text>
                                            <View style={{ flexDirection: 'row', borderBottomColor: "#111111", borderBottomWidth: 2 }} >
                                                <TextInput
                                                    style={{ flex: 1, height: hp('10%'), justifyContent: 'flex-start', fontFamily: fontFamily(), fontSize: fontSizes('smalltitle') }}
                                                    multiline={true}
                                                    numberOfLines={3}
                                                    value={item.subDealDiscription}
                                                    keyboardType={'default'}
                                                    maxLength={150}
                                                    onChangeText={(text) => this.onChange(text, "subdealDescription", index)}
                                                    //onSubmitEditing={() => this.refs.description.focus()}
                                                    ref='des1'
                                                //onFocus={() => this.setState({ subDealDiscriptionErr: '' })}
                                                />
                                            </View>
                                            {this.state.subDealDiscriptionErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.subDealDiscriptionErr}</Text>}

                                        </View>
                                    </View>
                                )
                            })
                        }

                        <TouchableOpacity onPress={() => this._addSubDeal()} style={{ zIndex: 10, left: '84%', bottom: '11.5%' }}>
                            <Image resizeMode="contain" source={require('../../Assets/icons/add_grey.png')} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => this.postDeal()} style={[Button1, { marginHorizontal: wp('8%'), marginBottom: hp('5%') }]}>
                        <Text style={ButtonText}>Post Deal</Text>
                    </TouchableOpacity>
                </ScrollView>
                {/* action sheet view modal */}
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


////djkdhk
showDateTimePicker(mode) {
    this.setState({ isDateTimePickerVisible: true, mode: mode });
}
hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
handleDatePicked = (date) => {
    if (this.state.mode == 'date') {
        let dates = this.dateConverterOfMilli(date)
        this.setState({ dealExpiryDate: dates, dealExpiryDateErr: '', errMessageArr: [] })
    } else {
        let time = this.timeConverterOfMilli(date)
        this.setState({ dealExpiryTime: time, dealExpiryTimeErr: '', errMessageArr: [] })
    }
    this.hideDateTimePicker();
};
//  hhjj
export function fontFamily(param) {
    if (param == "altbold") {
        return "Proxima Nova Alt Bold"
    }
    if (param == "altLight") {
        return "Proxima Nova Alt Light"
    }
    if (param == "altThin") {
        return "Proxima Nova Alt Thin"
    }
    if (param == "black") {
        return "Proxima Nova Black"
    }
    if (param == "bold") {
        return "Proxima Nova Bold"
    }
    if (param == "extraBold") {
        return "Proxima Nova Extrabold"
    }
    if (param == "thin") {
        return "Proxima Nova Thin"
    }
    return "ProximaNova-Regular"
}


/// deal remove
fetch(`http://realtimedeals.n1.iworklab.com:3005/v1/resturant/removeDeal/` + dealsId, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(variables),
})
    .then(response => response.json()
        .then(responseData => {
            //console.warn("===" + JSON.stringify(responseData))
            if (response.status === 200) {
                //console.warn('inside')
                this.setState({ toastColor: sliderColor, toastMessage: responseData.message, toastVisible: true })

                setTimeout(() => {
                    this.setState({
                        spinnerVisible: false,
                        dealDetail: {},
                        subDeal: []
                    })
                    this.props.navigation.navigate('MyDealsScreen')
                }, 2000);
            }
            else {
                //alert("else")
                this.setState({ toastColor: errorColor, toastMessage: responseData.message, toastVisible: true })
                setTimeout(() => {
                    this.setState({ toastVisible: false, spinnerVisible: false })
                    //this.props.navigation.navigate('mainRoute')
                }, 2000)
            }
        }))
    .catch(err => {
        alert("Server encountered a problem please retry.")
    });

// update deal
fetch(`http://realtimedeals.n1.iworklab.com:3005/v1/resturant/` + dealsId, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(variables),
})
    .then(response => response.json()
        .then(responseData => {
            //console.warn("===" + JSON.stringify(responseData))
            if (response.status === 200) {
                //console.warn('inside')
                this.setState({ toastColor: sliderColor, toastMessage: responseData.message, toastVisible: true })
                setTimeout(() => {
                    this.setState({
                        spinnerVisible: false,
                        toastVisible: false,
                        dealDetail: {},
                        subDeal: []
                    })
                    this.props.navigation.navigate('MyDealsScreen')
                }, 2000);
            }
            else {
                //alert("else")
                this.setState({ toastColor: errorColor, toastMessage: responseData.message, toastVisible: true })
                setTimeout(() => {
                    this.setState({ toastVisible: false, spinnerVisible: false })
                    //this.props.navigation.navigate('mainRoute')
                }, 2000)
            }
        }))
    .catch(err => {
        alert("Server encountered a problem please retry.")
    });


    /// place picker
    <View style={{ flexDirection: 'row', borderBottomColor: "#cacaca", borderBottomWidth: 1 }}>
                  <View style={{ flex: 5, flexDirection: 'row', alignItems: 'flex-start', marginTop: '5%' }}>
                    <Image resizeMode="contain" style={{ height: hp('5%'), width: wp('5%') }} source={require('../../Assets/icons/location_black.png')} />
                    <View style={{ flex: 1 }} >
                      <GooglePlacesAutocomplete
                        minLength={2} // minimum length of text to search
                        autoFocus={false}
                        //value={this.state.address}
                        editable={this.state.edit}
                        placesholder='enter the address'
                        listViewDisplayed={false} // true/false/undefined
                        returnKeyType={'search'}
                        fetchDetails={true}
                        filterReverseGeocodingByTypes={[
                          'locality',
                          'sublocality',
                          'postal_code',
                          'country',
                          'administrative_area_level_1',
                          'administrative_area_level_2',
                          'administrative_area_level_3',
                        ]}
                        renderDescription={row => row.description} // custom description render
                        onFocus={() => this.setState({ addressErr: '', errMessageArr: [] })}
                        onPress={(data, details = null) => {
                          console.warn(details)
                          console.warn(data)
                          this.setState({ address: details, addressErr: '' });
                        }}
                        getDefaultValue={() => {
                          return ''; // text input default value
                        }}
                        query={{
                          key: 'AIzaSyBaFtvmGRl186P0Lvk86aWnAforWLlTWVs',
                          language: 'en', // language of the results
                          components: 'country:hk'
                        }}
                        styles={{
                          container: {
                            marginBottom: hp('2%')
                          },
                          textInputContainer: {
                            backgroundColor: 'transparent',
                          },
                          description: {
                            fontWeight: 'bold',
                          },
                          predefinedPlacesDescription: {
                            color: '#1faadb',
                          },
                          textInput: {
                            flex: 1,
                            marginLeft: 0,
                            marginRight: 0,
                            fontSize: hp('2%'),
                            backgroundColor: 'transparent',
                          }
                        }}
                        nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                        GoogleReverseGeocodingQuery={{
                        }}
                        GooglePlacesSearchQuery={{
                          rankby: 'distance',
                          types: 'places',
                        }}
                        debounce={300}
                      />
                    </View>
                  </View>
                </View>