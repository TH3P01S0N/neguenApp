
const React = require('react-native');

const { StyleSheet, Dimensions } = React;
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
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
    
    paddingHorizontal: 0,
    backgroundColor: '#FFFFFF',
  },
  content:{
    backgroundColor: '#FBFAFA',
    alignItems: 'center',
    flex: 1
  },
  header:{
    // flexGrow: 1,
    //position: 'absolute',
    height:40,
     elevation: 0,
     backgroundColor: 'white'
   },
  body:{
    color: '#4A4A4A'
  },
  keyboard:{
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 2,
    marginRight: 2,
    paddingTop: 1,
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: "stretch"
  },
  texto: {
    color: '#4D4D4D',
    fontSize: 18
  },
  scrollContainer:{
    marginLeft: 0,
    paddingBottom: 0,
  },
  profilepic:{
    borderWidth:1,
       borderColor:'#D8D8D8',
       alignItems:'center',
       justifyContent:'center',
       width:viewportHeight*.2,
       height:viewportHeight*.2,
       backgroundColor:'#D8D8D8',
       borderRadius:100,
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
    width: viewportWidth*0.18,// Dimensions.get("window").width / 4 -46,
    justifyContent: 'center',
    alignItems: 'center',

    height: viewportWidth*0.18,
  },
  shadow: {
    height: viewportWidth*0.17,
    width: viewportWidth*0.17,
  },
  shadowPress: {
    height: 40,
    width: 40,
    borderColor: 'green',
    borderWidth: 3,
  },
  btnRegister:{
    padding: 10,
    paddingVertical: 15,
    marginTop: 21,
    marginHorizontal: 30,
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: '#DEDA3E',
    alignSelf: "stretch",
    alignItems: 'center',
    borderRadius:5,
  },
  texto:{
    color: '#1E1E32', 
    fontSize:18,
  }
};
