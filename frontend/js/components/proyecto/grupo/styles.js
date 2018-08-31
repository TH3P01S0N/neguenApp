
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
      padding: 1,
      paddingBottom:20,
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
      marginTop: 70,
      marginLeft: 47,
      marginRight: 47,
      alignItems: 'center',
      backgroundColor: '#ddd93d',
      borderRadius:5,
      alignSelf: "stretch"
    },
    btnGrupo:{
      padding: 15,
      marginTop: 30,
      marginBottom: 20,
      marginLeft: 47,
      marginRight: 47,
      alignItems: 'center',
      backgroundColor: '#ddd93d',
      borderRadius:5,
      alignSelf: "stretch"
    },
    keyboard:{
      margin: 20,
      padding: 20,
      alignSelf: "stretch"
    },
    scrollContainer:{
      flex:1,
      marginTop:20,
      justifyContent: 'space-between',
      alignItems: 'center',

      paddingBottom: 0,
    },
    viewGrid2:{
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 2,
      marginHorizontal: 30,
      marginVertical: 0
    },
    viewGrid:{
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 2,
      marginHorizontal: 30,
      marginTop: 0
    },
    box:{
      margin:4,
      width: viewportWidth*0.18, //Dimensions.get("window").width / 4 -36,
      justifyContent: 'center',
      alignItems: 'center',
  
      height: 60,
    },
    shadow: {
      height: viewportWidth*0.17,
      width: viewportWidth*0.17,
    },
    shadowPress: {
      height: viewportWidth*0.17,
      width: viewportWidth*0.17,
      borderColor: 'green',
      borderWidth: 3,
    },
}