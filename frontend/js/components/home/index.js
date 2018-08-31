import React, { Component } from "react";
import { TouchableOpacity, FlatList, TextInput, ActivityIndicator, Image, Dimensions, ScrollView, PermissionsAndroid,Alert , AsyncStorage} from "react-native";
import { connect } from "react-redux";
import BlankPage2 from "../blankPage2";
import DrawBar from "../DrawBar";
import MapView, {Marker,PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { DrawerNavigator, NavigationActions } from "react-navigation";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
  View,
  Toast
} from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {url_API} from "../../config";
import { setIndex } from "../../actions/list";
import { openDrawer } from "../../actions/drawer";
import styles from "./styles";
import Loading from "./../loaders/Loading";
import ImagePicker from 'react-native-image-picker';
import {customStyle} from './mapStyle';
import NavigationBar from 'react-native-navbar-color'
//const neguen = require("../../../images/neguenChico.png");
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const uri_foto = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/uploads/";
const llama = uri + "/especies.png";
const AvistIcon = uri + "/avistamientos.png";
const ProyIcon = uri + "/proyectos.png";
const pines = [uri+"/pin1.png", uri+"/pin2.png",uri+"/pin3.png", uri+"/pin4.png",uri+"/pin5.png", uri+"/pin6.png",uri+"/pin7.png", uri+"/pin8.png"];
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
class Mapa extends Component {
  constructor(props){
    super(props);
    this.state={
      region:{
        latitude: 0, longitude: 0, latitudeDelta: 0.005, longitudeDelta: 0.001
      },
      position:{
        latitude: 0 , longitude: 0
      },
      pressCruz: false, tabBar:true, loadingComent:false,
      isLoading: true, ImageSource: null, email:"", markers:[], verificado:'no'
    }
  }
  static navigationOptions = {
    header: null
  };
  static propTypes = {
    name: React.PropTypes.string,
    setIndex: React.PropTypes.func,
    list: React.PropTypes.arrayOf(React.PropTypes.string),
    openDrawer: React.PropTypes.func
  };
  async  requestLocationPermissions() {
    /*try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Neguen App Ubicacion Permiso',
          'message': 'Neguen App needs access to your ubication '
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera")
      } else {
        console.log("Camera permission denied")
      }
    } catch (err) {
      console.warn(err)
    }*/
    const chckLocationPermission = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (chckLocationPermission === PermissionsAndroid.RESULTS.GRANTED) {
        alert("You've access for the location");
    } else {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Cool Location App required Location permission',
                    'message': 'We required Location permission in order to get device location ' +
                        'Please grant us.'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                alert("You've access for the location");
            } else {
                alert("You don't have access for the location");
            }
        } catch (err) {
            alert(err)
        }
    }
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
    _findMe = async ()=> {
   // (async () => {
   //   await requestLocationPermissions();
    //  }) ();
   /* const chckLocationPermission = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (chckLocationPermission === PermissionsAndroid.RESULTS.GRANTED) {
        alert("You've access for the location");
    } else {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Cool Location App required Location permission',
                    'message': 'We required Location permission in order to get device location ' +
                        'Please grant us.'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                alert("You've access for the location");
            } else {
                alert("You don't have access for the location");
            }
        } catch (err) {
            alert(err)
        }
    }*/
    Geolocation.getCurrentPosition(
      (cords) => {
        //const {latitude, longitude} = position
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
    NavigationBar.setStatusBarTheme('light',true)
     this.setState({isLoading: false});
     fetch(url_API + 'avistamiento/avistamientoslikecomment', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
         // body: 1// JSON.stringify(data)
      })
      .then(function(response) {
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response.json();
      }).then(response=> {
        this.setState({loading: false});
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
                data={
                  idAvist:response.avistamientos[i].idAvist, id:response.avistamientos[i].idAvist, nombreEsp:response.avistamientos[i].nombreEsp, abrirComentario:false, comentario:"",
                  idGrupoEspecie:response.avistamientos[i].idGrupoEspecie, fecha:response.avistamientos[i].fecha,likes:likes_var,
                  coords:{latitude: response.avistamientos[i].latitude, longitude: response.avistamientos[i].longitude},
                  comentarios:coment_var, nombre:response.avistamientos[i].nombre, email:response.avistamientos[i].email, foto:response.avistamientos[i].foto,
                }
              //  console.log("data ", data);
                    markers.push(data);
                    likes_var={mg:0, email_like:""};
                coment_var= [];
              }
                this.setState({ markers:markers, loading:false});
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

  /*  this.watchID = navigator.geolocation.watchPosition(
      (cords) => {
        //const {lat, long} = coords
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
    },//(error) => alert(JSON.stringify(error)),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 0});*/
    AsyncStorage.getItem('email').then((email) => {
        this.setState({email:email})
    });
    AsyncStorage.getItem('verificado').then((verificado) => {
      if(verificado=='no'){
        Toast.show({text:"Por favor verifique la cuenta de correo", buttonText: "Ok", type: "warning", position:"bottom"})
      }
      this.setState({verificado:verificado})
  });
  }
  componentWillUnmount() {
  //  navigator.geolocation.clearWatch(this.watchID);
   // navigator.geolocation.stopObserving();
  }
  newPage(index) {
    this.props.setIndex(index);
    Actions.blankPage();
  }
  consultarAvist(idAvist) {
    const navigateAction = NavigationActions.navigate({
      routeName: "ConsultarAvist",
      params: {idAvist:idAvist, email: this.state.email, fromDrawBar: false, verificado:this.state.verificado },
      actions: [NavigationActions.navigate({ routeName: "ConsultarAvist" })],
      //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
    })
    this.props.navigation.dispatch(navigateAction);
  }
  abrirComentario(index){
    var {markers} = this.state;
    for (var i = 0, len = markers.length ; i < len; i++){
        markers[i].abrirComentario= false;
    }
    markers[index].abrirComentario= !markers[index].abrirComentario;    
    this.setState({markers});
}
MeGusta = (email_like, email, index) => {
    var liked = false;
    var email_copy = email;
    var avistamientos = this.state.markers;
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
    avistamientos[index].likes.mg=avistamientos[index].likes.mg+likes_temp;
    avistamientos[index].likes.email_like=email_copy;
   // console.log("new avist ", avistamientos);
    this.setState({markers:avistamientos});
   // this.setState({ likes:this.state.likes+likes_temp, liked: !this.state.liked});
    var data={email: email, idPost:avistamientos[index].idAvist, categoria:'A'};
   // console.log("like data ", data);
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
  onChangeComentario = (text, index)=> {
    var avistamientos = this.state.markers;
    avistamientos[index].comentario= text;
    this.setState({markers:avistamientos});
}
insertComentario (index) {
    var idAvist = this.state.markers[index].id;
    const { email} = this.state;
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
          //console.log("avist coment ", avistamientos);
          this.setState({markers: avistamientos,  loadingComent:false});
      })
    //var index = (Math.floor(Math.random()*99999999)+10000000);
    
  }
  render() {
    const { navigate } = this.props.navigation;
    const { loading } = this.props; 
    const {tabBar, email} = this.state;
   // const email = this.props.navigation.getParam('email', 'correo');
    //const {email} = this.props.navigation.state.params;
    return (
      <Container style={styles.container}>
       
        <Header style={{backgroundColor:'#FFFFFF'}}>
        <Left>
            <Button 
              transparent
              onPress={() => DrawerNav.navigate("DrawerOpen")}>
              <Image source={{uri: uri+"/person.png"}} style={{ width:viewportHeight*.035, height:viewportHeight*.035,marginVertical:viewportHeight*.015}}/>
            </Button>            
          </Left>
          <Body style={{flex:4, alignItems:'center'}}>
            {/*<Title></Title>*/}
           
             <Image source={{uri: uri+ "/neguenHome.png"}} style={{marginLeft:25, height:viewportHeight*.0468, width:viewportHeight*.1189}} ></Image>
            
          </Body>
          <Right>

            <Button
              transparent
              onPress={() => navigate("Explorar", {navigation: this.props.navigation, email:this.state.email, verificado:this.state.verificado})}>
              <Image source={{uri: uri+"/lupa.png"}} style={{ width:viewportHeight*.035, height:viewportHeight*.035,marginVertical:viewportHeight*.015}}/>
            </Button>
          </Right>
          
        </Header>
        <View style={{flex:1}}>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginVertical:0}} >
              <TouchableOpacity onPress={()=> this.setState({tabBar: true})} style={[this.state.tabBar ? {width:viewportWidth/2, alignItems:'center', borderBottomColor:'#ddd93d', borderBottomWidth:4} : {width:viewportWidth/2, alignItems:'center', borderBottomColor:'#ddd93d', borderBottomWidth:1}]}>
                {/*<FontAwesome name={"image"} size={25} style= {[this.state.tabBar ? {color: '#ddd93d',marginVertical:20} : {color:'#b2b2b2', marginVertical:20,} ]} />*/}
                <Image source={tabBar ? {uri: uri+"/customMarker3.png"} : {uri: uri+"/customMarker2.png"}} style={{ width:viewportHeight*.028, height:viewportHeight*.033,marginVertical:viewportHeight*.015}}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> this.setState({tabBar: false})} style={[this.state.tabBar ? {width:viewportWidth/2, alignItems:'center', borderBottomColor:'#ddd93d', borderBottomWidth:1} : {width:viewportWidth/2, alignItems:'center', borderBottomColor:'#ddd93d', borderBottomWidth:4} ]}>
                {/*<FontAwesome name={"map-o"} size={25} style= {[this.state.tabBar ? {color: '#b2b2b2',marginVertical:20} : {color:'#ddd93d', marginVertical:20,} ]} />*/}
                <Image source={tabBar ? {uri: uri+"/especie/camera.png"} : {uri: uri+"/especie/cameraPress.png"}} style={{ width:viewportHeight*.035, height:viewportHeight*.035,marginVertical:viewportHeight*.015}}/>
              </TouchableOpacity>
        </View>
        {(!tabBar) ?
            <ScrollView style={{ flex: 1, }}>
              <FlatList
                    data={this.state.markers}
                    extraData={this.state}
                    style={{flex:1}}
                    renderItem={({item, index}) => 
                        <View style={{flex:1, flexDirection: 'column',  paddingTop:10}}>
                        <View>
                            <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', marginHorizontal:20, paddingBottom:10, marginTop:0}}>
                                <View style={{flexDirection:'row'}}>
                                    <Image source={{uri: uri_foto+item.email+"/"+item.email+".jpg"}} style={{width:viewportWidth*.14, height:viewportWidth*.14, borderRadius:viewportWidth*.07,  borderColor: '#DEDA3E' ,borderWidth:1.5}} />
                                        <View style={{ flexDirection:'column', marginLeft:10, marginTop:5}}>
                                            <Text style={{color: '#1E1E32', fontSize: 14.5}} numberOfLines={1}>{item.nombre}</Text>
                                            <Text style={{color: '#787878', fontSize: 14.5}} numberOfLines={1}>{item.nombreEsp}</Text>
                                        </View>
                                </View>
                            <TouchableOpacity onPress={() => this.consultarAvist(item.id) } >    
                                <Image source={{uri: pines[item.idGrupoEspecie-1]}} style={{marginLeft:20, width:22, height:25.2, marginTop:7}}/>                                     
                            </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => this.consultarAvist(item.id) } > 
                              <Image style={{width: viewportWidth, height: viewportHeight*0.46,justifyContent: 'center',alignItems: 'center'}} source={{uri: uri_foto+item.email+"/" +item.foto}}></Image> 
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:15}}>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{color: '#FA511D', fontSize: 14.1, marginLeft:25}} numberOfLines={1}>{item.likes.mg}</Text>
                                <TouchableOpacity onPress={() => this.MeGusta(item.likes.email_like, email, index)} activeOpacity={1}>
                                    {item.likes.email_like == email ?
                                    <Image source={{uri: uri+"/liked.png"}} style={{height:22, width:22, marginLeft:3 }}></Image>:
                                    <Image source={{uri: uri+"/like.png"}} style={{marginLeft:3, width:22, height:22}}/> }
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.abrirComentario(index)  }>
                                    <Image source={{uri: uri+"/coment.png"}} style={{marginLeft:10, width:22, height:22}}/>  
                                </TouchableOpacity>
                            </View>
                            <Text style={{color: '#787878', fontSize: 14.1,  marginRight:20}} numberOfLines={1}>{item.fecha}</Text>

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
                            <View style={{  flexDirection:'column', marginHorizontal:20}}>
                                <Text style={{color: '#1E1E32',  fontSize: 13.5}}> {item.nombre}:  </Text>
                                <Text style={{color: '#787878', fontSize: 13.5, textAlign:"justify" }}>{item.descripcion}</Text>
                                
                            </View>
                            }
                            keyExtractor={(coments) => coments.id}
                            ListFooterComponent={() => <View style={{marginVertical:10}}/>}
                        /> } 
                        </View> 
                    }
                    numColumns = {1}
                    ItemSeparatorComponent={() => <View style={{height:1, opacity:0.4,  width:viewportWidth, backgroundColor:'#BEBEBE'}}/> }
                    keyExtractor={(item) => item.idAvist}
                />
            </ScrollView>:
          <View style={{flex:1}}>
        <View style={styles.vista}>
          <TouchableOpacity
           transparent
            activeOpacity={0.9}
            style={styles.mapButton}
            onPress={ this._findMe }
          ><MaterialCommunityIcons  name="near-me" size={30}
              style= {styles.navigate}/></TouchableOpacity>
        </View>
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
                <Image source={{uri:llama}}
                  style= {{height: 60, width: 60, marginLeft:0, marginTop:0 }}></Image>             
              </TouchableOpacity>
        </View>
        <View style={styles.registro}>
              <TouchableOpacity
                onPress={this.selectPhotoTapped.bind(this)}
                style={[styles.avistamientoButton, this.state.pressCruz && styles.avistamientoButtonShow]}>
                <Image source={{uri:AvistIcon}}
                  style= {{height: 60, width: 60, marginLeft:0, marginTop:0 }}></Image>              
              </TouchableOpacity>
        </View>
        <View style={styles.proyecto}>
              <TouchableOpacity
                onPress={ () => navigate("Proyecto", {navigation: this.props.navigation, email:this.state.email, modulo:"home"})}
                style={[styles.avistamientoButton, this.state.pressCruz && styles.avistamientoButtonShow]}>
                <Image source={{uri:ProyIcon}}
                  style= {{height: 60, width: 60, marginLeft:0, marginTop:0 }}></Image>             
              </TouchableOpacity>
        </View>
        <MapView
          style={ [styles.map, this.state.pressCruz && styles.mapOscuro] }
          provider={PROVIDER_GOOGLE}
          region={this.state.region}
          showsUserLocation={true}
          customMapStyle={customStyle}>
          {this.state.markers.map(marker => (
            <MapView.Marker 
              key={marker.id}
              coordinate={marker.coords}
              onPress={()=> this.consultarAvist(marker.id)}
              image={pines[marker.idGrupoEspecie-1]}
              //title={marker.stitle}
            />
          ))}
        </MapView>
        </View>
         }
         </View>  
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    setIndex: index => dispatch(setIndex(index)),
    openDrawer: () => dispatch(openDrawer())
  };
}
const mapStateToProps = state => ({
  name: state.user.name,
  list: state.list.list,
  loading: state.app.loading,
});

const HomeSwagger = connect(mapStateToProps, bindAction)(Mapa);
const DrawNav = DrawerNavigator(
  {
    Mapa: { screen: HomeSwagger },
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
