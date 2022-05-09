
import React from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator, AsyncStorage, Dimensions, Modal, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes, backgroundColor, errorColor } from '../Utils/responsive';
import { labelText,SmallTextHeading } from '../Utils/commonStyles';
import ImageViewer from 'react-native-image-zoom-viewer';
import { NodeAPI, imageUrl } from '../Services/apiServices';

export const ImageModal = ({ imageModal, menuImages, close }) => {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={imageModal}
            onRequestClose={() => {
                close
            }}
        >
            <View style={{ height: hp('100%'), width: wp('100%'), backgroundColor: "#00000090", justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={close} style={{ position: 'absolute', right: '3%', top: '3%', zIndex: 1 }}>
                    <Image source={require('../Assets/icons/cancel.png')} />
                </TouchableOpacity>
                {
                    menuImages.length == 0 ?
                        <View style={{ height: hp('90%'), width: wp('90%'), backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ height: hp('100%'), marginTop: hp('45%') }}>
                                <View style={{ height: hp('40%'), width: wp('60%'), alignSelf: 'center', marginTop: hp('3%'), backgroundColor: '#ffffff', elevation: 5, borderRadius: 50 }}>
                                    <Text style={[SmallTextHeading, { color: 'red', textAlign: 'center', marginTop: hp('5%') }]}>Oops!...</Text>
                                    <Image style={{ height: '40%', width: '90%', marginTop: hp('4%'), tintColor: '#111111' }} resizeMode={'contain'} source={require('../Assets/sad_emoji.png')} />
                                    <Text style={[SmallTextHeading, { color: 'red', textAlign: 'center', marginTop: hp('2%') }]}>NO DATA FOUND</Text>
                                </View>
                            </View>
                        </View>
                        :
                        <View style={{ height: hp('90%'), width: wp('90%') }}>
                            <ImageViewer imageUrls={menuImages} />
                        </View>
                }
            </View>
        </Modal>
    )
}