import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Platform } from 'react-native';
export function responsiveSize(size) { return hp(size); }
export function responsiveFontSize(size) {
    const newSize = responsiveSize(size); return newSize;
}
export const fontSizes = (type) => {
    if (type == "title") {
        return responsiveFontSize(2.6);//2.8
    }
    else if (type == "bigText") {
        return responsiveFontSize(6);//8
    }
    else if (type == "smalltitle") {
        return responsiveFontSize(2);//2.2
    }
    else if (type == "semiSmalltitle") {
        return responsiveFontSize(2.2);//2.4
    }
    else if (type == "verySmalltitle") {
        return responsiveFontSize(1.8);//2
    }
}
export const button1Color = "#111111"; // Black Button
export const button2Color = "#FF0000"; // red Button
export const backgroundColor = "#F8F8FF";
export const buttonTextColor = "#FFFFFF";// White Color
export const errorColor = "#ff0000"; // red Color
export const sliderColor = "#24f495"; // green color
export const borderLight = "#eaeaea";
export const borderDark = '#cacaca';

export function fontFamily(param) {
    if (Platform.OS === 'android') {
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
    else {
        if (param == "altbold") {
            return "ProximaNova-Bold"
        }
        if (param == "altLight") {
            return "ProximaNovaA-Light"
        }
        if (param == "altThin") {
            return "ProximaNovaA-Thin"
        }
        if (param == "black") {
            return "ProximaNova-Black"
        }
        if (param == "bold") {
            return "ProximaNovaA-Bold"
        }
        if (param == "extraBold") {
            return "ProximaNova-Extrabld"
        }
        if (param == "thin") {
            return "ProximaNovaT-Thin"
        }
        return "ProximaNova-Regular"
    }

}

// for android


export function dateConverterOfMilli(dateMilliSecond) {
    var date = new Date(dateMilliSecond)
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    date = (day < 10 ? '0' + day : day) + '/' + (month + 1 < 9 ? '0' + (month + 1) : (month + 1)) + '/' + year
    return date
}

export function timeConverterOfMilli(dateMilliSecond) {
    var date = new Date(dateMilliSecond)
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var second = date.getSeconds();
    time = (hour < 10 ? '0' + hour : hour) + ':' + (minutes < 10 ? '0' + minutes : minutes)
    return time
}

export function ageValidation(dob) {
    
    var DOB = dob
    
    var millisecondsBetweenDOBAnd1970 = Date.parse(DOB);
    var millisecondsBetweenNowAnd1970 = Date.now();
    var ageInMilliseconds = millisecondsBetweenNowAnd1970 - millisecondsBetweenDOBAnd1970;
    //--We will leverage Date.parse and now method to calculate age in milliseconds refer here https://www.w3schools.com/jsref/jsref_parse.asp
    var milliseconds = ageInMilliseconds;
    var second = 1000;
    var minute = second * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var month = day * 30;
    /*using 30 as base as months can have 28, 29, 30 or 31 days depending a month in a year it itself is a different piece of comuptation*/
    var year = day * 365;
    //let the age conversion begin
    var years = Math.round(milliseconds / year);
    var months = years * 12;
    var days = years * 365;
    var hours = Math.round(milliseconds / hour);
    var seconds = Math.round(milliseconds / second);
    return years
}



/*
Font name: ProximaNova-Extrabld
2019-07-29 16:30:12.122272+0530 Gratiphy[3097:666954]     Font name: ProximaNova-Black
2019-07-29 16:30:12.122618+0530 Gratiphy[3097:666954]     Font name: ProximaNovaT-Thin
2019-07-29 16:30:12.122899+0530 Gratiphy[3097:666954]     Font name: ProximaNova-Bold
2019-07-29 16:30:12.123215+0530 Gratiphy[3097:666954]     Font name: ProximaNova-Regular

Font name: ProximaNovaA-Light
2019-07-29 16:30:12.001358+0530 Gratiphy[3097:666954]     Font name: ProximaNovaA-Bold
2019-07-29 16:30:12.001732+0530 Gratiphy[3097:666954]     Font name: ProximaNovaA-Thin
 */