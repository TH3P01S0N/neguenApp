
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
     // justifyContent: 'center',
      padding: 2,
      paddingHorizontal: 0,
      backgroundColor: '#FFFFFF',
    },
    content:{
      backgroundColor: 'transparent',
      alignItems: 'center',
      marginTop: 30
    },
    body:{
       // color: 'transparent'
      },
    header:{   
      backgroundColor: 'transparent',
      elevation: 0,
      height:45
    },
    btnRegister:{
      padding: 10,
      paddingVertical: 15,
      marginBottom: 10,
      marginTop: 20,
      marginLeft: 20,
      marginRight: 20,
      alignItems: 'center',
      backgroundColor: '#ddd93d',
      alignSelf: "stretch",
      borderRadius:5
    },
    boton:{
      padding: 10,
      marginTop:20,
      marginVertical: 10,
      marginHorizontal: 0,
      alignItems: 'center',
      backgroundColor: '#ddd93d',
      alignSelf: "stretch",
      borderRadius: 5
    },
    containerStyle: {
      flex: 1,
    
      marginVertical:15,
      marginLeft: 50,
      marginRight: 40
      //flexDirection: 'row',
      //justifyContent: 'space-around'
      },
      numberStyle: {
          flex: 1
      },
      textContainerStyle: {
          flex: 4,
          flexDirection: 'row',
          justifyContent: 'center' 
      }
}