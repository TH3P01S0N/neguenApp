
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
      padding: 1,
      paddingHorizontal: 0,
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
      elevation: 0
    },
    btnRegister:{
      padding: 15,
      marginTop: 10,
      marginHorizontal: 30,
      alignItems: 'center',
      backgroundColor: '#BEBEBE',
      alignSelf: "stretch",
      borderRadius:5,
    },
    botonGuardar:{
      padding: 15,
      marginTop: 10,
      marginHorizontal: 30,
      alignItems: 'center',
      backgroundColor: '#DEDA3E',
      borderRadius:5,
      alignSelf: "stretch"
    },
    keyboard:{
      marginLeft: 40,
      marginRight: 40,
      flex:1,
      padding: 10,
     // alignSelf: "stretch"
     alignItems: 'center',
    justifyContent: 'center',
    },
    shadow: {
      height: 120,
      width: 120,
      marginBottom: 20,
      resizeMode: 'contain',
    },
    profilepic:{
      borderWidth:3.5,
         borderColor:'#D8D8D8',
         alignItems:'center',
         justifyContent:'center',
         width:140,
         height:140,
         backgroundColor:'#D8D8D8',
         borderRadius:120,
    },
    UserPress: {
      borderBottomWidth: 0,
      //flexDirection: 'row', 
      paddingHorizontal:10, 
      paddingVertical:15,
      paddingTop:15,
      paddingBottom:15,
      backgroundColor:'rgba(222, 216,62, 0.3)'
    },
    UserUnPress: {
      //flexDirection: 'row', 
      paddingHorizontal:10, 
      paddingVertical:15 ,
      paddingTop:15,
      paddingBottom:15,
      borderBottomWidth: 0
  }
}