import React, { Component } from "react";
import { connect } from "react-redux";
const {Dimensions} = require('react-native');
import ImagePicker from 'react-native-image-picker';
var moment = require('moment');
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  //TextInput,
  Input,
  Button,
  Icon,
  Left,
  Item,
  Right,
  Body,
  Radio,
  ListItem,
  StyleProvider, 
  Thumbnail
} from "native-base";
import { Field, reduxForm } from "redux-form";
import {ActivityIndicator, TextInput, Image, KeyboardAvoidingView, TouchableOpacity, Alert, View, ScrollView, AsyncStorage } from "react-native";
import DatePicker from 'react-native-datepicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material';
import { openDrawer } from "../../actions/drawer";
import BlankPage2 from "../blankPage2";
import DrawBar from "../DrawBar";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const hongo  = uri + "/hongo.png";// require("../../../images/1-hongo.png");
const rana =  uri + "/rana.png"; 
const llama = uri + "/llama.png"; 
const pajaro = uri + "/pajaro.png"; 
const flor = uri + "/flor.png"; 
const caracol = uri + "/caracol.png"; 
const cucaracha = uri + "/cucaracha.png"; 
const pez = uri + "/pez.png"; 
const validate = values => {
  const error= {};
  error.password= '';
  error.pass2= '';
  var pass = values.password;
  var pass2 = values.pass2;
  var detalle = values.detalle;
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
return error;
};

class Editprofile extends Component {
  constructor(props){
    super(props);
    this.state={
      isReady: false, date:"", nombre: "", email: "", password: "", localidad:"",
       pass2: "", itemSelected: "Mujer", detalle: "", pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false, facebook:false,
       pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false, ImageSource: null, cambioFotofb:false, loading: false, maxDate: "" 
    };
    this.renderInput = this.renderInput.bind(this);
    this.submitReady = this.submitReady.bind(this);
    this.AlertExample = this.AlertExample.bind(this);
    this.navegar = this.navegar.bind(this);
    this.insertGroups = this.insertGroups.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.delete = this.delete.bind(this);
    this.logout = this.logout.bind(this);
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
  selectPhotoTapped() {
    const options = {
      quality: 0.6,
      maxWidth: 500,
      maxHeight: 500,
      title: 'Seleccionar foto',
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Tomar foto',
      chooseFromLibraryButtonTitle: 'Galería',
      storageOptions: {
        skipBackup: true,
        path: 'Neguen'
      }
    };
    ImagePicker.showImagePicker(options, (response) => {
      //console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri,
          type: 'image/jpeg',
          //name: 'myImage' + '-' + Date.now() + '.jpg' 
           name: this.state.email + '.jpg' };   
        this.setState({ 
          ImageSource: source, cambioFotofb:true
        });
      }
    });
  };
  componentDidMount(){
    var startdate = moment().subtract(16, "years").format("DD/MM/YYYY");
    this.setState({isReady:true, maxDate: startdate});
    var token= "";
    AsyncStorage.getItem('id_token').then((id_token)=>{
      token=id_token;
    });
    var url="http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/uploads/";
    AsyncStorage.getItem('email').then((email) => {
      fetch( 'http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/api/users/getuser', {
              method: 'POST',
              headers: {  
              'Accept': 'application/json',
              'Content-Type': 'application/json', }  ,
              body:JSON.stringify({ email: email})     
            })
            .then((response) => response.json())
          .then(response=> {
              if (response.success) { 
                  url2= url+email + '/' + email + '.jpg?'+ Math.random();
                 let source = { uri: url2 ,
                  type: 'image/jpeg',
                  //name: 'myImage' + '-' + Date.now() + '.jpg' 
                  name: email + '.jpg' };
                this.setState({email: email, localidad:response.message.localidad,
                nombre: response.message.nombre, date: response.message.fecha_nac ,
                itemSelected: response.message.genero, detalle:response.message.descripcion, 
                ImageSource: source, facebook: response.message.facebook, isReady:false
                });
                fetch( 'http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/api/grupoespecies/getgrupos', {
                  method: 'POST',
                  headers: {  
                  'Accept': 'application/json',
                  'Content-Type': 'application/json', }  ,
                  body:JSON.stringify({ email: email})     
                })
                .then((response) => response.json())
              .then(response=> {
                  if (response.success) {  
                    console.log("get user1: ", response.message);
                    var grupos = response.message ;
                    for (var i = 0, len = grupos.length; i < len; i++) {
                      if(grupos[i].idGrupoEspecie ==1) this.setState({pressHongo: true});
                      if(grupos[i].idGrupoEspecie==2) this.setState({pressRana: true});
                      if(grupos[i].idGrupoEspecie==3) this.setState({pressLlama: true});
                      if(grupos[i].idGrupoEspecie==4) this.setState({pressPajaro: true});
                      if(grupos[i].idGrupoEspecie ==5) this.setState({pressFlor: true});
                      if(grupos[i].idGrupoEspecie==6) this.setState({pressCaracol: true});
                      if(grupos[i].idGrupoEspecie==7) this.setState({pressCucar: true});
                      if(grupos[i].idGrupoEspecie==8) this.setState({pressPez: true});
                  }  
                } else {
                  console.log("get user2: ", response.message);
              }   
            }) 
            } else {
              console.log("get user3: ", response.message);
          }   
        }) 
    });
   
  }
  AlertExample = (text) => {
    const string1=text;
    const string2= "Se encontraron errores en: " + string1;
    Alert.alert(
        'Atención',
        string2
     )
  }
  insertGroups = () => {
    var email = this.state.email;
    var grupos = [];
    if(this.state.pressHongo) grupos.push(1);
    if(this.state.pressRana) grupos.push(2);
    if(this.state.pressLlama) grupos.push(3);
    if(this.state.pressPajaro) grupos.push(4);
    if(this.state.pressFlor) grupos.push(5);
    if(this.state.pressCaracol) grupos.push(6);
    if(this.state.pressCucar) grupos.push(7);
    if(this.state.pressPez) grupos.push(8);
    //if(grupos.length>0){
        var data = {
          email: email,
          groups: grupos
        }
        console.log('grupos', JSON.stringify(grupos));
        fetch('http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/api/users/editgrupos', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
              body: JSON.stringify(data)
      })
      .then(function(response) {
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response.json();
      }).then(response=> {
        this.setState({loading: false});
        console.log("response: ", response);
          if(response.success){  
            Alert.alert('Atencipon','Modificación exitosa!',[{text:'Ok', onPress:  this.navegar  }])         
          }
          else {
            alert(response.message);
        }
      }) 
    //}
     
   }
  submitReady = () =>{
    var email = this.state.email;
    var name = this.state.nombre;
    var password = this.state.password;
    var pass2 = this.state.pass2;
    var date = this.state.date;
    var radio = this.state.itemSelected;
    var detalle = this.state.detalle;
    var {localidad} = this.state;
    if(this.state.facebook!='no'){
      password= 'facebook';
      pass2 = 'facebook';
    }
    if(name === ""  || password==="" || pass2 ==="" || date==="" || detalle===""){
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
    else {
      //Alert.alert('Atencipon','Modificación exitosa!',[{text:'Ok', onPress:  this.navegar  }])
      this.setState({loading:true});
      var foto= "/";
      const formData = new FormData();
      formData.append('email', email);
      formData.append('nombre', name);
      formData.append('localidad', localidad);
      if(this.state.facebook=='no')
      formData.append('password', password);
      else
      formData.append('password', 'facebook');
      formData.append('fecha_nac', this.state.date);
      formData.append('descripcion', detalle);
      formData.append('genero', radio);
      if(this.state.cambioFotofb==false){  //no se cambio la foto  
        formData.append('image', null);
        
        formData.append('foto', '/');
      }
      else{ //cambio la foto
        formData.append('image',this.state.ImageSource );
        formData.append('foto', this.state.ImageSource.uri);
      }
      console.log("form: ", formData);
        fetch('http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/api/users/edit', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                    //'Content-Type': 'multipart/form-data',
                },
                    body: formData//JSON.stringify(data)
            })
            .then(function(response) {
                if (response.status >= 400) {
                  throw new Error("Bad response from server");
                }
                return response.json();
            }).then(response=> {
                if(response.success){
                  this.insertGroups();                             
              }
                else {
                  alert(response.message);
              }
                console.log(response);
            })
           }
    
  }
  navegar(){
    const navigateAction = NavigationActions.navigate({
      routeName: "Mapa",
      
      actions: [NavigationActions.navigate({ routeName: 'Mapa' })],
      //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
    })
    this.props.navigation.dispatch(navigateAction); 
  }
  logout = async () => {
    try {
      await AsyncStorage.removeItem('id_token');
      await AsyncStorage.removeItem('email');
     // Alert.alert('Logout Success!');
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      stateName: 'MainAppNav',
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'Login' })],
      //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
    })
    this.props.navigation.dispatch(actionToDispatch)
    } catch (error) {
    console.log('AsyncStorage error: ' + error.message);
    }
   // DrawerNav.goBack();
  }
  delete(){
    var data = {
      email: this.state.email
    }
    console.log("email: ", data)
    fetch('http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/api/users/delete_user', {
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
                  this.logout();
              }
                else {
                  alert(response.message);
              }
                console.log(response);
            })
  }
  eliminar(){
    Alert.alert("Atención", 'Está seguro que desea eliminar esta cuenta?', [
      {text: 'Sí', onPress: this.delete },
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
  ]);
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
  renderInput({ input, label, type, meta: { touched, error, warning } }){
    var hasError= false;
    if(error !== undefined){
      hasError= true;
    }
    return( 
               <Item style= {{ margin: 8 }} error= {hasError}>{
                   (input.name === "password") ?
                   <Item style={{  borderColor: '#ddd93d'}} >
                      <FontAwesome name={'lock'}style= {{color: '#ddd93d'}} size={23}/>
                      <Input placeholderTextColor="#c4c4c4" secureTextEntry style={{color:'#4A4A4A', fontSize: viewportHeight*.021}}
                      placeholder="Contraseña"  underlineColorAndroid='#ddd93d'
                      value={this.state.password} onChangeText={value => this.setState({password : value})}
                        {...input}/>
                    </Item>
                    :
                    <Item style={{  borderColor: '#ddd93d'}} >
                      <FontAwesome name={'lock'}style= {{color: '#ddd93d'}} size={23}/>
                      <Input placeholderTextColor="#c4c4c4" secureTextEntry style={{color:'#4A4A4A', fontSize: viewportHeight*.021}}
                      placeholder="Repetir contraseña"  underlineColorAndroid='#ddd93d'
                      value={this.state.pass2} onChangeText={value => this.setState({pass2 : value})}
                      {...input}/>
                    </Item>
                  }
                   {hasError ?  <Text>{error}</Text> : <Text />}
               </Item>  
  )      
  }
  render() {
    //const { handleSubmit, reset } = this.props;
    const { props: { name, index, list } } = this;
    const { navigate } = this.props.navigation;
    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Left>
            <Button transparent  onPress={() => DrawerNav.navigate("DrawerOpen")}>
            <Image source={{uri: uri+"/person.png"}} style={{ width:viewportHeight*.035, height:viewportHeight*.035,marginVertical:viewportHeight*.015}}/>
            </Button>
          </Left>

          <Body>
            <Title style={{color: '#4A4A4A', marginLeft:50, fontSize:16}}>Editar perfil</Title>
          </Body>

          <Right>
          {(this.state.loading) ?
                    <ActivityIndicator/> :
              <Button transparent onPress= { this.submitReady}><Text style={{color: '#DEDA3E', fontSize:15}}>Guardar</Text></Button>
          }
          </Right>
        </Header>

        <ScrollView>
       {(this.state.isReady) ?
       <ActivityIndicator/> :
        <View style={{justifyContent:'center', alignItems: 'center', marginTop:20}}>
          <TouchableOpacity  style={styles.profilepic} onPress={this.selectPhotoTapped.bind(this)}>
          {/*<Image source={man} style={{width:100, height:100}} ></Image>*/}
          <View >
            { this.state.ImageSource === null ? <Icon style={{color: '#4A4A4A'}} name="camera" /> :
              <Image style={{width:130, height:130, borderRadius:65, borderWidth:2, borderColor:'#ddd93d'}} source={this.state.ImageSource} />
            }
          </View>
          </TouchableOpacity>
        </View>}
          
        <KeyboardAvoidingView style={styles.keyboard}>
          <View >
              <Item style={{  borderColor: '#ddd93d'}}>
                  <FontAwesome name={'pencil'}style= {{color: '#ddd93d', marginTop:30,marginRight:6}} size={23}/>
                  <TextInput underlineColorAndroid='transparent' style={{flex:1,fontSize:viewportWidth*.04}} numberOfLines={3} maxLength={110} enablesReturnKeyAutomatically={true}
                    placeholderTextColor="#c4c4c4" placeholder= "¿Qué te gusta hacer, de dónde eres, quién eres? :) "
                    value={this.state.detalle} onChangeText={detalle => this.setState({ detalle})} multiline={true}>
                    </TextInput>
              </Item>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>   
                    <Text style={{color: '#ddd93d', fontSize: viewportHeight*.02,  textAlign: 'center', marginBottom:15 }}>
                    Descripción</Text> 
                    <Text style={{fontSize:viewportHeight*.02, color:"#1E1E32"}} >{this.state.detalle.length}/110</Text>    
                </View>
            </View>
          <View >
              <Item style={{  borderColor: '#ddd93d'}}>
                <FontAwesome name={'pencil'}style= {{color: '#ddd93d', marginRight:6}} size={23}/>
                <Input underlineColorAndroid='#ddd93d' style={{fontSize:viewportHeight*.021, height:viewportHeight*0.06}} maxLength={160} enablesReturnKeyAutomatically={true}
                      placeholderTextColor="#4D4D4D"
                      value={this.state.nombre} onChangeText={nombre => this.setState({ nombre})}>
                </Input>
              </Item>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>   
                  <Text style={{color: '#ddd93d', fontSize: viewportHeight*.02,  textAlign: 'center', marginBottom:15 }}>
                      Nombre</Text> 
                  <Text style={{fontSize:viewportHeight*.02, color:"#1E1E32"}} >{this.state.nombre.length}/160</Text>    
                </View>
          </View>
          <View >
              <Item style={{  borderColor: '#ddd93d'}}>
              <Image source={{uri: uri+'/correo.png'}} style={{height:22, width:22, marginRight:5}}></Image>
                <Input underlineColorAndroid='#ddd93d' style={{fontSize:viewportHeight*.021, height:viewportHeight*0.06}} maxLength={160} enablesReturnKeyAutomatically={true}
                      placeholderTextColor="#4D4D4D" disabled={true}
                      value={this.state.email} onChangeText={email => this.setState({ email})}>
                </Input>
              </Item>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>   
                  <Text style={{color: '#ddd93d', fontSize: viewportHeight*.02,  textAlign: 'center', marginBottom:15 }}>
                      Email</Text> 
                  <Text style={{fontSize:viewportHeight*.02, color:"#1E1E32"}}> </Text>    
                </View>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <View style={{flexDirection:'column', flex:1}}>
              <DatePicker
                style={{width: window.width*.74 , marginTop:0}}
                date={this.state.date}
                mode="date"
                maxDate={this.state.maxDate}
                placeholder="Fecha de nacimiento"
                format="DD/MM/YYYY"
                showIcon={true}
                confirmBtnText="Confirmar"
                cancelBtnText="Cancelar"
                hideText={false}
                iconSource={{uri: uri+"/date.png"}}
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
                    fontSize:viewportHeight*.021,
                    textAlign: 'left',
                    marginLeft:30
                  },
                  placeholderText:{
                    fontSize: viewportHeight*.021,
                    marginLeft: 30,
                    color: '#c4c4c4'
                  }
                }}
              />
              <Text style={{color: '#ddd93d', fontSize: viewportHeight*.02,  textAlign: 'left', paddingBottom:0 }}>
                          Fecha de nacimiento</Text>
            </View>
            <View style={{flex:1}}  >
              <Item style={{  borderColor: '#ddd93d'}}>
              <Image source={{uri: uri+'/casa.png'}} style={{height:22, width:22, marginRight:5}}></Image>
                <Input underlineColorAndroid='#ddd93d' style={{fontSize:viewportHeight*.021, height:40}} maxLength={160} enablesReturnKeyAutomatically={true}
                      placeholderTextColor="#4D4D4D" 
                      value={this.state.localidad} onChangeText={localidad => this.setState({ localidad})}>
                </Input>
              </Item>  
                  <Text style={{color: '#ddd93d', fontSize: viewportHeight*.02,  textAlign: 'left', marginBottom:0 }}>
                      Ciudad</Text> 
            </View> 
            </View>
          <ListItem style={{borderBottomWidth:0}} >
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
          <View style={{width:viewportWidth*.79, height:1, backgroundColor: '#ddd93d', borderRadius: 10,
            marginTop:10, marginRight:230}} />
          {(this.state.facebook=='no') &&
          <View>
          <Text style={{fontSize:viewportHeight*.025, color: '#3a3a3a', marginTop:20, marginLeft: 50 }}>
                Cambiar contraseña</Text>
          <Field name="password" component={this.renderInput}  />
          <Field name="pass2" component={this.renderInput} /></View>}
                             
              <View style={styles.scrollContainer}>
                <Text style={{fontSize:viewportHeight*.025, color: '#3a3a3a', textAlign:'center', justifyContent:'center', marginHorizontal:30 }}>
                Grupos que estoy siguiendo</Text>
                  <View style={styles.viewGrid}>
                  
                  <Button transparent style={styles.box} onPress={ ()=> this.setState({pressHongo: !this.state.pressHongo}) }>
                    <Image source={this.state.pressHongo ? {uri:uri+'/hongo2.png'} : {uri: hongo}} style={styles.shadow}></Image>
                  </Button>
                  <Button transparent style={styles.box} onPress={ ()=> this.setState({pressRana: !this.state.pressRana}) }>
                    <Image source={this.state.pressRana ? {uri:uri+'/rana2.png'}: {uri:rana}} style={styles.shadow}></Image>
                  </Button>
                  <Button transparent style={styles.box} onPress={ ()=> this.setState({pressLlama: !this.state.pressLlama}) }>
                  <Image source={this.state.pressLlama ? {uri:uri+'/llama2.png'}: {uri:llama}} style={styles.shadow}></Image>
                  </Button>
                  <Button transparent style={styles.box} onPress={ ()=> this.setState({pressPajaro: !this.state.pressPajaro}) }>
                    <Image source={this.state.pressPajaro ? {uri:uri+'/pajaro2.png'}: {uri: pajaro}} style={styles.shadow}></Image>
                  </Button>
                  <Button transparent style={styles.box} onPress={ ()=> this.setState({pressFlor: !this.state.pressFlor}) }>
                  <Image source={this.state.pressFlor ? {uri:uri+'/flor2.png'} : {uri: flor}} style={styles.shadow}></Image>
                  </Button>
                  <Button transparent style={styles.box} onPress={ ()=> this.setState({pressCaracol: !this.state.pressCaracol}) }>
                  <Image source={this.state.pressCaracol ? {uri:uri+'/caracol2.png'} : {uri: caracol}} style={styles.shadow}></Image>
                  </Button>
                  <Button transparent style={styles.box}onPress={ ()=> this.setState({pressCucar: !this.state.pressCucar}) }>
                  <Image source={this.state.pressCucar ? {uri:uri+'/cucaracha2.png'} : {uri: cucaracha}} style={styles.shadow}></Image>
                  </Button>
                  <Button transparent style={styles.box}onPress={ ()=> this.setState({pressPez: !this.state.pressPez}) }>
                  <Image source={this.state.pressPez ? {uri:uri+'/pez2.png'} : {uri: pez}} style={styles.shadow}></Image>
                  </Button>
                    </View>
              </View>
              <TouchableOpacity  style= {styles.btnRegister} onPress= {this.eliminar} >
                  <Text capitalize={false} style={{color: '#FAF9EF', fontSize:16, marginRight: 10}}>Eliminar cuenta</Text>
              </TouchableOpacity>
              </KeyboardAvoidingView>
        </ScrollView>
      </Container>
    );
  }
}

const EditSwag = reduxForm(
  {
    form: "test",
    validate,
    initialValues: {
      nombre: 'Test'
  },
  enableReinitialize : true
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name)),
      openDrawer: () => dispatch(openDrawer())
    };
  }
)(Editprofile);
EditSwag.navigationOptions = {
  header: null
};
function bindAction(dispatch) {
  return {
    setIndex: index => dispatch(setIndex(index)),
    openDrawer: () => dispatch(openDrawer())
  };
}
const mapStateToProps = state => ({
  name: state.user.name,
  list: state.list.list
});

//const editSwagger = connect(mapStateToProps, bindAction)(Editprofile);

const DrawNav = DrawerNavigator(
  {
    Editprofile: { screen: EditSwag },
    BlankPage2: { screen: BlankPage2 }
  },
  {
    contentComponent: props => <DrawBar {...props} />
  }
);
const DrawerNav = null;
DrawNav.navigationOptions = ({ navigation }) => {
  DrawerNav = navigation;
  return {
    header: null
  };
};
export default DrawNav;

