
const React = require('react-native');

const { StyleSheet, Dimensions, Platform } = React;
const deviceHeight = Dimensions.get('window').height;
const IS_IOS = Platform.OS === 'ios';
const deviceWidth = Dimensions.get('window').width;
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.53;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;
export const colors = {
  black: '#1a1917',
  gray: '#888888',
  background1: '#B721FF',
  background2: '#21D4FD'
};
export default {
  container: {
    flex: 1,
   // position: 'absolute',
   // top: 0,
   // bottom: 0,
    //left: 0,
    //right: 0,
   // justifyContent: 'center',
    paddingHorizontal: 0,
    backgroundColor: '#FFFFFF',
  },
  header:{   
   backgroundColor: '#FFFFFF',
    elevation: 0,
    height:45
  },
  body:{
    color: '#4A4A4A'
  },
  keyboard:{
    marginLeft: 20,
    marginRight: 20,
    marginTop: 8,
    marginBottom: 0,
    padding: 20,
    alignSelf: "stretch"
  },
  keyboard2:{
    marginLeft: 0,
    marginRight: 0,
    marginTop: 4,
    marginBottom: 0,
    padding: 20,
    alignSelf: "stretch"
  },
  input: {
    marginBottom: 20,
  },
  btnLogin: {
    padding: 10,
    paddingVertical: 15,
    marginTop: 20,
    marginHorizontal:20,
    marginBottom:5,
    alignItems: 'center',
    backgroundColor: '#ddd93d',
    borderRadius:5
  },
  _btnLogin: {
    padding: 10,
    paddingVertical: 15,
    marginTop: 20,
    marginHorizontal:20,
    marginBottom:5,
    alignItems: 'center',
    backgroundColor: '#787878',
    borderRadius:5
  },
  texto:{
    color: '#4A4A4A', 
    fontSize:15,
    marginRight: 15
  },
  viewGrid:{

    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
    marginLeft: 30,
    marginTop: 15
    
  },
  botonTerminar:{
    padding: 10,
    marginTop: 20,
    paddingVertical: 15,
    marginHorizontal: 30,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#ddd93d',
    borderRadius:5,
    alignSelf: "stretch"
  },
  
  shadow: {
    height:deviceWidth*0.18,// 60,
    width: deviceWidth*0.18,//60,
  },
  scrollContainer:{
    flex:1,
    marginTop: 30,
    marginBottom: 3
  },
  scrollContainer2:{
    flex:1,
    paddingTop: 30,
    paddingBottom: 3,
    backgroundColor: '#F2F1E1'
  },
  processSphere:{
    
    width: viewportWidth*.05,
    height: viewportWidth*.05, //23,
    backgroundColor:'#ddd93d',
    borderRadius: 100,
    shadowRadius: 8,
  },
  processSphereOff:{
    
    width: viewportWidth*.05,
    height: viewportWidth*.05,
    backgroundColor:'#c6c6c6',
    borderRadius: 100,
    shadowRadius: 8,
  },
  processBar:{
    width:100, 
    height:2, 
    backgroundColor: '#c6c6c6',
    marginLeft: 10,
    marginRight: 10
  },
  viewGrid:{
   
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //padding: 2,
    //marginLeft: 40,
    marginTop: 15
  },
  box:{
    margin:4,
    //marginRight:10,
    width: deviceWidth*0.18,
    justifyContent: 'center',
    alignItems: 'center',
    height: deviceWidth*0.18,
  },
  boxMapear:{
    margin:4,
    width: deviceWidth*0.13,
    justifyContent: 'center',
    alignItems: 'center',
    height: deviceWidth*0.13,
  },
  boxMapearTemp:{
    margin:4,
    width: viewportWidth*0.18/1.3,
    justifyContent: 'center',
    alignItems: 'center',
    height: 47,
  },
  shadowMapear: {
    height:deviceWidth*0.13,// 60,
    width: deviceWidth*0.13,//60,
  },
  gridBox:{

    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
    marginHorizontal: 30,
   // marginLeft: deviceWidth*.18,//34, //55,
    //marginRight: deviceWidth*.095,//73, // 30,
    marginTop: 5
  },
  matriz:{
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding:4,
    marginTop:15,
    marginLeft:5,
    marginRight:5
  },
  matriz2:{
    //flex: 1,
   // justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    //padding:4,
    //marginTop:15,
   // marginLeft:5,
    //marginRight:5
  },
  matrizTexto:{
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding:4,
    paddingTop: 0,
    marginTop:0,
    marginHorizontal:20,
  },
  image: {
   // ...StyleSheet.absoluteFillObject,
   width:itemWidth*.65,
   height:slideHeight*.8,
   marginBottom:25,
    resizeMode: 'cover',
    backgroundColor: 'transparent',
    borderRadius:10,
    
   // borderRadius: IS_IOS ? entryBorderRadius : 0,
  //  borderTopLeftRadius: entryBorderRadius,
   // borderTopRightRadius: entryBorderRadius
},
imageContenedor: {
  width:itemWidth*.65,
   height:slideHeight,
   justifyContent:'center', alignItems: 'center'
},
imageAgregar:{height: 50, width: 50, position:'absolute', bottom:0,left:(itemWidth*.65)/2-25
},
imageContainer: {
  flex:1,
  marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
  backgroundColor: 'white',
  
 // borderTopLeftRadius: entryBorderRadius,
  //borderTopRightRadius: entryBorderRadius
},
imageContainerEven: {
  backgroundColor: '#1a1917'
},
title: {
  paddingHorizontal: 30,
  backgroundColor: 'transparent',
  color: 'black',
  fontSize: 19,
  fontWeight: 'bold',
  textAlign: 'center'
},
slideInnerContainer: {
  width: itemWidth*.9,
  height: slideHeight,
  paddingHorizontal: itemHorizontalMargin,
  paddingBottom: 18 // needed for shadow
},
shadows: {
  position: 'absolute',
  top: 0,
  left: itemHorizontalMargin,
  right: itemHorizontalMargin,
  bottom: 18,
  shadowColor: colors.black,
  shadowOpacity: 0.25,
  shadowOffset: { width: 0, height: 10 },
  shadowRadius: 10,
  borderRadius: entryBorderRadius
},
// image's border radius is buggy on iOS; let's hack it!
radiusMask: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: entryBorderRadius,
  backgroundColor: '#D8D8D8'
},
textContainer: {
  justifyContent: 'center',
  alignItems: "center",
  marginTop: 9 - entryBorderRadius,
  paddingBottom: 20,
  paddingHorizontal: 16,
  backgroundColor: 'rgba(221, 217, 61, 0.5)',
  borderBottomLeftRadius: entryBorderRadius,
  borderBottomRightRadius: entryBorderRadius
},
textContainerSelect: {
  justifyContent: 'center',
  alignItems: "center",
  paddingTop: 10 - entryBorderRadius,
  paddingBottom: 5,
  paddingHorizontal: 5,
  borderBottomLeftRadius: entryBorderRadius,
  borderBottomRightRadius: entryBorderRadius
},
titleSlider: {
  color: 'black',
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: 0.5
},
cruzContainer:{
  //position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
 // top: Dimensions.get("window").height -110,
  //left: Dimensions.get("window").width/2 -35  ,
  //right:Dimensions.get("window").width/2 ,
 // bottom: 20,
  width: 40,
  height: 40,
  flex:1,
  marginTop:20,
},
cruz: {
  width: 40,
  height: 40,
  backgroundColor:'#4A4A4A',
  shadowColor: 'black',
  zIndex: 10,
  borderRadius: 100,
  shadowRadius: 8,
},
especiePress: {
  borderBottomWidth: 0,
  //flexDirection: 'row', 
  paddingHorizontal:10, 
  paddingVertical:15,
  paddingTop:10,
  paddingBottom: 10,
  marginBottom:5,
  backgroundColor:'rgba(222, 216,62, 0.3)'
},
especieUnPress: {
  //flexDirection: 'row', 
  paddingHorizontal:10, 
  paddingVertical:15 ,
  paddingTop:10,
  paddingBottom:10,
  borderBottomWidth: 0
}
};
