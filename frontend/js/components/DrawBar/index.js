import React from "react";
import { AppRegistry, Image, TouchableOpacity, AsyncStorage, ActivityIndicator, Dimensions } from "react-native";
import {
  Button,
  Text,
  Container,
  List,
  ListItem,
  Content,
  StyleProvider, 
  getTheme,
  Icon,
  View,
} from "native-base";  MaterialIcons
import { connect } from "react-redux";
import Mapa from "../home";
import { setIndex } from "../../actions/list";
import { DrawerNavigator, NavigationActions } from "react-navigation";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {url_API} from "../../config";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const routes = ["Mapa", "Fotos", "Proyectos", "Especies" , "Notificaciones"];
const routesArray = ["Mapa_", "Fotos", "Proyectos", "Especies" , "Notificaciones"];
const routes2 = ["Editar perfil", "Acerca de Neguen"];
const uri_foto = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/uploads/";
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
export default class DrawBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: "", email: "", foto:null, verificado:"", loading:false, seguidores:"", seguidos:"",
      descripcion:""
    };
    this.logout = this.logout.bind(this);
    this.navegar = this.navegar.bind(this);
   // this._bootstrapAsync();
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
  componentDidMount(){
    this.setState({loading:true});
    AsyncStorage.getItem('verificado').then((verificado) => {
      this.setState({verificado:verificado})
  });
    AsyncStorage.getItem('email').then((email) => {
      fetch( 'http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/api/users/'+email, {
              method: 'GET',
              headers: {  
              'Accept': 'application/json',
              'Content-Type': 'application/json', }       
            })
            .then((response) => response.json())
          .then(response=> {
            var  url2= uri_foto+email + '/' + email + '.jpg?'+ Math.random();
              if (response.success) {  
                this.setState({nombre: response.message, foto: url2});
                
            } else {
              this.setState({nombre: response.message, email: email, foto:url2});
          }   
        })
        var data = {email:email }
        fetch(url_API+'users/perfildrawbar', {
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
                var seguidores=response.message.seguidores;
                var seguidos=response.message.seguidos;
                if(!seguidores) seguidores=0;
                if(!seguidos) seguidos=0;
                console.log("consultar perfil: ", response.message);
                this.setState({seguidores:seguidores, seguidos:seguidos, descripcion:response.message.descripcion,   loading:false});
                 })
          });
  }
  newPage(index) {
    this.props.setIndex(index);
    Actions.blankPage();
  }
  navegar = (navegar) => {
    AsyncStorage.getItem('email').then((email) => {
    console.log("email: ", email);
    const navigateAction = NavigationActions.navigate({
      routeName: "Registros",
      params: {email: email, verificado: this.state.verificado, navegar, nombre:this.state.nombre },
      actions: [NavigationActions.navigate({ routeName: "Registros" })],
      //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
    })
    this.props.navigation.dispatch(navigateAction);
  })
  }
  logout = async () => {
    try {
      await AsyncStorage.removeItem('id_token');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('verificado');
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
  render() {
    const {nombre, descripcion, seguidores, seguidos} = this.state;
    return (
      <Container transparent >
        <View style={{flex:1, backgroundColor:'rgba(222,218,62,0.1)'}}>

            <View style={{paddingTop:30, paddingLeft:5, paddingBottom:5, flexDirection: 'row', backgroundColor:'rgba(222,218,62,0.4)'}}>
                <Image style={{height:80, width:80,borderRadius: 80, marginLeft:15, marginRight:15,
                resizeMode: 'cover', borderWidth:2, borderColor:'#DEDA3E'}} source={{uri: this.state.foto}}></Image>
                <View style={{flexDirection:'column'}}>
                  <Text style={{marginTop:10, fontWeight:'bold', fontSize:viewportHeight*0.026, color:'#1E1E32'}}>{nombre}</Text>
                  <Text style={{marginTop:5, fontSize:viewportHeight*.02}}>{descripcion}</Text>
                </View>
            </View>
            <View style={{flexDirection:'row' , backgroundColor:'rgba(222,218,62,0.4)'}}>
            <View style={{flexDirection:'column', marginLeft:20, marginVertical:20 }}>
                  <Text style={{color: '#4A4A4A', fontSize: 17}}>     0</Text>
                  <Text style={{color: '#4A4A4A', fontSize: 11, marginTop:10}}>Registros</Text>
               </View>
               <View style={{flexDirection:'column', marginLeft:20, marginVertical:20  }}>
                  <Text style={{color: '#4A4A4A', fontSize: 17}}>     {seguidores}</Text>
                  <Text style={{color: '#4A4A4A', fontSize: 11, marginTop:10}}>Seguidores</Text>
               </View>
               <View style={{flexDirection:'column', marginLeft:20, marginVertical:20  }}>
                  <Text style={{color: '#4A4A4A', fontSize: 17}}>     {seguidos}</Text>
                  <Text style={{color: '#4A4A4A', fontSize: 11, marginTop:10}}>Seguidos</Text>
               </View>
            </View>
          <List
            dataArray={routes}
            style={{ backgroundColor:'rgba(222,218,62,0.1)', paddingTop:10}}
            renderRow={(data, sectionID, rowID, highlightRow) => {
              return (
                <TouchableOpacity
                  onPress={() => this.navegar(routesArray[rowID]) }//this.props.navigation.navigate(data)}
                >
                  <View style={{flexDirection: 'row', marginVertical:10, marginLeft: 20,}}>
                    {/*<Icon name={data == "Mapa" ? "home":"pinboard" } style={{color: '#4A4A4A'}} />*/}
                    <Image source={data == "Mapa" ? {uri: uri+"/customMarker2.png"} : null} style={{ width:22, height:25.2}}/> 
                    <Image source={data == "Fotos" ? {uri: uri+"/especie/camera.png"} : null} style={{ width:24, height:25}}/>
                    <Image source={data == "Proyectos" ? {uri: uri+"/proyecto/proyecto.png"} : null} style={{ width:24, height:25}}/>
                    <Image source={data == "Especies" ? {uri: uri+"/especie/fichero.png"} : null} style={{ width:24, height:25}}/>
                    <Image source={data == "Notificaciones" ? {uri: uri+"/notificaciones.png"} : null} style={{ width:24, height:25}}/>
                  {/* <MaterialCommunityIcons name={data=="Mapa" ? "home":null} size={25} style={{color: '#4A4A4A'}} /> */}
                    <MaterialCommunityIcons name={data=="Mis registros" ? "pin":null} size={25} style={{color: '#1E1E32'}} />
                  {/* <FontAwesome name={data=="Proyectos" ? "book":null} size={25} style={{color: '#4A4A4A'}} />
                    <MaterialIcons name={data=="Notificaciones" ? "notifications":null} size={25} style={{color: '#1E1E32'}} />*/}
                      <Text style={{fontSize:15}}>    </Text>
                      <Text style={{color: '#1E1E32', fontSize:15}}>{data}</Text>
                  </View>  
                </TouchableOpacity>
              );
            }}
          />
          <View style={{paddingBottom: 40, backgroundColor:'rgba(222,218,62,0.1)'}}>
          <List
            dataArray={routes2}
            style={{  paddingTop: 20,}}
            renderRow={data2 =>{
              return (
                <TouchableOpacity
                  onPress={()=> {this.props.navigation.navigate(data2, {email: this.state.email, nombre:this.state.nombre});} }>
                <View style={{flexDirection: 'row', marginVertical:10, marginLeft: 12,}}>
                <Text style={{fontSize:15}}>   </Text>
                <Text style={{color:'#1E1E32', fontSize:15}}>{data2}</Text>
                </View>
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity
            
              onPress={this.logout/* => {
                DrawerNav.dispatch(
                  NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: "Mapa" })]
                  })
                );
                DrawerNav.goBack();
              }*/}
            >
            <Text style={{color:'#1E1E32', fontSize:15, marginLeft:20,marginVertical:10,}}> Cerrar Sesión</Text>
          </TouchableOpacity>
          </View>
        </View>
      </Container>
    );
  }
}