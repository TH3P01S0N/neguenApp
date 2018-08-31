const React = require('react-native');
const { StyleSheet, Dimensions  } = React;
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
export default {
    container: {
      backgroundColor: '#FBFAFA',
    },
    map: {
        flex: 1,
       // zIndex: -1, 
      },
      mapOscuro: {
        flex: 1,
        zIndex: -1, 
        opacity:0.4
      },
      header:{   
        backgroundColor: '#FBFAFA',
        height:45
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
    navigate:{
      color: '#4A4A4A', 
      transform: [{ rotate: '270deg' }]
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
 processSphere:{
    
  width: viewportWidth*.05,
  height: viewportWidth*.05, //23,
  backgroundColor:'#DDDA3C',
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
 
  //flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  //padding: 2,
  //marginLeft: 40,
  marginTop: 15,
  marginBottom: 15,
  backgroundColor: '#FBFAFA'
},
cruz:{
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
 // top: Dimensions.get("window").height -110,
 // left: Dimensions.get("window").width/2 -75  ,
  //right:Dimensions.get("window").width/2 ,
  bottom: 30,
  //width: 250,
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
  marginLeft: 35,
  paddingHorizontal:65,
  borderRadius:5
}
}