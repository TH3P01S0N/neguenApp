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
import {customStyle} from "../../registros/StyleMap";
import MapView, { PROVIDER_GOOGLE, Polyline, Polygon} from 'react-native-maps';
import {ActivityIndicator, TouchableOpacity, ScrollView, KeyboardAvoidingView,StyleSheet, Keyboard, Dimensions,Platform, PermissionsAndroid, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Geolocation from 'react-native-geolocation-service';
import styles from "./styles";
import {url_API} from "../../../config";
import {isGoBack} from "../../../actions/goback_action";
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = -33.4858;
const LONGITUDE = -70.6414;
const LATITUDE_DELTA = 30;
const LONGITUDE_DELTA = LATITUDE_DELTA ;
const editando = null;
let id = 0;
let id2 = 0;
let cont = 0;

class Area extends Component{
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
     listo = () => {
       this.setState({loading:true})
       console.log(this.state.polylines);
       const {id, region, ubicacion, modulo, email, keyAvist} = this.props.navigation.state.params; 
       if(modulo=="proyecto"){
        var datas = { id, ubicacion:this.state.polylines , email}
        fetch(url_API+'proyecto/editArea', {
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
            if(response.success){
              this.setState({loading:false});
              if(modulo=="proyecto"){
                this.props.isGoBack();
                this.props.navigation.navigate({routeName:"ConsultarProyecto", key:keyAvist})
              }
            }
            else {
                Alert.alert("Ocurrió un problema.");
            }
          })
       }
      else {
      const { props: { name, index, list } } = this;
      const {nombre, email} = this.props.navigation.state.params;
      const {pregunta} = this.props.navigation.state.params;
      const {objetivos} = this.props.navigation.state.params;
      const navigateAction = NavigationActions.navigate({
        routeName: "Grupo",
        params: {nombre: nombre, pregunta: pregunta, objetivos: objetivos, polylines: this.state.polylines, region: this.state.region, email:email},
        actions: [NavigationActions.navigate({ routeName: 'Grupo' })],
      })
      this.props.navigation.dispatch(navigateAction);}
    }
      componentDidMount() { 
        const {id, region, ubicacion, modulo} = this.props.navigation.state.params;  
        if(modulo=="proyecto")   {
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
          //mapPress: false
        });
        editando= null;
        id2=0;
        cont=0;
      }
    render() {
        const { region } = this.props;
        const { navigate } = this.props.navigation;
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
                <Title style={{color: '#4A4A4A', fontSize: 17}}>Área de observación</Title>
              </Body> :
              <Body style={{flex:4,  justifyContent: 'center', alignItems: 'center', marginLeft: 35}}>
                <Title style={{color: '#4A4A4A', fontSize: 17}}>Área de observación</Title>
              </Body>
              }
              {this.state.isPolyline && <Right style={{flex:2}}>
                <Button transparent onPress= {() => this.limpiar()}>
                <Title style= {{color: '#ddd93d', fontSize: 15}}>Limpiar</Title></Button>
              </Right>}
           </Header>  

        
            <View style={styles.cruz}>
              <Text style={{fontSize: 15, textAlign:'center', justifyContent:'center', padding:10, paddingTop:4, color:'#4A4A4A', flex:1, marginHorizontal:15 }}>
              {(this.state.mapPress2===false) ? "Posiciona el mapa en el lugar que necesitas y usa un dedo para dibujar el área de observación del proyecto." :
              (this.state.termino===false) ? 
              "Asegúrate que tu dibujo cubra toda el área que quieres registrar." :
              "Si no estás seguro del área que dibujaste, puedes empezar de nuevo ;)"  }
              </Text>
              {(this.state.mapPress2===false) ?
                <TouchableOpacity               
                  style={styles.cruzButton}
                  onPress={() => this.onMapPress2()}>
                  <Text style={{color: '#4A4A4A', textAlign: 'center', fontSize:18, marginLeft:Dimensions.get("window").width/2-130 , marginRight:Dimensions.get("window").width/2-130}}>
                      Dibujar</Text>             
                </TouchableOpacity>
              :(this.state.termino===false) ?
                  <TouchableOpacity   disabled={!this.state.isPolyline}            
                    style={styles.dibujandoButton}
                    onPress={() => this.finish()}>                
                    <Text style={{color: '#4A4A4A', fontWeight:'bold', textAlign: 'center', fontSize:18, marginLeft:Dimensions.get("window").width/2-150 , marginRight:Dimensions.get("window").width/2-150}}>
                      {this.state.isPolyline ? "Cerrar trazo" : "Dibujando"}</Text>             
                  </TouchableOpacity> :
                  <TouchableOpacity               
                    style={styles.cruzButton}
                    onPress={this.listo}>{this.state.loading ? <ActivityIndicator/> :
                    <Text style={{color: '#4A4A4A', textAlign: 'center', fontSize:18, marginLeft:Dimensions.get("window").width/2-130 , marginRight:Dimensions.get("window").width/2-130}}>
                      Guardar</Text> }            
                  </TouchableOpacity>
                }
            </View>
            {(this.state.mapPress2===false) ?
              <MapView
              provider={PROVIDER_GOOGLE}
              customMapStyle={customStyle}
              style={styles.map}
              scrollEnabled={true}
              region={this.state.region}
              //onRegionChange={ region => this.setState({region}) }
              onRegionChangeComplete={ region => this.setState({region}) }         
            //  onRegionChange={this.onRegionChange}
            ></MapView>
             : (this.state.termino===false && this.state.mapPress2) ?
              <MapView
              provider={PROVIDER_GOOGLE}
                style={styles.map}
                onPanDrag={e => this.onPanDrag(e)}
                customMapStyle={customStyle}
                scrollEnabled={false}
               initialRegion={this.state.region}
                //onRegionChange={ region => this.setState({region}) }
              //  onRegionChangeComplete={ region => this.setState({region}) }         
              //  onRegionChange={this.onRegionChange}
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
              (this.state.termino && this.state.mapPress2) &&
              <MapView 
                  provider={PROVIDER_GOOGLE}
                  customMapStyle={customStyle}
                  style={styles.map}
                  scrollEnabled={true}
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

export default connect(mapStateToProps, bindActions)(Area);