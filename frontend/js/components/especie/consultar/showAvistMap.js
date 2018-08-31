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
import { Field, reduxForm } from "redux-form";
import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import {Image, TouchableOpacity, ScrollView, KeyboardAvoidingView,StyleSheet, ActivityIndicator, Dimensions,Platform, PermissionsAndroid, Alert} from 'react-native';
import styles from "./styles";
import Geolocation from 'react-native-geolocation-service';
import {url_API} from '../../../config';
import {customStyle} from "../../registros/StyleMap";
import {  NavigationActions } from "react-navigation";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const uri_foto = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/uploads/";
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
class ShowAvistMap extends Component {
    constructor(props){
        super(props);
        this.state={
          nombre:"", loading:false, markers:[], polylines: [], region:{
            latitude: 0, longitude: 0, latitudeDelta: 0.005, longitudeDelta: 0.001
          }, ubicacion:[]
        };
        this.fetchData = this.fetchData.bind(this);
      }
      static navigationOptions = {
        header: null
      };
    fetchData(){
        const {id, values} = this.props.navigation.state.params;
        var data = {id:id};
        this.setState({loading:true});
        fetch(url_API+'especie/showavistmap', {
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
            console.log("response show avist map: ", response);
            //AQUI SE AGREGAN LOS MARKERS
            var markers = [];
            var data = null;
            if(values.ubicacion.length>0)  { 
                for(var i=0; i<response.length; i++){
                //console.log(i, response[i].latitude, response[i].longitude);
                data={
                    id:response[i].idAvist,idGrupoEspecie:response[i].idGrupoEspecie, coords:{latitude: response[i].latitude, longitude: response[i].longitude}
                }
                markers.push(data); 
                }
                var _region = getRegionForCoordinates(values.ubicacion);
                var region = {
                    latitude: _region.latitude,
                    longitude: _region.longitude,
                    latitudeDelta: _region.latitudeDelta,
                    longitudeDelta: _region.longitudeDelta
                };
                var ubicacion_copy = {id: 0, coordinates: values.ubicacion}
                var item = [];
                item.push(ubicacion_copy);
                console.log(region);
                this.setState({markers:markers,ubicacion: item, loading:false, region, nombre:values.nombre});
            }
            else {
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
                this.setState({loading:false, nombre:values.nombre});
            }
        })
    }
    componentDidMount() {
       this.fetchData()
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
    EditArea = () => {   
        const {id, keyAvist, email} = this.props.navigation.state.params;
        const navigateAction = NavigationActions.navigate({
          routeName: "Area_e",
          params: {ubicacion:this.state.ubicacion, region:this.state.region, id,keyAvist,  email, modulo:"especie"},
          //params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, especie: this.state.especie },
          actions: [NavigationActions.navigate({ routeName: "Area_e" })],
          //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
        })
        this.props.navigation.dispatch(navigateAction);
    }
    render(){
        const {nombre} =this.state;
        return(
            <Container style={styles.container}>
                <Header  style={styles.header}>
                    <Left style={{flex:1}}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Icon name="ios-arrow-back" style= {{color: '#8c8c8c'}} />
                        </Button>
                    </Left>
                    <Body style={{flex:4,  justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                        <Text style={{color: '#1E1E32', fontSize: viewportHeight*.023, textAlign:'center', fontWeight:'bold' }}>{nombre}      </Text> 
                       {this.state.ubicacion.length>0 &&
                            <TouchableOpacity onPress={this.EditArea}>
                            <Image source={ {uri:uri+'/pencil.png'}} style={{width:viewportWidth*.065, height:viewportWidth*.065}}></Image>              
                        </TouchableOpacity>}
                    </Body>

                    <Right style={{flex:1}}>
                        <Button transparent onPress={this.guardar}>
                            <Image source={{uri:uri+"/neguen.png"}} style={{width:15, height:23.2}}  /></Button>
                    </Right>
                    </Header>
                  {this.state.ubicacion.length==0 &&
                        <View style={styles.cruz}>
                        <TouchableOpacity               
                        style={styles.cruzButton}
                        onPress={this.EditArea}>
                        <Text style={{color: '#4A4A4A', textAlign: 'center', fontSize:18, marginLeft:Dimensions.get("window").width/2-150 , marginRight:Dimensions.get("window").width/2-150}}>
                        Agregar área de distribución</Text>             
                        </TouchableOpacity>
                    </View>}
                
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{flex:1, zIndex:-1,  height: viewportHeight-20, width:viewportWidth }}
                    region={this.state.region}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    showsCompass={true}
                    customMapStyle={customStyle}>
                    {!this.state.loading && this.state.ubicacion.length>0 && 
                    this.state.ubicacion.map((polyline,index )=> (
                        <Polygon
                            key={index}
                            coordinates={polyline.coordinates}
                            lineCap="round"
                            lineJoin="round"
                            strokeColor="rgba(255,81,29,0.9)"
                            fillColor="rgba(255,81,29,0.5)"
                            strokeWidth={3}
                        /> ) )}
                {this.state.markers.map(marker => (
                <MapView.Marker 
                    key={marker.id}
                    coordinate={marker.coords}
                    //onPress={()=> this.consultarAvist(marker.id)}
                    image={pines[marker.idGrupoEspecie-1]}                 
                    //title={marker.title}
                />
                ))}
                </MapView>
            </Container>
        );
    }
}
const ProyectoSwag = reduxForm(
    {
      form: "test"
    },
    function bindActions(dispatch) {
      return {
        setUser: name => dispatch(setUser(name))
      };
    }
  )(ShowAvistMap);
  ProyectoSwag.navigationOptions = {
    header: null
  };
  export default ProyectoSwag;