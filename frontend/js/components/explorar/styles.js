
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
      padding: 0,
      paddingHorizontal: 0,
      backgroundColor: '#FFFFFF',
    },
    content:{
      backgroundColor: 'transparent',
      alignItems: 'center',
      marginTop: 40,
      marginHorizontal:30,
     // flex:1
    },
    body:{
       // color: 'transparent'
      },
    header:{   
      backgroundColor: 'transparent',
      elevation: 0
    },
    btnRegister:{
      padding: 15,
      marginTop: 50,
      marginLeft: 20,
      marginRight: 20,
      alignItems: 'center',
      backgroundColor: '#c4c4c4',
      alignSelf: "stretch"
    },

    containerStyle: {
      flex: 1,
      margin: 5,
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