
const React = require('react-native');

const { StyleSheet, Dimensions } = React;
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
export default {
    container: {
      flex: 1,
     // position: 'absolute',
     // top: 0,
     // bottom: 0,
      //left: 0,
      //right: 0,
     // justifyContent: 'center',
      padding: 0,
      paddingTop:10,
     // paddingHorizontal: 0,
      backgroundColor: '#FFFFFF',
    },
    content:{
      backgroundColor: 'transparent',
      alignItems: 'center',
      marginTop: 40
    },
    body:{
       // color: 'transparent'
      },
    header:{   
      backgroundColor: 'transparent',
      elevation: 0,
      height:40
    },
    btnRegister:{
      padding: 15,
      marginTop: 0,
      marginLeft: 40,
      marginRight: 40,
      alignItems: 'center',
      backgroundColor: '#ddd93d',
      alignSelf: "stretch"
    },
    boton:{
      padding: 15,
      marginTop: 0,
      alignItems: 'center',
      backgroundColor: '#ddd93d',
      borderRadius:5
    },
    botonAgregar:{
      padding: 8,
      paddingHorizontal:12,
      marginTop: 0,
      alignItems: 'center',
      backgroundColor: '#ddd93d',
      borderRadius:5
    },
    botonEliminar:{
      padding: 8,
      paddingHorizontal:12,
      marginTop: 0,
      alignItems: 'center',
      backgroundColor: '#BEBEBE',
      borderRadius:5
    },
    botonNombre:{
      padding: viewportHeight*.023,
      marginTop:0,
      marginBottom: viewportHeight*.046,
      alignItems: 'center',
      backgroundColor: '#ddd93d',
      borderRadius:5
    },
    keyboard:{
      margin: 20,
      padding: 20,
      alignSelf: "stretch"
    },
    shadow: {
      height: viewportWidth*0.15,
      width: viewportWidth*0.15,
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
}