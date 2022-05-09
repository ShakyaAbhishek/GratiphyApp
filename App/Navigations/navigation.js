import React, { Component } from 'react';
import { AsyncStorage, Alert, Dimensions, TouchableOpacity, Text, View, ImageBackground, TextInput, Image } from 'react-native';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from "react-navigation";

//Import PreLogin Screens Screens
import SplashScreen from '../Screens/PreLoginScreens/splashScreen';
import LandingScreen from '../Screens/PreLoginScreens/landingScreen';
import LoginScreen from '../Screens/PreLoginScreens/loginScreen';
import SignupScreen from '../Screens/PreLoginScreens/signupScreen';
import ForgotPasswordScreen from '../Screens/PreLoginScreens/forgotPasswordScreen';
import HomeScreen from '../Screens/InAppScreens/homeScreen';
import HelpScreen from '../Screens/InAppScreens/helpScreen';
import AppDrawer from './drawerNavigation';
import DealSummaryScreen from '../Screens/InAppScreens/dealSummaryScreen';
import ResetPassword from '../Screens/InAppScreens/resetPassword';
//import DealRedemptionScreen from '../Screens/InAppScreens/dealRedemptionScreen';
import DealDetailScreen from '../Screens/InAppScreens/dealDetailScreen';
import ResetPasswordScreen from '../Screens/PreLoginScreens/resetPasswordScreen';
import NotificationScreeen from '../Screens/InAppScreens/notificationScreen';
import DealsForMeScreen from '../Screens/InAppScreens/dealsForMeScreen';
import DealsHistoryScreen from '../Screens/InAppScreens/dealsHistoryScreen';
import RatingAndReviewsScreen from '../Screens/InAppScreens/ratingAndReviewsScreen';

import firebase from 'react-native-firebase';
import type, { Notification, NotificationOpen,RemoteMessage } from 'react-native-firebase';
import * as storeDynamicUrl from '../app_redux/actions/storeDyanmicUrl';
//import * as locationAction from '../../app_redux/actions/locationAction';
import { connect } from "react-redux";
//import inside app screens


// const Route = createStackNavigator({
//     SplashScreen: {
//         screen: SplashScreen,
//         navigationOptions: {
//             header: null
//         }
//     },
//     LandingScreen: {
//         screen: LandingScreen,
//         navigationOptions: {
//             header: null
//         }
//     },
//     LoginScreen: {
//         screen: LoginScreen,
//         navigationOptions: {
//             header: null
//         }
//     },
//     SignupScreen: {
//         screen: SignupScreen,
//         navigationOptions: {
//             header: null
//         }
//     },
//     ForgotPasswordScreen: {
//         screen: ForgotPasswordScreen,
//         navigationOptions: {
//             header: null
//         }
//     },
//     HomeScreen: {
//         screen: HomeScreen,
//         navigationOptions: {
//             header: null
//         }
//     },
//     HelpScreen: {
//         screen: HelpScreen,
//         navigationOptions: {
//             header: null
//         }
//     },
//     AppDrawer: {
//         screen: AppDrawer,
//         navigationOptions: {
//             header: null
//         }
//     },
//     AddDealScreen: {
//         screen: AddDealScreen,
//         navigationOptions: {
//             header: null
//         }
//     },
//     DealRedemptionScreen: {
//         screen: DealRedemptionScreen,
//         navigationOptions: {
//             header: null
//         }
//     }

// },
//     {
//         initialRouteName: "SplashScreen"
//     });

// export default createAppContainer(Route);

function stackOfAllScreens(initialScreen) {
    return createStackNavigator({
        SplashScreen: {
            screen: SplashScreen,
            navigationOptions: {
                header: null
            }
        },
        LandingScreen: {
            screen: LandingScreen,
            navigationOptions: {
                header: null
            }
        },
        LoginScreen: {
            screen: LoginScreen,
            navigationOptions: {
                header: null
            }
        },
        SignupScreen: {
            screen: SignupScreen,
            navigationOptions: {
                header: null
            }
        },
        ForgotPasswordScreen: {
            screen: ForgotPasswordScreen,
            navigationOptions: {
                header: null
            }
        },
        HomeScreen: {
            screen: HomeScreen,
            navigationOptions: {
                header: null
            }
        },
        HelpScreen: {
            screen: HelpScreen,
            navigationOptions: {
                header: null
            }
        },
        AppDrawer: {
            screen: AppDrawer,
            navigationOptions: {
                header: null
            }
        },

        // DealRedemptionScreen: {
        //     screen: DealRedemptionScreen,
        //     navigationOptions: {
        //         header: null
        //     }
        // },
        DealDetailScreen: {
            screen: DealDetailScreen,
            navigationOptions: {
                header: null
            }
        },
        ResetPasswordScreen: {
            screen: ResetPasswordScreen,
            navigationOptions: {
                header: null
            }
        },
        ResetPassword: {
            screen: ResetPassword,
            navigationOptions: {
                header: null
            }
        },
        NotificationScreeen: {
            screen: NotificationScreeen,
            navigationOptions: {
                header: null
            }
        },
        DealsForMeScreen: {
            screen: DealsForMeScreen,
            navigationOptions: {
                header: null
            }
        },
        DealsHistoryScreen: {
            screen: DealsHistoryScreen,
            navigationOptions: {
                header: null
            }
        },
        DealSummaryScreen: {
            screen: DealSummaryScreen,
            navigationOptions: {
                header: null
            }
        },
        RatingAndReviewsScreen: {
            screen: RatingAndReviewsScreen,
            navigationOptions: {
                header: null
            }
        }


    }
        , {
            initialRouteName: initialScreen,
            navigationOptions: {
                headerTintColor: '#7a7a7a',
                headerStyle: {
                    borderTopWidth: 0.5,

                    borderTopColor: '#e7e7e7',
                    borderBottomColor: 'white',

                },



            },
        }
    )
}





class HandleNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.checkAuth()
       
    }

    checkAuth = async () => {
        // const value = await AsyncStorage.getItem('auth_token');
        // if (value !== null) {
        //     const notificationOpen = await firebase.notifications().getInitialNotification();
        //     if (notificationOpen) {
        //         const { title, body } = notificationOpen.notification;
        //         console.log('getInitialNotification:');
        //         Alert.alert(title, body)
        //         this.props.navigation.navigate('mainRoute')
        //     }
        //     else{
        //         this.props.navigation.navigate('mainRoute')
        //     }
            
        // }
        // else {
        //     this.props.navigation.navigate('stack')
        // }
        // firebase.notifications().getInitialNotification()
        // .then((notificationOpen) => {
        //   console.warn("opneopen opne",notificationOpen)
        //    if (notificationOpen) {
        //       // App was opened by a notification
        //       console.warn("opneopen opne1")
        //       const notification= notificationOpen.notification;  
        //       const data = notificationOpen.notification._data;
        //       console.warn("opneopen opne2")
        //         // if (data.action === 'openChat') {
        //         //   //Code to open Chat screen  
        //         // }
        //    }
        // });
        // firebase.notifications().onNotificationOpened().then((notificationOpen: NotificationOpen) => {
        //     console.warn("opneopen opne2",notificationOpen)
        //      if (notificationOpen) {
        //         // App was opened by a notification
        //         console.warn("opneopen opne2")
        //         const notification: Notification = notificationOpen.notification;  
        //         const data = notificationOpen.notification._data;
        //         console.warn("opneopen opne4")
        //           // if (data.action === 'openChat') {
        //           //   //Code to open Chat screen  
        //           // }
        //      }
        //   });
        const value = await AsyncStorage.getItem('auth_token');
        if (value !== null) {
            firebase.links()
                .getInitialLink()
                .then((url) => {
                    if (url) {
                        let urlArray = url.split("=")
                        console.warn('url array---->',urlArray)
                        this.props.storeDynamicUrl(urlArray[1])
                        this.props.navigation.navigate('mainRoute')
                    } else {
                        // app NOT opened from a url
                        this.props.navigation.navigate('mainRoute')
                    }
                });
        } else {
            this.props.navigation.navigate('stack')
        }
    }
    render() {
        return (
            <View></View>
        )
    }
}

const FinalHandler = connect(
    state => ({
    }), { ...storeDynamicUrl }
)(HandleNavigation)

const Route = createSwitchNavigator({
    HandleNavigation: FinalHandler,
    stack: { screen: stackOfAllScreens('LandingScreen') },
    mainRoute: { screen: stackOfAllScreens('AppDrawer') }
});
export default createAppContainer(Route);
// export default connect(
//     state => ({
//     }), { ...storeDynamicUrl}
//   )(createAppContainer(Route))