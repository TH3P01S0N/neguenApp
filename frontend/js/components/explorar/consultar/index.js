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
  InputGroup,
  Thumbnail
} from "native-base";
import { Field, reduxForm } from "redux-form";
import {TextInput, FlatList,Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Dimensions, ActivityIndicator, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { isGoBack } from "../../../actions/goback_action";
import { isGoBackOff } from "../../../actions/goback_action_off";
import {url_API} from '../../../config';
var moment = require('moment');
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const uri_foto = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/uploads/";
const hongo  = uri + "/hongo.png";// require("../../../images/1-hongo.png");
const rana =  uri + "/rana.png"; 
const llama = uri + "/llama.png"; 
const pajaro = uri + "/pajaro.png"; 
const flor = uri + "/flor.png"; 
const caracol = uri + "/caracol.png"; 
const cucaracha = uri + "/cucaracha.png"; 
const pez = uri + "/pez.png"; 
const flor_trans = uri + "/flor_trans.png";
const like = uri + "/like.png";
const liked = uri + "/liked.png";

class ConsultarUser extends Component {
  constructor(props){
    super(props);
    this.state={
      fotoPerfil: null, nombreUser: "", loading:false,email_perfil:"", ifSeguido:false, tabBar:true,
      isOwner:false, PressInfo:false, flag:false,  fotoOld:"",loadingComent:false,
      fromDrawBar:false, email:"", liked: false, likes:0, idUsuario:0, verificado:false, comentarios:[],
      descripcion:"",   ingresarComentario:"", seguidos:0, seguidores:0, amenazasObject:[], region:{
        latitude: 0, longitude: 0, latitudeDelta: 0.005, longitudeDelta: 0.001
      }, markers:[]
    };
    this.fetchData = this.fetchData.bind(this);
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

  fetchData(str_aux){
    this.setState({loading:true});
    if(str_aux=="no")
    this.setState({flag:true});
    const {email_perfil} = this.props.navigation.state.params;
    const {idUsuario} = this.props.navigation.state.params; // usuario del perfil
    const {email} = this.props.navigation.state.params; //usuario q esta viendo
    const {fromDrawBar} = this.props.navigation.state.params;
    const {verificado} = this.props.navigation.state.params;
    var veri=false; 
    if(verificado=='no') veri=false;
    else veri=true;
    var data = {id:idUsuario, email:email }
    fetch(url_API+'users/public_perfil', {
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
            if(this.props.flag){
              this.props.isGoBackOff();
            }
            var _ifSeguido=false;
            var ifSeguido = response.message.ifSeguido;
            var seguidores=response.message.seguidores;
            var seguidos=response.message.seguidos;
            if(!seguidores) seguidores=0;
            if(!seguidos) seguidos=0;
            if(ifSeguido>0)
              _ifSeguido=true;
            var  urlUser= uri_foto+email_perfil + '/' + email_perfil + '.jpg';
            console.log("consultar perfil: ", response.message);
            if(email==email_perfil)
              this.setState({seguidores:seguidores, seguidos:seguidos, nombreUser:response.message.nombre, isOwner:true, descripcion:response.message.descripcion, fotoPerfil:urlUser,email_perfil:email_perfil,  email: email, verificado:veri, idUsuario:idUsuario, ifSeguido:_ifSeguido, loading:false});
            else
            this.setState({seguidores:seguidores, seguidos:seguidos, nombreUser:response.message.nombre, isOwner:false,descripcion:response.message.descripcion, fotoPerfil:urlUser, email_perfil:email_perfil,  email:email, verificado:veri, idUsuario:idUsuario,ifSeguido:_ifSeguido, loading:false});
          })

  }
  componentWillReceiveProps(newProps) {
    if(this.props.flag && !this.state.flag){
      console.log("props_flag", this.state.flag);
      this.props.isGoBackOff();
      this.fetchData("no");
    }
   // console.log("props2: ", this.props.flag, this.state.flag );
  }
  getAvistamiento(){
    const {email_perfil} = this.props.navigation.state.params;
      var datas = {email: email_perfil}
    fetch(url_API +'avistamiento/misamenazas', {
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
          var markers = [];
             var data = null;
             for(var i=0; i<response.length; i++){
               data={
                 id:response[i].id, localidad:response[i].localidad,
                  coords:{latitude: response[i].latitude, longitude: response[i].longitude}
               }
               markers.push(data);
             }
          this.setState({ amenazasObject:response, markers:markers});
        })
        Geolocation.getCurrentPosition(
          (cords) => {
            //const {latitude, longitude} = coords
            this.setState({
              position: {
                latitude: cords.coords.latitude,
                longitude: cords.coords.longitude,
              },
              region: {
                latitude: cords.coords.latitude,
                longitude: cords.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.001,
              }
            })
          },
          (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
  }
  componentDidMount() {
    this.fetchData("mount")
    this.getAvistamiento();
   // this.getComentarios();
  }

  getComentarios = () => {
    const {idEspecie} = this.props.navigation.state.params;
    var data = {id: idEspecie, categoria:'E'};
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
        console.log("comentarios ", coment);
        this.setState({comentarios:coment});}
      })
  }
  insertComentario = () => {
    var {comentarios, idUsuario, nombreUser, email, idEspecie, ingresarComentario} = this.state;
    this.setState({loadingComent:true});
    var data = {idUsuario:idUsuario ,idPost:idEspecie, descripcion:ingresarComentario, categoria:'E'} 
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
          index = response.insertId;
          console.log("index ", comentarios.length);
          //comentariosUntouched.push({id:index,idUsuario:idUsuario, nombre:nombreUser, email:email, idPost:idProyecto, descripcion: ingresarComentario  });
          var date = moment().format('DD-MM-YYYY HH:mm');
          if( comentarios.length==0){
            comentarios.push({id:index,idUsuario:idUsuario, nombre:nombreUser, email:email, idPost:idEspecie, descripcion: ingresarComentario, fecha_creac:date  });
          }
          else{
          comentarios.unshift({id:index,idUsuario:idUsuario, nombre:nombreUser, email:email, idPost:idEspecie, descripcion: ingresarComentario,  fecha_creac:date   });
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
    var data={email: this.state.email, idPost:this.state.idEspecie, categoria:'E'};
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
  Follow = () =>{
    var seguir_temp=0;
    var seguir_url="seguir/";
    if(this.state.ifSeguido){ 
      seguir_temp=-1;
      seguir_url=seguir_url+"unfollow";
    }
    else{
      seguir_url=seguir_url+"follow";  
      seguir_temp=1;
    }
    this.setState({seguidores:this.state.seguidores+seguir_temp, ifSeguido: !this.state.ifSeguido});
    var data={email: this.state.email, idUsuarioSeg:this.state.idUsuario};
    fetch(url_API+seguir_url, {
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
                  console.log("response seguir: ", response);
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
  consultarAvist(idAvist) {
    const {verificado} = this.props.navigation.state.params;
    const navigateAction = NavigationActions.navigate({
      routeName: "ConsultarAvist",
      params: {idAvist:idAvist, email: this.state.email, fromDrawBar:false, verificado:verificado },
      actions: [NavigationActions.navigate({ routeName: "ConsultarAvist" })],
      //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
    })
    this.props.navigation.dispatch(navigateAction);

  }
  render() {
    const { props: { name, index, list } } = this;
    const { navigate } = this.props.navigation;
    const {nombreUser, fotoPerfil, descripcion, email_perfil, loading, ifSeguido, seguidos, seguidores} = this.state;
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
            <Title style={{color: '#4A4A4A', fontSize: 17}}>{nombreUser}</Title>
          </Body>
        </Header>

        <ScrollView style={{flex:1}}>
            <View style={{flexDirection:'row', marginTop:10, marginBottom:10, flex:1}}>
              {this.state.loading ? <ActivityIndicator /> :
                  <Image source={{uri:fotoPerfil}} style={styles.imagenEspecie} ></Image>}

               <View style={{flexDirection:'column', marginLeft:20, marginVertical:20 }}>
                  <Title style={{color: '#4A4A4A', fontSize: 17}}>{this.state.amenazasObject.length}</Title>
                  <Title style={{color: '#4A4A4A', fontSize: 11, marginTop:10}}>Registros</Title>
               </View>
               <View style={{flexDirection:'column', marginLeft:20, marginVertical:20  }}>
                  <Title style={{color: '#4A4A4A', fontSize: 17}}>{seguidores}</Title>
                  <Title style={{color: '#4A4A4A', fontSize: 11, marginTop:10}}>Seguidores</Title>
               </View>
               <View style={{flexDirection:'column', marginLeft:20, marginVertical:20  }}>
                  <Title style={{color: '#4A4A4A', fontSize: 17}}>{seguidos}</Title>
                  <Title style={{color: '#4A4A4A', fontSize: 11, marginTop:10}}>Seguidos</Title>
               </View>
            </View>
       
          <View style={{width:viewportWidth, height:1.2, backgroundColor: '#c6c6c6',borderRadius: 10,
            marginTop:20}} />
          <View style={{flexDirection:'row', justifyContent:'space-between', marginVertical:10, marginHorizontal:20, flex:1}}>
            <Text style={{fontSize:viewportWidth*.032, color:'#4A4A4A', marginTop:5}}>{descripcion}</Text>
            {!this.state.isOwner &&
            <TouchableOpacity onPress={() => this.Follow() } 
                style={[ifSeguido ?  styles.botonAgregar : styles.botonEliminar]}>
              <Text style={{fontSize:viewportWidth*.032}}>{ifSeguido ? "Seguido" : "Seguir"}</Text>
            </TouchableOpacity>}
          </View>
          <View style={{width:viewportWidth, height:1.2, backgroundColor: '#c6c6c6',borderRadius: 10,
            marginTop:20}} />  

          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginVertical:0,  flex:1}} >
              <TouchableOpacity onPress={()=> this.setState({tabBar: true})} style={[this.state.tabBar ? {width:viewportWidth/2, alignItems:'center', borderBottomColor:'#ddd93d', borderBottomWidth:4} : {width:viewportWidth/2, alignItems:'center', borderBottomColor:'#ddd93d', borderBottomWidth:1}]}>
              <FontAwesome name={"image"} size={25} style= {[this.state.tabBar ? {color: '#ddd93d',marginVertical:20} : {color:'#b2b2b2', marginVertical:20,} ]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> this.setState({tabBar: false})} style={[this.state.tabBar ? {width:viewportWidth/2, alignItems:'center', borderBottomColor:'#ddd93d', borderBottomWidth:1} : {width:viewportWidth/2, alignItems:'center', borderBottomColor:'#ddd93d', borderBottomWidth:4} ]}>
              <FontAwesome name={"map-o"} size={25} style= {[this.state.tabBar ? {color: '#b2b2b2',marginVertical:20} : {color:'#ddd93d', marginVertical:20,} ]} />
              </TouchableOpacity>
          </View>
          {(this.state.tabBar) ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <FlatList
                 data={this.state.amenazasObject}
                  extraData={this.state}
                  renderItem={({item}) => 
                    <View style={{flex:1, flexDirection: 'column', marginVertical: 10}}>
                      <TouchableOpacity onPress={()=> this.consultarAvist(item.id)}>
                        <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', marginHorizontal:20}}>
                          <Text style={{color: '#ddd93d', fontSize: 17}} numberOfLines={1}>{item.nombre}
                          </Text>
                          <View style={{ flexDirection:'column'}}>
                              <Image source={{uri: uri+"/customMarker2.png"}} style={{marginLeft:20, width:27, height:30.9}} />
                              <Text style={{color: '#787878', fontSize: 17}} numberOfLines={1}>{item.localidad}</Text>
                          </View>
                        </View>
                        <Image style={{width: viewportWidth, height: viewportHeight*0.4,justifyContent: 'center',alignItems: 'center'}} source={{uri: uri_foto+email_perfil+"/" +item.foto}}></Image> 
                      </TouchableOpacity>
                    </View> 
                  }
                  numColumns = {1}
                  keyExtractor={(item) => item.id}
                /> 
            </View>:
            <MapView
              style={{flex:1, zIndex:-1, height: viewportHeight-10, width:viewportWidth-10 }}
              region={this.state.region}
              showsUserLocation={true}
              showsMyLocationButton={true}
              showsCompass={true}
              >
              {this.state.markers.map(marker => (
               <MapView.Marker 
                 key={marker.id}
                 coordinate={marker.coords}
                 onPress={()=> this.consultarAvist(marker.id)}
                 //title={marker.title}
               />
             ))}
            </MapView>
          }

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

export default connect(mapStateToProps, bindActions)(ConsultarUser);

