
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

const slideHeight = viewportHeight * 0.36;
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
    backgroundColor: 'white',
  },
  header:{   
    backgroundColor: 'white',
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
  input: {
    marginBottom: 20,
  },
  btnLogin: {
    padding: 10,
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: '#D8D8D8',
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
    marginLeft: 40,
    marginTop: 15
    
  },
  
  shadow: {
    height:deviceWidth*0.13,// 60,
    width: deviceWidth*0.13,//60,
  },
  shadowPress: {
    height:deviceWidth*0.13,// 50,
    width: deviceWidth*0.13,// 50,
    borderColor: 'green',
    borderWidth: 4,
  },
  scrollContainer:{
    flex:1,
    marginTop: 30,
    marginBottom: 3
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
    margin:8,
    marginRight:8,
    width: deviceWidth*0.13,
    justifyContent: 'center',
    alignItems: 'center',
    height: deviceWidth*0.13,
  },
  gridBox:{

    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
    marginLeft: deviceWidth*.13,//34, //55,
    marginRight: deviceWidth*.095,//73, // 30,
    marginTop: 15
  },
  matriz:{
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding:1,
    marginTop:15,
    marginLeft:20,
    marginRight:25
  },
  matrizTexto:{
    flex: 1,
    //justifyContent: 'space-between',
   // alignItems: 'center',
    flexDirection: 'row',
    padding:4,
    marginTop:2,
    marginLeft:15,
    marginRight:15
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
imagenEspecie: {
  width: viewportWidth*.33 ,
  height: viewportWidth*.33,
  borderRadius:100,
  marginLeft: 20,
  borderColor: '#ddd93d',
  borderWidth:2.5
},
vistaHelp:{
  flex:1,
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  bottom: 10,
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height
},
vista:{
position: 'absolute',

justifyContent: 'center',
alignItems: 'center',
top: Dimensions.get("window").height -110,
left: Dimensions.get("window").width - 80,
width: 70,
height: 70,
flex:1
},
mapButton: {
  width: 50,
 height: 50,
  backgroundColor:'#FFFFFF',
  shadowColor: 'black',
  zIndex: 10,
  borderRadius: 100,
  shadowRadius: 8,
},
navigate:{
  color: '#4A4A4A', 
  transform: [{ rotate: '270deg' }]
},
cruz:{
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
 // top: Dimensions.get("window").height -110,
 // left: Dimensions.get("window").width/2 -75  ,
  //right:Dimensions.get("window").width/2 ,
  bottom: 30,
  width: Dimensions.get("window").width,
  //height: 100,
  flex:1,
  zIndex: 9
},
cruzButton: {
  flex:1,
  padding: 15,
  marginTop: 30,
  alignItems: 'center',
  backgroundColor: '#ddd93d',
  zIndex: 9,
  marginLeft: 0,
  borderRadius:5,
},
map: {
  flex: 1,
 // zIndex: -1, 
},
};
