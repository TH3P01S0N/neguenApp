
const React = require('react-native');

const { StyleSheet, Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
export default {
  container: {
    flex: 1,
   // position: 'absolute',
   // top: 0,
   // bottom: 0,
    //  left: 0,
   // right: 0,
    justifyContent: 'center',
    paddingTop:0,
    backgroundColor: 'white',
  },
  header:{
   // flexGrow: 1,
   //position: 'absolute',
   height:40,
    elevation: 0,
    backgroundColor: 'white'
  },
  body:{
    color: 'white'
  },
  keyboard:{
    flex:1,
    marginBottom: 10,
    marginTop:0,
   // marginBottom: deviceHeight*.09, //70,
    marginHorizontal:40,
  },
  input: {
    marginBottom: 20,
  },
  btnRegister:{
    padding: 10,
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
    backgroundColor: '#DEDA3E',
  },
  btnFB: {
    padding: 10,
    marginTop: 15,
    alignItems: 'center',
    backgroundColor: '#D8D8D8',
  },
  texto:{
    color: '#1E1E32', 
    fontSize:deviceWidth*.04,
    marginRight: 15
  }
};
