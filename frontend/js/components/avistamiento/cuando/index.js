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
import { Field, reduxForm } from "redux-form";
import DatePicker from 'react-native-datepicker';
import {Image, TouchableOpacity, ScrollView, KeyboardAvoidingView,StyleSheet, Dimensions, PermissionsAndroid, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import Geolocation from 'react-native-geolocation-service';
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
import Geocoder from 'react-native-geocoder';

var moment = require('moment');
var esMoment = require('moment/locale/es.js');
const { width: viewportWidth, height: viewportHeight }  = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
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
class Cuando extends Component{
    constructor(props) {
        super(props);
        this.state = {
          date:"", primerBoton:false,  region: {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.005,
            longitudeDelta: 0.001,
          }, localidad:""
          };
          this.isAllowedDate = this.isAllowedDate.bind(this);
          this.borrarFunc = this.borrarFunc.bind(this)
          this.primerBotonFunc = this.primerBotonFunc.bind(this)
      }
     
    static navigationOptions = {
        header: null
      };
    componentDidMount(){
      const {cambioUbic, localidad} = this.props.navigation.state.params;
      let today     = moment().format("DD/MM/YYYY");
      this.setState({date:today});
     /* var geocode = {
        lat: -33.4903386,
        lng: -70.6530368
      }*/
      if(cambioUbic){
        this.primerBotonFunc();
        //this.setState({primerBoton:true, localidad:localidad})
      }else {
      Geolocation.getCurrentPosition(
        (cords) => {
          this.setState({
            region: {
              latitude: cords.coords.latitude,
              longitude: cords.coords.longitude,
              latitudeDelta: 7,
              longitudeDelta: 7
            }
          })
          var geocode = {
            lat: cords.coords.latitude,
            lng: cords.coords.longitude
          }
          console.log("position: ", geocode);
         Geocoder.geocodePosition(geocode).then(res => {
          // res is an Array of geocoding object (see below)
          this.setState({localidad:res[0].locality});
         // console.log("geocoding: ", res)
           });
        },
        (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      );
        }
        
    }
    isAllowedDate =(date) =>{
      var startdate = moment().format("YYYY-MM-DD");
      var newDate = moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");
      var token_if = moment(newDate,"YYYY-MM-DD" ).isAfter(startdate, "day");
      //console.log(token_if, newDate, startdate);
      if (!token_if){
        this.setState({date:date});
        this.localizar();
      }
      else Alert.alert("No puede seleccionar una fecha del futuro.");
    }
    localizar  () {
        const {ImageSource} = this.props.navigation.state.params;
        const {email, cambioUbic,ubicacion, especies, grupoEspecieProy } = this.props.navigation.state.params;
        var latitude = 0;
        var longitude = 0;
        if(cambioUbic){
          latitude = this.props.navigation.state.params.latitude;
          longitude = this.props.navigation.state.params.longitude;
        } else {
          latitude = this.state.region.latitude;
          longitude = this.state.region.longitude;
        }
        const navigateAction = NavigationActions.navigate({
          routeName: "Avistamiento",
          params: { ImageSource: ImageSource, email: email, localidad:this.state.localidad,
          latitude: latitude, longitude: longitude, fecha_nac: this.state.date, ubicacion, especies, grupoEspecieProy },
          actions: [NavigationActions.navigate({ routeName: 'Avistamiento' })],
        })
        this.props.navigation.dispatch(navigateAction);
      }
      donde = () =>{
        const {ImageSource, email, ubicacion, especies, grupoEspecieProy} = this.props.navigation.state.params;
        const navigateAction = NavigationActions.navigate({
          routeName: "Donde",
          params: { ImageSource: ImageSource, email: email ,ubicacion, especies, grupoEspecieProy },
          actions: [NavigationActions.navigate({ routeName: 'Donde' })],
        })
        this.props.navigation.dispatch(navigateAction);
      }
    
     borrarFunc = () => {
       console.log("funciono llamar esto");
      // this.setState({primerBoton:true}) 
      const {ubicacion, cambioUbic, localidad, latitude, longitude} = this.props.navigation.state.params;
      if(cambioUbic){
        this.setState({localidad, latitude, longitude});
      }
     }

    primerBotonFunc = () => {
      const {ubicacion, cambioUbic, localidad} = this.props.navigation.state.params;
      if(ubicacion){
        if(ubicacion[0].coordinates.length>0 ){
          var polygon = [];
          var ubicacion_ = ubicacion[0].coordinates;
          for (var z = 0, len_p = ubicacion_.length ; z < len_p; z++){
            const item = [ubicacion_[z].latitude,ubicacion_[z].longitude];
            polygon.push(item);
          }
          var latitude = 0;
          var longitude = 0;
          if(cambioUbic){
            latitude = this.props.navigation.state.params.latitude;
            longitude = this.props.navigation.state.params.longitude;
          } else {
            latitude = this.state.region.latitude;
            longitude = this.state.region.longitude;
          }
          let point = [latitude,longitude ];
          if( inside(point, polygon)){
            this.setState({primerBoton:true})
          }
          else{
            Alert.alert("Atención", 'Tu registro esta fuera del area del proyecto.', [
              {text: 'Continuar', onPress: () => this.setState({primerBoton:true,localidad})},
              {text: 'Corregir', onPress: () => this.borrarFunc()},
          ]);
          }
        }
      }
      else
        this.setState({primerBoton:true})
    }
    render() {
        const {ImageSource} = this.props.navigation.state.params;
        const {primerBoton, localidad} = this.state;
        let today     = moment().format("DD/MM/YYYY");
        var localLocale = moment();
        moment.updateLocale('es', esMoment );
        localLocale.locale(false);
        var _today  = localLocale.format("LL");
        
        return (
          <Container style={styles.container}>
            
            <Header  style={styles.header}>
              <Left style={{flex:1}}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                  <Icon name="ios-arrow-back" style= {{color: '#8c8c8c'}} />
                </Button>
              </Left>
              <Body style={{flex:4,  justifyContent: 'center', alignItems: 'center'}}>
              <Title style={{color: '#4A4A4A', fontSize: 17}}>Localiza tu registro</Title>
              </Body>

              <Right style={{flex:1}}>
                <Button transparent onPress= { this.submitReady}><FontAwesome name={'ellipsis-v'}style= {{color: '#8c8c8c'}} size={23}/></Button>
              </Right>
           </Header>   
           <ScrollView ref="scroll" style={{flex:1}} >      
            <View style={styles.viewGrid}>
              <View style={styles.processSphere}/>
              <View style={styles.processBar} />
              <View style={styles.processSphereOff}/>
              <View style={styles.processBar} />
              <View style={styles.processSphereOff}/>
            </View>
            <View style={{justifyContent:'center', alignItems: 'center', marginTop:0}}>
              <Image source={ImageSource}
              style={{width:viewportWidth, height:viewportHeight*0.48}} ></Image>
            </View>
            {(!primerBoton) ? 
              <View>{/*this.primerBotonFunc.bind(this) */}
                <TouchableOpacity style={styles.botonTerminar} onPress={() => this.primerBotonFunc()}>
                  <Image source={{uri:uri+"/customMarker.png"}} style={{width:41, height:41.5}}/>
                  <View style={{flex:1, flexDirection:'column', marginLeft:10}}>
                    <Text style={{fontWeight:'bold'}}>Aquí</Text>
                    <Text>{localidad}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor:'transparent', flexDirection:'row', justifyContent:'center'}} onPress={this.donde}>
                  <FontAwesome name={"map-o"} size={25} style={{color: '#787878', marginRight:10}} />
                  <Text style={{fontWeight:'bold', color:'#787878'}}>Otro lugar. ¿Dónde?</Text>
                </TouchableOpacity>
              </View>
              :
            <View>
               <TouchableOpacity style={styles.botonTerminar} onPress={this.localizar.bind(this)}>
                  <Image source={{uri:uri+"/customMarker.png"}} style={{width:41, height:41.5}}/>
                  <View style={{flex:1, flexDirection:'column', marginLeft:20}}>
                    <Text style={{fontWeight:'bold'}}>Hoy</Text>
                    <Text>{_today}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor:'transparent', flexDirection:'row', justifyContent:'center'}} onPress={() => this.datePickerRef.onPressDate()}>
                  <Image source={{uri:uri+"/date2.png"}} style={{width:30, height:30, marginRight:10}} />
                  <Text style={{fontWeight:'bold', color:'#787878'}}>Otro día. Cuándo?</Text>
                </TouchableOpacity>
              <DatePicker
              ref={(ref)=> this.datePickerRef=ref}
                style={{width: 308}}
                date={this.state.date}
                mode="date"
                placeholder="Ingresar fecha"
                format="DD/MM/YYYY"
                maxDate={today}
                showIcon={false}
                confirmBtnText="Confirmar"
                cancelBtnText="Cancelar"
                hideText={false}
                onDateChange={(date) => {
                  this.isAllowedDate(date);
                }}
                customStyles={{
                  dateInput: {
                    borderWidth: 0,
                    height:0,
                    width:0,
                    borderBottomWidth: 0,
                    alignItems: 'flex-start'
                  },
                  dateText:{
                    color: '#4A4A4A',
                    fontSize:16,
                    textAlign: 'left',
                    marginLeft: 10
                  },
                  placeholderText:{
                    fontSize: 17,
                    marginLeft: 8,
                    color: '#4A4A4A'
                  }
                }}
              />
            {/*  <TouchableOpacity  
              onPress={this.localizar}             
                style={styles.cruzButton}>
                <Text style={{color: '#4A4A4A', textAlign: 'center', fontSize:18}}>
                    Guardar</Text>             
            </TouchableOpacity>*/}
            </View>}
            </ScrollView>
          </Container>

        
        );
      }

}

const CuandoSwag = reduxForm(
  {
    form: "test"
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Cuando);
CuandoSwag.navigationOptions = {
  header: null
};
export default CuandoSwag;
