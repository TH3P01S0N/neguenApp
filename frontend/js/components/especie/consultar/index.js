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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {  List, ListItem } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import { isGoBack } from "../../../actions/goback_action";
import { isGoBackOff } from "../../../actions/goback_action_off";
import {url_API} from '../../../config';
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

const like = uri + "/like.png";
const liked = uri + "/liked.png";
const ficheros = ["info_esp_1.png", "info_esp_2.png", "info_esp_3.png", "info_esp_4.png","info_esp_5.png", "info_esp_6.png","info_esp_7.png", "info_esp_8.png"]
const ex  = uri + "/ex.png";// require("../../../images/1-hongo.png");
const ew =  uri + "/ew.png"; 
const cr = uri + "/cr.png"; 
const en = uri + "/en.png"; 
const vu = uri + "/vu.png"; 
const nt = uri + "/nt.png"; 
const lc = uri + "/lc.png"; 
const se =  uri + "/se.png";
const colores = [  '#86C290', '#B4922B', '#BE742E', '#4DC0DE','#9EAA36' , '#007090', '#816A27', '#0093BF'];
const nombreGrupos = [  'Hongo', 'Anfibio y reptile', 'Mamífero', 'Ave','Planta y alga' , 'Invertebrado marino', 'Artrópodo terrestre', 'Pez'];
class ConsultarEspecie extends Component {
  constructor(props){
    super(props);
    this.state={
    nombre:"",  ImageSource: null, nombreUser: "",  ImagenGrupoEspecie:null, nombreCient:"", loading:false,
      isOwner:false, PressInfo:false, idEspecie:0, flag:false, grupoEspecie:0, idEspecie:0, fotoOld:"",loadingComent:false,
      fromDrawBar:false, email:"", liked: false, likes:0, idUsuario:0, verificado:false, comentarios:[],fotoPerfil:null,
      idUsuario:0, descripcion:"", procedencia:"", estadoConservacion:null, estadoConservacionStr:"", ingresarComentario:"",
      comentarios_esp:[],loadingComent2:false, fecha_creac:"", ubicacion:[], aux:false, descripcion_texto:"", foto:""
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
  guardar = () => {   
    const navigateAction = NavigationActions.reset({
      index: 0,
      key: null,
      //params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, especie: this.state.especie },
      actions: [NavigationActions.navigate({ routeName: 'Mapa' })],
    })
    this.props.navigation.dispatch(navigateAction);
  }
  fetchData(str_aux){
    if(str_aux=="no")
    this.setState({flag:true});
    const {idEspecie} = this.props.navigation.state.params;
    const {email} = this.props.navigation.state.params;
    const {fromDrawBar} = this.props.navigation.state.params;
    const {verificado} = this.props.navigation.state.params;
    var veri=false;
    if(verificado=='no') veri=false;
    else veri=true;
    console.log("verificado: ", email);
    var data = {id:idEspecie, email:email }
    fetch(url_API+ 'especie/getespecies', {
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
      //  console.log("didmount: ", response);
        var grupoEspecie = response.grupoEspecie;

        this.setState({fecha_creac:response.fecha_creac, ubicacion:response.ubicacion});
        if(grupoEspecie==1) this.setState({nombreCient:response.nombreCient, ImagenGrupoEspecie:hongo, nombre:response.nombre, idEspecie: idEspecie, grupoEspecie:1,idUsuario:response.idUsuario, descripcion_texto:response.descripcion, procedencia:response.procedencia, fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked, grupoEspecie:grupoEspecie});
        if(grupoEspecie==2) this.setState({nombreCient:response.nombreCient, ImagenGrupoEspecie:rana, nombre:response.nombre, idEspecie: idEspecie, idGrupoEspecie:2,idUsuario:response.idUsuario, descripcion_texto:response.descripcion, procedencia:response.procedencia, fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked, grupoEspecie:grupoEspecie});
        if(grupoEspecie==3) this.setState({nombreCient:response.nombreCient, ImagenGrupoEspecie:llama,  nombre:response.nombre, idEspecie: idEspecie, idGrupoEspecie:3,idUsuario:response.idUsuario, descripcion_texto:response.descripcion,procedencia:response.procedencia, fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked, grupoEspecie:grupoEspecie});
        if(grupoEspecie==4) this.setState({nombreCient:response.nombreCient, ImagenGrupoEspecie:pajaro, nombre:response.nombre, idEspecie: idEspecie, idGrupoEspecie:4,idUsuario:response.idUsuario, descripcion_texto:response.descripcion,procedencia:response.procedencia, fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked, grupoEspecie:grupoEspecie});
        if(grupoEspecie==5) this.setState({nombreCient:response.nombreCient, ImagenGrupoEspecie:flor,  nombre:response.nombre, idEspecie: idEspecie, idGrupoEspecie:5,idUsuario:response.idUsuario, descripcion_texto:response.descripcion,procedencia:response.procedencia, fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked, grupoEspecie:grupoEspecie});
        if(grupoEspecie==6) this.setState({nombreCient:response.nombreCient, ImagenGrupoEspecie:caracol,  nombre:response.nombre, idEspecie: idEspecie, idGrupoEspecie:6,idUsuario:response.idUsuario, descripcion_texto:response.descripcion, procedencia:response.procedencia,fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked, grupoEspecie:grupoEspecie});
        if(grupoEspecie==7) this.setState({nombreCient:response.nombreCient, ImagenGrupoEspecie:cucaracha, nombre:response.nombre, idEspecie: idEspecie, idGrupoEspecie:7,idUsuario:response.idUsuario, descripcion_texto:response.descripcion,procedencia:response.procedencia, fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked, grupoEspecie:grupoEspecie});
        if(grupoEspecie==8) this.setState({nombreCient:response.nombreCient, ImagenGrupoEspecie:pez,  nombre:response.nombre, idEspecie: idEspecie, idGrupoEspecie:8,idUsuario:response.idUsuario, descripcion_texto:response.descripcion, procedencia:response.procedencia, fromDrawBar:fromDrawBar, likes: response.likes, liked: response.liked, grupoEspecie:grupoEspecie});
       // this.fetchUser(response.foto,response.idUsuario,idEspecie, email);
        if(response.estadoConservacion=="EX") this.setState({estadoConservacion:ex, estadoConservacionStr:1});
        if(response.estadoConservacion=="EW") this.setState({ estadoConservacion:ew, estadoConservacionStr:2});
        if(response.estadoConservacion=="CR") this.setState({ estadoConservacion:cr, estadoConservacionStr:3});
        if(response.estadoConservacion=="EN") this.setState({ estadoConservacion:en, estadoConservacionStr:4});
        if(response.estadoConservacion=="VU") this.setState({ estadoConservacion:vu, estadoConservacionStr:5});
        if(response.estadoConservacion=="NT") this.setState({ estadoConservacion:nt, estadoConservacionStr:6});
        if(response.estadoConservacion=="LC") this.setState({ estadoConservacion:lc, estadoConservacionStr:7});
        if(response.estadoConservacion=="SE") this.setState({ estadoConservacion:se, estadoConservacionStr:8});
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
            console.log(response);
            var  urlAvist= uri_foto+response.message.email + '/' + foto;
            var  urlUser= uri_foto+response.message.email + '/' + response.message.email + '.jpg?'+ Math.random();
            let source = { uri: urlAvist ,
              type: 'image/jpeg',
              //name: 'myImage' + '-' + Date.now() + '.jpg' 
              name: foto};
           // var  urlUser= uri_foto+response.message.email + '/' + response.message.email + '.jpg?'+ Math.random();
            if(email==response.message.email)
              this.setState({foto, nombreUser:response.message.nombre, isOwner:true,  fotoPerfil:urlUser,ImageSource:source,  email: email, verificado:veri, fotoOld:foto});
            else
            this.setState({foto, nombreUser:response.message.nombre, isOwner:false, fotoPerfil:urlUser, ImageSource:source,   email:response.message.email, verificado:veri, fotoOld:foto});
          })

      })
  }
  /*componentWillMount(){
    
    if(this.props.flag){
      this.props.isGoBackOff();
    }
  }*/
  componentWillReceiveProps(newProps) {
    if(this.props.flag && !this.state.flag){
      console.log("props_flag", this.state.flag);
      this.props.isGoBackOff();
      this.fetchData("no");
    }
   // console.log("props2: ", this.props.flag, this.state.flag );
  }
  componentDidMount() {
    this.fetchData("mount")
    this.getComentarios();
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
          var date_sub  = moment(date,'DD-MM-YYYY HH:mm').subtract(5, "hours");
          coment[i].fecha_creac = date_sub.format('DD-MM-YYYY HH:mm');
        }
        

        console.log("comentarios ", coment);
        this.setState({comentarios:coment});}
      })
      fetch(url_API+'especie/list', {
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
          console.log("response ", response.message);
          var coment = response.message.comentarios;
          var comentarios = [];
          var likes = response.message.likes;
          var likes_var = {mg:0, email_like:""};
          for (var i = 0, len = coment.length ; i < len; i++) {
            for (var j = 0, len_ = likes.length ; j < len_; j++){
              if(coment[i].id==likes[j].id ){
                  likes_var.mg=likes[j].mg;
                  likes_var.email_like=likes[j].email_like;
                  break;
              }                       
          }
            var date = moment(coment[i].fecha_creac).utc().format('DD-MM-YYYY HH:mm');
            var date_sub  = moment(date,'DD-MM-YYYY HH:mm').subtract(4, "hours");
            var coment_var = {descripcion:coment[i].descripcion,email:coment[i].email, fecha_creac:date_sub.format('DD-MM-YYYY HH:mm'),
             id:coment[i].id, idPost:coment[i].idPost, idUsuario:coment[i].idUsuario, nombre:coment[i].nombre,
             likes:likes_var  };
            comentarios.push(coment_var);
            likes_var={mg:0, email_like:""};
            coment_var= [];
          }

          console.log("comentarios_esp ", comentarios);
          this.setState({comentarios_esp:comentarios});}
        })
  }
  insertComentario2 = () => {
    var {comentarios_esp,  nombreUser, email, idEspecie, descripcion} = this.state;
    this.setState({loadingComent2:true});
    var data = {email:email ,idPost:idEspecie, descripcion:descripcion} 
    var index = 0;
    fetch(url_API+'especie/insertcomentario', {
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
          console.log("index ", comentarios_esp.length);
          var likes_var = {mg:0, email_like:""};
          //comentariosUntouched.push({id:index,idUsuario:idUsuario, nombre:nombreUser, email:email, idPost:idProyecto, descripcion: ingresarComentario  });
          var date = moment().format('DD-MM-YYYY HH:mm');
          if( comentarios_esp.length==0){
            comentarios_esp.push({id:index,idUsuario:response.id, nombre:response.nombreUser, email:email, idPost:idEspecie, descripcion: descripcion, fecha_creac:date , likes: likes_var });
          }
          else{
          comentarios_esp.unshift({id:index,idUsuario:response.id, nombre:response.nombreUser, email:email, idPost:idEspecie, descripcion: descripcion,  fecha_creac:date, likes:likes_var });
          }
          this.setState({comentarios_esp:comentarios_esp, descripcion:'', loadingComent2:false});
      })
  }
  onPressInfo = () => {
    const {descripcion_texto, fecha_creac, nombreUser, aux, PressInfo} = this.state;
    if(!aux && descripcion_texto.length>0){
    var {comentarios_esp} = this.state;
    var date = moment(fecha_creac).utc().format('DD-MM-YYYY HH:mm');
    var date_sub  = moment(date,'DD-MM-YYYY HH:mm').subtract(4, "hours");
    var item = {
      id:comentarios_esp.length, nombre:nombreUser, descripcion:descripcion_texto, fecha_creac:date_sub.format('DD-MM-YYYY HH:mm')
    }
    comentarios_esp.push(item);
    this.setState({PressInfo:!PressInfo, comentarios_esp, aux:true, descripcion:""});
    } else {
      this.setState({PressInfo:!PressInfo});
    }
  }
  insertComentario = () => {
    var {comentarios,  nombreUser, email, idEspecie, ingresarComentario} = this.state;
    this.setState({loadingComent:true});
    var data = {email:email ,idPost:idEspecie, descripcion:ingresarComentario, categoria:'E'} 
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
            comentarios.push({id:index,idUsuario:response.id, nombre:response.nombreUser, email:email, idPost:idEspecie, descripcion: ingresarComentario, fecha_creac:date  });
          }
          else{
          comentarios.unshift({id:index,idUsuario:response.id, nombre:response.nombreUser, email:email, idPost:idEspecie, descripcion: ingresarComentario,  fecha_creac:date   });
          }
          this.setState({comentarios:comentarios, ingresarComentario:'', loadingComent:false});
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
      params: {values: values, id:id, fromDrawBar:this.state.fromDrawBar, email:this.state.email,modulo:"especie", ImagenGrupoEspecie:this.state.ImagenGrupoEspecie,keyAvist:this.props.navigation.state.key },
      //params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, especie: this.state.especie },
      actions: [NavigationActions.navigate({ routeName: navegar })],
      //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
    })
    this.props.navigation.dispatch(navigateAction);
  }
  MeGusta = () => {
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
  MeGustaDescrip = (email_like, email, index) => {
    var liked = false;
    var email_copy = email;
    var {comentarios_esp} = this.state;
    if(email_like==email) {
        liked=true;
        email_copy="";
    }
    var likes_temp=0;
    var like_url="likes/";
    if(liked){ 
      likes_temp=-1;
      like_url=like_url+"deletelike";
    }
    else{
      like_url=like_url+"insertLike";  
      likes_temp=1;
    }
    comentarios_esp[index].likes.mg=comentarios_esp[index].likes.mg+likes_temp;
    comentarios_esp[index].likes.email_like=email_copy;
    console.log("new coment esp ", comentarios_esp);
    this.setState({comentarios_esp});
   // this.setState({ likes:this.state.likes+likes_temp, liked: !this.state.liked});
    var data={email: email, idPost:comentarios_esp[index].id, categoria:'D'};
    console.log("like data ", data);
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
          name: this.state.email + '.e.'+ (Math.floor(Math.random()*99999999)+10000000) + '.jpg' }; 
        const formData = new FormData();
        formData.append('foto', source.name);
        formData.append('fotoOld', this.state.fotoOld);
        formData.append('id', this.state.idEspecie);
        formData.append('image', source);
        console.log("form: ", formData);
        fetch(url_API+ 'especie/editfoto', {
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
            })
        this.setState({ 
          ImageSource: source, loading:false, fotoOld:source.name, foto: source.name
        });
      }
    });
  }
  render() {
    const { props: { name, index, list } } = this;
    const { navigate } = this.props.navigation;
    const {nombreCient, estadoConservacion, grupoEspecie, ImagenGrupoEspecie, ubicacion, foto, email} = this.state;
    var _fecha_creac = this.state.fecha_creac;
    var fecha_creac = "";
    var date = moment(_fecha_creac).utc().format('DD-MM-YYYY HH:mm');
    var date_sub  = moment(date,'DD-MM-YYYY HH:mm').subtract(4, "hours");
    
    var format = date_sub.format('DD-MM-YYYY');
    var localLocale = moment(format, "DD-MM-YYYY");
    moment.updateLocale('es', esMoment );
    localLocale.locale(false);
    fecha_creac= localLocale.format("LL");
    const nombreGrupo = nombreGrupos[grupoEspecie-1];
    const color =  colores[grupoEspecie-1]; 
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
                       
          </Body>

          <Right style={{flex:1}}>
            <Button transparent onPress={this.guardar}>
                    <Image source={{uri:uri+"/neguen.png"}} style={{width:15, height:23.2}}  /></Button>     
            </Right>
        </Header>

        <ScrollView style={{flex:1}}>
          <TouchableOpacity style={{alignItems:'center'}} onPress={this.selectPhotoTapped.bind(this)}>{this.state.loading ?
            <ActivityIndicator size="large"/> :
            <Image source={foto=="/" ? {uri:uri+"/NoHayFoto.png"} : this.state.ImageSource} 
            style={foto=="/" ? {width:viewportHeight*.33, height:viewportHeight*.33, marginVertical:30 } :  {width:viewportHeight*.43, height:viewportHeight*.43, borderRadius:(viewportHeight*.43)/2, borderWidth:4, borderColor:'#ddd93d' }}></Image>
          }</TouchableOpacity>
          <View style={{flexDirection:'row', flex:1, justifyContent:'center', alignItems:'center', marginVertical:8}}>
              <View style={{flexDirection:'column', alignItems:'center'}}>
                <Text style={{color: '#ddd93d', fontSize: 21, textAlign:'center', fontWeight:'bold' }}>{this.state.nombre}</Text>
                <Text style={{ fontStyle:'italic', color:'#BEBEBE',  fontSize:14}}>{nombreCient}</Text>
              </View>
            {(this.state.isOwner) &&
                <TouchableOpacity onPress={ ()=> this.edit("Grupo_e", {nombre: this.state.nombre, nombreCient:this.state.nombreCient, grupoEspecie: grupoEspecie, ImagenGrupoEspecie:ImagenGrupoEspecie }, this.state.idEspecie )} disabled={!this.state.isOwner} >
                <Image source={ {uri:uri+'/pencil.png'}} style={{width:viewportWidth*.065, height:viewportWidth*.065, marginLeft:10, marginTop:0}}></Image>
              </TouchableOpacity>}
          </View>
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
              <Image source={{uri: liked}} style={{height:viewportWidth*.066, width:viewportWidth*.066, marginLeft:15 }}></Image>:
              <Image source={{uri: like}} style={{height:viewportWidth*.066, width:viewportWidth*.066, marginLeft:15 }}></Image>}
            </TouchableOpacity>
            <Text style={{fontSize:viewportWidth*.032, color:'#4A4A4A', marginTop:3, marginRight:12}}>{this.state.likes} me gusta</Text>    
          </View>
        </View>

        {(!this.state.PressInfo) ?
        <View style={styles.matriz}>
            <TouchableOpacity style={{flex:1}} onPress={ ()=> this.edit("ShowAvistMap", {nombre: this.state.nombre, ubicacion} , this.state.idEspecie)} disabled={this.state.verificado=='no'}>
              <Image source={{uri: uri+"/customMarker2.png"}} style={{marginLeft:12, width:22, height:25.6}}/> 
            </TouchableOpacity>
            <View style={{flexDirection:'row', justifyContent:'space-between', flex:1}}>
            <TouchableOpacity  onPress={ ()=> this.edit("Procedencia", {procedencia:this.state.procedencia, estadoConservacion:this.state.estadoConservacionStr }, this.state.idEspecie)} disabled={this.state.verificado=='no'}>              
              <Image source={ {uri:estadoConservacion}} style={{width:viewportWidth*.12, height:viewportWidth*.12}}></Image>
            </TouchableOpacity>
              <TouchableOpacity  onPress={ ()=> this.edit("ShowAvist", {nombre: this.state.nombre, ubicacion}, this.state.idEspecie)} disabled={this.state.verificado=='no'}>
                <Image source={ {uri:uri+'/especie/camera.png'}} style={{width:viewportWidth*.08, height:viewportWidth*.08}}></Image>
              </TouchableOpacity>
              <TouchableOpacity onPress={ ()=> this.onPressInfo() } style={{height:viewportWidth*.08,width:viewportWidth*.08}}>
                <Image source={ {uri:uri+'/especie/fichero.png'}} style={{width:viewportWidth*.08, height:viewportWidth*.08}}></Image>
              </TouchableOpacity>
            </View>
        </View>
        :
        <View style={{flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row',  marginTop:10,  paddingRight:30, borderBottomWidth: 1.6,borderBottomColor:color }}>
            <TouchableOpacity  style={ {paddingLeft:18, borderBottomWidth: 3.5,borderBottomColor: color}}>
              <Image source={{uri: this.state.ImagenGrupoEspecie}} style={{ height:viewportWidth*.15, width:viewportWidth*.15, marginRight:15}}></Image>
            </TouchableOpacity>            
            <TouchableOpacity onPress={ ()=> this.setState({PressInfo: !this.state.PressInfo}) } style={{height:viewportWidth*.08,width:viewportWidth*.08}}>
              <Image source={ {uri:uri+'/'+ficheros[grupoEspecie-1]}} style={{width:viewportWidth*.08, height:viewportWidth*.08, marginRight:20}}></Image>
            </TouchableOpacity>
        </View>
        }
        {(this.state.PressInfo) &&
          <View style={{borderBottomWidth:1,  borderBottomColor:'#BEBEBE'}}>
            <View style={{flexDirection:'row', paddingHorizontal:25, justifyContent:'space-between', borderBottomWidth:1,  borderBottomColor:color }}>
              <Text style={{ color:color,  marginVertical:15,  fontSize:15}}>Especie {this.state.procedencia}</Text>
              <Text style={{ color:color , marginVertical:15,  fontSize:15}}>{nombreGrupo}</Text>
            </View>
              {/*<Text style={{color:'#BEBEBE' , marginVertical:20, marginLeft:20, fontSize:15}}>{this.state.descripcion}</Text>*/}
              <View style={{flex:1,  flexDirection:"row", justifyContent: 'space-between', paddingHorizontal:20, borderBottomColor:color, borderBottomWidth:1.6}}>
                <TextInput underlineColorAndroid='#c4c4c4' style={{flex:1,fontSize:viewportWidth*.035, color:color}}  enablesReturnKeyAutomatically={true}
                  placeholder={"Agrega una descripción aquí"} placeholderTextColor={color} underlineColorAndroid='rgba(0,0,0,0)'
                  value={this.state.descripcion} onChangeText={descripcion => this.setState({descripcion})}>
                </TextInput>
              {this.state.descripcion.length>0 &&  <TouchableOpacity onPress={() => this.insertComentario2()} disabled={this.state.loadingComent2} >{this.state.loadingComent2 ? <ActivityIndicator/> :
                <MaterialCommunityIcons name={'send'}style= {{color: color, marginTop:15}} size={23}/>}</TouchableOpacity>
              }</View>
              <List containerStyle={{marginTop:0, borderTopWidth: 0, borderBottomWidth: 0 }}>
             {this.state.comentarios_esp.length!=0 && 
              <FlatList
                  data={this.state.comentarios_esp}
                  extraData={this.state}
                  renderItem={({ item, index }) => (
                  <View style={{flex:1 ,flexDirection:'row', opacity:0.75, backgroundColor:color}}>                     
                     <View style={{ flex:1, flexDirection:'column', borderRadius:15, marginLeft:20}}> 
                     <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize:viewportWidth*.036, color:color, marginVertical:10, color:'white', marginLeft:4}}>
                            Descripcion general</Text>
                          {(item.email==this.state.email) &&
                              <Image source={ {uri:uri+'/pencil2.png'}} style={{width:viewportWidth*.049, height:viewportWidth*.049, marginLeft:15, marginTop:10}}></Image> }    
                           
                      </View>              
                       {item.email==this.state.email && <TouchableOpacity hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }} style={{zIndex:5, width:30, height:30, position:'absolute', top:8, right:13}} 
                       onPress={() => this.MeGustaDescrip(item.likes.email_like, email, index)} disabled={this.state.loadingComent}  >
                        <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize:viewportWidth*.036, color:color, marginVertical:5, color:'white'}}>
                          {item.likes.mg}</Text>
                        {item.likes.email_like == this.state.email ?
                        <Image source={{uri: uri+'/liked_esp.png'}} style={{height:viewportWidth*.066, width:viewportWidth*.063, marginLeft:0 }}></Image>:
                        <Image source={{uri: uri+'/like_esp.png'}} style={{height:viewportWidth*.066, width:viewportWidth*.063, marginLeft:0 }}></Image>}
                        </View>
                        </TouchableOpacity>}
                        <Text style={{fontSize:viewportWidth*.039, color:'white', marginTop:10, marginLeft:4, marginHorizontal:15}}>{item.descripcion}</Text>
                        <View style={{flexDirection:'row', marginVertical:15,justifyContent:'space-between'}}>
                          <Text style={{fontSize:viewportWidth*.033, color:'white',}}>{item.fecha_creac}</Text>
                          <Text style={{fontSize:viewportWidth*.033, color:'white', marginRight:20}}>
                          {item.nombre}</Text>       
                        </View>
                      </View>
                      
                  </View>) }
                  keyExtractor={item => item.id}
                  ItemSeparatorComponent={ () =>  <View style={{height:1, width:viewportWidth, backgroundColor:'white' }}/>}
                  ListHeaderComponent={this.renderHeader}
                  //ListFooterComponent={ () => <View style={{width:viewportWidth, height:1.1, backgroundColor: '#ddd93d',borderRadius: 10,
                  //marginTop:2}} /> }
                  //onRefresh={this.handleRefresh}
                  refreshing={this.state.refreshing}
                />}
            </List>
            <View style={{}}>
                <Text style={{ color:'#787878' , marginVertical:15, marginLeft:20,  fontSize:14}}>{this.state.comentarios.length} Comentarios</Text>
            </View>
          </View>
        }



        {/*    <View style={{flexDirection:'row', marginTop:10, marginBottom:0, flex:1}}>
              <View style={{width: viewportWidth*.4, height: viewportWidth*.4}}>
              <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}  >{this.state.loading ?
                <ActivityIndicator size="large"/> :
                  <Image source={this.state.ImageSource} style={styles.imagenEspecie} ></Image>}
               </TouchableOpacity>
                <TouchableOpacity style={{position:'absolute',  left:(viewportWidth*.4)/2-(viewportWidth*.07)/2, bottom:(viewportWidth*.4)-(viewportWidth*.35)-(viewportWidth*.05)}}
                    onPress={ ()=> this.edit("EditGrupos", this.state.grupoEspecie, this.state.idEspecie)} disabled={true} >
                      <View style={{width:viewportWidth*.14, height:viewportWidth*.14}}>
                      
                      
                      <FontAwesome name={'pencil'}style= {{position:'absolute', bottom:0, right:0 , color: '#ddd93d'}} size={24}/>
                      </View>
                </TouchableOpacity>
               
              </View>
               <View style={{flexDirection:'column', marginLeft:20 }}>
               <TouchableOpacity style={{marginRight:10, flexDirection:'row'}} onPress={() => this.edit("Grupo_e", {nombre: this.state.nombre, nombreCient:this.state.nombreCient, ImagenGrupoEspecie: this.state.ImagenGrupoEspecie}, this.state.idEspecie ) } >
                  <Title style={{color: '#ddd93d', fontSize: 17}}>{this.state.nombre}</Title>
                  <FontAwesome name={'pencil'}style= {{color: '#ddd93d', marginLeft:10}} size={24}/>
               </TouchableOpacity> 
                  <Title style={{color: '#787878', fontSize: 11, marginTop:10}}>Autor fotografía {this.state.nombreUser}</Title>
                  <Text style={{fontSize:viewportWidth*.032, color:'#787878', marginTop:10}}>Le gusta a  {this.state.likes} personas</Text>
                  <View style={{flexDirection:'row', marginTop:10}} >
                    <TouchableOpacity style={{flexDirection:'row'}}  onPress={() => this.edit("Procedencia", {procedencia:this.state.procedencia, estadoConservacion:this.state.estadoConservacionStr } , this.state.idEspecie ) } >
                      <Image source={{uri: this.state.estadoConservacion}}
                      style={{width:viewportWidth*.11, height:viewportWidth*.11}}>
                      </Image>
                      <FontAwesome name={'pencil'}style= {{color: '#ddd93d', marginLeft:10}} size={24}/>
                    </TouchableOpacity>
                  </View>
               </View>
            </View>
         
            <View style={styles.matriz}>
                <TouchableOpacity  >
                    <MaterialCommunityIcons  name="pin" size={32}
                      style= {{color:'#787878',  marginTop:0}}/> 
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.MeGusta()} activeOpacity={1} disabled={!this.state.verificado} >
                  {(this.state.liked)?
                  <Image source={{uri: liked}} style={{height:viewportWidth*.09, width:viewportWidth*.10 }}></Image>:
                  <Image source={{uri: like}} style={{height:viewportWidth*.09, width:viewportWidth*.10 }}></Image>}
                </TouchableOpacity>
                <TouchableOpacity onPress={ ()=> this.setState({PressInfo: !this.state.PressInfo}) }>
                  <FontAwesome name={'file-text-o'}style= {[this.state.PressInfo ?  {color: '#ddd93d'}: {color: '#787878'} ]} size={32}/>
                </TouchableOpacity>
                <FontAwesome name={'external-link'}style= {{color: '#787878'}} size={32}/>
            </View>
        
        <View style={{width:viewportWidth, height:1.2, backgroundColor: '#ddd93d', borderRadius: 10,
            marginTop:10}} />
          {(this.state.PressInfo) &&
          <View>
          <View style={{flexDirection: 'column',padding:4, marginVertical:15, marginHorizontal:20}}  >
            <View style={{flex:1, flexDirection:'row',  justifyContent: 'space-between'}}>  
              <Text style={{fontSize:viewportWidth*.036, color:'#ddd93d',fontWeight:'bold'}}>Detalle de esta especie</Text>
              <TouchableOpacity onPress={() => this.edit("Descripcion_e", this.state.descripcion , this.state.idEspecie ) } >
                <FontAwesome name={'pencil'}style= {{color: '#ddd93d'}} size={23}/></TouchableOpacity> 
            </View>
            <Text style={{fontSize:viewportWidth*.036, color:'#4A4A4A', marginRight:25, marginVertical:10}}>{this.state.descripcion}</Text>
            <View style={{width:viewportWidth*.9, height:1.1, backgroundColor: '#c6c6c6', marginLeft: 0, marginRight: 25,borderRadius: 10,
               marginVertical:10}} />
            <View style={{flex:1, flexDirection:'row',  justifyContent: 'space-between'}}>
              <Text style={{fontSize:viewportWidth*.036, color:'#ddd93d', marginRight:25, marginBottom:10, fontWeight:'bold'}}>Procedencia</Text>
              <TouchableOpacity  ><FontAwesome name={'pencil'}style= {{color: '#ddd93d'}} size={23}/></TouchableOpacity>
            </View>
            <Text style={{fontSize:viewportWidth*.036, fontWeight:'bold', color:'#4A4A4A', marginRight:25}}>{this.state.procedencia}</Text>
          </View>
          <View style={{width:viewportWidth, height:1.2, backgroundColor: '#ddd93d', borderRadius: 10,
          marginTop:10}} />
          </View>
          }*/}


          {!this.state.PressInfo &&
        <View style={{flex:1, marginTop:8, flexDirection:"row", justifyContent: 'space-between', paddingHorizontal:20, borderBottomColor:'#DEDA3E', borderBottomWidth:1.6, borderTopColor:'#DEDA3E', borderTopWidth:1.6}}>
              <TextInput underlineColorAndroid='#c4c4c4' style={{flex:1,fontSize:viewportWidth*.035,  marginVertical:10}}  enablesReturnKeyAutomatically={true}
                placeholder={"Comenta aquí"} placeholderTextColor="#DEDA3E" underlineColorAndroid='rgba(0,0,0,0)'
                value={this.state.ingresarComentario} onChangeText={ingresarComentario => this.setState({ingresarComentario})}>
              </TextInput>
             {this.state.ingresarComentario.length>0 &&  <TouchableOpacity onPress={() => this.insertComentario()} disabled={this.state.loadingComent} >{this.state.loadingComent ? <ActivityIndicator/> :
              <Image source={ {uri:uri+'/avioncito.png'}} style={{width:viewportWidth*.065, height:viewportWidth*.065, marginVertical:30}}></Image>}</TouchableOpacity>
        }</View>}

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

export default connect(mapStateToProps, bindActions)(ConsultarEspecie);



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