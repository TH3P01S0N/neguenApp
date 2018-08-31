import React, { Component } from "react";
import { Image, KeyboardAvoidingView, TouchableOpacity, Keyboard, AsyncStorage ,ActivityIndicator,Dimensions, Alert} from "react-native";
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
import { connect } from "react-redux";
import {
  Container,
  Content,
  Item,
  Input,
  Button,
  Icon,
  View,
  Text,
  InputGroup
} from "native-base";
import { Field, reduxForm } from "redux-form";
import { setUser } from "../../actions/user";
import styles from "./styles";
import { SocialIcon } from 'react-native-elements'
import FBSDK, {LoginManager,AccessToken,GraphRequestManager, GraphRequest } from 'react-native-fbsdk';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
//const neguen = require("../../../images/neguen.png");
//const neguen2 = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/temp/aa@aa.com.jpg";
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const validate = values => {
  const error = {};
  error.email = "";
  error.password = "";
  var ema = values.email;
  var pw = values.password;
  if (values.email === undefined) {
    ema = "";
  }
  if (values.password === undefined) {
    pw = "";
  }
  if (ema.length < 8 && ema !== "") {
    error.email = "too short";
  }
  if (!ema.includes("@") && ema !== "") {
    error.email = "No es formato de correo válido";
  }
  if (pw.length > 12) {
    error.password = "max 11 characters";
  }
  if (pw.length < 5 && pw.length > 0) {
    error.password = "Weak";
  }
  return error;
};

class Login extends Component {
  static propTypes = {
    setUser: React.PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      name: "", username: "", password:"", loading: false , loading_fb: false, email:""
    };
    this.renderInput = this.renderInput.bind(this);
    this.navegar = this.navegar.bind(this);
  }
  
  setUser(name) {
    this.props.setUser(name);
  }
  renderInput({
    input,
    label,
    type,
    meta: { touched, error, warning },
    inputProps
  }) {
    var hasError = false;
    if (error !== undefined) {
      hasError = true;
    }
    return (
      <Item error={hasError}>{
        (input.name === "email") ?  
          <InputGroup>      
            <Icon  name="person" style={{color: "#D8D8D8"}}/>
            <Input placeholderTextColor="#D8D8D8" type={type} returnKeyType="next"
              placeholder="Email" keyboardType="email-address" style={{color:'#dbdbdb'}}
              onChangeText={(name)=> this.setState({name})} value={this.state.name}
              {...input}/>
          </InputGroup>
          :
          <InputGroup> 
            <Icon  name="unlock" style={{color: "#D8D8D8"}}/>
            <Input placeholderTextColor="#D8D8D8" type={type} secureTextEntry
              placeholder="Contraseña" onChangeText={(password)=> this.setState({password})}
              value={this.state.password}
              {...input}/>
          </InputGroup> 
        }
        {hasError
          ? <Item style={{ borderColor: "transparent" }}>
              <Icon active style={{ color: "red", marginTop: 5 }} name="bug" />
              <Text style={{ fontSize: 15, color: "red" }}>{error}</Text>
            </Item>
          : <Text />}
      </Item>
    );
  }
  navegar () {
    var data = {
      email: this.state.email
    }
    console.log("email: ", data);
    fetch('http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/api/users/reactivar', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                     'Content-Type': 'application/json'
                },
                    body: JSON.stringify(data)
            })
            .then(function(response) {
                if (response.status >= 400) {
                  throw new Error("Bad response from server");
                }
                return response.json();
            }).then(response=> {
              this.setState({loading_fb:false});
                if(response.success){             
                  this.setState({loading:true});
                  (async () => {        
                    await this.saveItem('id_token', response.id_token);
                  }) ();
                  const navigateAction = NavigationActions.navigate({
                    routeName: "Mapa",                  
                    actions: [NavigationActions.navigate({ routeName: 'Mapa' })],
                    //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
                  })
                  this.props.navigation.dispatch(navigateAction);
              }
                else {
                  alert(response.message);
              }
                console.log(response);
            })
     
  }
  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
  }
 
  login = () => {
    var email = this.state.name;
    var password = this.state.password;
    Keyboard.dismiss();
    if(email==="" || password===""){
      Alert.alert(
        'Atención',
        'No pueden haber campos vacíos'
     ) 
    }
    else{
      (async () => {        
        await this.saveItem('email', email);
      }) ();
    this.setState({loading:true});
    fetch("http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/api/sessions/create", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
                body: JSON.stringify({
                username: this.state.name,
                password: this.state.password,
                })
        })
        .then(function(response) {
            if (response.status >= 400) {
              this.setState({loading: false});
                throw new Error("Bad response from server");
              }
              return response.json();
            }).then(response=> {
              this.setState({loading: false});
                if (response.success) {  
                console.log(response);
            //this.props.navigation.navigate('Memberarea')
                  (async () => {        
                    await this.saveItem('id_token', response.id_token);
                  }) ();
                  (async () => {        
                    await this.saveItem('verificado', response.verificado);
                  }) ();
                  const actionToDispatch = NavigationActions.reset({
                    index: 0,
                    key: null,
                    actions: [NavigationActions.navigate({ routeName: 'Mapa',
                  params: {email: email} })],
                  })
                  this.props.navigation.dispatch(actionToDispatch)
                // DrawerNav.goBack();
              } else {
                alert(response.message);
            }
 
         })
        }
  }
  _fbAuth () {
    var that = this;
    this.setState({loading_fb: true});
    LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_birthday', 'user_gender']).then(function(result){
      if(result.isCancelled){
        console.log('Login was cancelled');
      }else{
        console.log('Login was success' + result.grantedPermissions.toString() );
        AccessToken.getCurrentAccessToken().then((data) => {
          const { accessToken } = data
          const responseInfoCallback = (error, result) => {
            if (error) {
              console.log(error)
              alert('Error fetching data: ' + error.toString());
            } else {
                (async () => {        
                 await that.saveItem('email', result.email);
                }) ();
                that.setState({email:result.email});
                  console.log(result)
                  var facebookId = result.id;
                  fetch("http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/api/users/login_fb", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                        body: JSON.stringify({
                        username: result.email,
                        password: 'facebook',
                        facebook: facebookId
                        })
                })
                .then(function(response) {
                    if (response.status >= 400) {
                        throw new Error("Bad response from server");
                      }
                      return response.json();
                    }).then(response=> {
                        if (response.success) {   
                          console.log("lb email: ", result.email);
                          (async () => {    
                            await that.saveItem('verificado', response.verificado);    
                            await that.saveItem('id_token', response.id_token);
                          }) ();
                          const actionToDispatch = NavigationActions.reset({
                            index: 0,
                            key: null,
                            actions: [NavigationActions.navigate({ routeName: 'Mapa' })],
                            //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
                          })
                          that.props.navigation.dispatch(actionToDispatch)
                        }else if(response.message=='reactivar') {
                          Alert.alert("Atención", 'Esta cuenta fue borrada, desea reactivarla?', [
                            {text: 'OK', onPress:  that.navegar },
                            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        ]);
                        }    
                        else {
                          const navigateAction = NavigationActions.navigate({
                            routeName: "Welcome",
                            params: {nombre: result.name, correo: result.email, contras: 'facebook', fecha: result.birthday, radio: result.gender, foto: result.picture, facebook:result.id},
                            actions: [NavigationActions.navigate({ routeName: 'Welcome' })],
                          })
                          that.props.navigation.dispatch(navigateAction);
                      }
                    })

            }
          }
          const infoRequest = new GraphRequest(
            '/me',
            {
              accessToken: accessToken,
              parameters: {
                fields: {
                  string: 'id, email,name,birthday, gender, picture.type(large)'
                }
              }
            },
            responseInfoCallback
          );
          new GraphRequestManager().addRequest(infoRequest).start();
        })
      }
    }, function(error){
      console.log('Ocurrió un error: '+ error);
    } )
  }
 
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <View style={styles.container}>
        { /* <Content>*/}
          <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-70} style={{flex:1}}>
            <View style={styles.logoContainer}>
             <Image source={{uri: uri+'/neguenHome.png'}} style={styles.shadow}></Image>
            </View>
           { this.state.loading || this.state.loading_fb ?
           <ActivityIndicator size="large"/> :
            <View>
            <TouchableOpacity onPress={() => navigate("Register", {navigation: this.props.navigation})}>
              <Text 
              style={{color: '#DEDA3E', fontWeight:'bold', fontSize: viewportHeight*0.028, textAlign: 'center' }}>
              Registrarse</Text>
            </TouchableOpacity>
            <Text 
              style={{color: '#1E1E32',  fontSize: viewportWidth*.056, textAlign: 'center', marginVertical:10 }}>
              o,</Text>
              <SocialIcon style={{borderRadius:5, marginHorizontal:viewportHeight*.046 }} fontStyle={{fontSize:viewportHeight*.026}}
                title='Registrarse con Facebook'
                button
                onPress={this._fbAuth.bind(this)}
                type='facebook'
              />
           <Text 
              style={{color: '#1E1E32',  fontSize: viewportWidth*.035, textAlign:'left', marginTop:15, marginLeft:30 }}>
              Si ya tienes una cuenta, ingresa aqui</Text> 
            <View style={styles.keyboard}>  
            <View >
              <Item style={{  borderColor: '#ddd93d'}}>
              <Image source={{uri: uri+'/correo.png'}} style={{height:22, width:22, marginRight:5}}></Image>
                <Input underlineColorAndroid='#ddd93d' style={{fontSize:15, height:40}} maxLength={160} enablesReturnKeyAutomatically={true}
                      placeholderTextColor="#4D4D4D"
                      value={this.state.name} onChangeText={name => this.setState({ name})}>
                </Input>
              </Item>  
                  <Text style={{color: '#ddd93d', fontSize: viewportHeight*0.023,  textAlign: 'left', marginBottom:10 }}>
                      Correo electrónico</Text> 
            </View>    
            <View >
              <Item style={{  borderColor: '#ddd93d'}}>
              <Image source={{uri: uri+'/password.png'}} style={{height:22, width:22, marginRight:5}}></Image>
                <Input underlineColorAndroid='#ddd93d' style={{fontSize:15, height:40}} maxLength={160} enablesReturnKeyAutomatically={true}
                      placeholderTextColor="#4D4D4D" secureTextEntry={true}
                      value={this.state.password} onChangeText={password => this.setState({ password})}>
                </Input>
              </Item>  
                  <Text style={{color: '#ddd93d', fontSize: viewportHeight*0.023,  textAlign: 'left', marginBottom:10 }}>
                      Contraseña</Text> 
            </View>                        
               {/* <Field name="email" component={this.renderInput}/> */}              
               {/* <Field name="password" type="password" component={this.renderInput} />*/}
                <TouchableOpacity // botón ingresar
                  style={styles.btnLogin}
                  onPress={this.login}
                  title="Ingresar"> 
                  <Text style={{color: '#1E1E32', textAlign: 'center', fontSize:viewportHeight*0.026}}>
                    Ingresar</Text>  
                </TouchableOpacity> 
                <TouchableOpacity //botón registrar
                  style={styles.btnRegister}
                  onPress={this._fbAuth.bind(this)}
                  title="Registrarse">
                  <Text style={{color: 'white', textAlign: 'center', fontWeight:'bold', fontSize:viewportHeight*.026}}>
                    Ingresar con Facebook</Text>
                </TouchableOpacity>
 
              { /* <TouchableOpacity //botón facebook
                  style={styles.btnFB}
                  onPress={this._fbAuth.bind(this)}
                  title="Facebook"> 
                  {(this.state.loading_fb) ?
                  <ActivityIndicator/> :
                  <Text style={{color: 'white', textAlign: 'center', fontSize:18}}>
                    Facebook</Text>  }
                  </TouchableOpacity>*/}
                </View>
            </View>}
            </KeyboardAvoidingView>
              {/*</View>*/}
            {/*</Image> */}
        {/*  </Content>*/}
        </View>
      </Container>
    );
  }
}
const LoginSwag = reduxForm(
  {
    form: "test",
    validate
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Login);
LoginSwag.navigationOptions = {
  header: null
};
export default withNavigation(LoginSwag);
