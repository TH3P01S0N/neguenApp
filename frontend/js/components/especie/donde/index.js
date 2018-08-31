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
} from "native-base";
import MapView, { ProviderPropType, Polyline, Polygon} from 'react-native-maps';
import {Keyboard, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView,StyleSheet, Dimensions,Platform, PermissionsAndroid, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Geolocation from 'react-native-geolocation-service';
import styles from "./styles";
import {isGoBack} from "../../../actions/goback_action";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
const { width, height } = Dimensions.get('window');
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import {url_API} from '../../../config';
const ASPECT_RATIO = width / height;
const LATITUDE = -33.4858;
const LONGITUDE = -70.6414;
const LATITUDE_DELTA = 30;
const LONGITUDE_DELTA = LATITUDE_DELTA ;
const SPACE = 0.01;
const editando = null;
let id = 0;
let id2 = 0;
let cont = 0;
class Area_e extends Component{
    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              },
              mapPress: false, mapPress2: false, termino: false, listo: false, isPolyline: false,
              polylines: [], cerrarTrazo:false, loading:false,
              editing: null,
          };
      }  
      static propTypes = {
        name: React.PropTypes.string,
        index: React.PropTypes.number,
        list: React.PropTypes.arrayOf(React.PropTypes.string),
        openDrawer: React.PropTypes.func,
        isGoBack: React.PropTypes.func
      };
      isGoBack() {
        console.log("isgoback");
        this.props.isGoBack(true);
    }     
    static navigationOptions = {
        header: null
      };
     listo = () => { //OJO que este boton se usa para los dos botones
       console.log(this.state.polylines);
       const {id, region, ubicacion, modulo, email, keyAvist} = this.props.navigation.state.params; 
       if(modulo=="especie"){
        this.setState({loading:true});
        var datas = { id, ubicacion:this.state.polylines , email}
        fetch(url_API+'especie/editArea', {
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
            this.setState({loading:false});
            if(response.success){
              
              if(modulo=="especie"){
                this.props.isGoBack();
                this.props.navigation.navigate({routeName:"ConsultarEspecie", key:keyAvist})
              }
            }
            else {
                Alert.alert("Ocurrió un problema.");
            }
          })
       }
      else {
      const { props: { name, index, list } } = this;
      const {email,nombre, nombreCient,GrupoEspecie,ImageSource,AutorFoto,modulo,keyAvist,cambioFoto, descripcion} = this.props.navigation.state.params;
      const navigateAction = NavigationActions.navigate({
        routeName: "Procedencia",
        params: {nombre: nombre, nombreCient:nombreCient, GrupoEspecie:GrupoEspecie, email:email, ImageSource:ImageSource, cambioFoto:cambioFoto,
          AutorFoto:AutorFoto, descripcion:descripcion, modulo:modulo, keyAvist:keyAvist,polylines: this.state.polylines},
        actions: [NavigationActions.navigate({ routeName: 'Procedencia' })],
      })
      this.props.navigation.dispatch(navigateAction);}
    }
      componentDidMount() {    
        const {id, region, ubicacion, modulo} = this.props.navigation.state.params;  
        if(modulo=="especie")   {
            if(ubicacion.length==0)
              this.setState({region, polylines:ubicacion});
            else 
              this.setState({region,polylines:ubicacion, termino:true,mapPress2:true, isPolyline:true})
        } else{   
        Geolocation.getCurrentPosition(
          (cords) => {
            this.setState({
              region: {
                latitude: cords.coords.latitude,
                longitude: cords.coords.longitude,
                latitudeDelta: 30,
                longitudeDelta: 30,
              }
            })
          },
          (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      );
      Keyboard.dismiss();}
      }         
     componentWillUnmount() {
       // navigator.geolocation.clearWatch(this.watchID);
      }
      onMapPress (){
        this.setState({mapPress: true});
      }
      onMapPress2 (){
        this.setState({mapPress2: true});
      }
      finish() {
        const { polylines, editing } = this.state;
        this.setState({
          polylines: [...polylines, editando],
          editing: null,
        });
        editando = null;
        this.setState({termino: true});
      }    
      onPanDrag(e) {
        if(!editando){
        //if (!editing) {
         /* this.setState({
            editing: {
              id: id++,
              coordinates: [e.nativeEvent.coordinate],
            },
          });*/
          this.setState({isPolyline: true});
          editando = {
            id: id2++,
            coordinates: [e.nativeEvent.coordinate]
          };
          // console.log(e.nativeEvent.coordinate);
        } else {
          editando = {
            ...editando,
            coordinates: [
              ...editando.coordinates,
              e.nativeEvent.coordinate,
            ]
          };
          cont++;
          if(cont%9===0){
            this.setState({isPolyline: true});
          }
          /*this.setState({
            editing: {
              ...editing,
              coordinates: [
                ...editing.coordinates,
                e.nativeEvent.coordinate,
              ],
            },
          }); */
        }
      }
      limpiar(){
        this.setState({
          polylines: [],
          editing: null,
          mapPress2: false,
          isPolyline: false,
          termino: false,
          listo:false,
          //mapPress: false
        });
        editando= null;
        id2=0;
        cont=0;
      }
    regionChange(region){
      if(this.state.mapPress2==false){
        this.setState({region:region});
      }
    }
    render() {
        const { region } = this.props;
        const { navigate } = this.props.navigation;
        const {id,  ubicacion, modulo} = this.props.navigation.state.params;
        return (
          <Container style={styles.container}>
            
            <Header  style={styles.header}>
              <Left style={{flex:1}}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                  <Icon name="ios-arrow-back" style= {{color: '#8c8c8c'}} />
                </Button>
              </Left>
              {(this.state.isPolyline===false)?
              <Body style={{flex:4,  justifyContent: 'center', alignItems: 'center', marginRight: 35}}>
                <Title style={{color: '#4A4A4A', fontSize: 17}}>Área de distribución</Title>
              </Body> :
              <Body style={{flex:4,  justifyContent: 'center', alignItems: 'center', marginLeft: 35}}>
                <Title style={{color: '#4A4A4A', fontSize: 17}}>Área de distribución</Title>
              </Body>
              }
              {this.state.isPolyline && <Right style={{flex:2}}>
                <Button transparent onPress= {() => this.limpiar()}>
                <Title style= {{color: '#ddd93d', fontSize: 15}}>Limpiar</Title></Button>
              </Right>}
           </Header>  

        
            <View style={styles.cruz}>
            {(this.state.termino===false && (this.state.mapPress2)) && 
              <Text style={{fontSize: 15, textAlign:'center', justifyContent:'center', padding:10, paddingTop:4, color:'#4A4A4A', flex:1, marginHorizontal:15 }}>
                No olvides revisar la bibliografía actualizada antes de dibujar el área de distribución de una especie.
              </Text>}
              {(this.state.termino && this.state.mapPress2) && 
              <Text style={{fontSize: 15, textAlign:'center', justifyContent:'center', padding:10, paddingTop:4, color:'#4A4A4A', flex:1, marginHorizontal:15 }}>
                Si no estás seguro del área que dibujaste, puedes empezar de nuevo ;)
              </Text>}
              {(this.state.mapPress2===false) ?
                <View style={{flex:1, paddingHorizontal:30, marginTop:20, width:viewportWidth}} >
                  {modulo!="especie" &&
                  <TouchableOpacity   style={styles.buttonPlomo} onPress={this.listo}>
                      <Text style={{color: 'white', textAlign: 'center', fontSize:16, marginHorizontal:0 }}>
                      Editar distribución más tarde</Text>             
                  </TouchableOpacity>}
                  <TouchableOpacity   style={styles.cruzButton}
                    onPress={() => this.onMapPress2()}>
                    <Text style={{color: '#4A4A4A', textAlign: 'center', fontSize:16, }}>
                      Dibujar</Text>             
                  </TouchableOpacity>
                </View>
              :(this.state.termino===false) ?
                  <TouchableOpacity   disabled={!this.state.isPolyline}            
                    style={styles.dibujandoButton}
                    onPress={() => this.finish()}>                
                    <Text style={{color: '#4A4A4A', fontWeight:'bold', textAlign: 'center', fontSize:18, marginLeft:Dimensions.get("window").width/2-150 , marginRight:Dimensions.get("window").width/2-150}}>
                      {this.state.isPolyline ? "Cerrar trazo" : "Dibujando"}</Text>             
                  </TouchableOpacity> :
                  <TouchableOpacity               
                    style={styles.cruzButton}
                    onPress={this.listo}>{ this.state.loading ? <ActivityIndicator/> :
                    <Text style={{color: '#4A4A4A', textAlign: 'center', fontSize:18, marginLeft:Dimensions.get("window").width/2-150 , marginRight:Dimensions.get("window").width/2-150}}>
                      Guardar distribución</Text> }            
                  </TouchableOpacity>
                }
            </View>
            {(this.state.mapPress2===false) && 
              <View pointerEvents="none" style={{zIndex:9, flex:1, position: 'absolute', top: 48 ,  left: 0, right:0, paddingVertical:20, paddingHorizontal:20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.5)'}}>
                <Text style={{fontSize: 15,fontWeight:'bold', textAlign:'center', justifyContent:'center', color:'#4A4A4A',  paddingHorizontal:15 }}>
                  Usa dos dedos para ubicar en el centro el área de distribución de la especie y presiona dibujar para trazar sus límites
              </Text>
              </View>
            }
            {(this.state.mapPress2===false) ?
              <MapView
              provider={this.props.provider}
              style={styles.map}
              region={this.state.region}
              //onRegionChange={ region => this.setState({region}) }
              onRegionChangeComplete={region => this.setState({region}) }         
              scrollEnabled={true}
            >
            </MapView>:
              (this.state.termino===false) ?
              <MapView
                provider={this.props.provider}
                style={styles.map}
                onPanDrag={e => this.onPanDrag(e)}
                
                scrollEnabled={false}
               initialRegion={this.state.region}
              >                      
              {this.state.isPolyline &&
                <Polyline
                  key="editingPolyline"
                  //coordinates={this.state.editing.coordinates}
                  coordinates={editando.coordinates}
                  strokeColor="rgba(255,81,29,0.9)"
                //  fillColor="rgba(255,81,29,0.5)"
                  strokeWidth={3}
                />
                }
              </MapView>: 
              <MapView 
                  provider={this.props.provider}
                  style={styles.map}
                  scrollEnabled={false}
                  initialRegion={this.state.region} >
                   {(this.state.isPolyline === false) ? <View/>
                   :
                   this.state.polylines.map(polyline => (
                  <Polygon
                    key={polyline.id}
                    coordinates={polyline.coordinates}
                    lineCap="round"
                    lineJoin="round"
                    strokeColor="rgba(255,81,29,1)"
                    fillColor="rgba(255,81,29,0.7)"
                    strokeWidth={3}
                  />
                  ))                 
                  }
              </MapView>
            }
          </Container>
        
        );
      }

}

function bindActions(dispatch) {
  return {
    isGoBack: () => dispatch(isGoBack())
  };
}

const mapStateToProps = state => ({
  name: state.user.name,
  index: state.list.selectedIndex,
  list: state.list.list,
  flag: state.goback_reducer.flag
});

export default connect(mapStateToProps, bindActions)(Area_e);
/*
Area_e.propTypes = {
    provider: ProviderPropType,
  };

export default Area_e;*/