
const React = require('react-native');

const { StyleSheet, Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')
export default {
  container: {
    flex: 1,
   // position: 'absolute',
   // top: 0,
   // bottom: 0,
    //left: 0,
    //right: 0,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  shadow: {
    flexGrow: 1,
    width: viewportHeight*.287,
    height: viewportHeight*.115,
    marginTop: 40,
    marginBottom: 20
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  keyboard:{
    marginHorizontal: 10,
    padding: 20,
    paddingTop: 10,
    alignSelf: "stretch"
  },
  bg: {
    flex: 1,
    marginTop: deviceHeight / 1.75,
    paddingTop: 20,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 30,
    bottom: 0,
  },
  input: {
    marginBottom: 20,
  },
  btnLogin: {
    padding: 10,
    borderRadius: 5,
    paddingVertical: 15,
    marginTop: 15,
    alignItems: 'center',
    backgroundColor: '#DEDA3E',
  },
  btnRegister:{
    padding: 10,
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 16,
    alignItems: 'center',
    backgroundColor: '#3b5998',
  },
  btnFB: {
    padding: 10,
    marginTop: 15,
    alignItems: 'center',
    backgroundColor: '#D8D8D8',
  },
};
