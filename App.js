import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, SafeAreaView, AsyncStorage, Alert } from 'react-native';
import Route from './App/Navigations/navigation';
// import SplashScreen from 'react-native-splash-screen';
import store from './App/app_redux/store/index';
import { Provider } from 'react-redux'
import { borderLight } from './App/Utils/responsive';
import firebase from 'react-native-firebase';
import type, { Notification, NotificationOpen,RemoteMessage } from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
// import {
//   getUniqueId,
//   getUniqueIdSync,
//   getManufacturer,
//   getManufacturerSync,
//   getBrand,
//   getBrandSync,
//   getModel,
//   getModelSync,
//   getDeviceId,
//   getDeviceIdSync,
// } from 'react-native-device-info';
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;
const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={{ height: STATUSBAR_HEIGHT, backgroundColor }}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

export default class App extends Component {



  async componentDidMount() {
    await this.checkPermission();
    await this.createNotificationListeners();
    await this.getdeviceId();
//     firebase.notifications().getInitialNotification()
// .then(notificationOpen => {
//   console.warn("opneopen opne",notificationOpen)
//    if (notificationOpen) {
//       // App was opened by a notification
//       console.warn("opneopen opne1")
//       const notification = notificationOpen.notification;  
//       const data = notificationOpen.notification._data;
//       console.warn("opneopen opne2")
//         // if (data.action === 'openChat') {
//         //   //Code to open Chat screen  
//         // }
//    }
// });
// firebase.notifications().onNotificationOpened().then(notificationOpen => {
//             console.warn("opneopen opne2",notificationOpen)
//              if (notificationOpen) {
//                 // App was opened by a notification
//                 console.warn("opneopen opne2")
//                 const notification = notificationOpen.notification;  
//                 const data = notificationOpen.notification._data;
//                 console.warn("opneopen opne4")
//                   // if (data.action === 'openChat') {
//                   //   //Code to open Chat screen  
//                   // }
//              }
//           });
this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
  const { title, body } = notificationOpen.notification;
  console.warn('onNotificationOpened:');
  alert(title, body)
  Alert.alert(title, body)

});
    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed(notification => {
        console.log("CDM1", notification);
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      });
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        console.log("CDM2", notification);
        // Process your notification as required
      });
  }
  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    this.messageListener();
    this.notificationOpenedListener();
  }

  getdeviceId = () => {
    //Getting the Unique Id from here
    var id = DeviceInfo.getDeviceId().then(deviceId => {
      // iOS: "iPhone7,2"
      // Android: "goldfish"
      // Windows: ?
      console.warn(' inside mere phone ki id', deviceId)
      return deviceId;
    });
    console.warn('mere phone ki id', id)
  };

  // //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
      this.createNotificationListeners();
    } else {
      this.requestPermission();
    }
  }

  // //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.warn('fcm', fcmToken)
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      console.warn('fcmtoken', fcmToken)
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  // //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
      this.createNotificationListeners();
    } catch (error) {
      // User has rejected permissions
    }
  }




  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
   if (Platform.OS === 'android') {
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      console.log('onNotification:');
      const localNotification = new firebase.notifications.Notification({
        sound: 'sampleaudio',
        show_in_foreground: true,
      })
        .setSound('sampleaudio.wav')
        .setNotificationId(notification.notificationId)
        .setTitle(notification.title)
        .setBody(notification.body)
        .android.setChannelId('fcm_FirebaseNotifiction_default_channel') // e.g. the id you chose above
        .android.setSmallIcon('@drawable/ic_launcher') // create this icon in Android Studio
        .android.setColor('#ffffff99') // you can set a color here
        .android.setPriority(firebase.notifications.Android.Priority.High);
      
      //add my new lines
        const action = new firebase.notifications.Android.Action('test_action', 'ic_launcher', 'My Test Action');
      // Add the action to the notification
      //action.setShowUserInterface(false);
      notification.android.addAction(action);

      firebase.notifications().displayNotification(localNotification)
      .catch(err => console.error(err));
    });
  }

    const channel = new firebase.notifications.Android.Channel('fcm_FirebaseNotifiction_default_channel', 'Demo app name', firebase.notifications.Android.Importance.High)
      .setDescription('Demo app description')
    //.setSound('sampleaudio.wav');
    firebase.notifications().android.createChannel(channel);

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      console.warn('onNotificationOpened:');
      alert(title, body)
      Alert.alert(title, body)

    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      console.warn('getInitialNotification:');
      Alert.alert(title, body)
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.warn("JSON.stringify:", JSON.stringify(message));
    });
  }





  //https://gratiphycustomer.page.link/share
  render() {
    return (
      <Provider store={store}>
        {/* <View
          style={{
            backgroundColor: "#F8F8FF",
            height: Platform.OS === 'ios' ? 35 : StatusBar.currentHeight,
          }}>
          <StatusBar
            translucent
            backgroundColor="#F8F8FF"
            barStyle="dark-content"
          />
        </View> */}

        <SafeAreaView style={styles.container}>
          <MyStatusBar backgroundColor={'#F8F8FF'} barStyle="dark-content" />
          <Route />
        </SafeAreaView>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});