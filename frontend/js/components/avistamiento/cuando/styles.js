const React = require('react-native');
const { StyleSheet, Dimensions  } = React;
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
export default {
    container: {
      backgroundColor: '#FBFAFA',
      justifyContent: 'center',
    },
      header:{   
        backgroundColor: '#FBFAFA'
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

 processSphere:{
    
  width: viewportWidth*.05,
  height: viewportWidth*.05,
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
  marginBottom: 10,
  backgroundColor: '#FBFAFA'
},

cruzButton: {
  flex:1,
  marginTop: 30,
  alignItems: 'center',
  backgroundColor: '#DDDA3C',
  padding: 10,
 // marginLeft: 20,
 // marginRight: 20
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
  flexDirection:'row'
},
}