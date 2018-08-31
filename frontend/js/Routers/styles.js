
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
    justifyContent: 'center',
    paddingHorizontal: 0,
    backgroundColor: '#FBFAFA',
  },
  header:{
    
    backgroundColor: '#FBFAFA'
  },
  body:{
    color: '#4A4A4A'
  },
  keyboard:{
    marginLeft: 20,
    marginRight: 20,
    marginTop: 8,
    marginBottom: 0,
    padding: 20,
    alignSelf: "stretch"
  },
  input: {
    marginBottom: 20,
  },
  btnRegister:{
    padding: 10,
    marginTop: 16,
    alignItems: 'center',
    backgroundColor: '#9B9B9B',
  },
  btnFB: {
    padding: 10,
    marginTop: 15,
    alignItems: 'center',
    backgroundColor: '#D8D8D8',
  },
  texto:{
    color: '#4A4A4A', 
    fontSize:15,
    marginRight: 15
  },
  viewGrid:{

    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
    marginLeft: 40,
    marginTop: 15
  },
  box:{
    margin:5,
    width: Dimensions.get("window").width / 4 -36,
    justifyContent: 'center',
    alignItems: 'center',

    height: 60,
  },
  shadow: {
    height: 60,
    width: 60,
  },
  shadowPress: {
    height: 60,
    width: 60,
    borderColor: 'green',
    borderWidth: 5,
  },
  scrollContainer:{
    marginBottom: 30
  },
  map: {
    flex: 1,
    zIndex: -1
  },
};
