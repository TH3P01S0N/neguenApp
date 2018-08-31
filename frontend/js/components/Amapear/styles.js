
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
    //left: 0,
    //right: 0,
   // justifyContent: 'center',
    padding: 20,
    paddingHorizontal: 0,
    backgroundColor: '#FFFFFF',
  },
  header:{
    // flexGrow: 1,
    //position: 'absolute',
    height:40,
     elevation: 0,
     backgroundColor: 'white'
   },
  content:{
    flex:1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  body:{
    color: '#4A4A4A'
  },
  keyboard:{
    marginTop: 20,
    marginLeft: 2,
    marginRight: 10,
    paddingTop: 20,
    paddingLeft: 2,
    paddingRight: 1,
    alignSelf: "stretch"
  },
  texto: {
    color: '#4D4D4D',
    fontSize: 18
  },
  scrollContainer:{
    flex:1,
    marginHorizontal:20, 
  },
  viewGrid:{
    justifyContent:'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
    marginHorizontal: 10,
   // marginLeft: deviceWidth*.08,// 60,
    //marginRight: deviceWidth*.05,// 20,
    marginTop: 20
  },
  box:{
    margin:5,
    width: deviceWidth*.16,//60,
    justifyContent: 'center',
    alignItems: 'center',
    height:deviceWidth*.16,// 60,
    marginBottom: 10
  },
  shadow: {
    height: deviceWidth*.16,// 60,
    width:  deviceWidth*.16,//60,
  },
  btnRegister:{
    padding: 10,
    paddingVertical: 15,
    marginHorizontal: 30,
    alignItems: 'center',
    backgroundColor: '#DEDA3E',
    alignSelf: "stretch",
    borderRadius:5,
  },
  texto:{
    color: '#1E1E32', 
    fontSize:18,

  }
};
