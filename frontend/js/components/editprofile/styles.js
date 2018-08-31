
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
    justifyContent: 'center',
    paddingHorizontal: 0,
    backgroundColor: '#FBFAFA',
  },
  header:{
    flexGrow: 1,
    backgroundColor: '#FBFAFA'
  },
  body:{
    color: '#4A4A4A'
  },
  keyboard:{
    marginLeft: 20,
    marginRight: 20,
    marginTop: 0,
    marginBottom: 0,
    padding: 20,
    paddingTop: 10,
    flex:1
  },
  input: {
    marginBottom: 20,
  },
  btnRegister:{
    padding: 10,
    paddingVertical: 15,
    marginTop: 16,
    marginLeft:0,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: '#FA511D',
    borderRadius:5,
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
    marginRight: 10
  },
  profilepic:{
    borderWidth:1,
       borderColor:'#D8D8D8',
       alignItems:'center',
       justifyContent:'center',
       width:130,
       height:130,
       backgroundColor:'#D8D8D8',
       borderRadius:100,
  },
  viewGrid:{
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  box:{
    margin:4,
    width:  deviceWidth*0.16, //Dimensions.get("window").width / 4 -36,
    justifyContent: 'center',
    alignItems: 'center',
    height:deviceWidth*0.16// 50,
  },
  shadow: {
    height: deviceWidth*0.16,// 50,
    width: deviceWidth*0.16//50,
  },
  shadowPress: {
    height:deviceWidth*0.12,// 50,
    width: deviceWidth*0.12,// 50,
    borderColor: 'green',
    borderWidth: 5,
  },
  scrollContainer:{
    marginBottom: 20,
    marginTop:20
  },
};
