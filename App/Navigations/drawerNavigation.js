import React, { Component } from 'react';
import { View, Text, TouchableNativeFeedback, SafeAreaView, ScrollView,Dimensions } from 'react-native';
import {createDrawerNavigator, createAppContainer, DrawerItems} from 'react-navigation';
const{width, height} = Dimensions.get('window');

// screen imports
import HomeScreen from '../Screens/InAppScreens/homeScreen';
import HelpScreen from '../Screens/InAppScreens/helpScreen';
import MyAccountScreen from '../Screens/InAppScreens/myAccountScreen';
import DealsForMeScreen from '../Screens/InAppScreens/dealsForMeScreen';
import CustomDrawer from '../Components/customDrawer';
import DealsHistoryScreen from '../Screens/InAppScreens/dealsHistoryScreen';

const AppDrawer = createDrawerNavigator({
    HomeScreen :{
        screen: HomeScreen,
        navigationOption:{
            drawerLable:"HomeScreen"
        }
    },
    DealsForMeScreen :{
        screen: DealsForMeScreen,
        navigationOption:{
            drawerLable:"DealsForMeScreen"
        }
    },
    HelpScreen :{
        screen: HelpScreen,
        navigationOption:{
            drawerLable:"HelpScreen"
        }
    },
    MyAccountScreen :{
        screen: MyAccountScreen,
        navigationOption:{
            drawerLable:"MyAccountScreen"
        }
    },
    DealsHistoryScreen :{
        screen: DealsHistoryScreen,
        navigationOption:{
            drawerLable:"DealsHistoryScreen"
        }
    },

},
{
    contentComponent:CustomDrawer,
    drawerWidth:300,
    // drawerBackgroundColor:'#11111190',
    contentOptions:{
        activeTintColor:'red',
    }
});

export default createAppContainer(AppDrawer);