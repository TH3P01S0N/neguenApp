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
var moment = require('moment');
import ImagePicker from 'react-native-image-picker';
import { SearchBar, List, ListItem, colors } from 'react-native-elements';
import {TextInput, Image, FlatList, TouchableOpacity, ScrollView, KeyboardAvoidingView, Dimensions, ActivityIndicator, RefreshControl} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, {PROVIDER_GOOGLE, Polygon}  from 'react-native-maps';
import {customStyle} from "../../registros/StyleMap";
import { isGoBack } from "../../../actions/goback_action";
import { isGoBackOff } from "../../../actions/goback_action_off";
import {url_API} from '../../../config';
var moment = require('moment');
var esMoment = require('moment/locale/es.js');
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const uri_foto = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/uploads/";
const hongo  = uri + "/proyecto/hongo.png";// require("../../../images/1-hongo.png");
const rana =  uri + "/proyecto/rana.png"; 
const llama = uri + "/proyecto/llama.png"; 
const pajaro = uri + "/proyecto/pajaro.png"; 
const flor = uri + "/proyecto/flor.png"; 
const caracol = uri + "/proyecto/caracol.png"; 
const cucaracha = uri + "/proyecto/cucaracha.png"; 
const pez = uri + "/proyecto/pez.png"; 
const like = uri + "/like.png";
const liked = uri + "/liked.png";
const LATITUDE = -33.4858; //-33.489021;//-33.4858;
const LONGITUDE = -70.6414;//-70.654514;//-70.6414;
const LATITUDE_DELTA = 0.3;//0.0018079999999969232;// 0.3;
const LONGITUDE_DELTA =LATITUDE_DELTA; //0.0015179999999901383;// LATITUDE_DELTA ;
const colores = [  '#86C290', '#B4922B', '#BE742E', '#4DC0DE','#9EAA36' , '#007090', '#816A27', '#0093BF'];
var grupoEspecie_ = ["/hongo5.png", "/rana5.png","/llama5.png", "/flor5.png","/caracol5.png","/cucaracha5.png","/pez5.png"];

function getRegionForCoordinates(points) {
  // points should be an array of { latitude: X, longitude: Y }
  let minX, maxX, minY, maxY;

  // init first point
  ((point) => {
    minX = point.latitude;
    maxX = point.latitude;
    minY = point.longitude;
    maxY = point.longitude;
  })(points[0]);

  // calculate rect
  points.map((point) => {
    minX = Math.min(minX, point.latitude);
    maxX = Math.max(maxX, point.latitude);
    minY = Math.min(minY, point.longitude);
    maxY = Math.max(maxY, point.longitude);
  });

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const deltaX = (maxX - minX);
  const deltaY = (maxY - minY);

  return {
    latitude: midX,
    longitude: midY,
    latitudeDelta: deltaX,
    longitudeDelta: deltaY
  };
}
class ConsultarProyecto extends Component {
  constructor(props){
    super(props);
    this.state={
      nombre:"",  grupoEspecie: [], pregunta: "", idProyecto:0, objetivos:"", especies:[], comentarios:[],
      ubicacion:[], isOwner:false, PressInfo:false, usuarios:[], flag:false, ingresarComentario:"", nombreUser:"",
      fromDrawBar:false, email:"", liked: false, likes:0, idUsuario:0, verificado:false, listRefreshing:false,
      loadingComent:false, comentariosUntouched: [], loading:false, pressEquipo:false, pressFichero:false,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }, email_duenio:""
    };
    this.fetchUser = this.fetchUser.bind(this);
    this.grupoEspecieInclude = this.grupoEspecieInclude.bind(this);
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
  guardar = () => {   
    const navigateAction = NavigationActions.reset({
      index: 0,
      key: null,
      //params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, especie: this.state.especie },
      actions: [NavigationActions.navigate({ routeName: 'Mapa' })],
    })
    this.props.navigation.dispatch(navigateAction);
  }
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
    const {idProyecto} = this.props.navigation.state.params;
    const {email} = this.props.navigation.state.params;
    const {fromDrawBar} = this.props.navigation.state.params;
    const {verificado, cantEquipo} = this.props.navigation.state.params;
    var veri=false;
    if(verificado=='no') veri=false;
    else veri=true;
    var data = {id:idProyecto, email:email }
    fetch(url_API+'proyecto/getproyecto', {
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
        var _region = getRegionForCoordinates(response.ubicacion);
        var region = {
          latitude: _region.latitude,
          longitude: _region.longitude,
          latitudeDelta: _region.latitudeDelta,
          longitudeDelta: _region.longitudeDelta
        };       
       // console.log("region new", region);
        var ubicacion_copy = {id: 0, coordinates: response.ubicacion}
        var item = [];
        item.push(ubicacion_copy);
        this.setState({nombre:response.nombre, grupoEspecie:response.grupoEspecie, pregunta:response.pregunta, email:email, 
          idProyecto: idProyecto,objetivos:response.objetivos, especies:response.especies, ubicacion:item, listRefreshing:false ,
          usuarios:response.usuarios, fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked,
           cantEquipo:cantEquipo, region });
        
      })

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
    const {idProyecto} = this.props.navigation.state.params;
    const {email} = this.props.navigation.state.params;
    const {fromDrawBar} = this.props.navigation.state.params;
    const {verificado} = this.props.navigation.state.params;
    const {cantEquipo} = this.props.navigation.state.params;
    this.setState({loading:true});
    var veri=false;
    if(verificado=='no') veri=false;
    else veri=true;
    //console.log("verificado: ", verificado);
    var data = {id:idProyecto, email:email }
    fetch(url_API+'proyecto/getproyecto', {
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
        console.log("polylines ", response.ubicacion);
        var _region = getRegionForCoordinates(response.ubicacion);
        var region = {
          latitude: _region.latitude,
          longitude: _region.longitude,
          latitudeDelta: _region.latitudeDelta,
          longitudeDelta: _region.longitudeDelta
        };       
       // console.log("region new", region);
        var ubicacion_copy = {id: 0, coordinates: response.ubicacion}
        var item = [];
        item.push(ubicacion_copy);
        console.log("ubica ", item);
        console.log("region ", region); 
        console.log("fecha", response.fecha_creac)
      //  console.log("consultar: ", response);
        //console.log("region ", getRegionForCoordinates(response.ubicacion));
        this.setState({fecha_creac:response.fecha_creac,
          nombre:response.nombre, grupoEspecie:response.grupoEspecie, pregunta:response.pregunta, email:email, region:region,
          idProyecto: idProyecto,objetivos:response.objetivos, especies:response.especies, ubicacion: item, cantEquipo:cantEquipo,
          usuarios:response.usuarios, fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked,
            });
       // this.fetchUser(response.foto,response.idUsuario,idAvist, email);
        var datas = { id: response.idUsuarioDuenio}
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
            var  urlUser= uri_foto+response.message.email + '/' + response.message.email + '.jpg?'+ Math.random();
            if(email==response.message.email)
              this.setState({  isOwner:true, email_duenio:response.message.email, idUsuario:datas.id,fotoPerfil:urlUser, email: email, verificado:veri, nombreUser: response.message.nombre, loading:false});
            else
            this.setState({  isOwner:false,email_duenio:response.message.email, idUsuario:datas.id,fotoPerfil:urlUser, email:email, verificado:veri, nombreUser: response.message.nombre, loading:false});
          })

      })
      this.getComentarios();
  }
  /*componentDidMount() {
    this.getComentarios();
  }*/
  getComentarios = () => {
    const {idProyecto} = this.props.navigation.state.params;
    var data = {id: idProyecto, categoria:'P'};
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
       // var date = moment(coment[0].fecha_creac).utc().format('DD-MM-YYYY HH:mm');
      //  var date_sub = moment(date,'DD-MM-YYYY HH:mm').subtract(4, "hours");
        for (var i = 0, len = coment.length ; i < len; i++) {
          var date = moment(coment[i].fecha_creac).utc().format('DD-MM-YYYY HH:mm');
          var date_sub  = moment(date,'DD-MM-YYYY HH:mm').subtract(4, "hours");
          coment[i].fecha_creac = date_sub.format('DD-MM-YYYY HH:mm');
        }
        
       // console.log(date_sub.format('DD-MM-YYYY HH:mm') )
        console.log("comentarios ", coment);
       // coment.reverse();
        this.setState({comentarios:coment});}
      })
  }
  edit = (navegar, values, id) => {
    this.setState({flag:false});
    const navigateAction = NavigationActions.navigate({
      routeName: navegar,
      params: {values: values, id:id, fromDrawBar:this.state.fromDrawBar, email:this.state.email, modulo:"proyecto", keyAvist:this.props.navigation.state.key},
      //params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, especie: this.state.especie },
      actions: [NavigationActions.navigate({ routeName: navegar })],
      //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
    })
    this.props.navigation.dispatch(navigateAction);
  }
  insertComentario = () => {
    var {comentarios, nombreUser, email, idProyecto, ingresarComentario} = this.state;
    this.setState({loadingComent:true});
    var data = {email:email ,idPost:idProyecto, descripcion:ingresarComentario, categoria:'P'} 
    var index = 0;
    console.log("coment proy ", data);
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
          console.log("response comentario: ", response);
          index = response.result.insertId;
          console.log("index ", comentarios.length);
          //comentariosUntouched.push({id:index,idUsuario:idUsuario, nombre:nombreUser, email:email, idPost:idProyecto, descripcion: ingresarComentario  });
          var date = moment().format('DD-MM-YYYY HH:mm');
          if( comentarios.length==0){
            comentarios.push({id:index,idUsuario:response.id, nombre:response.nombreUser, email:email, idPost:idProyecto, descripcion: ingresarComentario, fecha_creac:date  });
          }
          else{
          comentarios.unshift({id:index,idUsuario:response.id, nombre:response.nombreUser, email:email, idPost:idProyecto, descripcion: ingresarComentario,  fecha_creac:date   });
          }
          this.setState({comentarios:comentarios, ingresarComentario:'',  loadingComent:false});
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
    var data={email: this.state.email, idPost:this.state.idProyecto, categoria:'P'};
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
  grupoEspecieInclude (grupo){
    var grupoEspecie = this.state.grupoEspecie;
    var found = false;
    for (var i = 0, len = grupoEspecie.length ; i < len; i++) {
      if(grupoEspecie[i].idGrupoEspecie==grupo){
        found=true;
        break;}
    }
    return found;
  }
  selectPhotoTapped() {
    var veri = this.state.verificado;
    if(veri){
        const options = {
          quality: 0.5,
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
      
          if (response.didCancel) {
            console.log('User cancelled photo picker');
          }
          else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          }
          else if (response.customButton) {
          }
          else {
            const source = { uri: response.uri, type: 'image/jpeg', name: this.state.email + '.a.'+ (Math.floor(Math.random()*99999999)+10000000) + '.jpg' }; 
            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };  
            this.setState({ 
              ImageSource: source
            });
            const actionToDispatch = NavigationActions.navigate({
              routeName: "Cuando",
              params: {ImageSource: source, email: this.state.email, ubicacion:this.state.ubicacion,
              especies:this.state.especies, grupoEspecieProy:this.state.grupoEspecie },
              actions: [NavigationActions.navigate({ routeName: 'Cuando' })],
              //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
            })
            this.props.navigation.dispatch(actionToDispatch)
          }
        });
      }
  };
  render() {
    const { props: { name, index, list } } = this;
    const { navigate } = this.props.navigation;
    const {pressEquipo, PressInfo, usuarios, pressFichero, isOwner} = this.state;
    var _fecha_creac = this.state.fecha_creac;
   // console.log("_fecha ", _fecha_creac);
    var fecha_creac = "";
    var date = moment(_fecha_creac).utc().format('DD-MM-YYYY HH:mm');
    var date_sub  = moment(date,'DD-MM-YYYY HH:mm').subtract(4, "hours");
    
    var format = date_sub.format('DD-MM-YYYY');
    var localLocale = moment(format, "DD-MM-YYYY");
    moment.updateLocale('es', esMoment );
    localLocale.locale(false);
    fecha_creac= localLocale.format("LL");
    const color="#DEDA3E";
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
            <Title style={{color: '#4A4A4A', fontSize: viewportHeight*.022}}>{this.state.nombre}</Title>
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
       {this.state.loading ? <ActivityIndicator/> :   <MapView
          provider={PROVIDER_GOOGLE}
          customMapStyle={customStyle}
           liteMode={true}
           style={{height: viewportHeight*.42}}
           scrollEnabled={false}
           region={this.state.region}>
          {this.state.ubicacion.map((polyline,index )=> (
           <Polygon
             key={index}

             coordinates={polyline.coordinates}
             lineCap="round"
             lineJoin="round"
             strokeColor="rgba(255,81,29,0.9)"
             fillColor="rgba(255,81,29,0.5)"
             strokeWidth={3}
         /> ) )}
       </MapView>}
       <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}  >
          <View style={styles.matrizTexto}>
            <Image style={{height:50, width:50,borderRadius: 80, marginLeft:1, marginRight:10, borderColor:'#DEDA3E', borderWidth:2,
                  resizeMode: 'cover'}} source={{uri: this.state.fotoPerfil}}></Image>
            <View style={{flexDirection:'column'}}>
              <Text style={{fontSize:viewportWidth*.035,fontWeight:'bold', color:'#4A4A4A', marginTop:10}}>{this.state.nombreUser}</Text>
              <Text style={{fontSize:viewportWidth*.032, color:'#4A4A4A', marginTop:2}}>{fecha_creac}</Text>
            </View>
          </View>
          <View style={{ flexDirection:'column', marginTop:14, justifyContent:'center'}}>
            <TouchableOpacity onPress={() => this.MeGusta()} activeOpacity={1} disabled={!this.state.verificado}>
              {(this.state.liked)?
              <Image source={{uri: liked}} style={{height:viewportWidth*.066, width:viewportWidth*.063, marginLeft:15 }}></Image>:
              <Image source={{uri: like}} style={{height:viewportWidth*.066, width:viewportWidth*.063, marginLeft:15 }}></Image>}
            </TouchableOpacity>
            <Text style={{fontSize:viewportWidth*.032, color:'#4A4A4A', marginTop:3, marginRight:12}}>{this.state.likes} me gusta</Text>    
          </View>
        </View>
        {(!PressInfo) ?
        <View style={styles.matriz}>
            <TouchableOpacity  onPress={ ()=> this.edit("ShowAvistMapProy", {nombre: this.state.nombre, email_duenio:this.state.email_duenio, ubicacion: this.state.ubicacion, listEspecies:this.state.especies, usuarios, isOwner } , this.state.idProyecto)}>
              <Image source={{uri: uri+"/customMarker2.png"}} style={{marginLeft:12, width:22, height:25.6}}/> 
            </TouchableOpacity>
            <TouchableOpacity  onPress={this.selectPhotoTapped.bind(this)} disabled={this.state.verificado=='no'}>
              <Image source={ {uri:uri+"/proyecto/pinAvist.png"}} style={{width:viewportHeight*.07, height:viewportHeight*.07}}></Image>
            </TouchableOpacity>
            <TouchableOpacity  onPress={ ()=> this.setState({pressEquipo:!pressEquipo})} style={pressEquipo && {borderBottomColor:color, borderBottomWidth:3}} >
                <Image source={pressEquipo ? {uri: uri+'/proyecto/equipoPress.png'}: {uri:uri+'/proyecto/equipo.png'}} style={{width:viewportHeight*.085, height:viewportHeight*.085}}></Image>
              </TouchableOpacity>
              <TouchableOpacity onPress={ ()=> this.edit("ShowAvist", {nombre: this.state.nombre,listEspecies:this.state.especies, ubicacion: this.state.ubicacion},this.state.idProyecto)} style={{height:viewportWidth*.08,width:viewportWidth*.08}}>
                <Image source={ {uri:uri+'/especie/camera.png'}} style={{width:viewportWidth*.08, height:viewportWidth*.08}}></Image>
              </TouchableOpacity>
              <TouchableOpacity onPress={ ()=> this.setState({PressInfo: !this.state.PressInfo}) } style={{height:viewportWidth*.08,width:viewportWidth*.08}}>
                <Image source={ {uri:uri+'/proyecto/proyecto.png'}} style={{width:viewportWidth*.08, height:viewportWidth*.08}}></Image>
              </TouchableOpacity>
        </View>
        :
        <View style={{flex: 1, justifyContent: 'flex-end', marginTop:20,   alignItems: 'center', flexDirection: 'row',  marginTop:10,  borderBottomWidth: 1.6,borderBottomColor:color }}>
            <TouchableOpacity onPress={() => this.setState({pressFichero: true}) } 
            style={(pressFichero && PressInfo ) ? {paddingHorizontal:25,paddingBottom:10, borderBottomWidth: 3.5,borderBottomColor: color} : {paddingHorizontal:25,paddingBottom:10} }>
              <Image source={(pressFichero && PressInfo ) ? {uri: uri+"/proyecto/ficheroPress.png"}: {uri: uri+"/especie/fichero.png"}} style={{ height:viewportWidth*.08, width:viewportWidth*.08}}></Image>
            </TouchableOpacity>            
            <TouchableOpacity onPress={ ()=> this.setState({PressInfo: !this.state.PressInfo, pressFichero:false}) } 
            style={(!pressFichero && PressInfo ) ? {paddingHorizontal:25,paddingBottom:10, borderBottomWidth: 3.5,borderBottomColor: color} : {paddingHorizontal:25,paddingBottom:10}}>
              <Image source={ {uri:uri+'/proyecto/proyectoPress.png'}} style={{width:viewportWidth*.08, height:viewportWidth*.08}}></Image>
            </TouchableOpacity>
        </View>
        }
        {(pressEquipo && !PressInfo ) &&
          <View style={{flex:1, backgroundColor:'rgba(222,218,62,0.4)'}} >
          <View style={{flexDirection:'row',   marginLeft:20}}>
            <Text style={{fontSize:viewportWidth*.035, color:'#1E1E32', marginTop:10}}>Equipo de trabajo</Text>
            <TouchableOpacity onPress={() => this.edit("Equipo",1, this.state.idProyecto  )} disabled={!this.state.isOwner} >
              <Image source={ {uri:uri+'/pencil3.png'}} style={{width:viewportWidth*.062, height:viewportWidth*.062, marginLeft:10, marginTop:5}}></Image>
            </TouchableOpacity>
          </View> 
            <FlatList
                contentContainerStyle={{flex:1,flexDirection:'row',justifyContent:'space-between',paddingVertical:20, flexWrap: 'wrap',paddingHorizontal:25}}
                data={usuarios}
                extraData={usuarios}
                keyExtractor={item =>item.id }
                renderItem={({item}) => (
                  <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', marginRight:10, marginBottom:10}}>
                    <Image style={{ height:viewportHeight*.055, width:viewportHeight*.055,borderRadius: 80}} source={{uri:uri_foto+item.email+"/"+item.email+".jpg"}}/>
                    <Text style={{fontSize:viewportHeight*.017, color:'#1E1E32', marginTop:10}}>  {item.nombre}</Text>
                  </View>
                )}
            />
          </View>
        }
        {
          (!pressFichero && PressInfo) &&
          <View style={{flex: 1,flexDirection: 'column', marginTop:15, borderBottomWidth:1, borderBottomColor:color}}  >
              <View style={{flex:1,  borderBottomWidth:1, borderBottomColor:color,  paddingHorizontal:20 }}> 
                <View style={{flexDirection:'row',}}>
                  <Text style={{fontSize:viewportWidth*.032, color:'#4A4A4A', fontWeight:'bold'}}>Objetivo</Text>
                  {this.state.isOwner &&  <TouchableOpacity onPress={() => this.edit("Objetivos", {pregunta:this.state.pregunta, objetivos:this.state.objetivos} , this.state.idProyecto ) }disabled={!this.state.isOwner} >
                <Image source={ {uri:uri+'/pencil.png'}} style={{width:viewportWidth*.065, height:viewportWidth*.065, marginLeft:10}}></Image>
                </TouchableOpacity> }
                </View>
                <Text style={{fontSize:viewportWidth*.034, color:'#4A4A4A', marginRight:25, marginVertical:10}}>{this.state.objetivos}</Text>
              </View>
              <View style={{flex:1, flexDirection:'row',  paddingHorizontal:20, marginTop:15}}>  
                <Text style={{fontSize:viewportWidth*.032, color:'#4A4A4A',fontWeight:'bold'}}>Pregunta de investigación  </Text>
                {this.state.isOwner &&  <TouchableOpacity onPress={() => this.edit("Objetivos", {pregunta:this.state.pregunta, objetivos:this.state.objetivos} , this.state.idProyecto ) }disabled={!this.state.isOwner} >
                <Image source={ {uri:uri+'/pencil.png'}} style={{width:viewportWidth*.065, height:viewportWidth*.065, marginLeft:10}}></Image>
                </TouchableOpacity> }
              </View>
              <Text style={{fontSize:viewportWidth*.034,  color:'#4A4A4A', paddingHorizontal:20 , marginVertical:10}}  >{this.state.pregunta}</Text>
                             
          </View>
        }
        { (pressFichero && PressInfo) &&
          <View style={{borderBottomWidth:1, borderBottomColor:color, paddingBottom:10}} >
               <View style={{flex:1, flexDirection:'row',  justifyContent: 'space-between',  marginHorizontal:20, paddingVertical:10, paddingBottom:3}}>  
                <Text style={{fontSize:viewportWidth*.032, color:'#4A4A4A',}}>Grupos de especies asociadas al proyecto</Text>
              {this.state.isOwner &&  <TouchableOpacity onPress={() => this.edit("Grupo", this.state.grupoEspecie , this.state.idProyecto)}disabled={!this.state.isOwner} >
              <Image source={ {uri:uri+'/pencil.png'}} style={{width:viewportWidth*.065, height:viewportWidth*.065, marginLeft:10}}></Image></TouchableOpacity> }
               </View>
               <View style={{flexDirection:'row', flexWrap:'wrap', borderBottomWidth:1, borderBottomColor:color,}}>
                  {( this.grupoEspecieInclude(1) ) &&
                  <Image source={{uri: hongo}} style={styles.shadow}></Image>}
                  {( this.grupoEspecieInclude(2) ) &&
                  <Image source={{uri: rana}} style={styles.shadow}></Image>}
                  {( this.grupoEspecieInclude(3) ) &&
                  <Image source={{uri: llama}} style={styles.shadow}></Image>}
                  {( this.grupoEspecieInclude(4) ) &&
                  <Image source={{uri: pajaro}} style={styles.shadow}></Image>}
                  {( this.grupoEspecieInclude(5) ) &&
                  <Image source={{uri: flor}} style={styles.shadow}></Image>}
                  {( this.grupoEspecieInclude(6) ) &&
                  <Image source={{uri: caracol}} style={styles.shadow}></Image>}
                  {( this.grupoEspecieInclude(7) ) &&
                  <Image source={{uri: cucaracha}} style={styles.shadow}></Image>}
                  {( this.grupoEspecieInclude(8) ) &&
                  <Image source={{uri: pez}} style={styles.shadow}></Image>}
               </View>
               <View style={{flex:1, flexDirection:'row',  justifyContent: 'space-between',marginTop:10,  marginHorizontal:20}}>  
                <Text style={{fontSize:viewportWidth*.032, color:'#4A4A4A', marginTop:5}}>Especies asociadas al proyecto</Text>
               {this.state.isOwner && <TouchableOpacity onPress={() => this.edit("Especie", { listEspecies:this.state.especies, grupoEspecie:this.state.grupoEspecie} , this.state.idProyecto)}disabled={!this.state.isOwner} >
               <Image source={ {uri:uri+'/pencil.png'}} style={{width:viewportWidth*.065, height:viewportWidth*.065, marginLeft:10}}></Image></TouchableOpacity> }
               </View>
              {this.state.especies.length>0 ? 
               <List containerStyle={{flex:1, borderTopWidth: 0, marginVertical:10,  borderBottomWidth: 0 ,backgroundColor: '#FBFAFA', paddingLeft:20}}>
               <FlatList
                    data={this.state.especies}
                    renderItem={({ item }) => (
                      <View style={{flexDirection:'row'}} >
                        <Image source={{uri:uri+grupoEspecie_[item.grupoEspecie-1]}} style={{width:viewportHeight*.075, height:viewportHeight*.075}}/>
                        <View style={{flexDirection:'column'}}>
                        <Text style={{fontSize:viewportWidth*.032, color:'#787878', marginTop:5}}>{item.nombre}</Text>
                        <Text style={{fontSize:viewportWidth*.032, color:'#BEBEBE', fontStyle:'italic', marginTop:0}}>{item.nombreCient} </Text>
                        </View>
                      </View>
                    )}
                  keyExtractor={item => item.id}
                />
              </List>  :
              <Text style={{fontSize:viewportWidth*.032, color:'#787878', marginVertical:20, marginHorizontal:20}}>
              Este proyecto no tiene especies asociadas, solo grupos.</Text>
            }       
          </View>
        }



{/*
        <View style={{flexDirection:'row', marginTop:15, marginLeft:20}}>
          <Text style={{fontSize:viewportWidth*.045,fontWeight:'bold', color:'#4A4A4A', marginTop:10}}>{this.state.nombre}  </Text>
          {this.state.isOwner &&
            <TouchableOpacity onPress={() => this.edit("Nombre", this.state.nombre , this.state.idProyecto ) } >{(this.state.verificado)&&
              <FontAwesome name={'pencil'}style= {{color: '#DEDA3E', marginLeft:10}} size={26}/>}
            </TouchableOpacity>}
        </View>
        <View style={styles.matriz}>
            <TouchableOpacity onPress={ ()=> this.edit("Editubica", {longitude: this.state.longitude, latitude:this.state.latitude} , this.state.idAvist)} disabled={!this.state.isOwner} >
                <MaterialCommunityIcons  name="pin" size={32}
                  style= {{color:'#4A4A4A',  marginLeft:15}}/> 
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.MeGusta()} activeOpacity={1} disabled={!this.state.verificado} >
              {(this.state.liked)?
              <Image source={{uri: liked}} style={{height:viewportWidth*.09, width:viewportWidth*.10 }}></Image>:
              <Image source={{uri: like}} style={{height:viewportWidth*.09, width:viewportWidth*.10 }}></Image>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.edit("Equipo",1, this.state.idProyecto  )} disabled={!this.state.isOwner} >
                <Text style={{fontSize:20, color:'#4A4A4A'}}>{this.state.cantEquipo}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={ ()=> this.setState({PressInfo: !this.state.PressInfo}) }>
              <FontAwesome name={'file-text-o'}style= {this.state.PressInfo ? {color:'#DEDA3E'}: {color: '#4A4A4A'}} size={32}/>
            </TouchableOpacity>
            <FontAwesome name={'external-link'}style= {{color: '#4A4A4A'}} size={32}/>
        </View>
        <View style={styles.matrizTexto}>
                <Text style={{fontSize:viewportWidth*.03, color:'#4A4A4A', marginRight:10}}>Avistamientos</Text>
                <Text style={{fontSize:viewportWidth*.03, color:'#4A4A4A', marginRight:10}}> Me gusta  </Text>
                <Text style={{fontSize:viewportWidth*.03, color:'#4A4A4A', marginRight:10}}>  Equipo   </Text> 
                <Text style={this.state.PressInfo ? {fontSize:viewportWidth*.032, color:'#DEDA3E',marginRight:8, fontWeight:"bold"}: {fontSize:viewportWidth*.032, color:'#4A4A4A',marginRight:8}}>Información</Text>
                <Text style={{fontSize:viewportWidth*.03, color:'#4A4A4A'}}>Compartir</Text>
        </View>
      {(this.state.PressInfo) ?
          <View style={{flex: 1,flexDirection: 'column',padding:4, marginTop:15, marginLeft:20, marginRight:5}}  >
              <View style={{flex:1, flexDirection:'row',  justifyContent: 'space-between'}}>  
                <Text style={{fontSize:viewportWidth*.032, color:'#4A4A4A',}}>Pregunta de investigación</Text>
              {this.state.isOwner &&  <TouchableOpacity onPress={() => this.edit("Objetivos", {pregunta:this.state.pregunta, objetivos:this.state.objetivos} , this.state.idProyecto ) } >
                <FontAwesome name={'pencil'}style= {{color: '#DEDA3E'}} size={23}/></TouchableOpacity> }
              </View>
              <Text style={{fontSize:viewportWidth*.032, color:'#4A4A4A', marginRight:25, marginVertical:10}}>{this.state.pregunta}</Text>
              <View style={{width:viewportWidth*.9, height:1.1, backgroundColor: '#c6c6c6', marginLeft: 0, marginRight: 25,borderRadius: 10,
                marginTop:20}} />
                <View style={{flex:1, flexDirection:'row',  justifyContent: 'space-between'}}>  
                  <Text style={{fontSize:viewportWidth*.032, color:'#4A4A4A',}}>Objetivo</Text>

                </View>
              <Text style={{fontSize:viewportWidth*.032, color:'#4A4A4A', marginRight:25, marginVertical:10}}>{this.state.objetivos}</Text>
              <View style={{width:viewportWidth*.9, height:1.1, backgroundColor: '#c6c6c6', marginLeft: 0, marginRight: 25,borderRadius: 10,
               marginTop:20}} />
               <View style={{flex:1, flexDirection:'row',  justifyContent: 'space-between'}}>  
                <Text style={{fontSize:viewportWidth*.032, color:'#4A4A4A',}}>Grupos de especie</Text>
              {this.state.isOwner &&  <TouchableOpacity onPress={() => this.edit("Grupo", this.state.grupoEspecie , this.state.idProyecto ) } >
                <FontAwesome name={'pencil'}style= {{color: '#DEDA3E'}} size={23}/></TouchableOpacity> }
               </View>
               <View style={{flexDirection:'row'}}>
                  {( this.grupoEspecieInclude(1) ) &&
                  <Image source={{uri: hongo}} style={styles.shadow}></Image>}
                  {( this.grupoEspecieInclude(2) ) &&
                  <Image source={{uri: rana}} style={styles.shadow}></Image>}
                  {( this.grupoEspecieInclude(3) ) &&
                  <Image source={{uri: llama}} style={styles.shadow}></Image>}
                  {( this.grupoEspecieInclude(4) ) &&
                  <Image source={{uri: pajaro}} style={styles.shadow}></Image>}
                  {( this.grupoEspecieInclude(5) ) &&
                  <Image source={{uri: flor}} style={styles.shadow}></Image>}
                  {( this.grupoEspecieInclude(6) ) &&
                  <Image source={{uri: caracol}} style={styles.shadow}></Image>}
                  {( this.grupoEspecieInclude(7) ) &&
                  <Image source={{uri: cucaracha}} style={styles.shadow}></Image>}
                  {( this.grupoEspecieInclude(8) ) &&
                  <Image source={{uri: pez}} style={styles.shadow}></Image>}
               </View>
               <View style={{width:viewportWidth*.9, height:1.1, backgroundColor: '#c6c6c6', marginLeft: 0, marginRight: 25,borderRadius: 10,
               marginTop:20}} />
               <View style={{flex:1, flexDirection:'row',  justifyContent: 'space-between',marginTop:10}}>  
                <Text style={{fontSize:viewportWidth*.032, color:'#4A4A4A', marginTop:5}}>Especies</Text>
               {this.state.isOwner && <TouchableOpacity onPress={() => this.edit("Especie", { listEspecies:this.state.especies, grupoEspecie:this.state.grupoEspecie} , this.state.idProyecto ) } >
                <FontAwesome name={'pencil'}style= {{color: '#DEDA3E'}} size={23}/></TouchableOpacity> }
               </View>
               <List containerStyle={{flex:1, borderTopWidth: 0, borderBottomWidth: 0 ,backgroundColor: '#FBFAFA'}}>
               <FlatList
                    data={this.state.especies}
                    renderItem={({ item }) => (
                      <ListItem
                        title={item.nombre}
                        subtitle={item.nombreCient}
                        containerStyle={{ borderBottomWidth: 0, marginLeft:0, paddingTop:0 }}
                        titleStyle={{marginLeft:0}}
                        contentContainerStyle={{marginLeft:0}}
                        rightIcon={<FontAwesome name="check" size={25} style={{color: '#FBFAFA'}} />}
                        />
                    )}
                  keyExtractor={item => item.id}
                />
              </List>
                  </View>}*/}

         {!this.state.PressInfo &&
        <View style={{flex:1, marginTop:3, flexDirection:"row", justifyContent: 'space-between', paddingHorizontal:20, borderBottomColor:'#DEDA3E', borderBottomWidth:1.6, borderTopColor:'#DEDA3E', borderTopWidth:1.6}}>
              <TextInput underlineColorAndroid='#c4c4c4' style={{flex:1,fontSize:viewportWidth*.035,  marginVertical:10}}  enablesReturnKeyAutomatically={true}
                placeholder={"Comenta aquí"} placeholderTextColor="#DEDA3E" underlineColorAndroid='rgba(0,0,0,0)'
                value={this.state.ingresarComentario} onChangeText={ingresarComentario => this.setState({ingresarComentario})}>
              </TextInput>
             {this.state.ingresarComentario.length>0 &&  <TouchableOpacity onPress={() => this.insertComentario()} disabled={this.state.loadingComent} >{this.state.loadingComent ? <ActivityIndicator/> :
              <Image source={ {uri:uri+'/avioncito.png'}} style={{width:viewportWidth*.065, height:viewportWidth*.065, marginVertical:30}}></Image>}</TouchableOpacity>
        }</View>}

           <View style={{flex:1, marginHorizontal:0, justifyContent:'center'}} >
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
                        <Text style={{fontSize:viewportWidth*.037, color:color, marginTop:10, fontWeight:'bold', marginLeft:4}}>
                        {item.nombre}</Text>
                        <Text style={{fontSize:viewportWidth*.037, color:'#4A4A4A', marginTop:10, marginLeft:4, marginHorizontal:15}}>{item.descripcion}</Text>
                        <Text style={{fontSize:viewportWidth*.035, color:'#787878', marginBottom:20, textAlign:'right', marginRight:20}}>{item.fecha_creac}</Text>
                      </View>
                  </View>) }
                  keyExtractor={item => item.id}
                  ItemSeparatorComponent={ () =>  <View style={{height:1, width:viewportWidth, backgroundColor:'#BEBEBE' }}/>}
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

export default connect(mapStateToProps, bindActions)(ConsultarProyecto);

