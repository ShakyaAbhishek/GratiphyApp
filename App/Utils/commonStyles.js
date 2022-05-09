import { fontFamily, fontSizes, button1Color, button2Color, backgroundColor, buttonTextColor } from './responsive';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const elevation = 3;
const borderRadius = "5%";
const paddingVertical = "1.6%"
export const elevationShadow = {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
}
// flec view without padding and the justifyContent and the alignItems
export const ConatinerViewWithoutPadding = {
    flex: 1,
    // marginTop:hp('3%'),
    // height:hp('97%'),
    backgroundColor: backgroundColor
}
// flex view with padding 
export const ConatinerViewWithPadding = {
    flex: 1,
    //height:hp('97%'),
    backgroundColor: backgroundColor,
    marginHorizontal: wp('5%')
}
// Login page and the signup page Heading 
export const BigHeadingText = {
    fontFamily: fontFamily(),
    fontSize: fontSizes('bigText'),
    color: "#111111"
}
// login Signup and Forgot screen medium heading 
export const SmallTextHeading = {
    fontFamily: fontFamily('bold'),
    fontSize: fontSizes('title'),
    color: "#111111"
}
// text input margin 
export const textInputMargin = {
    marginTop: hp('2%')
}
// text input style
export const TextInputView = {
    flex: 1,
    fontFamily: fontFamily(),
    fontSize: fontSizes('smalltitle'),
    height: hp("6%")
}
// text input right image 
export const TextInputImage = {
    height: hp('6%'),
    width: wp('6%')
}
// text input lable style 
export const labelText = {
    color: "#111111",
    fontFamily: fontFamily(),
    fontSize: fontSizes('smalltitle')
}
// text input with the image style 
export const TextInputViewWithImage = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: "#111111",
    borderBottomWidth: 2
}
// Black Button
export const Button1 = {
    paddingVertical: hp(paddingVertical),
    backgroundColor: button1Color,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(borderRadius),
    elevation: elevation
}
// red Button
export const Button2 = {
    paddingVertical: hp(paddingVertical),
    backgroundColor: button2Color,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(borderRadius),
    elevation: elevation
}
// all button text
export const ButtonText = {
    fontFamily: fontFamily('bold'),
    fontSize: fontSizes('title'),
    color: buttonTextColor
}
export const rowContentCenter = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
}