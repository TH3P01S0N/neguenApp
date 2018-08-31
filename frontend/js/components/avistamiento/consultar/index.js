import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Item,
  Button,
  Icon,
  Left,
  Right,
  Body,
  View,
  Input,
  InputGroup
} from "native-base";
import { Field, reduxForm } from "redux-form";
import {TextInput, FlatList, Image, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Dimensions, ActivityIndicator, RefreshControl} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import ImagePicker from 'react-native-image-picker';
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {  List, ListItem } from 'react-native-elements';
import { isGoBack } from "../../../actions/goback_action";
import { isGoBackOff } from "../../../actions/goback_action_off";
import {url_API} from '../../../config';
import {ENTRIES1, ENTRIES2} from '../static/entries';
var moment = require('moment');
var esMoment = require('moment/locale/es.js');
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const uri_foto = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/uploads/";
const hongo  = uri + "/hongosolo.png";// require("../../../images/1-hongo.png");
const rana =  uri + "/ranasolo.png"; 
const llama = uri + "/llamasolo.png"; 
const pajaro = uri + "/pajarosolo.png"; 
const flor = uri + "/florsolo.png"; 
const caracol = uri + "/caracolsolo.png"; 
const cucaracha = uri + "/cucarachasolo.png"; 
const pez = uri + "/pezsolo.png"; 
const flor_trans = uri + "/flor_trans.png";
const like = uri + "/like.png";
const liked = uri + "/liked.png";
const advertencia = uri+"/advertencia.png";
const temperatura = uri+"/temp.png";
const huella = uri+"/huella.png";
const colores = [  '#86C290', '#B4922B', '#BE742E', '#4DC0DE','#9EAA36' , '#007090', '#816A27', '#0093BF'];
const nombreGrupos = [  'Hongo', 'Anfibio y reptile', 'Mamífero', 'Ave','Planta y alga' , 'Invertebrado marino', 'Artrópodo terrestre', 'Pez'];
class ConsultarAvist extends Component {
  constructor(props){
    super(props);
    this.state={
    especie:"",  ImageSource: null, nombreUser: "", fotoPerfil:null, temp:0, ImagenGrupoEspecie:null, loading:false,
     nombreEspecie:"", isOwner:false, PressInfo:false, idAvist:0, flag:false, idGrupoEspecie:0, longitude:null, localidad:"",
     latitude: null, fromDrawBar:false, email:"", liked: false, likes:0, idUsuario:0, verificado:false, listRefreshing:false
    , fotoOld:"", comentarios:[],ingresarComentario:"",loadingComent:false, amenaza:[], suelo:[], descripcion:"", pressGrupo:true,
    pressAme:false, pressSuelo:false, fecha_avist:"", nombreCient:""
    };
    this.fetchUser = this.fetchUser.bind(this);
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }
  static navigationOptions = {
    header: null
  };
  static propTypes = {
    name: React.PropTypes.string,
    index: React.PropTypes.number,
    list: React.PropTypes.arrayOf(React.PropTypes.string),
    openDrawer: React.PropTypes.func,
    flag: React.PropTypes.bool,
    isGoBackOff: React.PropTypes.func
  };
  isGoBackOff() {
    console.log("isgoback off");
      this.props.isGoBackOff();
  }
  _refreshing = () => {
    this.setState({listRefreshing:true});
    this.fetchUser();
  }
  fetchUser = () =>{
    this.setState({flag:true });
    const {idAvist} = this.props.navigation.state.params;
    const {email} = this.props.navigation.state.params;
    //console.log("fetch_ flag: ", this.props.flag);
    //console.log(idAvist, email);
    var data = {id:idAvist }
    fetch(url_API +'avistamiento/getamenazas', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
          body:  JSON.stringify(data)
      })
      .then(function(response) {
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response.json();
      }).then(response=> {
        var grupoEspecie = response.idGrupoEspecie;
        var sueloObject = [];
        var amenazaObject =[] ;
          for (var i = 0, len = response.amenaza.length; i < len; i++){
            amenazaObject.push(ENTRIES1[response.amenaza[i].idAmenaza]);
          }
          for (var i = 0, len = response.suelo.length; i < len; i++){
            sueloObject.push(ENTRIES2[response.suelo[i].idAmenaza]);
          }
          var localLocale = moment(response.fecha,"DD/MM/YYYY");
        moment.updateLocale('es', esMoment );
        localLocale.locale(false);
        var _today  = localLocale.format("LL");
        
          this.setState({amenaza:amenazaObject, suelo:sueloObject,fecha_avist:_today, temp:response.temp, nombreCient:response.nombreCient });
        if(grupoEspecie==1) this.setState({localidad:response.localidad, descripcion:response.descripcion, nombreEspecie:response.nombre, ImagenGrupoEspecie:hongo, temp:response.temp, idAvist: idAvist, idGrupoEspecie:1, latitude:response.latitude, longitude:response.longitude, flag:true});
        if(grupoEspecie==2) this.setState({localidad:response.localidad,descripcion:response.descripcion,nombreEspecie:response.nombre, ImagenGrupoEspecie:rana, temp:response.temp, idAvist: idAvist, idGrupoEspecie:2, latitude:response.latitude, longitude:response.longitude,flag:true});
        if(grupoEspecie==3) this.setState({localidad:response.localidad,descripcion:response.descripcion,nombreEspecie:response.nombre, ImagenGrupoEspecie:llama,  temp:response.temp, idAvist: idAvist, idGrupoEspecie:3,latitude:response.latitude, longitude:response.longitude, flag:true});
        if(grupoEspecie==4) this.setState({localidad:response.localidad,descripcion:response.descripcion,nombreEspecie:response.nombre, ImagenGrupoEspecie:pajaro, temp:response.temp, idAvist: idAvist, idGrupoEspecie:4,latitude:response.latitude, longitude:response.longitude, flag:true});
        if(grupoEspecie==5) this.setState({localidad:response.localidad,descripcion:response.descripcion,nombreEspecie:response.nombre, ImagenGrupoEspecie:flor,  temp:response.temp, idAvist: idAvist, idGrupoEspecie:5,latitude:response.latitude, longitude:response.longitude, flag:true});
        if(grupoEspecie==6) this.setState({localidad:response.localidad,descripcion:response.descripcion,nombreEspecie:response.nombre, ImagenGrupoEspecie:caracol,  temp:response.temp, idAvist: idAvist, idGrupoEspecie:6,latitude:response.latitude, longitude:response.longitude, flag:true});
        if(grupoEspecie==7) this.setState({localidad:response.localidad,descripcion:response.descripcion,nombreEspecie:response.nombre, ImagenGrupoEspecie:cucaracha,  temp:response.temp, idAvist: idAvist, idGrupoEspecie:7,latitude:response.latitude, longitude:response.longitude, flag:true});
        if(grupoEspecie==8) this.setState({localidad:response.localidad,descripcion:response.descripcion,nombreEspecie:response.nombre, ImagenGrupoEspecie:pez,  temp:response.temp, idAvist: idAvist, idGrupoEspecie:8,latitude:response.latitude, longitude:response.longitude, flag:true});
       // this.fetchUser(response.foto,response.idUsuario,idAvist, email);
        var datas = { id: response.idUsuario}
        var foto = response.foto;
        fetch(url_API+'getuser/id', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
              body:  JSON.stringify(datas)
          })
          .then(function(response) {
              if (response.status >= 400) {
                throw new Error("Bad response from server");
              }
              return response.json();
          }).then(response=> {
            if(this.props.flag){
              this.props.isGoBackOff();
            }
            var  urlAvist= uri_foto+response.message.email + '/' + foto;
            var  urlUser= uri_foto+response.message.email + '/' + response.message.email + '.jpg?'+ Math.random();
            let source = { uri: urlAvist ,
              type: 'image/jpeg', 
              name: foto};
            if(email==response.message.email)
              this.setState({ nombreUser:response.message.nombre, isOwner:true, ImageSource:source, fotoPerfil:urlUser, email:email, idUsuario:datas.id, listRefreshing:false, fotoOld:foto, loading:false});
            else
            this.setState({ nombreUser:response.message.nombre, isOwner:false, ImageSource:source, fotoPerfil:urlUser, email:email, idUsuario:datas.id, listRefreshing:false, fotoOld:foto, loading:false });
          })

      })
  }
  guardar = () => {   
    const navigateAction = NavigationActions.reset({
      index: 0,
      key: null,
      //params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, especie: this.state.especie },
      actions: [NavigationActions.navigate({ routeName: 'Mapa' })],
    })
    this.props.navigation.dispatch(navigateAction);
  }
  componentWillReceiveProps(newProps) {
    if(this.props.flag && !this.state.flag){
      console.log("props_flag", this.state.flag);
      this.props.isGoBackOff();
      this.fetchUser();
    }
   // console.log("props2: ", this.props.flag, this.state.flag );
  }
  componentDidMount() {
    const {idAvist} = this.props.navigation.state.params;
    const {email} = this.props.navigation.state.params;
    const {fromDrawBar} = this.props.navigation.state.params;
    const {verificado} = this.props.navigation.state.params;
    var veri=false;
    if(verificado=='no') veri=false;
    else veri=true;
    var data = {id:idAvist, email:email }
    fetch(url_API+'avistamiento/getamenazas', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
          body:  JSON.stringify(data)
      })
      .then(function(response) {
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response.json();
      }).then(response=> {
        console.log(response);
        var amenazaObject =[] ;
        var sueloObject = [];
        for (var i = 0, len = response.amenaza.length; i < len; i++){
          amenazaObject.push(ENTRIES1[response.amenaza[i].idAmenaza]);
        }
        for (var i = 0, len = response.suelo.length; i < len; i++){
          sueloObject.push(ENTRIES2[response.suelo[i].idAmenaza]);
        }
        var localLocale = moment(response.fecha,"DD/MM/YYYY");
        moment.updateLocale('es', esMoment );
        localLocale.locale(false);
        var _today  = localLocale.format("LL");
        this.setState({amenaza:amenazaObject, suelo:sueloObject, fecha_avist:_today, nombreCient:response.nombreCient });
        var grupoEspecie = response.idGrupoEspecie;
        if(grupoEspecie==1) this.setState({localidad:response.localidad,descripcion:response.descripcion,nombreEspecie:response.nombre, ImagenGrupoEspecie:hongo, temp:response.temp, idAvist: idAvist, idGrupoEspecie:1,latitude:response.latitude, longitude:response.longitude, fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked});
        if(grupoEspecie==2) this.setState({localidad:response.localidad,descripcion:response.descripcion,nombreEspecie:response.nombre, ImagenGrupoEspecie:rana, temp:response.temp, idAvist: idAvist, idGrupoEspecie:2,latitude:response.latitude, longitude:response.longitude, fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked});
        if(grupoEspecie==3) this.setState({localidad:response.localidad,descripcion:response.descripcion,nombreEspecie:response.nombre, ImagenGrupoEspecie:llama,  temp:response.temp, idAvist: idAvist, idGrupoEspecie:3,latitude:response.latitude, longitude:response.longitude, fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked});
        if(grupoEspecie==4) this.setState({localidad:response.localidad,descripcion:response.descripcion,nombreEspecie:response.nombre, ImagenGrupoEspecie:pajaro, temp:response.temp, idAvist: idAvist, idGrupoEspecie:4,latitude:response.latitude, longitude:response.longitude, fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked});
        if(grupoEspecie==5) this.setState({localidad:response.localidad,descripcion:response.descripcion,nombreEspecie:response.nombre, ImagenGrupoEspecie:flor,  temp:response.temp, idAvist: idAvist, idGrupoEspecie:5,latitude:response.latitude, longitude:response.longitude, fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked});
        if(grupoEspecie==6) this.setState({localidad:response.localidad,descripcion:response.descripcion,nombreEspecie:response.nombre, ImagenGrupoEspecie:caracol,  temp:response.temp, idAvist: idAvist, idGrupoEspecie:6,latitude:response.latitude, longitude:response.longitude, fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked});
        if(grupoEspecie==7) this.setState({localidad:response.localidad,descripcion:response.descripcion,nombreEspecie:response.nombre, ImagenGrupoEspecie:cucaracha,  temp:response.temp, idAvist: idAvist, idGrupoEspecie:7,latitude:response.latitude, longitude:response.longitude, fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked});
        if(grupoEspecie==8) this.setState({localidad:response.localidad,descripcion:response.descripcion,nombreEspecie:response.nombre, ImagenGrupoEspecie:pez,  temp:response.temp, idAvist: idAvist, idGrupoEspecie:8,latitude:response.latitude, longitude:response.longitude, fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked});
       // this.fetchUser(response.foto,response.idUsuario,idAvist, email);
        var datas = { id: response.idUsuario}
        var foto = response.foto;
        fetch(url_API+'getuser/id', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
              body:  JSON.stringify(datas)
          })
          .then(function(response) {
              if (response.status >= 400) {
                throw new Error("Bad response from server");
              }
              return response.json();
          }).then(response=> {
            if(this.props.flag){
              this.props.isGoBackOff();
            }
            var  urlAvist= uri_foto+response.message.email + '/' + foto;
            var  urlUser= uri_foto+response.message.email + '/' + response.message.email + '.jpg?'+ Math.random();
            let source = { uri: urlAvist ,
              type: 'image/jpeg', 
              name: foto};
            if(email==response.message.email)
              this.setState({ nombreUser:response.message.nombre, isOwner:true, ImageSource:source, fotoPerfil:urlUser, idUsuario:datas.id, email: email, verificado:veri, fotoOld:foto});
            else
            this.setState({ nombreUser:response.message.nombre, isOwner:false, ImageSource:source, fotoPerfil:urlUser, idUsuario:datas.id, email:email, verificado:veri, fotoOld:foto});
            this.getComentarios();  
            /* fetch('http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/api/avistamiento/getlikes', {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
                  body:  JSON.stringify(data)
              })
              .then(function(response) {
                  if (response.status >= 400) {
                    throw new Error("Bad response from server");
                  }
                  return response.json();
              }).then(response=> {
                  console.log("response like: ", response);
                  this.setState({likes: response.message});
              })*/
          })
      })
  }
  getComentarios = () => {
    const {idAvist} = this.props.navigation.state.params;
    var data = {id: idAvist, categoria:'A'};
    fetch(url_API+'comentario/list', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
          body:  JSON.stringify(data)
      })
      .then(function(response) {
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response.json();
      }).then(response=> {
        if(response.message!=0) {
        var coment = response.message;
        for (var i = 0, len = coment.length ; i < len; i++) {
          var date = moment(coment[i].fecha_creac).utc().format('DD-MM-YYYY HH:mm');
          var date_sub  = moment(date,'DD-MM-YYYY HH:mm').subtract(4, "hours");
          coment[i].fecha_creac = date_sub.format('DD-MM-YYYY HH:mm');
        }
       // console.log("comentarios ", coment);
        this.setState({comentarios:coment});}
      })
  }
  insertComentario = () => {
    var {comentarios, nombreUser, email, idAvist, ingresarComentario} = this.state;
    this.setState({loadingComent:true});
    var data = {email:email ,idPost:idAvist, descripcion:ingresarComentario, categoria:'A'} 
    var index = 0;
    fetch(url_API+'comentario/insertcomentario', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
          body:  JSON.stringify(data)
      })
      .then(function(response) {
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response.json();
      }).then(response=> {
          console.log("response like: ", response);
          index = response.result.insertId;
          console.log("index ", comentarios.length);
          //comentariosUntouched.push({id:index,idUsuario:idUsuario, nombre:nombreUser, email:email, idPost:idProyecto, descripcion: ingresarComentario  });
          var date = moment().format('DD-MM-YYYY HH:mm');
          if( comentarios.length==0){
            comentarios.push({id:index,idUsuario:response.id, nombre:response.nombreUser, email:email, idPost:idAvist, descripcion: ingresarComentario, fecha_creac:date  });
          }
          else{
          comentarios.unshift({id:index,idUsuario:response.id, nombre:response.nombreUser, email:email, idPost:idAvist, descripcion: ingresarComentario,  fecha_creac:date   });
          }
          this.setState({comentarios:comentarios,  loadingComent:false});
      })
    //var index = (Math.floor(Math.random()*99999999)+10000000);
    
  }
  removeComentario = (id) => {
    var comentarios_copy = this.state.comentarios;
   // var comentariosUntouched_copy = this.state.comentariosUntouched;
    var data = {id:id}
    this.setState({loadingComent:true});
    fetch(url_API+'comentario/deletecomentario', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
          body:  JSON.stringify(data)
      })
      .then(function(response) {
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response.json();
      }).then(response=> {
          console.log("response delete like: ", response);
          var index = comentarios_copy.findIndex(function(el){
            return el.id == id;
          });
          //var index2 = comentariosUntouched_copy.findIndex(function(ell){
          //  return ell.id == id;
         // });
          var comentarios_copyCopy = comentarios_copy.splice(index,1);
          //var comentariosUntouched_copyCopy = comentariosUntouched_copy.splice(index2,1);
          this.setState({comentarios:comentarios_copy, loadingComent:false});
      })
  }
  edit = (navegar, values, id) => {
    this.setState({flag:false});
    const navigateAction = NavigationActions.navigate({
      routeName: navegar,
      params: {values: values, id:id,keyAvist:this.props.navigation.state.key, fromDrawBar:this.state.fromDrawBar, email:this.state.email, modulo:"avistamiento"},
      //params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, especie: this.state.especie },
      actions: [NavigationActions.navigate({ routeName: navegar })],
      //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
    })
    this.props.navigation.dispatch(navigateAction);
  }
  MeGusta = () =>{
    var likes_temp=0;
    var like_url="likes/";
    if(this.state.liked){ 
      likes_temp=-1;
      like_url=like_url+"deletelike";
    }
    else{
      like_url=like_url+"insertLike";  
      likes_temp=1;
    }
    this.setState({likes:this.state.likes+likes_temp, liked: !this.state.liked});
    var data={email: this.state.email, idPost:this.state.idAvist, categoria:'A'};
    fetch(url_API+like_url, {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
                  body:  JSON.stringify(data)
              })
              .then(function(response) {
                  if (response.status >= 400) {
                    throw new Error("Bad response from server");
                  }
                  return response.json();
              }).then(response=> {
                  console.log("response like: ", response);
              })
  }
  navegar = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "Mapa",
      //params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, especie: this.state.especie },
      actions: [NavigationActions.navigate({ routeName: 'Mapa' })],
      //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
    })
    this.props.navigation.dispatch(navigateAction);
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
      const {correo} = this.props.navigation.state.params;
      if (response.didCancel) {
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        this.setState({loading:true});
        let source = { uri: response.uri,
          type: 'image/jpeg',
          name: this.state.email + '.a.'+ (Math.floor(Math.random()*99999999)+10000000) + '.jpg' }; 
        const formData = new FormData();
        formData.append('foto', source.name);
        formData.append('fotoOld', this.state.ImageSource.name);
        formData.append('id', this.state.idAvist);
        formData.append('image', source);
        fetch(url_API+ 'avistamiento/editfoto', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
         })
        .then(function(response) {
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response.json();
        }).then(response=>{
              if(response.success!=true){
                Alert.alert("Hubo un problema actualizando la foto")
              }
              this.fetchUser();
            })
        this.setState({ 
            fotoOld:source.name
        });
        
      }
    })
  }
  render() {
    const { props: { name, index, list } } = this;
    const { navigate } = this.props.navigation;
    const {idGrupoEspecie, descripcion, localidad, nombreCient, amenaza, suelo, temp, pressAme,pressGrupo,pressSuelo, fecha_avist} = this.state;
    const nombreGrupo = nombreGrupos[idGrupoEspecie-1];
   // console.log(this.state.nombreEspecie);
    const color =  colores[idGrupoEspecie-1];    
    return (
      <Container style={styles.container}>
      {/*(this.props.flag) && this.fetchUser()*/}
        <Header  style={styles.header}>
          <Left style={{flex:1}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="ios-arrow-back" style= {{color: '#8c8c8c'}} />
            </Button>
          </Left>
          <Body style={{flex:4,  justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
            <Title style={{color: '#4A4A4A', fontSize: 17}}>{this.state.nombreEspecie}</Title>
            <TouchableOpacity onPress={() => this.edit("EditEspecie", {idGrupoEspecie: this.state.idGrupoEspecie, ImageSource: this.state.ImageSource.uri}, this.state.idAvist ) } >{(this.state.verificado)&&
              <Image source={{uri:uri+"/pencil.png"}} style={{width:viewportWidth*.065, height:viewportWidth*.065}}  />}
            </TouchableOpacity>
          </Body>

          <Right style={{flex:1}}>
                <Button transparent onPress={this.guardar}>
                    <Image source={{uri:uri+"/neguen.png"}} style={{width:15, height:23.2}}  /></Button>
            </Right>
        </Header>

        <ScrollView style={{flex:1}} 
          refreshControl={
            <RefreshControl
                onRefresh={() => this._refreshing()}
                refreshing={this.state.listRefreshing}
            />
        }
        >
          <View style={{justifyContent:'center', alignItems: 'center', marginTop:0}}>
            <View style={{marginTop:0, marginBottom:10}}>
              <TouchableOpacity disabled={!this.state.isOwner} onPress={this.selectPhotoTapped.bind(this)}>{this.state.loading ?
                <ActivityIndicator size="large"/> :
               <Image source={ this.state.ImageSource} style={styles.imagenAvist} ></Image>}
              </TouchableOpacity>  
            </View>
        </View>
        <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}  >
          <View style={styles.matrizTexto}>
            <Image style={{height:50, width:50,borderRadius: 80, marginLeft:1, marginRight:10, borderColor:'#DEDA3E', borderWidth:2,
                  resizeMode: 'cover'}} source={{uri: this.state.fotoPerfil}}></Image>
            <View style={{flexDirection:'column'}}>
              <Text style={{fontSize:viewportWidth*.035,fontWeight:'bold', color:'#4A4A4A', marginTop:10}}>{this.state.nombreUser}   </Text>
              <Text style={{fontSize:viewportWidth*.032, color:'#4A4A4A', marginTop:5}}>{localidad}</Text>
            </View>
          </View>
          <View style={{ flexDirection:'column', marginTop:14, justifyContent:'center'}}>
            <TouchableOpacity onPress={() => this.MeGusta()} activeOpacity={1} disabled={!this.state.verificado} >
              {(this.state.liked)?
              <Image source={{uri: liked}} style={{height:viewportWidth*.066, width:viewportWidth*.066, marginLeft:15 }}></Image>:
              <Image source={{uri: like}} style={{height:viewportWidth*.066, width:viewportWidth*.066, marginLeft:15 }}></Image>}
            </TouchableOpacity>
            <Text style={{fontSize:viewportWidth*.032, color:'#4A4A4A', marginTop:3, marginRight:12}}>{this.state.likes} me gusta</Text>    
          </View>
        </View>
        {(!this.state.PressInfo) ?
        <View style={styles.matriz}>
            <TouchableOpacity onPress={ ()=> this.edit("Editubica", {longitude: this.state.longitude, latitude:this.state.latitude} , this.state.idAvist)} disabled={!this.state.isOwner} >
              <Image source={{uri: uri+"/customMarker2.png"}} style={{marginLeft:12, width:22, height:25.6}} /> 
            </TouchableOpacity>
            <Text style={{fontSize:viewportWidth*.032, color:'#4A4A4A', marginTop:5}}>{fecha_avist}</Text>
            <View style={{height:viewportHeight*.051, width:viewportHeight*.058}}>
              <View style={{position:'absolute', bottom:0, right:0, height:viewportHeight*.032, width:viewportHeight*.032,
                    borderRadius:(18)/2, borderWidth:0, borderColor:'#FA511D', backgroundColor:'#FA511D',
                    zIndex:9 }}>
                    <Text style={{color:'white', textAlign:'center', marginBottom:5, marginLeft:3, fontSize:14}}>{amenaza.length} </Text>
              </View>
              <Image source={ {uri:uri+'/advertencia.png'}} style={{zIndex:-1, marginTop:0, marginLeft:0, height:viewportHeight*.041, width:viewportHeight*.047}}></Image>
            </View>
              <View style={{height:viewportHeight*.051, width:viewportHeight*.058}}>
              <View style={{position:'absolute', bottom:0, right:0, height:viewportHeight*.032, width:viewportHeight*.032,
                    borderRadius:(18)/2, borderWidth:0, borderColor:'#FA511D', backgroundColor:'#FA511D',
                    zIndex:9 }}>
                    <Text style={{color:'white', textAlign:'center', marginBottom:5, marginLeft:3, fontSize:14}}>{suelo.length} </Text>
              </View>
              <Image source={ {uri:uri+'/huella.png'}} style={{zIndex:-1, marginTop:0, marginLeft:0, height:viewportHeight*.041, width:viewportHeight*.047}}></Image>
              </View>
              <Text style={{fontSize:viewportWidth*.06, color:'#FA511D', marginTop:5}}>{temp}°</Text>     
            <TouchableOpacity onPress={ ()=> this.setState({PressInfo: !this.state.PressInfo}) } style={{height:28,width:20}} >
                <Icon name="ios-arrow-back" style= {{color: '#808080', transform: [{ rotate: '270deg'}]}}size={37} />
            </TouchableOpacity>
        </View>
        :
        <View style={{flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row',  marginTop:15,  paddingRight:25, borderBottomWidth: 1.6,borderBottomColor:color }}>
            <View style={{flexDirection:'row'}}>
            <TouchableOpacity onPress={ ()=> this.setState({pressGrupo:true, pressAme:false, pressSuelo:false})} style={pressGrupo ? {paddingLeft:20, borderBottomWidth: 3.5,borderBottomColor: color} : {paddingLeft:20} } >
              <Image source={{uri: this.state.ImagenGrupoEspecie}} style={{ height:45, width:45, marginRight:15}}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={ ()=> this.setState({pressAme:true, pressGrupo:false, pressSuelo:false})} style={pressAme ? {paddingLeft:10, borderBottomWidth: 3.5,borderBottomColor: color} :{paddingLeft:10}} >
              <Image source={ {uri:uri+'/advertencia.png'}} style={{marginTop:9, height:viewportHeight*.044, width:viewportHeight*.05, marginHorizontal:15}}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={ ()=> this.setState({pressAme:false, pressGrupo:false, pressSuelo:true})} style={pressSuelo ? {paddingLeft:10, borderBottomWidth: 3.5,borderBottomColor: color} :{paddingLeft:10}} >
            <Image source={ {uri:uri+'/huella.png'}} style={{marginTop:9, height:viewportHeight*.044, width:viewportHeight*.05, marginHorizontal:15}}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.edit("Mapear", {temp: temp, amenaza: amenaza, suelo:suelo, comentario:descripcion}, this.state.idAvist ) } >{(this.state.verificado)&&
              <Image source={{uri:uri+"/pencil.png"}} style={{width:viewportWidth*.065, height:viewportWidth*.065}}  />}
            </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={ ()=> this.setState({PressInfo: !this.state.PressInfo}) } style={{height:28,width:20}} >
                  <Icon name="ios-arrow-back" style= {{color: '#808080', transform: [{ rotate: '90deg'}]}}size={37} />
            </TouchableOpacity>
        </View>
        }
        {(pressGrupo && this.state.PressInfo) &&
          <View style={{borderBottomWidth:1,  borderBottomColor:'#BEBEBE'}}>
            <View style={{flexDirection:'row', paddingHorizontal:25, justifyContent:'space-between', borderBottomWidth:1,  borderBottomColor:'#BEBEBE' }}>
              <Text style={{ fontStyle:'italic', marginVertical:20,  fontSize:15}}>{nombreCient}</Text>
              <Text style={{ color:color , marginVertical:20,  fontSize:15}}>{nombreGrupo}</Text>
            </View>
              <Text style={{color:'#BEBEBE' , marginVertical:20, marginLeft:20, fontSize:15}}>{this.state.descripcion}</Text>
          </View>
        }
        {(pressAme && this.state.PressInfo) &&
          <View>
              <Text style={{ color:'#787878' , marginVertical:10, marginLeft:20,  fontSize:14}}>Intervenciones antrópicas/amenazas</Text>
              <FlatList
                    contentContainerStyle={{flexDirection:'row',paddingBottom:10, flexWrap: 'wrap',borderBottomColor:'#BEBEBE', borderBottomWidth:1.6, paddingHorizontal:20}}
                    data={this.state.amenaza}
                    extraData={this.state.amenaza}
                    keyExtractor={item =>item.index }
                    horizontal={false}
                    ItemSeparatorComponent={ () => <View style={{margin: 0 }}/>}
                    renderItem={({item}) =>(
                      <TouchableOpacity onPress={() => this.edit("Amenaza", this.state.amenaza,this.state.idAvist)}disabled={!this.state.isOwner} >
                        <Image source={{uri:item.consulta}} style={{height:viewportWidth*.195, width:viewportWidth*.195,  marginHorizontal:4, marginBottom:4}}/>
                      </TouchableOpacity>
                    )}
                />
          </View>
        }
        {(pressSuelo && this.state.PressInfo) &&
          <View>
            <Text style={{ color:'#787878' , marginVertical:10,paddingBottom:10, marginLeft:20,  fontSize:14}}>Tipos de suelo del registro</Text>
              <FlatList
                  contentContainerStyle={{flexDirection:'row',paddingBottom:10, flexWrap: 'wrap', borderBottomColor:'#BEBEBE', borderBottomWidth:1.6, paddingHorizontal:20}}
                  data={this.state.suelo}
                  extraData={this.state.suelo}
                  keyExtractor={item =>item.index }
                  horizontal={false}
                  ItemSeparatorComponent={ () => <View style={{margin: 0}}/>}
                  renderItem={({item}) =>(
                    <TouchableOpacity onPress={() => this.edit("Suelo", this.state.suelo,this.state.idAvist)}disabled={!this.state.isOwner} >
                      <Image source={{uri:item.consulta}} style={{height:viewportWidth*.195, width:viewportWidth*.195,  marginRight:10, marginBottom:4}}/>
                    </TouchableOpacity>
                  )}
              />
          </View>
        }

       {!this.state.PressInfo &&
        <View style={{flex:1, marginTop:15, flexDirection:"row", justifyContent: 'space-between', paddingHorizontal:20, borderBottomColor:'#DEDA3E', borderBottomWidth:1.6, borderTopColor:'#DEDA3E', borderTopWidth:1.6  }}>
              <TextInput underlineColorAndroid='#c4c4c4' style={{flex:1,fontSize:viewportWidth*.035,  marginVertical:10}}  enablesReturnKeyAutomatically={true}
                placeholder={"Comenta aquí"} placeholderTextColor="#DEDA3E" underlineColorAndroid='rgba(0,0,0,0)'
                value={this.state.ingresarComentario} onChangeText={ingresarComentario => this.setState({ingresarComentario})}>
              </TextInput>
             {this.state.ingresarComentario.length>0 &&  <TouchableOpacity onPress={() => this.insertComentario()} disabled={this.state.loadingComent} >{this.state.loadingComent ? <ActivityIndicator/> :
              <Image source={ {uri:uri+'/avioncito.png'}} style={{width:viewportWidth*.065, height:viewportWidth*.065, marginVertical:30}}></Image>}</TouchableOpacity>
        }</View>}
      {/*
          <View style={{flex: 1,flexDirection: 'column',padding:4, marginTop:15, marginLeft:0, marginRight:5}}  >
            
            <View style={{flex:1, flexDirection:'row', marginBottom:20, marginLeft:35}} >
              <Image source={{uri:temperatura}} style={{height:viewportHeight*0.071, width:viewportHeight*.044}}></Image>
              <View style={{flex:1, flexDirection: 'column', marginLeft:20}}>
                <Text style={{ color:'#4A4A4A'}}>Temperatura</Text>
                <View style={{flexDirection:'row', flex:1}}>
                  <Text style={{fontSize:viewportWidth*.049, fontWeight:'bold', color:'#4A4A4A'}}>{this.state.temp}°</Text>
                  <TouchableOpacity onPress={ ()=> this.edit("Edittemp", this.state.temp, this.state.idAvist)}disabled={!this.state.isOwner}>
                    {(this.state.isOwner) &&
                    <FontAwesome name={'pencil'}style= {{color: '#DEDA3E', marginLeft:10}} size={26}/>}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{flex:1, flexDirection:'row', marginBottom:20, marginLeft:25}} >
              <Image source={{uri:huella}} style={{width:viewportHeight*.078, height:viewportHeight*.071}}></Image>
              <View style={{flex:1, flexDirection: 'column', marginLeft:20}}>
                <Text style={{ color:'#4A4A4A'}}>Suelos</Text>
                <FlatList
                    data={this.state.suelo}
                    keyExtractor={item =>item.index }
                    horizontal={true}
                    ItemSeparatorComponent={ () => <View style={{margin: 0}}/>}
                    renderItem={({item}) =>(
                      <TouchableOpacity onPress={() => this.edit("Suelo", this.state.suelo,this.state.idAvist)}disabled={!this.state.isOwner} >
                        <Image source={{uri:item.illustration}} style={{height:70, width:49, borderRadius:10, marginRight:10}}/>
                      </TouchableOpacity>
                    )}
                />
              </View>
            </View>
            <View style={{flex:1, flexDirection:'row', marginBottom:5, marginLeft:25}} >
              <Image source={{uri:advertencia}} style={{height:viewportHeight*.0718, width:viewportHeight*.083} }></Image>
              <View style={{flex:1, flexDirection: 'column', marginLeft:20}}>
                <Text style={{ color:'#4A4A4A'}}>Amenazas</Text>
                <FlatList
                    data={this.state.amenaza}
                    extraData={this.state.amenaza}
                    keyExtractor={item =>item.index }
                    horizontal={true}
                    ItemSeparatorComponent={ () => <View style={{margin: 0}}/>}
                    renderItem={({item}) =>(
                      <TouchableOpacity onPress={() => this.edit("Amenaza", this.state.amenaza,this.state.idAvist)}disabled={!this.state.isOwner} >
                        <Image source={{uri:item.illustration}} style={{height:70, width:49, borderRadius:10, marginRight:10}}/>
                      </TouchableOpacity>
                    )}
                />
              </View>
            </View>
            <View style={{width:viewportWidth, height:1.1, backgroundColor: '#DEDA3E', marginLeft: 0, marginRight:0,borderRadius: 10,
        marginTop:20}} />
                  </View>*/}
        <View style={{flex:1, marginHorizontal:0}} >
           {this.loadingComent ? <ActivityIndicator size="large"/> :
              <List containerStyle={{marginTop:0, borderTopWidth: 0, borderBottomWidth: 0 }}>
             {this.state.comentarios.length!=0 && 
              <FlatList
                  data={this.state.comentarios}
                  extraData={this.state}
                  renderItem={({ item }) => (
                  <View style={{flex:1 ,flexDirection:'row'}}>
                     {/* <View style={{backgroundColor:"#787878", width:30, height:30, borderRadius:15}}/>*/}
                     
                      <Image source={{uri: uri_foto+item.email+"/"+item.email+".jpg"}} style={{width:viewportWidth*.11, height:viewportWidth*.11, borderRadius:viewportWidth*.06, marginTop:10, marginLeft:20, borderColor: color ,borderWidth:1.5}} />
                     <View style={{ flex:1, flexDirection:'column', borderRadius:15, marginLeft:10}}>                     
                       {item.email==this.state.email && <TouchableOpacity hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }} style={{zIndex:5, width:30, height:30, position:'absolute', top:8, right:8}} onPress={() => this.removeComentario(item.id)} disabled={this.state.loadingComent} >
                        <MaterialCommunityIcons name={'close'}style= {{color: '#4A4A4A', zIndex:-1}} size={20}/>
                        </TouchableOpacity>}
                        <Text style={{fontSize:viewportWidth*.039, color:color, marginTop:10, fontWeight:'bold', marginLeft:4}}>
                        {item.nombre}</Text>
                        <Text style={{fontSize:viewportWidth*.039, color:'#4A4A4A', marginTop:10, marginLeft:4, marginHorizontal:15}}>{item.descripcion}</Text>
                        <Text style={{fontSize:viewportWidth*.035, color:'#787878', marginBottom:20, marginLeft:viewportWidth-180}}>{item.fecha_creac}</Text>
                      </View>
                  </View>) }
                  keyExtractor={item => item.id}
                  ItemSeparatorComponent={ () =>  <View style={{height:1, width:viewportWidth, backgroundColor:'#BEBEBE' }} />}
                  ListHeaderComponent={this.renderHeader}
                  ListFooterComponent={ () => <View style={{width:viewportWidth, height:1.1, backgroundColor: '#ddd93d',borderRadius: 10,
                  marginTop:2}} /> }
                  //onRefresh={this.handleRefresh}
                  refreshing={this.state.refreshing}
                />}
            </List>}
            
        </View>
        </ScrollView>
      </Container>
    );
  }
}

  function bindActions(dispatch) {
    return {
      isGoBackOff: () => dispatch(isGoBackOff())
    };
  }
  const mapStateToProps = state => ({
    name: state.user.name,
    index: state.list.selectedIndex,
    list: state.list.list,
    flag: state.goback_reducer.flag
  });

export default connect(mapStateToProps, bindActions)(ConsultarAvist);



/*function mapDispatchToProps(dispatch) {
  return {
   // addToCounter: () => dispatch(addToCounter())
    isGoBackOff: () => dispatch(isGoBackOff())
  }
}
function mapStateToProps(state) {
  return {
    flag: state.flag
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsultarAvist)*/