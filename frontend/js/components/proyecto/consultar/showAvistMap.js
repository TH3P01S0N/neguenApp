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
import ImagePicker from 'react-native-image-picker';
import { Field, reduxForm } from "redux-form";
import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import {Image, TouchableOpacity, ScrollView, KeyboardAvoidingView,StyleSheet, ActivityIndicator, Dimensions,Platform, PermissionsAndroid, Alert} from 'react-native';
import styles from "./styles";
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
    const deltaX = (maxX - minX);
    const deltaY = (maxY - minY);
    console.log(deltaX, deltaY);
    return {
      latitude: midX,
      longitude: midY,
      latitudeDelta: deltaX+deltaX*0.55,
      longitudeDelta: deltaY+deltaY*0.55
    };
  }
  function inside(point, vs) {
    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};
class ShowAvistMapProy extends Component {
    constructor(props){
        super(props);
        this.state={
          nombre:"", loading:false, markers:[], polylines: [], region:{
            latitude: 0, longitude: 0, latitudeDelta: 0.005, longitudeDelta: 0.001
          }, ubicacion:[], enviado:false, isEquipo:false, isOwner:false
        };
        this.fetchData = this.fetchData.bind(this);
      }
      static navigationOptions = {
        header: null
      };
    fetchData(){
        const {id, values, isOwner, email} = this.props.navigation.state.params;
        var data = {id:id};
        this.setState({loading:true});
        fetch(url_API+'proyecto/proyectoAvist', {
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
            if(values.ubicacion[0].coordinates.length>0)  { 
                var polygon = [];
                var listEspecies = values.listEspecies;
                var ubicacion = values.ubicacion[0].coordinates;
                var avistamiento_copy = response.avistamientos;
                var avistamiento = [];
                for (var z = 0, len_p = ubicacion.length ; z < len_p; z++){
                    const item = [ubicacion[z].latitude,ubicacion[z].longitude];
                    polygon.push(item);
                }
                for (var x = 0, _len = avistamiento_copy.length ; x < _len; x++){
                    for(var y = 0, __len = listEspecies.length ; y < __len; y++){
                        if(avistamiento_copy[x].idEspecie==listEspecies[y].id){
                            let point = [avistamiento_copy[x].latitude,
                                avistamiento_copy[x].longitude ];
                                if( inside(point, polygon)){
    
                                    avistamiento.push(avistamiento_copy[x]); 
                                    var array = {id:avistamiento_copy[x].idAvist, 
                                        fecha:avistamiento_copy[x].fecha, coords:{latitude: avistamiento_copy[x].latitude, longitude: avistamiento_copy[x].longitude} , 
                                        localidad:avistamiento_copy[x].localidad, email:avistamiento_copy[x].email, idGrupoEspecie:avistamiento_copy[x].idGrupoEspecie,
                                         nombre:avistamiento_copy[x].nombre, nombreEsp: listEspecies[y].nombre, nombreCient:listEspecies[y].nombreCient
                                          }
                                    console.log("array ", array);
                                    markers.push(array);
                                    }
                                             
                        }
                    }
                }
                var _region = getRegionForCoordinates(values.ubicacion[0].coordinates);
                var region = {
                    latitude: _region.latitude,
                    longitude: _region.longitude,
                    latitudeDelta: _region.latitudeDelta,
                    longitudeDelta: _region.longitudeDelta
                };
                var isEquipo=false;
                for (var z = 0, len_p = values.usuarios.length ; z < len_p; z++){
                    if(values.usuarios[z].email==email){
                        isEquipo=true;
                    }
                }                
                this.setState({markers:markers,ubicacion:values.ubicacion, loading:false, region, 
                    nombre:values.nombre, isEquipo, isOwner});

            }
            else {
                this.setState({loading:false, nombre:values.nombre});
            }
        })
    }
    localizar =() => {
        const {id, values, email, isOwner} = this.props.navigation.state.params;
        const {nombre} = this.state;
        var isEquipo=false;
        for (var z = 0, len_p = values.usuarios.length ; z < len_p; z++){
            if(values.usuarios[z].email==email){
                isEquipo=true;
            }
        }
        //console.log("markers ", this.state.markers);
        if(this.state.markers.length>0){
        var datas = { id, nombre, avistamientos:this.state.markers, email_duenio:email}
            if(isOwner || isEquipo ){
                fetch(url_API+'proyecto/excel', {
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
                       // Alert.alert("Te enviamos un correo con los avistamientos de este proyecto.");
                       this.setState({enviado:true});
                    }
                    else {
                        Alert.alert("Ocurrió un problema.");
                    }
                })
            }
        }
    }
    componentDidMount() {
       this.fetchData()
    }
    selectPhotoTapped() {
        var veri = true;
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
                  params: {ImageSource: source, email: this.state.email},
                  actions: [NavigationActions.navigate({ routeName: 'Cuando' })],
                  //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
                })
                this.props.navigation.dispatch(actionToDispatch)
              }
            });
          }
      };
    guardar = () => {   
        const {id, keyAvist, email} = this.props.navigation.state.params;
        const navigateAction = NavigationActions.navigate({
          routeName: "Area",
          params: {ubicacion:this.state.ubicacion, region:this.state.region, id:id,keyAvist,  email, modulo:"proyecto"},
          //params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, especie: this.state.especie },
          actions: [NavigationActions.navigate({ routeName: "Area" })],
          //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
        })
        this.props.navigation.dispatch(navigateAction);
      }
    render(){
        const {nombre, enviado, isEquipo, isOwner} =this.state;
        return(
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
                        <Image source={ {uri:uri+'/pencil.png'}} style={{width:viewportWidth*.065, height:viewportWidth*.065}}></Image></Button>
                    </Right>
                    </Header>
                {(!this.state.loading && this.state.ubicacion.length>0 && isEquipo) ? 
                <View style={styles.cruz}>
                    <TouchableOpacity               
                        style={styles.cruzButton}
                        onPress={ this.localizar}>
                        <Image source={{uri:uri+"/proyecto/excel.png"}} style={{width:27, height:27, marginHorizontal:10}} />
                        <Text style={{color: '#4A4A4A', textAlign: 'center', fontSize:16, fontWeight:'bold', marginRight:10 }}>{enviado ? "Datos enviados" : "Enviar datos a mi correo"}</Text>          
                    </TouchableOpacity>
                </View>:
                <View style={{flex:1, zIndex: 9, position: 'absolute', justifyContent: 'center', width:viewportWidth,
                bottom: 30, alignItems: 'center',}}>
                    <TouchableOpacity  onPress={this.selectPhotoTapped.bind(this)} disabled={this.state.verificado=='no'}>
                        <Image source={ {uri:uri+"/proyecto/pinAvist.png"}} style={{width:viewportHeight*.08, height:viewportHeight*.08}}></Image>
                    </TouchableOpacity> 
                </View>               
                 }
                {!this.state.loading && this.state.ubicacion.length>0 &&
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{flex:1, zIndex:-1,  height: viewportHeight-20, width:viewportWidth }}
                    region={this.state.region}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    showsCompass={true}
                    customMapStyle={customStyle}>
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
                {this.state.markers.map(marker => (
                <MapView.Marker 
                    key={marker.id}
                    coordinate={marker.coords}
                    //onPress={()=> this.consultarAvist(marker.id)}
                    image={pines[marker.idGrupoEspecie-1]}                 
                    //title={marker.title}
                />
                ))}
                </MapView>}
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
  )(ShowAvistMapProy);
  ProyectoSwag.navigationOptions = {
    header: null
  };
  export default ProyectoSwag;