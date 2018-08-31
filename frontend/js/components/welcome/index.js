import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Left,
  Right,
  Body,
  View,
  List,
  Item,
  Input,
  Thumbnail
} from "native-base";
import {NavigationActions, withNavigation } from "react-navigation";
import { Field, reduxForm } from "redux-form";
import { Image, KeyboardAvoidingView, Dimensions,StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator, AsyncStorage } from "react-native";
import styles from "./styles";
import ImagePicker from 'react-native-image-picker';
import {url_API} from "../../config";
import HTMLView from 'react-native-htmlview';
import {textoGrupos} from "../avistamiento/textGrupos";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const hongo  = uri + "/hongo.png";// require("../../../images/1-hongo.png");
const rana = uri + "/rana.png";
const llama = uri + "/llama.png";
const pajaro = uri + "/pajaro.png";
const flor = uri + "/flor.png";
const caracol = uri + "/caracol.png";
const cucaracha = uri + "/cucaracha.png";
const pez = uri + "/pez.png";
const colores = [   '#86C290', '#B4922B', '#BE742E', '#4DC0DE', '#9EAA36', '#007090', '#816A27', '#0093BF'];

const validate = values => {
  const error= {};
  return error;
}
class Welcome extends Component {
  constructor(props){
    super(props);
    this.state={
      detalle: "", text: '', textLength: 0, pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,
      pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false,  ImageSource: null, loading: false, cambioFotofb:false,
      pressRana2: false, pressLlama2: false, pressPajaro2: false, pressFlor2: false,pressCaracol2: false, pressCucar2: false, pressPez2: false 
     , grupoEspecie:""
    };
    this.renderInput = this.renderInput.bind(this);
    this.submitReady = this.submitReady.bind(this);
    this.insertGroups = this.insertGroups.bind(this);
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
    const {contras} = this.props.navigation.state.params;
    if(contras=='facebook'){
        const {foto} = this.props.navigation.state.params;
        const {correo} = this.props.navigation.state.params;
        let source = { uri:   foto.data.url,
          type: 'image/jpeg',
          //name: 'myImage' + '-' + Date.now() + '.jpg' 
          name: correo + '.jpg' }; 
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };  
        this.setState({ 
          ImageSource: source
        });
      }
  }
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
      const {correo} = this.props.navigation.state.params;
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
           name: correo + '.jpg' }; 
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };  
        this.setState({ 
          ImageSource: source, cambioFotofb:true
        });
      }
    });
  };

 insertGroups = () => {
  const {correo} = this.props.navigation.state.params;
  const {radio, nombre, localidad} = this.props.navigation.state.params;
  var grupos = [];
  if(this.state.pressHongo2) grupos.push(1);
  if(this.state.pressRana2) grupos.push(2);
  if(this.state.pressLlama2) grupos.push(3);
  if(this.state.pressPajaro2) grupos.push(4);
  if(this.state.pressFlor2) grupos.push(5);
  if(this.state.pressCaracol2) grupos.push(6);
  if(this.state.pressCucar2) grupos.push(7);
  if(this.state.pressPez2) grupos.push(8);
  if(grupos.length>0){
      var data = {
        email: correo,
        groups: grupos
      }
      console.log('grupos', JSON.stringify(grupos));
      fetch(url_API+'users/groups', {
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
        if(response.success){  
          const actionToDispatch = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'Amapear',
            params: {genero: radio, grupos: grupos, ImageSource:this.state.ImageSource,nombre, localidad} })],
          })
          this.props.navigation.dispatch(actionToDispatch)         
       }
        else {
          //alert(response.message);
      }
    }) 
  }
  else{
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'Amapear',
      params: {genero: radio, ImageSource:this.state.ImageSource, grupos: grupos, nombre, localidad} })],
    })
    this.props.navigation.dispatch(actionToDispatch)
  }
   
 }

 async saveItem(item, selectedValue) {
  try {
    await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.error('AsyncStorage error: ' + error.message);
  }
}
  submitReady = ()=>{

    if(this.state.detalle === ""){
      Alert.alert(
        'Atención',
        'No pueden haber campos vacíos'
     )  
    }
    else{
        this.setState({loading:true});
        const {nombre} = this.props.navigation.state.params;
        const {correo} = this.props.navigation.state.params;
        const {contras} = this.props.navigation.state.params;
        const {fecha} = this.props.navigation.state.params;
        const {radio} = this.props.navigation.state.params;
        const {facebook, localidad} = this.props.navigation.state.params;
        const formData = new FormData();
        if(radio=='male') radio="Hombre";
        if(radio=='female') radio="Mujer";
        var foto= "/";
        if(this.state.ImageSource!=null) foto="foto";
        formData.append('email', correo);
        formData.append('nombre', nombre);
        formData.append('password', contras);
        formData.append('fecha_nac', fecha);
        formData.append('descripcion', this.state.detalle);
        formData.append('genero', radio);
        formData.append('localidad', localidad);
        formData.append('categoria', 'usuario');
        formData.append('verificado', 'no');
        formData.append('facebook', facebook);
        formData.append('access_token', 1);
        if(this.state.cambioFotofb==false && contras=='facebook'){
          formData.append('foto', this.state.ImageSource.uri);
          formData.append('image', null);
        } else{
          formData.append('foto', foto );
          formData.append('image',this.state.ImageSource ); }
        console.log("form: ", formData);
        fetch(url_API+'users/create', {
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
                this.setState({loading: false});
                if(response.success){
                   (async () => {        
                       await this.saveItem('id_token', response.id_token);
                       await this.saveItem('email', correo);
                       await this.saveItem('verificado', 'no');
                    }) ();
              this.insertGroups();             
              }
                else {
                  alert(response.message);
              }
                console.log(response);
            })
           }
      // DrawerNav.goBack();
  }
  renderInput({ input, label, type, meta: { touched, error, warning } }){
    var hasError= false;
    if(error !== undefined){
      hasError= true;
    }
      return(
        <Item style= {{ margin: 10, marginLeft:30, marginRight:30 }} error= {hasError}>{
          <Input placeholderTextColor="#D8D8D8" style={{color:'#4D4D4D', height:90}}
          placeholder={input.name === "detalle" ? "  ¿Qué te gusta hacer, de   dónde eres, quién eres? :) " : null} 
          value={this.state.detalle} onChangeText={value => this.setState({detalle : value})} multiline={true}
          numberOfLines={3} maxLength={110}
          {...input} />
        }
        {hasError ?  <Text>{error}</Text> : <Text />}
       </Item>
        
      )
  }
  handleGroup = (value) =>{
    var {grupoEspecie, pressCaracol, pressCucar, pressFlor, pressHongo, pressLlama, pressPajaro, pressPez, pressRana} = this.state; 
    if(value==grupoEspecie) grupoEspecie=0;
   else grupoEspecie=value;
    // this.setState({pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,
   //   pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false}); 
     //<Text style={{color:colores[this.state.idGrupoEspecie-1], fontWeight:'bold', fontFamily:'notoserif' }} >{textoGrupos[this.state.idGrupoEspecie-1].titulo}</Text> 
        //   <Text style={{color:colores[this.state.idGrupoEspecie-1], textAlign:'justify', fontFamily:'notoserif' }}>{textoGrupos[this.state.idGrupoEspecie-1].text}</Text>
    if(value==1) this.setState({pressHongo:!pressHongo, grupoEspecie:grupoEspecie,pressRana: false, pressLlama: false, pressPajaro: false, pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false });
    if(value==2) this.setState({pressRana:!pressRana, grupoEspecie:grupoEspecie,pressHongo: false,pressLlama: false, pressPajaro: false,pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false });
    if(value==3) this.setState({pressLlama:!pressLlama, grupoEspecie:grupoEspecie, pressHongo: false, pressRana: false,pressPajaro: false,pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false});
    if(value==4) this.setState({pressPajaro:!pressPajaro, grupoEspecie:grupoEspecie, pressHongo: false, pressRana: false, pressLlama: false,pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false});
    if(value==5) this.setState({pressFlor:!pressFlor, grupoEspecie:grupoEspecie, pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,pressCaracol: false, pressCucar: false, pressPez: false});
    if(value==6) this.setState({pressCaracol:!pressCaracol, grupoEspecie:grupoEspecie, pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,pressFlor: false, pressCucar: false, pressPez: false});
    if(value==7) this.setState({pressCucar:!pressCucar, grupoEspecie:grupoEspecie,pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,pressFlor: false, pressCaracol: false,pressPez: false });
    if(value==8) this.setState({pressPez:!pressPez, grupoEspecie:grupoEspecie, pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,pressFlor: false, pressCaracol: false, pressCucar: false});
  }
  render() {
    const { props: { name, index, list } } = this;
    const { navigate } = this.props.navigation;
    var {nombre, radio} = this.props.navigation.state.params;
    if(radio=='male') radio="Hombre";
    if(radio=='female') radio="Mujer";
    const {grupoEspecie, pressFlor2, pressHongo2,pressRana2, pressLlama2, pressFlor,pressPajaro2,pressCaracol2, pressCucar2,pressPez2, pressHongo,pressRana, pressLlama ,pressPajaro,pressCaracol, pressCucar, pressPez} = this.state;

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

        {/*<View style={styles.content}>*/}
        
        <ScrollView  style={grupoEspecie>0 ? {flex:1,backgroundColor: '#F2F1E1'}: {flex:1}}>
        <KeyboardAvoidingView style={{flex:1}}>
          <View style={{justifyContent:'center', alignItems: 'center', marginTop:5}}>
            <TouchableOpacity  style={styles.profilepic} onPress={this.selectPhotoTapped.bind(this)}>
            {/*<Image source={man} style={{width:100, height:100}} ></Image>*/}
            <View >
              { this.state.ImageSource === null ? <Icon style={{color: '#4A4A4A'}} name="camera" /> :
                <Image style={{width:viewportHeight*.2, height:viewportHeight*.2, borderRadius:(viewportHeight*.2)/2}} source={this.state.ImageSource} />
              }
            </View>
            </TouchableOpacity>
          </View>
          
          <Text style={{color: '#4D4D4D', fontSize: viewportHeight*.026, marginTop:8, textAlign:'center'}}>Hola</Text>                    
          <Text style={{color: '#DEDA3E', fontSize: viewportHeight*.04, textAlign:'center'}}>{nombre}</Text>
            {/*  <Field name="detalle" component={this.renderInput} />*/}
              <View style={{marginTop:0, marginHorizontal:25}} >
              <Item style={{  borderColor: '#ddd93d'}}>
              <Image source={radio=="Hombre" ? {uri: uri+'/niño.png'}: {uri: uri+'/niña.png'}} style={{height:22, width:22, marginRight:5}}></Image>
                  <Input underlineColorAndroid='#ddd93d' style={{fontSize:15, height:80}} maxLength={200}
                   enablesReturnKeyAutomatically={true} multiline={true} maxLength={110}
                        placeholderTextColor="#4D4D4D" placeholder={"A mi me gusta el Tangananica...."}
                        value={this.state.detalle} onChangeText={detalle => this.setState({ detalle})}>
                  </Input>
              </Item> 
              <View style={{flexDirection:'row', justifyContent:'space-between'}}> 
                <Text style={{color: '#ddd93d', fontSize: viewportWidth*.04,  textAlign: 'center', paddingBottom:0 }}>
                    Acerca de ti</Text> 
                <Text style={{fontSize:viewportWidth*.04, color:"#1E1E32"}} >{this.state.detalle.length}/200</Text>    
              </View>
          </View> 
             {/* <Text style={{fontSize:15, textAlign:'left' }} >{this.state.detalle.length}/110</Text>*/}
              <Text style={{fontSize:viewportWidth*.035, color: '#4D4D4D', marginTop:10, marginLeft: 20, marginRight:20,
               textAlign: 'center', marginBottom:10 }}>
                Selecciona el/los grupos de especies que te interesan</Text>             
       
                  <View style={styles.viewGrid}>
                      <Button transparent style={styles.box} onLongPress={() => this.setState({pressFlor2:!pressFlor2})}
                        onPress={()=> this.handleGroup(5) }>{pressFlor2 ?
                          <Image source={{uri:uri+'/flor4.png'}} style={styles.shadow}></Image>
                        :<Image source={pressFlor ? {uri:uri+'/flor2.png'} : {uri: flor}} style={styles.shadow}></Image>
                      }</Button>
                      <Button transparent style={styles.box} onLongPress={() => this.setState({pressRana2:!pressRana2})}
                         onPress={()=> this.handleGroup(2) }>{pressRana2 ? 
                        <Image source={{uri:uri+'/rana4.png'}} style={styles.shadow}></Image>    
                      :<Image source={this.state.pressRana ? {uri:uri+'/rana2.png'}: {uri:rana}} style={styles.shadow}></Image>
                       }</Button>
                      <Button transparent style={styles.box} onLongPress={() => this.setState({pressLlama2:!pressLlama2})}
                      onPress={()=> this.handleGroup(3) }>{pressLlama2 ?
                        <Image source={{uri:uri+'/llama4.png'}} style={styles.shadow}></Image>
                        :<Image source={this.state.pressLlama ? {uri:uri+'/llama2.png'}: {uri:llama}} style={styles.shadow}></Image>
                      }</Button>
                    <Button transparent style={styles.box} onLongPress={() => this.setState({pressPajaro2:!pressPajaro2})}
                    onPress={()=> this.handleGroup(4) }>{pressPajaro2 ?
                      <Image source={{uri:uri+'/pajaro4.png'}} style={styles.shadow}></Image>
                      :<Image source={this.state.pressPajaro ? {uri:uri+'/pajaro2.png'}: {uri: pajaro}} style={styles.shadow}></Image>
                    }</Button>
                </View>
                {(this.state.grupoEspecie > 1 && this.state.grupoEspecie<6) &&
                  <View style={{flexWrap: 'wrap', marginHorizontal:30, marginVertical:10 }}>
                      <Text style={{color:colores[this.state.grupoEspecie-1], fontWeight:'bold', fontFamily:'notoserif' }} >{textoGrupos[this.state.grupoEspecie-1].titulo}: </Text> 
                      <HTMLView style={{flex:1, flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap'}} 
                        stylesheet={styleshtml}  value={textoGrupos[this.state.grupoEspecie-1].text} />
                  </View>                 
                }
              <View style={styles.viewGrid}>
                  <Button transparent style={styles.box} onLongPress={() => this.setState({pressHongo2:!pressHongo2})}
                  onPress={()=> this.handleGroup(1) }>{pressHongo2 ?
                    <Image source={{uri:uri+'/hongo4.png'}} style={styles.shadow}></Image>
                    :<Image source={pressHongo ? {uri:uri+'/hongo2.png'} : {uri: hongo}} style={styles.shadow}></Image>
                  }</Button>
                  <Button transparent style={styles.box} onLongPress={() => this.setState({pressCaracol2:!pressCaracol2})}
                  onPress={()=> this.handleGroup(6)}>{pressCaracol2 ?
                    <Image source={{uri:uri+'/caracol4.png'}} style={styles.shadow}></Image>
                    :<Image source={this.state.pressCaracol ? {uri:uri+'/caracol2.png'} : {uri: caracol}} style={styles.shadow}></Image>
                  }</Button>
                  <Button transparent style={styles.box} onLongPress={() => this.setState({pressCucar2:!pressCucar2})}
                  onPress={()=> this.handleGroup(7)}>{pressCucar2 ?
                    <Image source={{uri:uri+'/cucaracha4.png'}} style={styles.shadow}></Image>
                    :<Image source={this.state.pressCucar ? {uri:uri+'/cucaracha2.png'} : {uri: cucaracha}} style={styles.shadow}></Image>
                  }</Button>
                  <Button transparent style={styles.box} onLongPress={() => this.setState({pressPez2:!pressPez2})}
                  onPress={ ()=> this.handleGroup(8) }>{pressPez2 ?
                    <Image source={{uri:uri+'/pez4.png'}} style={styles.shadow}></Image>
                    :<Image source={this.state.pressPez ? {uri:uri+'/pez2.png'} : {uri: pez}} style={styles.shadow}></Image>
                }</Button>
              </View>
            {((this.state.grupoEspecie > 5 && this.state.grupoEspecie<9) || this.state.grupoEspecie==1 )&&
              <View style={{flexWrap: 'wrap', marginHorizontal:30, marginTop:20}}>
                  <Text style={{color:colores[this.state.grupoEspecie-1], fontWeight:'bold', fontFamily:'notoserif' }} >{textoGrupos[this.state.grupoEspecie-1].titulo}: </Text> 
                  <HTMLView style={{flex:1, flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap'}} 
                    stylesheet={styleshtml}  value={textoGrupos[this.state.grupoEspecie-1].text} />
              </View>                 
            }

                  <TouchableOpacity  style= {styles.btnRegister} onPress= { this.submitReady} disabled={this.state.loading} >
                  {(this.state.loading) ?
                    <ActivityIndicator/> :
                    <Text capitalize={false} style={styles.texto}>Guardar</Text>
                  }
                 </TouchableOpacity>
                       
              </KeyboardAvoidingView>   
              </ScrollView> 
        {/*</View>*/}
      </Container>
    );
  }
  
}
const styleshtml = StyleSheet.create({
  a: {
    color:  '#86C290', // make links coloured pink
  },
  bb: {
    color:'#B4922B'
  },
  c: {color:'#BE742E'},
  d: {color:'#4DC0DE'},
  e: {color:'#9EAA36'},
  f: {color:'#007090'},
  g: {color:'#816A27'},
  hh: {color:'#0093BF'}
});
const WelcomeSwag = reduxForm(
  {
    form: "test",
    validate
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Welcome);
WelcomeSwag.navigationOptions = {
  header: null
};
export default WelcomeSwag;
