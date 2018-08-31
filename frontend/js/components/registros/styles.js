
const React = require('react-native');

const { StyleSheet, Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;

export default {
  container: {
    flex: 1,
   // position: 'absolute',
   // top: 0,
   // bottom: 0,
    //left: 0,
    //right: 0,
    justifyContent: 'center',
    paddingHorizontal: 0,
    backgroundColor: '#FBFAFA',
  },
  header:{
    elevation:0,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd93d',
    backgroundColor: '#FBFAFA'
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
  btnRegister:{
    padding: 10,
    marginTop: 16,
    alignItems: 'center',
    backgroundColor: '#9B9B9B',
  },
  btnFB: {
    padding: 10,
    marginTop: 15,
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
  box:{
    margin:5,
    width: Dimensions.get("window").width / 4 -36,
    justifyContent: 'center',
    alignItems: 'center',

    height: 60,
  },
  shadow: {
    height: 60,
    width: 60,
  },
  shadowPress: {
    height: 60,
    width: 60,
    borderColor: 'green',
    borderWidth: 5,
  },
  scrollContainer:{
    marginBottom: 30
  },
  map: {
    flex: 1,
    zIndex: -1
  },
  cruz:{
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: Dimensions.get("window").width/2 -35  ,
    bottom: 20,
    width: 70,
    height: 70,
    flex:1
  },
  avistamiento:{
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: Dimensions.get("window").height*.1,
    left: Dimensions.get("window").width/2 + 40 ,
    width: 70,
    height: 70,
    flex:1
  },
  registro:{
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: Dimensions.get("window").height*.166 ,
    left: Dimensions.get("window").width/2 -35,
    width: 70,
    height: 70,
    flex:1
  },
  proyecto:{
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: Dimensions.get("window").height*.1,
    left: Dimensions.get("window").width/2 - 105,
    width: 70,
    height: 70,
    flex:1
  },
  cruzButton: {
    width: 70,
    height: 70,
    backgroundColor:'#ddd93d',
    shadowColor: 'black',
    zIndex: 10,
    borderRadius: 100,
    shadowRadius: 8,
  },
  avistamientoButton:{
    width: 0,
     height: 0,
      backgroundColor:'#FFFFFF',
      shadowColor: 'black',
      zIndex: 10,
      borderRadius: 100,
      shadowRadius: 8,
  
  },
  avistamientoButtonShow:{
    width: 60,
     height: 60,
      backgroundColor:'#FFFFFF',
      shadowColor: 'black',
      zIndex: 10,
      borderRadius: 100,
      shadowRadius: 8,
  
  },
};
