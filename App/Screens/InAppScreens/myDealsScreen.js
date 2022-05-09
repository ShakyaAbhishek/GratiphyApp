import React, { Component } from 'react';
import { FlatList, View, Text, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor, errorColor } from '../../Utils/responsive';
import { Dropdown } from 'react-native-material-dropdown';
import Header from '../../Components/commonHeader';
import DateTimePicker from "react-native-modal-datetime-picker";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button1, ButtonText, ConatinerViewWithPadding, BigHeadingText, SmallTextHeading, TextInputViewWithImage, TextInputView, labelText, TextInputImage, ConatinerViewWithoutPadding } from '../../Utils/commonStyles';
import { Toast, Loader } from '../../Components/modals';
import { NodeAPI, imageUrl } from '../../Services/apiServices';
import { NavigationEvents } from 'react-navigation';

export default class MyDealsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dealsData: [],
      auth_token: '',
      toastVisible: false,
      spinnerVisible: false,
      toastColor: '',
      toastMessage: '',
    };
    //this._retrieveData();
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('auth_token');
      if (value !== null) {
        console.log(value)
        this.setState({
          auth_token: value
        })
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  dateConverterOfMilli(dateMilliSecond) {
    var date = new Date(dateMilliSecond)
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    date = (day < 10 ? '0' + day : day) + '/' + (month + 1 < 9 ? '0' + (month + 1) : (month + 1)) + '/' + year
    return date
  }
  timeConverterOfMilli(dateMilliSecond) {
    // dateMilliSecond= JSON.parse(dateMilliSecond)
    var date = new Date(dateMilliSecond)
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var second = date.getSeconds();
    time = (hour < 10 ? '0' + hour : hour) + ':' + (minutes < 10 ? '0' + minutes : minutes)
    return time
  }
  // componentDidMount() {
  //   this.myDealsData()
  // }

  async myDealsData() {
    this.setState({ spinnerVisible: true })
    await this._retrieveData();
    var variables = {}
    return NodeAPI(variables, "dealList", 'GET', this.state.auth_token)
      .then(response => {
        console.warn(response)
        if (response.status === 200) {
          this.setState({ dealsData: response.data, spinnerVisible: false })
        }
        else {
          this.setState({ toastColor: errorColor, toastMessage: response.message, toastVisible: true, })
          setTimeout(() => {
            this.setState({ toastVisible: false, spinnerVisible: false })
            //this.props.navigation.navigate('mainRoute')
          }, 2000)
        }
      })
  }

  _dealList(item, index) {
    return (
      <View style={{ height: hp('13.5%'), marginTop: hp('1.2%'), flexDirection: 'row', borderColor: '#cacaca', borderBottomWidth: hp('0.2%') }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('DealDetailScreen', { dealId: item._id })} style={{
            height: hp('12%'), width: wp('28%'), elevation: 2, borderColor: "#ffffff", borderWidth: hp('0.5%'), borderRadius: wp('5%'), shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}>
            <Image style={{ height: '100%', width: '100%', borderRadius: 15 }} source={item.dealImage == '' ? require('../../Assets/icons/dummy_image.png') : { uri: `${imageUrl}${item.dealImage}` }} resizeMode="cover" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 2, marginVertical: hp('0.5%'), marginLeft: wp('2%') }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 2 }}>
              <Text numberOfLines={1} style={[labelText, { fontFamily: fontFamily('bold'), color: '#111111' }]}>{item.dealTitle}</Text>
            </View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('DealRedemptionScreen')} style={{ flex: 1.2, backgroundColor: '#eaeaea', borderRadius: hp('5%'), justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: fontFamily(), fontSize: hp('1.5%') }}>Redemptions</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
            <View style={{ flex: 1, marginLeft: hp('0.5%'), flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              <Image resizeMode='contain' source={require('../../Assets/icons/watch.png')} />
              <Text style={{ fontFamily: fontFamily(), fontSize: hp('1.9%'), color: '#111111' }}>{item.dealExpiryTime} </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }}>
              <Image resizeMode='contain' source={require('../../Assets/icons/calendar.png')} />
              <Text style={{ fontFamily: fontFamily(), fontSize: hp('1.9%'), color: '#111111' }}>{item.dealExpiryDate}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: hp('1%') }}>
            <View style={{ flex: 1.3, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image resizeMode='contain' source={item.Status == 'Expired' ? require('../../Assets/icons/expired.png') : require('../../Assets/icons/patially.png')} />
              </View>
              <View style={{ flex: 3, justifyContent: 'center', }}>
                <Text style={{ fontFamily: fontFamily(), fontSize: hp('1.9%'), color: item.Status === 'Expired' ? 'red' : '#111111' }}>{item.Status}</Text>
              </View>
            </View>
            <View style={{ flex: 0.5 }}>
              <Text style={{ fontFamily: fontFamily(), fontSize: hp('1.9%'), color: '#111111' }}>0/{item.availableCoupon}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const navigation = this.props.navigation;
    //console.warn('this.state', this.state.dealsData)
    return (
      <View style={ConatinerViewWithoutPadding}>
        <NavigationEvents
          onWillFocus={() =>
            this.myDealsData()
          }
        />
        <Header navigation={navigation} icon={true} menuButton={true} />
        <Loader spinnerVisible={this.state.spinnerVisible} />
        <Toast visible={this.state.toastVisible} message={this.state.toastMessage} backColor={this.state.toastColor} />
        <View style={ConatinerViewWithPadding}>
          {this.state.dealsData.length == 0 ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={SmallTextHeading}>
                No Data
              </Text>
            </View>
            :
            <FlatList
              data={this.state.dealsData}
              extraData={this.state}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => this._dealList(item, index)}
            />
          }
        </View>
      </View>
    );
  }
}

// {
        //   cafeName: 'Sandwich Cafe',
        //   dealTime: "04:30",
        //   dealDate: "27/05/2020",
        //   dealStatus: "Partially redeemed",
        //   totalDeal: 40,
        //   redeemedDeal: 4
        // },
        // {
        //   cafeName: 'Pizza Cafe',
        //   dealTime: "14:30",
        //   dealDate: "28/06/2020",
        //   dealStatus: "Expired",
        //   totalDeal: 40,
        //   redeemedDeal: 30
        // },
        // {
        //   cafeName: 'Coffee Cafe',
        //   dealTime: "15:30",
        //   dealDate: "27/05/2020",
        //   dealStatus: "Fully redeemed",
        //   totalDeal: 40,
        //   redeemedDeal: 40
        // },
        // {
        //   cafeName: 'Sandwich Cafe',
        //   dealTime: "04:30",
        //   dealDate: "27/05/2020",
        //   dealStatus: "Partially redeemed",
        //   totalDeal: 40,
        //   redeemedDeal: 4
        // },
        // {
        //   cafeName: 'Pizza Cafe',
        //   dealTime: "14:30",
        //   dealDate: "28/06/2020",
        //   dealStatus: "Expired",
        //   totalDeal: 40,
        //   redeemedDeal: 30
        // },
        // {
        //   cafeName: 'Coffee Cafe',
        //   dealTime: "15:30",
        //   dealDate: "27/05/2020",
        //   dealStatus: "Fully redeemed",
        //   totalDeal: 40,
        //   redeemedDeal: 40
        // },
        // {
        //   cafeName: 'Sandwich Cafe',
        //   dealTime: "04:30",
        //   dealDate: "27/05/2020",
        //   dealStatus: "Partially redeemed",
        //   totalDeal: 40,
        //   redeemedDeal: 4
        // },
        // {
        //   cafeName: 'Pizza Cafe',
        //   dealTime: "14:30",
        //   dealDate: "28/06/2020",
        //   dealStatus: "Expired",
        //   totalDeal: 40,
        //   redeemedDeal: 30
        // },
        // {
        //   cafeName: 'Coffee Cafe',
        //   dealTime: "15:30",
        //   dealDate: "27/05/2020",
        //   dealStatus: "Fully redeemed",
        //   totalDeal: 40,
        //   redeemedDeal: 40
        // }