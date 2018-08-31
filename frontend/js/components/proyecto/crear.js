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
import {Image, TouchableOpacity, ScrollView, KeyboardAvoidingView,ActivityIndicator, Dimensions,Platform, PermissionsAndroid, FlatList} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from "react-navigation";
import MapView, {ProviderPropType, Polygon}  from 'react-native-maps';
import {url_API} from "../../config";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const uri_foto_user = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/uploads/";
const { width, height } = Dimensions.get('window');
const LATITUDE = -33.4858;
const LONGITUDE = -70.6414;
const LATITUDE_DELTA = 30;
const LONGITUDE_DELTA = LATITUDE_DELTA ;
const ASPECT_RATIO = 0.6;//width / height;
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
class Crear extends Component{
    constructor(props) {
        super(props);
        this.state = {
            listUser: [], listUser2: [], region: {
              latitude: LATITUDE,
              longitude: LONGITUDE,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }, polylines: [] , nombre: "", GridColumnsValue: false, loading:false
          };
      }
    componentDidMount(){
      const { props: { name, index, list } } = this;
      const {listUser} = this.props.navigation.state.params;
      const {nombre} = this.props.navigation.state.params;
      const {pregunta, polylines} = this.props.navigation.state.params;
      const {objetivos} = this.props.navigation.state.params;
      var {region} = this.props.navigation.state.params;
      const {especie} = this.props.navigation.state.params;
      var _region = getRegionForCoordinates(polylines[0].coordinates);
      var regiones = {
        latitude: _region.latitude,
        longitude: _region.longitude,
        latitudeDelta: _region.latitudeDelta,
        longitudeDelta: _region.longitudeDelta
      };
     // console.log("especie: ", especie);
     // let aux = listUser.map(el => (
     //   el.press === true ? this.state.listUser2.push([el.emails, el.fotos]) : el
     // ))
     const aux =[]
     for (let i =0; i<listUser.length; i++){
       if(listUser[i].press===true){
         var correo = listUser[i].emails;
          aux.push({
            emails: correo,
            fotos:  uri_foto_user+correo+"/"+correo+".jpg"    //listUser[i].fotos
          })
       }
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
    // aux = listUser.map(el =>( 
     //  el.press &&
    //    [...el, {emails: el.emails, fotos: el.fotos} ] 
    //  ) )
      this.setState({listUser2: aux});
     // this.setState({
     //   listPress: [... this.state.listPress, {emails: el.email, press: false, fotos: picture.thumbnail }]
     // })
      this.setState({ region: regiones, nombre: nombre});
    } 
    static navigationOptions = {
        header: null
      };
    listuser() {
        console.log(this.state.listUser2[0]);
      //<View><Text>{users.emails}</Text></View>
      const largo = this.state.listUser2.length;
      //console.log("largo 0: ", this.state.listUser2);
          return this.state.listUser2.map((users) => {
            return (
              <Image style={{width: 48, height: 48, borderRadius: 24}} source={{uri: users.fotos}}></Image>
            )
          })
    }
    consultar (idInsert){
      const {email} = this.props.navigation.state.params;
      const navigateAction = NavigationActions.navigate({
            routeName: "ConsultarProyecto",
            params: {idProyecto:idInsert, email: email, fromDrawBar: false, verificado:"si" },
            actions: [NavigationActions.navigate({ routeName: "ConsultarProyecto" })],
            //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
          })
          this.props.navigation.dispatch(navigateAction);
    }
    navegar = ()=>{
      this.setState({loading:true});
      const {nombre, grupoEspecie, email, pregunta, polylines, especie, usuarios, objetivos} = this.props.navigation.state.params;
      var data = {nombre, pregunta, objetivos, email, polylines, especie, usuarios, grupoEspecie };
          console.log("equipo data: ", data);
          fetch(url_API+'proyecto/create', {
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
              console.log(response);
              this.setState({loading:false});
              if(response.message){
                const navigateAction = NavigationActions.reset({
                  index: 0,
                  key: null,
                  //params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, especie: this.state.especie },
                  actions: [NavigationActions.navigate({ routeName: 'Mapa' })],
                })
                this.props.navigation.dispatch(navigateAction);
              }
            })        
    }
    render() {

        const { navigate } = this.props.navigation;
        const { region } = this.props;
        const {polylines,nombre, objetivos} = this.props.navigation.state.params;
        console.log("users ", this.state.listUser2);
        return (
          <Container style={{flex:1, paddingHorizontal:0}}>
            <Header  style={styles.header}>
            <Left style={{}}>
            <Button transparent  onPress={() => this.props.navigation.goBack()}>
                <Icon style={{color: '#4A4A4A'}} name="ios-arrow-back" />
              </Button>
            </Left>
            <Body style={{flex:3,  justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#4D4D4D', fontSize: viewportHeight*.026, textAlign:'center', 
                 maxWidth:viewportHeight*.424, marginRight: 20, fontWeight: 'bold',}}numberOfLines={1}>
                {nombre}
                </Text>
            </Body>
            </Header>
            <View style={{flex:1, backgroundColor:'rgba(222,218,62,0.2)'}}>
                <MapView
                 provider={this.props.provider}
                  liteMode={true}
                  style={{height: viewportHeight*.28, zIndex:-1 }}
                  scrollEnabled={false}
                  initialRegion={this.state.region}>
                  {polylines.map(polyline => (
                  <Polygon
                    key={polyline.id}
                    coordinates={polyline.coordinates}
                    lineCap="round"
                    lineJoin="round"
                    strokeColor="rgba(255,81,29,0.9)"
                    fillColor="rgba(255,81,29,0.5)"
                    strokeWidth={3}
                  /> ) )}
              </MapView>
                 
              <Image style={{zIndex:10,position:'absolute', top:120, left:30, height:60, width:60}} source={{uri:uri+"/proyectos.png"}}/>
              <View style={{paddingHorizontal:40,}}>
              
                <Text style={{fontSize:viewportWidth*.05, color: '#ddd93d', marginTop:15, 
                fontWeight:'bold' , textAlign:'left', justifyContent:'center' }}>
                Resumen del proyecto</Text>
                <View style={{width:viewportWidth*.75, height:1.2, backgroundColor: '#DEDA3E', marginLeft: 0, marginRight: 25,borderRadius: 10,
               marginTop:0}} />
              <Text style={{color: '#DEDA3E', fontSize: 15, margin: 10, marginBottom:5, fontWeight:'bold' }}>
                Objetivo
              </Text>
              <Text style={{color: '#787878', height:viewportHeight*.121, fontSize: 15.5, marginHorizontal: 10, marginTop:1 }}>
                {objetivos}
              </Text>     
              <View style={{width:viewportWidth*.75, height:1.2, backgroundColor: '#DEDA3E', marginLeft: 0, marginRight: 25,borderRadius: 10,
               marginTop:0}} />
              <Text style={{color: '#DEDA3E', fontSize: 15, margin: 10, marginBottom:5, fontWeight:'bold' }}>
                Equipo
              </Text>
             
              <FlatList
                  data={this.state.listUser2}
                  extraData={this.state}
                  renderItem={({item}) => 
                    <View style={{flex:1, flexDirection: 'row', justifyContent:'space-between',  margin:1, marginTop: 5, marginBottom: 0}}>
                      <View style={{width: viewportHeight*.078, height: viewportHeight*.078, borderRadius: 24,justifyContent: 'center',alignItems: 'center', backgroundColor:'black'}}>
                        <Image style={{width: viewportHeight*.078, height: viewportHeight*.078, borderRadius: 24,justifyContent: 'center',alignItems: 'center',}} source={{uri: item.fotos}}></Image>
                      </View>
                    </View> 
                  }
                  numColumns = {4}
                  keyExtractor={(item) => item.emails}
                  />

             
              <TouchableOpacity  style= {styles.boton} onPress={this.navegar} 
              disabled={this.state.loading} >{this.state.loading ?
                <ActivityIndicator/>:
                <Text capitalize={false} style={{fontWeight:'bold', fontSize:18}}>Guardar</Text>
             }</TouchableOpacity>
            </View>
            </View>
          </Container>

        
        );
      }

}

Crear.propTypes = {
  provider: ProviderPropType,
};

export default Crear;