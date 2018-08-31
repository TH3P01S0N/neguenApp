import React, { Component } from "react";
import { connect } from "react-redux";
import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
import {
    Button,
    Text,
    Header,
    Body,
    Container,
    Content,
    List,
    ListItem,
    StyleProvider, 
    Title,
    Icon,
    View,
    Left,
    Right
  } from "native-base";
  import { Field, reduxForm } from "redux-form";
import BlankPage2 from "../blankPage2";
import DrawBar from "../DrawBar";
import { FlatList, AsyncStorage, Image, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, TextInput} from 'react-native';
import styles from "./styles";
import {customStyle} from "./StyleMap";
import {url_API} from '../../config';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";

const uri_foto = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/uploads/";
const pines = [uri+"/pin1.png", uri+"/pin2.png",uri+"/pin3.png", uri+"/pin4.png",uri+"/pin5.png", uri+"/pin6.png",uri+"/pin7.png", uri+"/pin8.png"];
   
  
/*  const RegistrosStack = StackNavigator ({
    RegistrosTab: {
      screen: TabNavigator({
        Lista: { screen: Listareg },
        Mapareg: { screen: Mapareg },
      },{
        navigationOptions: ({ navigation }) => ({
          tabBarIcon: ({ focused, tintColor }) => {
            const { routeName } = navigation.state;
            let iconName;
            if (routeName === 'Lista') {
              iconName = `photo`;
            } else if (routeName === 'Mapareg') {
              iconName = `map-o`;
            }
            // You can return any component that you like here! We usually use an
            // icon component from react-native-vector-icons
            return <FontAwesome name={iconName} size={25}  />;
          },
      }),  
        tabBarOptions: {
          activeTintColor: 'black',
          showIcon: true,
          showLabel: false,
          inactiveTintColor: '#b2b2b2',
          style: {
            backgroundColor: 'white',
          },
          indicatorStyle: {
            backgroundColor: '#444444',
        },
        },
      }  
    )
    },
    ConsultarAvist: {screen: ConsultarAvist},
    Edittemp: {screen: Edittemp},
    EditGrupos: {screen: EditGrupos},
    Editubica: {screen: Editubica},
    DeleteAvist: {screen: DeleteAvist},
    EditEspecie: {screen:EditEspecie}
  }, {
    headerMode: 'none'
  }
);
*/
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
  class Registros extends Component {
    constructor(props){
      super(props);
      this.state= {region:{
        latitude: 0, longitude: 0, latitudeDelta: 0.005, longitudeDelta: 0.001
      }, proyectos:[], markers:[], email:"", amenazasObject:[], pin:true, camera:false, proy:false, 
      espec:false, notific:false, loading:false,loadingComent:false, especies:[], loadingEspec:false,
      pressCruz:false }
      this.consultarAvist = this.consultarAvist.bind(this);
      this.consultarEspecie = this.consultarEspecie.bind(this);
    }
    static navigationOptions = {
      header: null
    };
    componentDidMount(){
     // console.log("params ", this.props.navigation.state.params);
      this.setState({loading:true});
      AsyncStorage.getItem('email').then((email)=>{
        var datas = {email: email}
      fetch(url_API+'avistamiento/misamenazaslikecoment', {
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
             //AQUI SE AGREGAN LOS MARKERS
             var markers = [];
             var data = null;
             var likes = response.likes;
            var likes_var = {mg:0, email_like:""};
            var comentarios = response.comentarios;
            var coment_var = [];
             for(var i=0; i<response.avistamientos.length; i++){
                for (var j = 0, len_ = likes.length ; j < len_; j++){
                  if(response.avistamientos[i].idAvist==likes[j].id ){
                      likes_var.mg=likes[j].mg;
                      likes_var.email_like=likes[j].email_like;
                      break;
                  }                       
                }
                for(var l = 0, len__ = comentarios.length ; l < len__; l++){
                    if(response.avistamientos[i].idAvist==comentarios[l].idPost){
                        coment_var.push(comentarios[l]);
                    }
                }
                var localidad = response.avistamientos[i].localidad;
                data={
                  idAvist:response.avistamientos[i].idAvist, id:response.avistamientos[i].idAvist, localidad:localidad, abrirComentario:false, comentario:"",
                  idGrupoEspecie:response.avistamientos[i].idGrupoEspecie, fecha:response.avistamientos[i].fecha,likes:likes_var,
                  coords:{latitude: response.avistamientos[i].latitude, longitude: response.avistamientos[i].longitude},
                  comentarios:coment_var, nombre:response.avistamientos[i].nombre, email:email, foto:response.avistamientos[i].foto,
                }
               /*if(!localidad){
                var geocode = {
                  lat: response.avistamientos[i].latitude,
                  lng: response.avistamientos[i].longitude
                }
                Geocoder.geocodePosition(geocode).then(res => {
                  // res is an Array of geocoding object (see below)
                  localidad=res[0].locality;
                  console.log("local ", localidad);
                  data.localidad=localidad;
                  console.log("data ", data);
                  markers.push(data);
                  Avistamientos_response[i].localidad=localidad;
                   });
               } else {*/
                    console.log("data ", data);
                    markers.push(data);
                    likes_var={mg:0, email_like:""};
                coment_var= [];
              //  }
               
             }
            this.setState({email:email, amenazasObject:response.avistamientos, markers:markers, loading:false});
            var {navegar} = this.props.navigation.state.params;
            if(navegar=="Fotos") this.setState({pin:false, camera:true, proy:false, espec:false, notific:false});
            if(navegar=="Proyectos") this.ShowProy();
            if(navegar=="Notificaciones") this.setState({pin:false, camera:true, proy:false, espec:false, notific:false});
            if(navegar=="Especies") this.ShowEspecie();
          })
          Geolocation.getCurrentPosition(
            (cords) => {
              //const {latitude, longitude} = coords
              this.setState({
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
      });
      }
    consultarAvist = (idAvist) =>{
    //  console.log("from registros: ", idAvist);
      const navigateAction = NavigationActions.navigate({
        routeName: "ConsultarAvist",
        params: {idAvist:idAvist, email: this.state.email,fromDrawBar:false, verificado:'si' },
        actions: [NavigationActions.navigate({ routeName: "ConsultarAvist" })],
      })
      this.props.navigation.dispatch(navigateAction);
    }
    consultarEspecie = (idEspecie) =>{
      //this.setState({consultar:true});
      AsyncStorage.getItem('email').then((email)=>{
     // const {email} = this.props.navigation.state.params;
      const {fromDrawBar} = false;
      const {verificado} = 'si';
      const navigateAction = NavigationActions.navigate({
        routeName: "ConsultarEspecie",
        params: {idEspecie:idEspecie, email: email, fromDrawBar: false, verificado:verificado },
        actions: [NavigationActions.navigate({ routeName: "ConsultarEspecie" })],
        //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
      })
      this.props.navigation.dispatch(navigateAction);
      this.setState({consultar:false});
      });
    }
    consultarProyecto(idProyecto, cantEquipo) {
      //this.setState({consultar:true});
      const {email} = this.props.navigation.state.params;
      const {fromDrawBar} = this.props.navigation.state.params;
      const {verificado} = this.props.navigation.state.params;
      const navigateAction = NavigationActions.navigate({
        routeName: "ConsultarProyecto",
        params: {idProyecto:idProyecto, email: email, fromDrawBar: false, verificado:verificado, cantEquipo:cantEquipo },
        actions: [NavigationActions.navigate({ routeName: "ConsultarProyecto" })],
      })
      this.props.navigation.dispatch(navigateAction);
      this.setState({consultar:false});
    }
    ShowProy = () => {
      AsyncStorage.getItem('email').then((email)=> {
        this.setState({pin: false, camera:false, proy:true, espec:false, notific:false});
      var datas= {email: email}
      fetch(url_API+'proyecto/getproyectos', {
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
          var proyectos = response.proyectos;
          var proyectos_list = [];
          var ubicaciones = response.ubicacion;
          var ubicacion =  [];
          
          for(var i=0; i<proyectos.length; i++){
            for(var j=0; j<ubicaciones.length; j++){
               if(ubicaciones[j].idProyecto==proyectos[i].id){
                  var coordinate = {latitude:ubicaciones[j].latitude, longitude:ubicaciones[j].longitude};
                 // coordinate.latitude=ubicaciones[j].latitude;
                  //coordinate.longitude=ubicaciones[j].longitude;
                  ubicacion.push(coordinate);
                 // console.log("coords ", coordinate);
               }
            }
            console.log("ubicac ", ubicacion);
            var _region = getRegionForCoordinates(ubicacion);
            var item = {id:proyectos[i].id, nombre: proyectos[i].nombre, ubicacion:ubicacion, _region};
            proyectos_list.push(item);
            ubicacion=[];
          }
          console.log("proyectos ", proyectos_list);
          this.setState({proyectos:proyectos_list});
        })
      });
    }
    ShowEspecie = () => {
      this.setState({loadingEspec:true});
      AsyncStorage.getItem('email').then((email)=> {
        this.setState({pin: false, camera:false, proy:false, espec:true, notific:false});
      var datas= {email: email}
      fetch(url_API+'especie/misespecies', {
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
          var especies_array = [];
          var data = null;
             var likes = response.likes;
            var likes_var = {mg:0, email_like:""};
          console.log("response especies ", response);
           // var comentarios = response.comentarios;
           // var coment_var = [];
             for(var i=0; i<response.especies.length; i++){
                for (var j = 0, len_ = likes.length ; j < len_; j++){
                  if(response.especies[i].id==likes[j].id ){
                      likes_var.mg=likes[j].mg;
                      likes_var.email_like=likes[j].email_like;
                      break;
                  }                       
                }
                data={
                  id:response.especies[i].id,  abrirComentario:false, comentario:"",
                  idGrupoEspecie:response.especies[i].grupoEspecie,likes:likes_var,  nombreCient:response.especies[i].nombreCient,
                   nombre:response.especies[i].nombre, email:email, foto:response.especies[i].foto,
                }
                  //  console.log("data ", data);
                    especies_array.push(data);
                    likes_var={mg:0, email_like:""};
                //coment_var= [];
              //  }
               
             }
            console.log("especies ", especies_array);
            this.setState({email:email, especies:especies_array, loadingEspec:false});
        })
      });
    }
    guardar = () => { 
      console.log("guardar")  ;
      const navigateAction = NavigationActions.reset({
        index: 0,
        key: null,
        //params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, especie: this.state.especie },
        actions: [NavigationActions.navigate({ routeName: 'Mapa' })],
      })
      this.props.navigation.dispatch(navigateAction);
    }
    abrirComentario(index){
      var avistamientos = this.state.markers;
      for (var i = 0, len = avistamientos.length ; i < len; i++){
          avistamientos[i].abrirComentario= false;
      }
      avistamientos[index].abrirComentario= !avistamientos[index].abrirComentario;    
      this.setState({markers:avistamientos});
  }
  onChangeComentario = (text, index)=> {
    var avistamientos = this.state.markers;
    avistamientos[index].comentario= text;
    this.setState({markers:avistamientos});
}
insertComentario (index) {
    var idAvist = this.state.markers[index].id;
    const { email} = this.props.navigation.state.params;
    var descripcion = this.state.markers[index].comentario;
    var avistamientos = this.state.markers;
    var comentarios = avistamientos[index].comentarios;
    this.setState({loadingComent:true});
    var data = {email:email ,idPost:idAvist, descripcion, categoria:'A'} 
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
          var idInsert = response.result.insertId;
          console.log("index ", index);
          //comentariosUntouched.push({id:index,idUsuario:idUsuario, nombre:nombreUser, email:email, idPost:idProyecto, descripcion: ingresarComentario  });
          //var date = moment().format('DD-MM-YYYY HH:mm');
          if( comentarios.length==0){
            comentarios.push({id:idInsert, nombre:response.nombreUser, idPost:idAvist, descripcion: descripcion });
          }
          else{
          comentarios.unshift({id:idInsert, nombre:response.nombreUser,  idPost:idAvist, descripcion: descripcion   });
          }
          avistamientos[index].comentarios=comentarios;
          avistamientos[index].comentario='';
          avistamientos[index].abrirComentario=false;
          console.log("avist coment ", avistamientos);
          this.setState({markers:avistamientos,  loadingComent:false});
      })
    //var index = (Math.floor(Math.random()*99999999)+10000000);
    
  }
    MeGusta = (email_like, email, index, object) => {
      var liked = false;
      var email_copy = email;
      var idPost = 0;
      if(object=='A'){
        var avistamientos = this.state.markers;
        idPost=avistamientos[index].idAvist;
        console.log("idPost ", idPost);
        console.log("object ", object);
        console.log("index ", index);
      }
      else {
        var avistamientos = this.state.especies;
        idPost=avistamientos[index].id;
        console.log("idPost ", idPost);
        console.log("object ", object);
        }
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
      console.log("avist[0] ", avistamientos[index]);
      avistamientos[index].likes.mg=avistamientos[index].likes.mg+likes_temp;
      avistamientos[index].likes.email_like=email_copy;
      console.log("new avist ", avistamientos);
      if(object=='A')
        this.setState({markers:avistamientos});
      else 
      this.setState({especies:avistamientos});
     // this.setState({ likes:this.state.likes+likes_temp, liked: !this.state.liked});
      var data={email: email, idPost:idPost, categoria:object};
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
    selectPhotoTapped() {
      var veri = this.state.verificado;
      if(veri=='si'){
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
          var name = "aaa";
          ImagePicker.showImagePicker(options, (response) => {
          //  console.log('Response = ', response);
        
            if (response.didCancel) {
              console.log('User cancelled photo picker');
            }
            else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
           //   console.log('User tapped custom button: ', response.customButton);
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
                params: {ImageSource: source, email: this.state.email},
                actions: [NavigationActions.navigate({ routeName: 'Cuando' })],
                //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
              })
              this.props.navigation.dispatch(actionToDispatch)
            }
          });
        }
    };
    render(){
      const { handleSubmit, reset } = this.props;
      const { props: { name, index, list } } = this;
      const { navigate } = this.props.navigation;
      const {nombre} = this.props.navigation.state.params;
     // console.log("params ", this.props.navigation.state.params);
      const {pin, camera, proy, espec,notific, proyectos, email, loading, loadingEspec} = this.state;
     // console.log(this.state.markers);
      return (
        <Container style={styles.container}>
          <Header style={styles.header}>
          <Left style={{flex:1}}>
            <Button transparent  onPress={() => DrawerNav.navigate("DrawerOpen")}>
              <Icon  name="ios-arrow-back" style= {{color: '#8c8c8c'}} />
            </Button>
          </Left>

          <Body style={{flex:5,  justifyContent: 'center', alignItems: 'center'}}>
            <Title style={{color: '#4A4A4A', fontSize: 17}}>{nombre}</Title>
          </Body>

          <Right style={{flex:1}} >
              <Button transparent onPress={this.guardar} ><Image source={{uri:uri+"/neguen.png"}} style={{width:15, height:23.2}} /></Button>
          </Right>
        
          </Header>
        <ScrollView style={{flex:1}}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:0,  flex:1}} >
              <TouchableOpacity onPress={()=> this.setState({pin: true, camera:false, proy:false, espec:false, notific:false})} style={ {width:viewportWidth/5, alignItems:'center', borderBottomColor:'#ddd93d', borderBottomWidth:1, }}>
                <Image source={pin ? {uri: uri+"/customMarker3.png"} : {uri: uri+"/customMarker2.png"}} style={{ width:viewportHeight*.043, height:viewportHeight*.048,marginVertical:viewportHeight*.025}}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> this.setState({pin: false, camera:true, proy:false, espec:false, notific:false})} style={ {width:viewportWidth/5, alignItems:'center', borderBottomColor:'#ddd93d', borderBottomWidth:1}}>
                <Image source={camera ? {uri: uri+"/especie/cameraPress.png"} : {uri: uri+"/especie/camera.png"}} style={{ width:viewportHeight*.05, height:viewportHeight*.05,marginVertical:viewportHeight*.0234}}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.ShowProy } style={ {width:viewportWidth/5, alignItems:'center', borderBottomColor:'#ddd93d', borderBottomWidth:1, }}>
                <Image source={proy ? {uri: uri+"/proyecto/proyectoPress.png"} : {uri: uri+"/proyecto/proyecto.png"}} style={{ width:viewportHeight*.05, height:viewportHeight*.05,marginVertical:viewportHeight*.0234}}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={ this.ShowEspecie} style={ {width:viewportWidth/5, alignItems:'center', borderBottomColor:'#ddd93d', borderBottomWidth:1, }}>
                <Image source={espec ? {uri: uri+"/proyecto/ficheroPress.png"} : {uri: uri+"/especie/fichero.png"}} style={{ width:viewportHeight*.05, height:viewportHeight*.05,marginVertical:viewportHeight*.0234}}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> this.setState({pin: false, camera:false, proy:false, espec:false, notific:true})} style={ {width:viewportWidth/5, alignItems:'center', borderBottomColor:'#ddd93d', borderBottomWidth:1, }}>
                <Image source={notific ? {uri: uri+"/notificacionesPress.png"} : {uri: uri+"/notificaciones.png"}} style={{ width:viewportHeight*.05, height:viewportHeight*.05,marginVertical:viewportHeight*.0234}}/>
              </TouchableOpacity>
          </View>
          {(camera) &&
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <FlatList
                 data={this.state.markers}
                  extraData={this.state}
                  renderItem={({item, index}) => 
                        <View style={{flex:1, flexDirection: 'column',  paddingTop:viewportHeight*.0156}}>
                        <View>
                            <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', marginHorizontal:viewportHeight*.0312, paddingBottom:viewportHeight*.0156, marginTop:0}}>
                                <View style={{flexDirection:'row'}}>
                                    <Image source={{uri: uri_foto+item.email+"/"+item.email+".jpg"}} style={{width:viewportWidth*.14, height:viewportWidth*.14, borderRadius:viewportWidth*.07,  borderColor: '#DEDA3E' ,borderWidth:1.5}} />
                                        <View style={{ flexDirection:'column', marginLeft:10, marginTop:5}}>
                                            <Text style={{color: '#1E1E32', fontSize: viewportHeight*0.022}} numberOfLines={1}>{item.nombre}</Text>
                                            <Text style={{color: '#787878', fontSize: viewportHeight*0.022}} numberOfLines={1}>{item.localidad}</Text>
                                        </View>
                                </View>
                            <TouchableOpacity onPress={() => this.consultarAvist(item.idAvist) } >    
                                <Image source={{uri: pines[item.idGrupoEspecie-1]}} style={{marginLeft:viewportHeight*0.03, width:viewportHeight*0.034, height:viewportHeight*0.039, marginTop:7}}/>                                     
                            </TouchableOpacity>
                            </View>
                            <Image style={{width: viewportWidth, height: viewportHeight*0.46,justifyContent: 'center',alignItems: 'center'}} source={{uri: uri_foto+item.email+"/" +item.foto}}></Image> 
                        </View>
                        <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:15}}>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{color: '#FA511D', fontSize: viewportHeight*.022, marginLeft:viewportHeight*0.039}} numberOfLines={1}>{item.likes.mg}</Text>
                                <TouchableOpacity onPress={() => this.MeGusta(item.likes.email_like, email, index, 'A')} activeOpacity={1}>
                                    {item.likes.email_like == email ?
                                    <Image source={{uri: uri+"/liked.png"}} style={{height:viewportHeight*0.034, width:viewportHeight*0.034, marginLeft:3 }}></Image>:
                                    <Image source={{uri: uri+"/like.png"}} style={{marginLeft:3, width:viewportHeight*0.034, height:viewportHeight*0.034}}/> }
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.abrirComentario(index)  }>
                                    <Image source={{uri: uri+"/coment.png"}} style={{marginLeft:10, width:viewportHeight*0.034, height:viewportHeight*0.034}}/>  
                                </TouchableOpacity>
                            </View>
                            <Text style={{color: '#787878', fontSize: viewportHeight*.022,  marginRight:viewportHeight*0.03}} numberOfLines={1}>{item.fecha}</Text>

                        </View>
                        {item.abrirComentario &&
                            <View style={{flex:1, marginTop:3, flexDirection:"row", justifyContent: 'space-between', paddingHorizontal:20, borderBottomColor:'#DEDA3E', borderBottomWidth:1.6, borderTopColor:'#DEDA3E', borderTopWidth:1.6}}>
                            <TextInput underlineColorAndroid='#c4c4c4' style={{flex:1,fontSize:viewportWidth*.035,  marginVertical:0}}  enablesReturnKeyAutomatically={true}
                              placeholder={"Comenta aquí"} placeholderTextColor="#DEDA3E" underlineColorAndroid='rgba(0,0,0,0)'
                              value={item.comentario} onChangeText={text => this.onChangeComentario(text,index)}>
                            </TextInput>
                           {item.comentario.length>0 &&  <TouchableOpacity onPress={() => this.insertComentario(index)} disabled={this.state.loadingComent} >{this.state.loadingComent ? <ActivityIndicator/> :
                            <Image source={ {uri:uri+'/avioncito.png'}} style={{width:viewportWidth*.065, height:viewportWidth*.065, marginTop:30}}></Image>}</TouchableOpacity>
                      }</View>

                        }
                        {item.comentarios && <FlatList
                            contentContainerStyle={{flexGrow: 1, marginTop:10 }}
                            data={item.comentarios}
                            extraData={this.state}
                            renderItem={({item})=>
                            <View style={{  flexDirection:'row', marginHorizontal:viewportHeight*.0312}}>
                                <Text style={{color: '#1E1E32',  fontSize: viewportHeight*.022}}> {item.nombre}  </Text>
                                <Text style={{color: '#787878', fontSize: viewportHeight*.022}}>{item.descripcion}</Text>
                                
                            </View>
                            }
                            keyExtractor={(coments) => coments.id}
                            ListFooterComponent={() => <View style={{marginVertical:viewportHeight*.0156}}/>}
                        /> } 
                        </View> 
                    }
                  //renderItem={({item, index}) =>
                   

                 /*  <View style={{flex:1, flexDirection: 'column', marginVertical: 10}}>
                      <TouchableOpacity onPress={()=> this.consultarAvist(item.idAvist)}  >
                      <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', marginHorizontal:20}}>
                        <Text style={{color: '#ddd93d', fontSize: 17}} numberOfLines={1}>{item.nombre}
                         </Text>
                         <View style={{ flexDirection:'column'}}>
                            <Image source={{uri: uri+"/customMarker2.png"}} style={{marginLeft:20, width:27, height:30.9}} />
                              <Text style={{color: '#787878', fontSize: 17}} numberOfLines={1}>{item.localidad}</Text>
                          </View>
                          </View>
                        <Image style={{width: viewportWidth, height: viewportHeight*0.4,justifyContent: 'center',alignItems: 'center'}} source={{uri: uri_foto+this.state.email+"/" +item.foto}}></Image> 
                      </TouchableOpacity>
                    </View> */
                   
                  ListEmptyComponent={
                    <View style={{flex:1, justifyContent:'center', alignItems:'center', width:viewportWidth, height:viewportHeight*.65}}>
                      <Image style={{justifyContent:'center', alignItems:'center', width: viewportHeight*.3, height: viewportHeight*.3}} source={{uri: uri+"/NoHayCamera.png"}}></Image>
                    </View>
                  }
                  numColumns = {1}
                  keyExtractor={(item) => item.idAvist}
                /> 
            </View>}{ pin &&   loading ?
            <ActivityIndicator /> : pin &&
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{flex:1, zIndex:-1,  height: viewportHeight-20, width:viewportWidth }}
              region={this.state.region}
              showsUserLocation={true}
              showsMyLocationButton={true}
              showsCompass={true}
              customMapStyle={customStyle}
              >
              {this.state.markers.map(marker => (
               <MapView.Marker 
                 key={marker.id}
                 coordinate={marker.coords}
                 onPress={()=> this.consultarAvist(marker.id)}
                 image={pines[marker.idGrupoEspecie-1]}                 
                 //title={marker.title}
               />
             ))}
            </MapView>
          }
          { proy &&  
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <FlatList 
              data= {proyectos}
              extraData={this.state}
              renderItem={({item}) => 
              <View style={{flex:1, flexDirection: 'column', marginVertical: viewportHeight*.0234}}>
                <TouchableOpacity onPress={()=> this.consultarProyecto(item.id,1)}>
                <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
                  <View style={{flex:1, flexDirection:'row',  marginLeft:viewportHeight*.0234}}>
                    <Image source={{uri: uri_foto+email+ '/' + email + '.jpg?'}} 
                      style={{height:viewportHeight*.07, width:viewportHeight*.07, borderRadius:(viewportHeight*.07)/2, borderWidth:2, borderColor:'#DEDA3E'}}/>
                    <View style={{flexDirection:'column', marginLeft:10, justifyContent: 'center'}}>
                      <Text style={{color: '#1E1E32', fontSize: viewportHeight*.025}} numberOfLines={1}>{item.nombre}</Text>
                      <Text style={{color: '#787878', fontSize: viewportHeight*.017}} numberOfLines={1}>{nombre}</Text>
                    </View>
                  </View>
                   <View style={{ flexDirection:'column',justifyContent: 'center' }}>
                      <Image source={{uri: uri+"/proyecto/proyecto.png"}} style={{marginRight:20, width:viewportHeight*.042, height:viewportHeight*.042}} />
                    </View>
                </View>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        customMapStyle={customStyle}
                        liteMode={true}
                        style={{height: viewportHeight*.34, width:viewportWidth, marginTop:10}}
                        scrollEnabled={false}
                        region={item._region}>
                        
                        <Polygon
                          key={item.id}

                          coordinates={item.ubicacion}
                          lineCap="round"
                          lineJoin="round"
                          strokeColor="rgba(255,81,29,0.9)"
                          fillColor="rgba(255,81,29,0.5)"
                          strokeWidth={3}
                      />
                    </MapView>
                </TouchableOpacity>
              </View> 
            }
            ListEmptyComponent={
              <View style={{flex:1, justifyContent:'center', alignItems:'center', width:viewportWidth, height:viewportHeight*.65}}>
                <Image style={{width: viewportHeight*.3, height: viewportHeight*.3,  justifyContent: 'center',alignItems: 'center'}} source={{uri: uri+"/NoHayProys.png"}}></Image>
              </View>
            }
            numColumns = {1}
            keyExtractor={(item) => item.id}
          /> 
          </View>
          }
          { espec && loadingEspec ? 
            <ActivityIndicator/> : espec &&
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',  }}>
              <FlatList
                 data={this.state.especies}
                  extraData={this.state}
                  renderItem={({item, index}) => 
                    <TouchableOpacity onPress={() => this.consultarEspecie(item.id) }  style={{flex:1,  flexDirection: 'row', width:viewportWidth , justifyContent:'space-between' ,  paddingVertical:15, borderBottomColor:'rgba(190,190,190,0.4)', borderBottomWidth:2}}>
                      <View style={{flexDirection:'row', marginLeft:viewportHeight*.032, }}>
                        <View style={{width: viewportHeight*.125, height: viewportHeight*.125, backgroundColor:'#DEDA3E', borderRadius:viewportHeight*.0625,justifyContent: 'center',alignItems: 'center'}}>
                      {item.foto!='/' ?
                          <Image style={{width: viewportHeight*.125, height: viewportHeight*.125, borderColor:'#DEDA3E', borderRadius:viewportHeight*.0625, borderWidth:3, justifyContent: 'center',alignItems: 'center'}} source={{uri: uri_foto+item.email+"/" +item.foto}}></Image>:
                          <Image source={camera ? {uri: uri+"/especie/camera.png"} : {uri: uri+"/especie/camera.png"}} style={{ width:viewportHeight*.053, height:viewportHeight*.053}}/>
                          }
                          </View>
                          <View style={{flexDirection:'column', marginLeft:viewportHeight*.032,justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={{color: '#1E1E32', fontSize: viewportHeight*.022, maxWidth:viewportHeight*.234, fontWeight:'bold'}}  numberOfLines={1}>{item.nombre}</Text>
                            <Text style={{color: '#787878', fontSize: viewportHeight*.017, fontStyle:'italic'}} numberOfLines={1}>{item.nombreCient}</Text>
                            <View style={{flexDirection:'row', marginTop:5}}>
                              <Text style={{color: '#FA511D', fontSize: viewportHeight*.022, marginLeft:0}} numberOfLines={1}>{item.likes.mg}</Text>
                              <TouchableOpacity onPress={() => this.MeGusta(item.likes.email_like, email, index, 'E')} activeOpacity={1}>
                                        {item.likes.email_like == email ?
                                        <Image source={{uri: uri+"/liked.png"}} style={{height:viewportHeight*.034, width:viewportHeight*.034, marginLeft:3 }}></Image>:
                                        <Image source={{uri: uri+"/like.png"}} style={{marginLeft:3, width:viewportHeight*.034, height:viewportHeight*.034}}/> }
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center',marginRight:viewportHeight*.042 }}>
                          <Image source={{uri: uri+"/especie/fichero.png"}} style={{width:viewportHeight*.042, height:viewportHeight*.042}} />
                        </View>
                    </TouchableOpacity>
                  }
                  ListEmptyComponent={
                    <View style={{flex:1, justifyContent:'center', alignItems:'center', width:viewportWidth, height:viewportHeight*.65}}>
                      <Image style={{width: viewportHeight*.3, height: viewportHeight*.3,  justifyContent: 'center',alignItems: 'center'}} source={{uri: uri+"/NoHayEspec.png"}}></Image>
                    </View>
                  }
                  numColumns = {1}
                  ListFooterComponent={
                    <View  />
                  }
                  keyExtractor={(item) => item.id}
              />
            </View>

          }
       
        </ScrollView>
        <View style={styles.cruz}>
              <TouchableOpacity
                onPress={ ()=> this.setState({pressCruz: !this.state.pressCruz}) }
                style={styles.cruzButton}>
                <MaterialCommunityIcons  name="plus" size={60}
              style= {{color:'#FFFFFF', marginLeft:5, marginTop:3 }}/>             
              </TouchableOpacity>
        </View>
        <View style={styles.avistamiento}>
              <TouchableOpacity
                onPress={ () => navigate("Grupo_e", {navigation: this.props.navigation, email:this.state.email, modulo:"home", id:0}) }
                style={[styles.avistamientoButton, this.state.pressCruz && styles.avistamientoButtonShow]}>
                <Image source={{uri:uri+"/especies.png"}}
                  style= {{height: 60, width: 60, marginLeft:0, marginTop:0 }}></Image>             
              </TouchableOpacity>
        </View>
        <View style={styles.registro}>
              <TouchableOpacity
                onPress={this.selectPhotoTapped.bind(this)}
                style={[styles.avistamientoButton, this.state.pressCruz && styles.avistamientoButtonShow]}>
                <Image source={{uri:uri+"/avistamientos.png"}}
                  style= {{height: 60, width: 60, marginLeft:0, marginTop:0 }}></Image>              
              </TouchableOpacity>
        </View>
        <View style={styles.proyecto}>
              <TouchableOpacity
                onPress={ () => navigate("Proyecto", {navigation: this.props.navigation, email:this.state.email, modulo:"home"})}
                style={[styles.avistamientoButton, this.state.pressCruz && styles.avistamientoButtonShow]}>
                <Image source={{uri:uri+"/proyectos.png"}}
                  style= {{height: 60, width: 60, marginLeft:0, marginTop:0 }}></Image>             
              </TouchableOpacity>
        </View>
        </Container>
      );
    }
  }

  
  const RegSwag = reduxForm(
    {
      form: "test"
    },
    function bindActions(dispatch) {
      return {
        setUser: name => dispatch(setUser(name)),
        openDrawer: () => dispatch(openDrawer())
      };
    }
  )(Registros);
  RegSwag.navigationOptions = {
    header: null
  };
 /* function bindAction(dispatch) {
    return {
      setIndex: index => dispatch(setIndex(index)),
      openDrawer: () => dispatch(openDrawer())
    };
  }
  const mapStateToProps = state => ({
    name: state.user.name,
    list: state.list.list
  });*/
  
  //const editSwagger = connect(mapStateToProps, bindAction)(Editprofile);
  
  const DrawNav = DrawerNavigator(
    {
      Registros: { screen: RegSwag },
      BlankPage2: { screen: BlankPage2 },
      
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