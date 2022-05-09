import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, Platform, TextInput, Modal, PermissionsAndroid, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, errorColor, timeConverterOfMilli } from '../../Utils/responsive';
import Header from '../../Components/commonHeader';
import DateTimePicker from "react-native-modal-datetime-picker";
import { Button1, ButtonText, ConatinerViewWithPadding, textInputMargin, TextInputView, labelText, ConatinerViewWithoutPadding } from '../../Utils/commonStyles';
import { NodeAPI } from '../../Services/apiServices';
import { Dropdown } from 'react-native-material-dropdown';
import * as saveProfileAction from '../../app_redux/actions/SaveProfileDataAction';
import * as locationAction from '../../app_redux/actions/locationAction';
import { connect } from "react-redux";
import { Toast, Loader } from '../../Components/modals';
import LocationView from "../../Components/react-native-location-view";
//import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import { NavigationEvents } from 'react-navigation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {LocationPicker} from '../../Components/locationPicker';


class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      activeTab: "setdate",
      mode: 'date',
      date: '',//new Date().toLocaleDateString(),
      time: '',
      timeErr: '',
      spinnerVisible: true,
      isVisible: false,
      currentLocation: {
        latitude: 0,
        longitude: 0
      },
      address: {
        location: [0, 0],
        formatted_address: ''
      },
      addressErr: '',
      initialPosition: 0,
      lastPosition: 0,
      noOfPeople: 0,
      noOfPeopleErr: '',
      dealTypes: [],
      errMessageArr: [],
      foodType: '',
      updatesEnabled: true
    }
    //this.currentLocationFun();
  }

  //------------------------------------ life cycle function--------------------------------- 
  async componentDidMount() {
    await this.profileData();
    await this.currentLocationFun();
    await this.dealTypesFunction();
   // await this.getLocationUpdates();

  }

  //----------------------------------- input tym change text function-------------------------
  onChange(text, type, index) {
    //this pattern checks for emoji
    var pattern = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/
    if (type == "noOfpeople") {
      this.setState({
        noOfPeople: text.replace(/[^0-9]/g, ''),
        errMessageArr: []
      });
    }
  }
//------------------------------------------- life cycle function------------------------------------
  componentWillUnmount() {
     if (this.watchId !== null) {
          Geolocation.clearWatch(this.watchId);
      }
  }


//--------------------------- all location functions here--------------------------------------------//

//----------------------------- for enabled the gps in android---------------------------------------- 
  onLocationEnablePressed = async () => {
    if (Platform.OS === 'android') {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
        .then(async (data) => {
          if (data == 'enabled') {
            await this.currentLocationFun();
          }
        }).catch(async (err) => {
          if (err.code == 'ERR00') {
            await this.currentLocationFun();
          }
        });
    }
  }

  //--------------------------------- for check the location permissions----------------------------------
  hasLocationPermission = async () => {
    if (Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      this.hasLocationPermission();
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      this.hasLocationPermission();
    }
    return this.hasLocationPermission();
  }

  //----------------------------------- for get the current longitiude and lattitude--------------------------- 
  async currentLocationFun() {
    const hasLocationPermission = await this.hasLocationPermission();
    if (!hasLocationPermission) return;

    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = JSON.stringify(position);
        this.setState({ initialPosition });
      },
      error => {
        if (error.code == 2) {
          this.onLocationEnablePressed()
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 },
    );
    this.watchID = Geolocation.watchPosition(async (position) => {
      var lastPosition = position;
      await this.setState({
        currentLocation: {
          latitude: lastPosition.coords.latitude,
          longitude: lastPosition.coords.longitude,
        },
      });
     
      await this.locationText();
    },
      //error => Alert.alert('Error', JSON.stringify(error))
    );
    this.watchId = Geolocation.watchPosition(
      async (position) => {
        var lastPosition = position;
        await this.setState({
          currentLocation: {
            latitude: lastPosition.coords.latitude,
            longitude: lastPosition.coords.longitude,
          },
        });
       
        await this.locationText();
        //this.setState({ location: position });
        console.warn("ppppp--->",position);
      },
      (error) => {
        //this.setState({ location: error });
        console.log(error);
      },
      { enableHighAccuracy: true, distanceFilter: 0, interval: 5000, fastestInterval: 2000 }
    );
  }
  // getLocationUpdates = async () => {
  //   const hasLocationPermission = await this.hasLocationPermission();

  //   if (!hasLocationPermission) return;

  //   this.setState({ updatesEnabled: true }, () => {
  //     this.watchId = Geolocation.watchPosition(
  //       (position) => {
  //         //this.setState({ location: position });
  //         console.log("ppppp--->",position);
  //       },
  //       (error) => {
  //         //this.setState({ location: error });
  //         console.log(error);
  //       },
  //       { enableHighAccuracy: true, distanceFilter: 0, interval: 5000, fastestInterval: 2000 }
  //     );
  //   });
  // }


  //-------------------------------------------- for lattitude to address in text formate---------------------------------------
  // {
  //  https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=address,mongolian%20grill&inputtype=textquery&fields=formatted_address,name,geometry&locationbias=point:${this.state.currentLocation.latitude, this.state.currentLocation.longitude}&key=AIzaSyB9vC55lgpt2ymmljWWXt579lReV2nW3IY
  // }
  //https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.region.latitude + ',' + this.state.region.longitude + '&key=AIzaSyBWfFx_15TqC1t6cCMpiIk7f4gJWhhLcLc'
  locationText() {
    return fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.currentLocation.latitude + ',' + this.state.currentLocation.longitude + '&key=AIzaSyBWfFx_15TqC1t6cCMpiIk7f4gJWhhLcLc')
      .then((response) => response.json())
      .then((responseJson) => {
        this.props.saveLocationData(responseJson.results[0])
        this.setState({ spinnerVisible: false })
      })
      .catch((error) => {
        this.setState({ spinnerVisible: false })
      });
  }
//--------------------------- end all location functions here--------------------------------------------//
 

//------------------------------------- get profile data fron api function --------------------------------
  profileData = async () => {
    const value = await AsyncStorage.getItem('auth_token');
    if (value !== null) {
      let variables = {}
      return NodeAPI(variables, "profileUser", 'GET', value)
        .then(response => {
          if (response.status === 200) {
            this.props.saveProfileData(JSON.stringify(response.data))
          }
          else {
            //alert(response)
          }
        })
    }
  }

  //---------------------------------- get the types of deel from api function -----------------------------------
  async dealTypesFunction() {
    let variables = {}
    return NodeAPI(variables, "dealTypeDropDown", 'GET')
      .then(response => {
        if (response.status === 200) {
          var reformattedArray = response.dealsData.map(obj => {
            var typeDeals = {
              label: obj.dealType,
              value: obj.dealType
            }
            var data = this.state.dealTypes;
            data.push(typeDeals)
            this.setState({
              dealTypes: data,
              spinnerVisible: false
            })
          });
        }
        else{
          this.setState({
            spinnerVisible: false
          })
        }
      })
  }

 //---------------------------------------------- time and date finctions ------------------------------------------
  showDateTimePicker(mode) {
    this.setState({ isDateTimePickerVisible: true, mode: mode, timeErr: '', errMessageArr: [] });
  }

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  handleDatePicked = (date) => {
    if (this.state.mode == 'date') {
      this.setState({ date: new Date(date).toLocaleDateString() })
    } 
    else {
      this.setState({ time: new Date(date) })
    }
    this.hideDateTimePicker();
  };


// ----------------------------------- submit intention function ----------------------------------
  submitButton = () => {
    let {
      address,
      noOfPeople,
      time,
      errMessageArr,
    } = this.state;
    errMessageArr = [];

    if (address.formatted_address == '' || address.formatted_address === null || address.formatted_address === undefined) {
      this.setState({
        addressErr: "*Please select the address",
        errMessageArr: errMessageArr.push("*Please select the address")
      })
    }
    if (noOfPeople <= 0) {
      this.setState({
        noOfPeopleErr: "*Please select the no of peoples",
        errMessageArr: errMessageArr.push("*Please select the no of peoples")
      })
    }
    if (time == '') {
      this.setState({
        timeErr: "*Please select the time",
        errMessageArr: errMessageArr.push("*Please select the time")
      })
    }
    setTimeout(() => {
      if (this.state.errMessageArr.length == 0) {
        this.props.navigation.navigate('DealsForMeScreen', { address: this.state.address, noOfPeople: this.state.noOfPeople, time: this.state.time, foodType: this.state.foodType })
      }
    }, 500)
  }

  //--------------------------- refresh state function ------------------------------------
  async refreshState() {
    this.setState({
      address: {
        location: [],
        formatted_address: ''
      },
      noOfPeople: 0,
      time: '',
      foodType:''
    })
    await this.currentLocationFun();
    // await  setInterval(async()=>{
    //   this.currentLocationFun();
    // }, 1000)
  }

  //------------------------------------- add and minus no of people functions ---------------------------
  addNoPeople = () => {
    this.setState({
      noOfPeople: this.state.noOfPeople == '' ? 0 + 1 : parseInt(this.state.noOfPeople) + 1,
      noOfPeopleErr: '',
      errMessageArr: []
    }) 
  }

  minusNoPeople=()=>{
    this.setState({ 
      noOfPeople: this.state.noOfPeople == 0 ? this.state.noOfPeople : parseInt(this.state.noOfPeople) - 1, 
      noOfPeopleErr: '', 
      errMessageArr: [] 
    })
  }

  
   //--------------------------------------- close modal function ------------------------------------
  closeModalfun =()=>{
    this.setState({isVisible: false})
  }

   
  render() {
    const navigation = this.props.navigation;
    return (
      <View style={ConatinerViewWithoutPadding}>
      {/* -----------------------for call the function when enter the page--------------------- */}
        <NavigationEvents
          onWillFocus={
            () => this.refreshState()
          }
        />
        {/* -----------------------loader--------------------- */}
        <Loader spinnerVisible={this.state.spinnerVisible} />
        {/* -----------------------date and time picker--------------------- */}
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          mode={this.state.mode}
          minimumDate={new Date()}
        />
        {/* -----------------------header--------------------- */}
        <Header navigation={navigation} icon={true} menuButton={true} />
        {/* <LocationPicker 
          isVisible={this.state.isVisible} 
          closeModal={this.setState({isVisible:false})} 
          initialLocations = {{
                    latitude: this.state.currentLocation.latitude,
                    longitude: this.state.currentLocation.longitude,
                  }}
         /> */}
         {/* -----------------------Location Picker modal--------------------- */}
        <Modal
          animationType={"fade"}
          hardwareAccelerated
          visible={this.state.isVisible}
          transparent={true}
          onRequestClose={() => { console.log("Modal has been closed.") }}>
          <SafeAreaView style={styles.modal}>
            <KeyboardAvoidingView>
              <View style={{ height: hp('95%'), width: wp('99%') }}>
                <LocationView
                  apiKey={"AIzaSyB9vC55lgpt2ymmljWWXt579lReV2nW3IY"}
                  markerColor={'transparent'}
                  onLocationSelect={(address) => {
                    this.setState({
                      address: {
                        formatted_address: address.address,
                        location: [
                          address.latitude,
                          address.longitude
                        ]
                      },
                      addressErr: '',
                      isVisible: false,
                    }, () => { console.warn("address------>", this.state.address) });
                  }}
                  initialLocation={{
                    latitude: this.state.currentLocation.latitude,
                    longitude: this.state.currentLocation.longitude,
                  }}
                />
              </View>
              <TouchableOpacity onPress={() => {
                this.setState({ isVisible: !this.state.isVisible })
              }} style={{ position: 'absolute', top: 10, right: 5 }}>
                <Image source={require('../../Assets/icons/cancel.png')} />
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
        {/* -----------------------Screen View--------------------- */}
        <ScrollView showsVerticalScrollIndicator={false} style={ConatinerViewWithPadding}>
          <View style={styles.cell_PhoneView}>
            <Image resizeMode='contain' style={{ flex: 1 }} source={require('../../Assets/icons/cell_phone.png')} />
          </View>
          {/* -----------------------Select location View--------------------- */}
          <View style={styles.LocationPickerView}>
            <View style={styles.LocationPickerTextInputView}>
              <Text style={labelText}>Mention Location</Text>
              <TextInput
                style={TextInputView}
                editable={false}
                value={this.state.address.formatted_address}
                maxLength={56}
                keyboardType={'default'}
                placeholder="Enter Location"
              // onChangeText={(text) => this.onChange(text.trim(), "email")}
              // onSubmitEditing={() => this.refs.Password.focus()}
              // onFocus={() => this.setState({ emailErr: '' })}
              />
            </View>
            <TouchableOpacity onPress={() => {
              //this.opne();
              this.setState({ isVisible: true, addressErr: '', errMessageArr: [] })
            }
            } style={{ flex: 1, borderRadius: hp('5%') }}>
              <Image resizeMode='contain' style={{ flex: 1 }} source={require('../../Assets/icons/pin1.png')} />
            </TouchableOpacity>
          </View>
          {this.state.addressErr == "" ? null : <Text style={[labelText, { color: errorColor, marginLeft: hp('5%') }]}>{this.state.addressErr}</Text>}
{/* -----------------------Select no of people View--------------------- */}
          <View style={{ marginHorizontal: wp('6%'), marginTop: hp('3%') }}>
            <View style={[textInputMargin, { flexDirection: 'row' }]}>
              <View style={{ flex: 1.5, justifyContent: 'center' }}>
                <Text style={[labelText, { flexWrap: 'wrap' }]}>Select no.of people </Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                {/* Add Button */}
                <TouchableOpacity onPress={() => this.addNoPeople()} style={styles.addMinusButtonView}>
                  <Image resizeMode="center" source={require('../../Assets/icons/add_green.png')} />
                </TouchableOpacity>
                <View >
                  <TextInput
                    style={[styles.counterTextInputView, labelText]}
                    value={this.state.noOfPeople.toString()}
                    keyboardType={'number-pad'}
                    maxLength={3}
                    onChangeText={(text) => this.onChange(text.trim(), "noOfpeople")}
                    //ref='people'
                    // onSubmitEditing={() => this.refs.people.focus()}
                    onFocus={() => this.setState({ noOfPeopleErr: '', noOfPeople: this.state.noOfPeople })}
                  />
                </View>
                {/* minus Button */}
                <TouchableOpacity onPress={() => this.minusNoPeople()} style={styles.addMinusButtonView}>
                  <Image resizeMode="contain" source={require('../../Assets/icons/minus_green.png')} />
                </TouchableOpacity>
              </View>
            </View>
            {this.state.noOfPeopleErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.noOfPeopleErr}</Text>}
           {/* -----------------------Select tentive hours view--------------------- */}
            <View style={textInputMargin}>
              <Text style={labelText}>Select Tentative Hours</Text>
              <View style={styles.dateTimeView}>
                <TouchableOpacity style={styles.dateTimePicker} onPress={() => this.showDateTimePicker('time')}>
                  {
                    this.state.time == '' ?
                      <Text style={styles.timeDateFont}> 00:00 </Text>
                      :
                      <Text style={styles.timeDateFont}>{timeConverterOfMilli(this.state.time)}</Text>
                  }
                </TouchableOpacity>
              </View>
              {this.state.timeErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.timeErr}</Text>}
            </View>
{/* -----------------------Select what are you lookong for view--------------------- */}
            <View style={{ marginTop: hp('3%') }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={labelText}>What you're looking for</Text>
              </View>
              <View style={styles.lookinForView}>
                <Dropdown
                  data={this.state.dealTypes}
                  placeholder="please select"
                  fontSize={hp('2%')}
                  labelFontSize={0}
                  fontSize={hp('2%')}
                  rippleOpacity={0}
                  containerStyle={{ height: hp('6%') }}
                  dropdownOffset={{ top: hp('2%') }}
                  onChangeText={(value) => {
                    this.setState({
                      foodType: value
                    })
                  }}
                  pickerStyle={{ marginBottom: hp('10%'), marginLeft: hp('1.5%'), borderRadius: hp("1%") }}
                />
              </View>
              {/* {this.state.priceCategoryErr == "" ? null : <Text style={[labelText, { color: errorColor }]}>{this.state.priceCategoryErr}</Text>} */}
            </View>
          </View>
          {/* -----------------------submit intition button--------------------- */}
          <TouchableOpacity onPress={() => this.submitButton()} style={[Button1, { marginHorizontal: wp('8%'), marginVertical: hp('5%') }]}>
            <Text style={ButtonText}>Submit Intention</Text>
          </TouchableOpacity>

          {/* onPress={() => this.props.navigation.navigate('DealsForMeScreen')} */}
        </ScrollView>
      </View>
    );
  }
}

export default connect(
  state => ({
    location: state.SaveLocationReducer.locationData
  }), { ...saveProfileAction, ...locationAction }
)(HomeScreen)


const styles = StyleSheet.create({
  analyticsFont: {
    fontFamily: fontFamily('bold'),
    fontSize: fontSizes('title'),
    color: '#111111'
  },
  filterView: {
    backgroundColor: '#ffffff',
    borderRadius: hp('2%'),
    marginTop: hp('2%'),
    padding: hp('2%')
  },
  dateTimeView: {
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: "#111111"
  },
  dateTimePicker: {
    height: hp('6%'),
    justifyContent: 'center'
  },
  timeDateFont: {
    fontSize: hp('2%'),
    color: '#111111'
  },
  cell_PhoneView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('35%')
  },
  LocationPickerView: {
    height: hp('9%'),
    flexDirection: 'row',
    marginHorizontal: wp('5%'),
    backgroundColor: '#ffffff',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: hp('5%')
  },
  LocationPickerTextInputView: {
    flex: 2.5,
    borderTopLeftRadius: wp('5%'),
    borderBottomLeftRadius: wp('5%'),
    paddingLeft: wp('5%'),
    paddingTop: hp('1%'),

  },
  counterButtonView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  counterTextView: {
    backgroundColor: '#ffffff',
    borderWidth: wp('0.6%'),
    borderColor: '#111111',
    borderRadius: hp('2.2%'),
    height: hp('4.5%'),
    width: wp('14%'),
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#11111190'
  },
  counterTextInputView: {
    backgroundColor: '#ffffff',
    borderWidth: wp('0.6%'),
    borderColor: '#111111',
    borderRadius: hp('2.2%'),
    height: hp('6%'),
    width: wp('14%'),
    textAlign: 'center'
  },
  addMinusButtonView:{ 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
lookinForView:{ 
  flex: 1, 
  borderBottomWidth: 2, 
  borderBottomColor: "#111111" 
}
})
