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
import maps from '../../home/mapStyle';
import { Field, reduxForm } from "redux-form";
import MapView, {Marker, ProviderPropType, AnimatedRegion} from 'react-native-maps';
import {Image, TouchableOpacity, ScrollView, KeyboardAvoidingView,StyleSheet,ActivityIndicator, Dimensions,Platform, PermissionsAndroid, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import styles from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const markerImage = uri + "/customMarker.png?123213";
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = -33.4858;
const LONGITUDE = -70.6414;
const LATITUDE_DELTA = 7;
const LONGITUDE_DELTA = LATITUDE_DELTA;
const SPACE = 0.01;

class Donde extends Component{
    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              },
              mapPress: false, loading:false
          };
      }
     
    static navigationOptions = {
        header: null
      };
      //onRegionChange = reg =>{
     //     this.setState({region});
          
     // };
    // onRegionChange(region) {
     //   this.state.region.setValue(region);
     // }
     localizar () {
       this.setState({loading:true});
      var geocode = {
        lat: this.state.region.latitude,
        lng: this.state.region.longitude
      }
      Geocoder.geocodePosition(geocode).then(res => {
        // res is an Array of geocoding object (see below)
        this.setState({loading:false});
        const {ImageSource} = this.props.navigation.state.params;
        const {email, ubicacion, especies, grupoEspecieProy} = this.props.navigation.state.params;
        const navigateAction = NavigationActions.navigate({
          routeName: "Cuando",
          params: { ImageSource: ImageSource, email: email, cambioUbic:true, localidad:res[0].locality,
          latitude: this.state.region.latitude, longitude: this.state.region.longitude, ubicacion, especies, grupoEspecieProy },
          actions: [NavigationActions.navigate({ routeName: 'Cuando' })],
          })
        this.props.navigation.dispatch(navigateAction);
        });
    }
      componentDidMount() {       

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
          },
          (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      );
      }
      _findMe= async ()=>{
        //await requestLocationPermissions();
        Geolocation.getCurrentPosition(
          (cords) => {
            //const {latitude, longitude} = position
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
      /*this.watchID = navigator.geolocation.watchPosition(
        position => {
          this.setState({      
              region:     
             { latitude: position.coords.latitude,
               longitude: position.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.001,}
             
          });
        },
        (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 0});*/
      }    
  //   componentWillUnmount() {
   //     navigator.geolocation.clearWatch(this.watchID);
	    //  navigator.geolocation.stopObserving();
    //  }
      onMapPress (){
        this.setState({mapPress: true});
      }

    render() {
        const { region } = this.props;
        return (
          <Container style={styles.container}>
            
            <Header  style={styles.header}>
              <Left style={{flex:1}}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                  <Icon name="ios-arrow-back" style= {{color: '#8c8c8c'}} />
                </Button>
              </Left>
              <Body style={{flex:4,  justifyContent: 'center', alignItems: 'center'}}>
              <Title style={{color: '#4A4A4A', fontSize: 17}}>Donde</Title>
              </Body>

              <Right style={{flex:1}}>
                <Button transparent onPress= { this.submitReady}><FontAwesome name={'ellipsis-v'}style= {{color: '#8c8c8c'}} size={23}/></Button>
              </Right>
           </Header>         
            <View style={styles.viewGrid}>
              <View style={styles.processSphere}/>
              <View style={styles.processBar} />
              <View style={styles.processSphere}/>
              <View style={styles.processBar} />
              <View style={styles.processSphereOff}/>
            </View>
           
            <View style={styles.vista}>
              {/*<TouchableOpacity
                transparent
                //activeOpacity={0.9}
                style={styles.mapButton}
                onPress={ () => this._findMe() }
              ><MaterialCommunityIcons  name="near-me" size={30}
              style= {styles.navigate}/></TouchableOpacity>*/}
            </View>
            {(this.state.mapPress===false) ?
            <View style={styles.vistaHelp}>
              <TouchableOpacity 
                onPress={() => this.onMapPress()}
                style={{zIndex: 10, flex:1, backgroundColor: '#FBFAFA', opacity: 0.7}} >
                {/*<MaterialCommunityIcons name="arrow-up" size={40}
                style={{zIndex:10, marginTop:Dimensions.get("window").height/2 -50 }}/>*/}
                <Text style={{fontSize: 20, marginLeft: 50, marginRight: 30, marginTop:Dimensions.get("window").height/2+150, color:'black'}}>
                  Si no es aquí mueve el mapa para localizar tu avistamiento</Text>
                  
              </TouchableOpacity>
              
            </View>
            :
              <View/>
            }
            <View style={styles.cruz}>
              <TouchableOpacity               
                style={styles.cruzButton} disabled={this.state.loading}
                onPress={this.localizar.bind(this)}>{ this.state.loading ? <ActivityIndicator/> :
                <Text style={{color: '#4A4A4A', textAlign: 'center', fontSize:18, marginLeft:Dimensions.get("window").width/2-130 , marginRight:Dimensions.get("window").width/2-130}}>
                    Guardar</Text>             }
              </TouchableOpacity>
            </View>
           {/* <View  style={{zIndex:5, position: 'absolute', top: viewportHeight/2-30 , bottom: viewportHeight/2-30, left: viewportWidth/2-20 , right: viewportWidth/2-20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
                <Image style={{zIndex:6, flex:1, height:30, width:30}} source={{uri: markerImage}}/>
          </View>*/}
              <MapView
              loadingEnabled={true}
                showsMyLocationButton={true}
                //provider={this.props.provider}
                showsUserLocation={true}
                style={styles.map}
               customMapStyle={maps}
                region={this.state.region}
              //  onRegionChange={ region => this.setState({region}) }
                onRegionChangeComplete={ region => this.setState({region}) }         
              //  onRegionChange={this.onRegionChange}
              />   
              <View pointerEvents="none" style={{position: 'absolute', top: viewportHeight/2-40 , bottom: viewportHeight/2-40, left: viewportWidth/2-25 , right: viewportWidth/2-25, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
                 <Image style={{ height:49, width:51}} source={{uri: markerImage}}/>
              </View>
                {/*<Marker 
                    coordinate={ this.state.region }
                    draggable
                />
                </MapView> */}
            
          </Container>

        
        );
      }

}
Donde.propTypes = {
    provider: ProviderPropType,
  };

export default Donde;