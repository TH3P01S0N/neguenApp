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
} from "native-base";
//import maps from '../../home/mapStyle';
import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import {Image, TouchableOpacity, ScrollView, KeyboardAvoidingView,StyleSheet, ActivityIndicator, Dimensions,Platform, PermissionsAndroid, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import styles from "./styles";
import {customStyle} from "../../registros/StyleMap";
import {url_API} from '../../../config';
import {isGoBack} from "../../../actions/goback_action";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";

const markerImage = uri + "/customMarker.png";
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = -33.4858;
const LONGITUDE = -70.6414;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = 0.001;

const pines = [uri+"/pin1.png", uri+"/pin2.png",uri+"/pin3.png", uri+"/pin4.png",uri+"/pin5.png", uri+"/pin6.png",uri+"/pin7.png", uri+"/pin8.png"];
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
  const deltaX = (maxX - minX)+4;
  const deltaY = (maxY - minY)+4;

  return {
    latitude: midX,
    longitude: midY,
    latitudeDelta: deltaX,
    longitudeDelta: deltaY
  };
}
class VerAvistMap extends Component{
    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              },
               id:0, loading:false,  Avist: null, nombre:"", ubicacion:[]
          };
      }
     
    static navigationOptions = {
        header: null
      };
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
    guardar = () => {   
      const navigateAction = NavigationActions.reset({
        index: 0,
        key: null,
        //params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, especie: this.state.especie },
        actions: [NavigationActions.navigate({ routeName: 'Mapa' })],
      })
      this.props.navigation.dispatch(navigateAction);
    }
      componentDidMount() {       
        const {Avist, ubicacion} = this.props.navigation.state.params;
        var item = [];
        if(ubicacion.length>0){
        var ubicacion_copy = {id: 0, coordinates: ubicacion}
        item.push(ubicacion_copy);}
       // const {id} = this.props.navigation.state.params; 
        console.log("values: ", Avist);
        var region  = {
          latitude: Avist.latitude,
          longitude: Avist.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
        this.setState({region: region, id: Avist.id, Avist, nombre:Avist.nombre, ubicacion:item});
        
      }
    render() {
        const { Avist } = this.state;
        const {nombre} = this.props.navigation.state.params;
        return (
          <Container style={styles.container}>
           <Header  style={styles.header}>
            <Left style={{flex:1}}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="ios-arrow-back" style= {{color: '#8c8c8c'}} />
                </Button>
            </Left>
            <Body style={{flex:4,  justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
            <Text style={{color: '#1E1E32', fontSize: viewportHeight*.025, textAlign:'center', fontWeight:'bold' }}>{nombre}</Text>                
            </Body>

            <Right style={{flex:1}}>
                <Button transparent onPress={this.guardar}>
                    <Image source={{uri:uri+"/neguen.png"}} style={{width:15, height:23.2}}  /></Button>
            </Right>
            </Header>              
             {!this.state.loading &&
              <MapView
              loadingEnabled={true}
                showsMyLocationButton={true}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                style={styles.map}
                customMapStyle={customStyle}
                region={this.state.region}
               // onRegionChangeComplete={ region => this.setState({region}) }         
              //  onRegionChange={this.onRegionChange}
              >{this.state.ubicacion.length>0 && this.state.ubicacion.map((polyline,index )=> (
                <Polygon
                    key={index}
                    coordinates={polyline.coordinates}
                    lineCap="round"
                    lineJoin="round"
                    strokeColor="rgba(255,81,29,0.9)"
                    fillColor="rgba(255,81,29,0.5)"
                    strokeWidth={3}
                /> ) )}
              {Avist &&
                <MapView.Marker 
                  key={Avist.idAvist}
                  coordinate={{latitude:Avist.latitude, longitude:Avist.longitude}}
                  //onPress={()=> this.consultarAvist(marker.id)}
                  image={pines[Avist.idGrupoEspecie-1]}
                  //title={marker.title}
                />}
                </MapView>}
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

export default connect(mapStateToProps, bindActions)(VerAvistMap);


