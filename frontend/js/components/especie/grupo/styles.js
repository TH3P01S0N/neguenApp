
const React = require('react-native');

const { StyleSheet, Dimensions } = React;
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
export default {
    container: {
      flex: 1,
      padding: 2,
      paddingHorizontal: 0,
      backgroundColor: '#FFFFFF',
    },
    content:{
      backgroundColor: 'transparent',
      alignItems: 'center',
      marginTop: 20
    },
    content2:{
      backgroundColor: '#F2F1E1',
      alignItems: 'center',
      marginTop: 20
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
      padding: 15,
      marginTop: 70,
      marginLeft: 0,
      marginRight: 0,
      alignItems: 'center',
      backgroundColor: '#ddd93d',
      borderRadius:5,
      alignSelf: "stretch"
    },
    btnRegisterOpc:{
      padding: 15,
      marginTop: 70,
      marginLeft: 0,
      marginRight: 0,
      alignItems: 'center',
      backgroundColor: '#BEBEBE',
      borderRadius:5,
      alignSelf: "stretch"
    },
    botonTerminar:{
      padding: 10,
      paddingVertical: 15,
      marginTop: 10,
      marginHorizontal:40,
      marginBottom: 10,
      alignItems: 'center',
      backgroundColor: '#ddd93d',
      borderRadius:5,
      alignSelf: "stretch"
    },
    botonIndex:{
      padding: 10,
      paddingVertical: 15,
      marginTop: 20,
      marginHorizontal:30,
      marginBottom: 10,
      alignItems: 'center',
      backgroundColor: '#ddd93d',
      borderRadius:5,
      alignSelf: "stretch"
    },
    botonNombrar:{
      padding: 10,
      paddingVertical: 15,
      marginTop: 30,
      marginHorizontal:10,
      marginBottom: 50,
      alignItems: 'center',
      backgroundColor: '#ddd93d',
      borderRadius:5,
      alignSelf: "stretch"
    },
    boton:{
      padding: 10,
      marginTop: 20,
      marginLeft: 0,
      marginRight: 0,
      marginBottom: 20,
      alignItems: 'center',
      backgroundColor: '#D8D8D8',
      alignSelf: "stretch"
    },
    botonProceden:{
      padding: 10,
      paddingVertical: 12,
      marginTop: 20,
      marginHorizontal:40,
      marginBottom: 15,
      alignItems: 'center',
      backgroundColor: '#ddd93d',
      borderRadius:5,
      alignSelf: "stretch"
    },
    keyboard:{
      margin: 20,
      padding: 20,
      justifyContent:'center',
      alignItems:'center'
    },
    scrollContainer:{
      marginLeft: 0,
      paddingBottom: 0,
    },
    viewGrid:{
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 2,
      marginHorizontal: 30,
      marginTop: 0
    },
    
    box:{
      margin:4,
      width: viewportWidth*0.18,//Dimensions.get("window").width / 4 -36,
      justifyContent: 'center',
      alignItems: 'center',
  
      height: 60,
    },
    shadow: {
      height:viewportWidth*0.17,// 60,
    width: viewportWidth*0.17,//60,
    },
    textGuardar:{
     fontSize: 18,
    },
    textGuardarOpc:{
      fontSize: 18,
      color:'#ffffff'
     }
}