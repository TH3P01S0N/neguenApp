import React, { Component } from "react";
const {Dimensions} = require('react-native');
import { connect } from "react-redux";
var moment = require('moment');
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  TextInput,
  Input,
  Button,
  Icon,
  Left,
  Item,
  Right,
  Body,
  Radio,
  ListItem,
  StyleProvider
} from "native-base";
import { Field, reduxForm } from "redux-form";
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import { Image, KeyboardAvoidingView, TouchableOpacity, Alert, ActivityIndicator, View, AsyncStorage } from "react-native";
import DatePicker from 'react-native-datepicker'
import styles from "./styles";
import {url_API} from "../../config";
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material';
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
//const window = Dimensions.get('window');
const validate = values => {
  const error= {};
  error.email= '';
  error.name= '';
  error.password= '';
  error.pass2= '';
  var ema = values.email;
  var nm = values.name;
  var pass = values.password;
  var pass2 = values.pass2;
  if(values.email === undefined){
    ema = '';
  }
  if(values.name === undefined){
    nm = '';
  }
  if (values.password === undefined) {
    pass = '';
  }
  if (values.pass2 === undefined){
    pass2 = '';
  }
  if (pass!==pass2) {
    error.password = 'Contraseñas no coinciden';
  }
  if (pass.length<5 && pass.length>0) {
      error.password = "Débil";
  }
  if(ema.length < 8 && ema !== ''){
    error.email= 'Muy corto';
  }
  if(!ema.includes('@') && ema !== ''){
    error.email= '@ no incluido';
  }

  if(nm.length > 8){
    error.name= 'Máximo 10 caracteres';
  }
  
return error;
};

class Register extends Component {
  constructor(props){
    super(props);
    this.state={
      isReady: false, date:"", nombre: "", email: "", password: "", pass2: "", itemSelected: "Mujer",
      loading: false, maxDate: "", localidad:""
    };
    this.renderInput = this.renderInput.bind(this);
    this.submitReady = this.submitReady.bind(this);
    this.AlertExample = this.AlertExample.bind(this);
    this.navegar = this.navegar.bind(this);
    this.isAllowedDate = this.isAllowedDate.bind(this);
  }
  static navigationOptions = {
    header: null
  };
  static propTypes = {
    name: React.PropTypes.string,
    index: React.PropTypes.number,
    list: React.PropTypes.arrayOf(React.PropTypes.string),
    openDrawer: React.PropTypes.func
  };
  componentDidMount(){
    Geolocation.getCurrentPosition(
      (cords) => {
        var geocode = {
          lat: cords.coords.latitude,
          lng: cords.coords.longitude
        }
        console.log("position: ", geocode);
       Geocoder.geocodePosition(geocode).then(res => {
        // res is an Array of geocoding object (see below)
        this.setState({localidad:res[0].locality});
       // console.log("geocoding: ", res)
         });
      },
      (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
    var startdate = moment().subtract(16, "years").format("DD/MM/YYYY");
    this.setState({maxDate: startdate});
  }
  navegar(){
    var data = {
      email: this.state.email
    }
    console.log("email: ", data);
    (async () => {        
      await this.saveItem('email', this.state.email);
    }) ();
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
  AlertExample = (text) => {
    const string1=text;
    const string2= "Se encontraron errores en: " + string1;
    Alert.alert(
        'Atención',
        string2
     )
  }
  isAllowedDate =(date) =>{
    var startdate = moment().subtract(16, "years").format("YYYY-MM-DD");
    var newDate = moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");
    var token_if = moment(newDate,"YYYY-MM-DD" ).isAfter(startdate, "day");
    //console.log(token_if, newDate, startdate);
    if (!token_if){
      this.setState({date:date});
    }
    else Alert.alert("Tiene que ser mayor de 16 años para usar esta aplicación");
  }
  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
  }
  submitReady = () =>{
    var name = this.state.nombre;
    var email = this.state.email;
    var password = this.state.password;
    var pass2 = this.state.pass2;
    var date = this.state.date;
    var radio = this.state.itemSelected;
    var data = {
      email: email
    }
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(name === "" || email === "" || password==="" || pass2 ==="" || date===""){
      Alert.alert(
        'Atención',
        'No pueden haber campos vacíos'
     )  
    }
    else if(password!==pass2){
      this.AlertExample("contraseña");
    }
    else if (password.length<5){
      this.AlertExample("contraseña");
    }
    else if (password==="facebook"){
      this.AlertExample("contraseña, palabra reservada");
    }
    else if(reg.test(email)=== false){
      this.AlertExample("correo");
    }
    else {
      this.setState({loading:true});
      fetch(url_API+'users/exist', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
                body: JSON.stringify(data)
        })
        .then(function(response) {
            if (response.status >= 400) {
              throw new Error("Mala respuesta del servidor");
            }
            return response.json();
        }).then(response=> {
          this.setState({loading: false});
            if(response.success){
               const navigateAction = NavigationActions.navigate({
                routeName: "Condiciones",//"Welcome",
                params: {nombre: name, correo: email, contras: password, fecha: date, localidad:this.state.localidad,
                   radio: radio, facebook:'no'},
                actions: [NavigationActions.navigate({ routeName: 'Condiciones' })],
              })
              this.props.navigation.dispatch(navigateAction);          
            }
            else if(response.message=='facebook'){
              Alert.alert("Atención", 'Esta cuenta ya existe, intente ingresar mediante facebook');
            }
            else if(response.message=='reactivar') {
              Alert.alert("Atención", 'Esta cuenta fue borrada, desea reactivarla?', [
                {text: 'Sí', onPress: this.navegar },
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ]);
          }
            console.log(response);
        })
      
    }
    
  }
  
  renderInput({ input, label, type, meta: { touched, error, warning } }){
    var hasError= false;
    if(error !== undefined){
      hasError= true;
    }
    return( 
               <Item style= {{ margin: 7 }} error= {hasError}>{
                 (input.name === "name") ?
                  <Input placeholderTextColor="#dbdbdb" style={{color:'#dbdbdb', fontSize:viewportWidth*.04}}
                    placeholder={input.name === "name" ? "Nombre" : null}
                    value={this.state.nombre} onChangeText={value => this.setState({nombre : value})}
                    {...input}/>
                  : 
                  (input.name === "email") ?
                  <Input placeholderTextColor="#dbdbdb" style={{color:'#dbdbdb', fontSize:viewportWidth*.04}}
                  placeholder="Email" keyboardType="email-address"
                  value={this.state.email} onChangeText={value => this.setState({email : value})}
                   {...input}/> 
                   :
                   (input.name === "password") ?
                   <Input placeholderTextColor="#dbdbdb" secureTextEntry style={{color:'#dbdbdb', fontSize:viewportWidth*.04}}
                   placeholder="Contraseña"  
                   value={this.state.password} onChangeText={value => this.setState({password : value})}
                    {...input}/>
                    :
                    <Input placeholderTextColor="#dbdbdb" secureTextEntry style={{color:'#dbdbdb', fontSize:viewportWidth*.04}}
                    placeholder="Repetir contraseña" 
                    value={this.state.pass2} onChangeText={value => this.setState({pass2 : value})}
                     {...input}/>
                  }
                   {hasError ?  <Text>{error}</Text> : <Text />}
               </Item>  
  )      
  }
  render() {
    const { handleSubmit, reset } = this.props;
    const { props: { name, index, list } } = this;
    const { navigate } = this.props.navigation;
    //console.log(this.props.navigation, "000000000");
    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Left style={{flex:1}}>
            <Button transparent  onPress={() => this.props.navigation.goBack()}>
              <Icon style={{color: '#787878'}} name="ios-arrow-back" />
            </Button>
          </Left>

          <Body style={{flex:5,  justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#1E1E32', fontSize: 19, textAlign:'center', fontWeight:'bold'}}>Registrarse</Text>
          </Body>

          <Right />
        </Header>

        {/*<Content padder>*/}
      {/*  <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={100}   style={styles.keyboard}>*/}
          <View style={{flex:1, flexDirection:'column', justifyContent:'space-between', marginHorizontal:viewportHeight*0.057, marginVertical:20}}>
          <View style={{marginTop:0,}} >
              <Item style={{  borderColor: '#ddd93d'}}>
              <Image source={{uri: uri+'/personPress.png'}} style={{height:22, width:22, marginRight:5}}></Image>
                  <Input underlineColorAndroid='#ddd93d' style={{fontSize:15, height:40}} maxLength={160} enablesReturnKeyAutomatically={true}
                        placeholderTextColor="#4D4D4D"
                        value={this.state.nombre} onChangeText={nombre => this.setState({ nombre})}>
                  </Input>
              </Item> 
                <Text style={{color: '#ddd93d', fontSize: viewportWidth*.04,  textAlign: 'left', paddingBottom:0 }}>
                    Nombre</Text> 
          </View>  
          <View  >
              <Item style={{  borderColor: '#ddd93d'}}>
              <Image source={{uri: uri+'/correo.png'}} style={{height:22, width:22, marginRight:5}}></Image>
                <Input underlineColorAndroid='#ddd93d' style={{fontSize:15, height:40}} maxLength={160} enablesReturnKeyAutomatically={true}
                      placeholderTextColor="#4D4D4D"
                      value={this.state.email} onChangeText={email => this.setState({email})}>
                </Input>
              </Item>  
                  <Text style={{color: '#ddd93d', fontSize: viewportWidth*.04,  textAlign: 'left', paddingBottom:0 }}>
                      E-mail</Text> 
            </View>        
        {/*  <Field name="name" component={this.renderInput} />
          <Field name="email" component={this.renderInput} />*/}
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <View style={{flexDirection:'column', flex:1}}>
              <DatePicker
                style={{ width: window.width*.74 , marginTop:0}}
                date={this.state.date}
                mode="date"
                maxDate={this.state.maxDate}
                placeholder=" "
                format="DD/MM/YYYY"
                showIcon={true}
                confirmBtnText="Confirmar"
                cancelBtnText="Cancelar"
                hideText={false}
                iconSource={{uri: uri+"/date.png"}}
                //onDateChange={(date) => {this.setState({date: date});}}
                onDateChange={(date) => {
                  this.isAllowedDate(date);
                }}
                customStyles={{
                  dateIcon:{
                    marginLeft:0,
                    position: 'absolute',
                    left:0,
                    width:23,
                    height:23
                  },
                  dateInput: {
                    borderWidth: 0,
                    borderBottomWidth: 0.8,
                    alignItems: 'flex-start',
                    borderBottomColor:'#DDDA3C'
                  },
                  dateText:{
                    color: '#4A4A4A',
                    fontSize:viewportWidth*.04,
                    textAlign: 'left',
                    marginLeft: 30
                  },
                  placeholderText:{
                    fontSize: viewportWidth*.04,
                    marginLeft: 30,
                    color: '#c4c4c4'
                  }
                }}
              />
              <Text style={{color: '#ddd93d', fontSize: viewportWidth*.04,  textAlign: 'left', paddingBottom:0 }}>
                          Fecha de nacimiento</Text>
              </View>
            <View style={{flex:1}}  >
              <Item style={{  borderColor: '#ddd93d'}}>
              <Image source={{uri: uri+'/casa.png'}} style={{height:22, width:22, marginRight:5}}></Image>
                <Input underlineColorAndroid='#ddd93d' style={{fontSize:15, height:40}} maxLength={160} enablesReturnKeyAutomatically={true}
                      placeholderTextColor="#4D4D4D" 
                      value={this.state.localidad} onChangeText={localidad => this.setState({ localidad})}>
                </Input>
              </Item>  
                  <Text style={{color: '#ddd93d', fontSize: viewportWidth*.04,  textAlign: 'left', marginBottom:0 }}>
                      Ciudad</Text> 
            </View>   
          </View>       
        {/*  <Field name="password" component={this.renderInput}  />
          <Field name="pass2" component={this.renderInput}  />*/}
            <View >
              <Item style={{  borderColor: '#ddd93d'}}>
              <Image source={{uri: uri+'/password.png'}} style={{height:22, width:22, marginRight:5}}></Image>
                <Input underlineColorAndroid='#ddd93d' style={{fontSize:15, height:40}} maxLength={160} enablesReturnKeyAutomatically={true}
                      placeholderTextColor="#4D4D4D" secureTextEntry={true}
                      value={this.state.password} onChangeText={password => this.setState({ password})}>
                </Input>
              </Item>  
                  <Text style={{color: '#ddd93d', fontSize: viewportWidth*.04,  textAlign: 'left', marginBottom:0 }}>
                      Contraseña</Text> 
            </View>
            <View  >
              <Item style={{  borderColor: '#ddd93d'}}>
              <Image source={{uri: uri+'/password.png'}} style={{height:22, width:22, marginRight:5}}></Image>
                <Input underlineColorAndroid='#ddd93d' style={{fontSize:15, height:40}} maxLength={160} enablesReturnKeyAutomatically={true}
                      placeholderTextColor="#4D4D4D" secureTextEntry={true}
                      value={this.state.pass2} onChangeText={pass2 => this.setState({pass2})}>
                </Input>
              </Item>  
                  <Text style={{color: '#ddd93d', fontSize: viewportWidth*.04,  textAlign: 'left', paddingBottom:0 }}>
                      Repetir contraseña</Text> 
            </View>
          <ListItem>
              <Left>
                <StyleProvider style={getTheme(material)}>
                  <Radio onPress={() => this.setState({ itemSelected: 'Mujer' })}
                  selected={this.state.itemSelected == 'Mujer'}  />
                </StyleProvider>
                  <Text style={styles.texto}>Mujer</Text> 
                <StyleProvider style={getTheme(material)}>
                  <Radio onPress={() => this.setState({ itemSelected: 'Hombre' })}
                      selected={this.state.itemSelected == 'Hombre' }  />
                </StyleProvider>
                  <Text style={styles.texto}>Hombre</Text>
                  <StyleProvider style={getTheme(material)}>
                <Radio  onPress={() => this.setState({ itemSelected: 'Otro' })}
                    selected={this.state.itemSelected == 'Otro' }  />
                </StyleProvider>
                  <Text style={styles.texto}>Otro</Text>
              </Left>
          </ListItem>
          <TouchableOpacity  style= {styles.btnRegister} onPress= { this.submitReady} >
          {(this.state.loading) ?
          <ActivityIndicator/> :
           <Text capitalize={false} style={{color: '#1E1E32',fontSize:viewportHeight*.0266}}>Guardar</Text>
          }
          </TouchableOpacity>
        </View> 
     {/*   </KeyboardAvoidingView>*/}
       {/* </Content>*/}
      </Container>
    );
  }
}


const RegisterSwag = reduxForm(
  {
    form: "test",
    validate
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Register);
RegisterSwag.navigationOptions = {
  header: null
};
export default withNavigation(RegisterSwag);

