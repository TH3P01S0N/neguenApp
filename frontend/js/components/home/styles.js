
const React = require('react-native');

const { StyleSheet, Dimensions  } = React;
const deviceHeight = Dimensions.get('window').height;
export default {
  container: {
    backgroundColor: 'white',
    
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    marginLeft: 8
  },
  vista:{
    position: 'absolute',
    
    justifyContent: 'center',
    alignItems: 'center',
    top: Dimensions.get("window").height -110,
    left: Dimensions.get("window").width - 80,
    width: 63,
    height: 63,
    flex:1
  },
  cruz:{
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
   // top: Dimensions.get("window").height -110,
    left: Dimensions.get("window").width/2 -35  ,
    //right:Dimensions.get("window").width/2 ,
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
  
  map: {
    flex: 1,
    zIndex: -1, 
    height: Dimensions.get("window").height -20,
    width: Dimensions.get("window").width
  },
  mapOscuro: {
    flex: 1,
    zIndex: -1, 
    opacity:0.7,
    height: Dimensions.get("window").height -20,
    width: Dimensions.get("window").width
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
navigate:{
    color: '#4A4A4A', 
    transform: [{ rotate: '270deg' }]
}
};
