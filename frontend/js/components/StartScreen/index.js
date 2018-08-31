import React, { Component } from 'react';
import {ActivityIndicator, AsyncStorage, View, Image, Dimensions, Text} from 'react-native';
import { DrawerNavigator, NavigationActions, withNavigation, StackNavigator } from "react-navigation";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
class StartScreen extends Component {

  constructor() {
    super();
    this.state = {
      flag:false
    };
    this._bootstrapAsync();
  }
  static navigationOptions = {
    header: null
  };
  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
  }
  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('id_token');
    const email = await AsyncStorage.getItem('email');
    console.log("token: ", userToken);
    
    if(userToken && email){
        var data = {email: email}
          // TODO: localhost doesn't work because the app is running inside an emulator. Get the IP address with ifconfig.
          console.log("email: ",email);
          fetch('http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/api/protected/remember', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + userToken , 
            'Accept': 'application/json',
            'Content-Type': 'application/json', },
            body: JSON.stringify({ email: email})       
          })
          .then((response) => response.json())
        .then(response=> {
            if (response.success) {  
              //console.log(response);
              let that = this;
            setTimeout(function() {
              that.props.navigation.navigate('Login');
            }, 1000)
          } else {
            (async () => {        
              await this.saveItem('verificado', response.verificado);
            }) ();
            console.log(response);
            let that = this;
            setTimeout(function() { //Start the timer
             // this.setState({render: true}) //After 1 second, set render to true
             that.setState({flag:true});
             setTimeout(function(){
              const actionToDispatch = NavigationActions.reset({
                index: 0,
                key: null,
                actions: [NavigationActions.navigate({ routeName: 'Mapa' })],
                //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
              })
              that.props.navigation.dispatch(actionToDispatch)
             }, 2000)
            /*
              */
              }, 2000)
           // this.props.navigation.navigate('Mapa', {email: email});
        }   
     })
        // .catch(error => {
    //	throw error;
    //	});
          .done();
        }//) }
       else{
        let that = this;
        setTimeout(function() {
         // 
         that.setState({flag:true});
         setTimeout(function()  {
          //that.props.navigation.navigate('Login');
          const actionToDispatch = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
            //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
          })
          that.props.navigation.dispatch(actionToDispatch)
         }, 2000);
        }, 2000)
       }
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
   // this.props.navigation.navigate(userToken ? 'Mapa' : 'Login');
  };
  //componentDidMount() {
  //  AsyncStorage.getItem('id_token').then((token) => {
  //    this.setState({ hasToken: token !== null, isLoaded: true })
  //  });
 // }

  render() {
    return(
      
        <View style={{flex:1}}>
        {this.state.flag ?
          <View>
          <Image source={{uri:uri+"/hongos.jpg"}} style={{flex:1,height:viewportHeight, width:viewportWidth, zIndex:1, position:'absolute', top:0, left:0}} />
          <View style={{flex:1, position:'absolute', top:0, left:0, height:viewportHeight*.3, width:viewportWidth, zIndex:3, justifyContent:'center', backgroundColor:'rgba(222,218,62,0.4)'}}>
            {/* <ActivityIndicator size="large" />*/}
            
            <Image source={{uri: uri+'/Logo-corpNeguen-05.png'}} 
            style={{width:viewportHeight*.297,height: viewportHeight*.115, zIndex:9, position:'absolute', top:viewportHeight*.08, left:viewportWidth/2-viewportHeight*.297/2}}></Image>

          </View>
          <View style={{flex:1, position:'absolute', top:viewportHeight*.3, left:0, height:viewportHeight*.7, width:viewportWidth, zIndex:3, justifyContent:'center', backgroundColor:'rgba(242,242,225,0.8)'}}>
          <Text 
            style={{zIndex:9,color: '#1E1E32', fontWeight:'bold', fontSize: viewportWidth*.051, textAlign: 'center', position:'absolute', top:40, left:viewportWidth/2-viewportHeight*.297/2 +3, right:viewportWidth/2-viewportHeight*.297/2+3 }}>
            Con el apoyo de:</Text>
            <Image source={{uri: uri+'/Logos explora coquimbo-02.png'}} 
            style={{width:viewportHeight*.32,height: viewportHeight*.13, zIndex:9, position:'absolute', top:80, left:viewportWidth/2-viewportHeight*.32/2}}></Image>
            <Image source={{uri: uri+'/Logos explora coquimbo-03.png'}} 
            style={{width:viewportHeight*.32,height: viewportHeight*.115, zIndex:9, position:'absolute', top:190, left:viewportWidth/2-viewportHeight*.32/2}}></Image>
            <Image source={{uri: uri+'/logoU.png'}} 
            style={{width:viewportHeight*.125,height: viewportHeight*.125, zIndex:9, position:'absolute', top:270, left:viewportWidth/2-viewportHeight*.125/2}}></Image>
            
          </View>
        </View>:

          <View>
            <Image source={{uri:uri+"/pajarito.jpg"}} style={{flex:1,height:viewportHeight, width:viewportWidth, zIndex:1, position:'absolute', top:0, left:0}} />
            <View style={{flex:1, position:'absolute', top:0, left:0, height:viewportHeight, width:viewportWidth, zIndex:3, justifyContent:'center', backgroundColor:'rgba(222,218,62,0.4)'}}>
              {/* <ActivityIndicator size="large" />*/}
              
              <Image source={{uri: uri+'/neguenHome.png'}} 
              style={{width:viewportHeight*.297,height: viewportHeight*.115, zIndex:9, position:'absolute', top:viewportHeight*.08, left:viewportWidth/2-viewportHeight*.297/2}}></Image>
              <Text 
              style={{zIndex:9,color: '#1E1E32', fontWeight:'bold', fontSize: viewportWidth*.055, textAlign: 'center', position:'absolute', top:viewportHeight*.22, left:viewportWidth/2-viewportHeight*.297/2 +3, right:viewportWidth/2-viewportHeight*.297/2+3 }}>
              Mapa participativo de   la naturaleza de Chile</Text>
              <Text 
              style={{zIndex:9,color: '#1E1E32', fontWeight:'bold', fontSize: viewportWidth*.048, textAlign: 'center', position:'absolute', bottom:viewportHeight*.2, left:viewportWidth/2-46 }}>
              ¡BIENVENID@!</Text>
            </View>
          </View> }
      </View>
    );
  }
}
export default withNavigation(StartScreen);