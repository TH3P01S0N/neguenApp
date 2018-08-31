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
import MapView, {Marker, ProviderPropType, AnimatedRegion} from 'react-native-maps';
import {Image, TouchableOpacity, ScrollView, KeyboardAvoidingView,StyleSheet, ActivityIndicator, Dimensions,Platform, PermissionsAndroid, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import styles from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
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
const SPACE = 0.01;

class Editubica extends Component{
    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              },
              mapPress: false, id:0, loading:false,  fromDrawBar:false
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
     localizar () {
      var geocode = {
        lat: this.state.region.latitude,
        lng: this.state.region.longitude
      }
      Geocoder.geocodePosition(geocode).then(res => {
        // res is an Array of geocoding object (see below)
      this.setState({loading:true});
      var data ={
        localidad:res[0].locality, latitude: this.state.region.latitude, longitude: this.state.region.longitude , id: this.state.id
      }
      fetch(url_API+'avistamiento/editubica', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json', 'Content-Type': 'application/json'
                },
                    body: JSON.stringify(data)
            })
            .then(function(response) {
                if (response.status >= 400) {
                  throw new Error("Bad response from server");
                }
                return response.json();
            }).then(response=>{             
              this.setState({loading: false});
              if(response.success){
                if(this.state.fromDrawBar==false){
                  this.props.isGoBack();
                  this.props.navigation.goBack(); 
                 }      
                 else this.props.navigation.popToTop();        
              }
              else {
                console.log("response: ", response);
              }
            })
        });
    }
      componentDidMount() {       
        const {values} = this.props.navigation.state.params;
        const {id} = this.props.navigation.state.params; 
        const {fromDrawBar} = this.props.navigation.state.params;
        console.log("values: ", values);
        var region  = {
          latitude: values.latitude,
          longitude: values.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
        this.setState({region: region, id: id,  fromDrawBar:fromDrawBar});
        
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
              console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
      }   
    
     componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
	    //  navigator.geolocation.stopObserving();
      }
      onMapPress (){
        this.setState({mapPress: true});
      }

    render() {
        const { region } = this.props;
        return (
          <Container style={styles.container}>
           {(!this.state.fromDrawBar ) &&
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
           </Header>   }                

            {(this.state.mapPress===false) ?
            <View style={styles.vistaHelp}>
              <TouchableOpacity 
                onPress={() => this.onMapPress()}
                style={{zIndex: 10, flex:1, backgroundColor: '#FBFAFA', opacity: 0.7}} >
                {/*<MaterialCommunityIcons name="arrow-up" size={40}
                style={{zIndex:10, marginTop:Dimensions.get("window").height/2 -50 }}/>*/}
                <Text style={{fontSize: 20, marginLeft: 50, marginRight: 30, marginTop:Dimensions.get("window").height/2+150, color:'black'}}>
                  Si no es aquí mueve el mapa para actualizar tu avistamiento</Text>
                  
              </TouchableOpacity>             
            </View>
            :
              <View/>
            }
            <View style={styles.cruz}>
              <TouchableOpacity               
                style={styles.cruzButton}
                onPress={this.localizar.bind(this)}>
                {(this.state.loading) ? 
                <ActivityIndicator/> :
                <Text style={{color: '#4A4A4A', textAlign: 'center', fontSize:18, marginLeft:Dimensions.get("window").width/2-130 , marginRight:Dimensions.get("window").width/2-130}}>Actualizar</Text> }            
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
               //customMapStyle={maps}
                region={this.state.region}
              //  onRegionChange={ region => this.setState({region}) }
                onRegionChangeComplete={ region => this.setState({region}) }         
              //  onRegionChange={this.onRegionChange}
              /> 
              {(!this.state.fromDrawBar) ?
              <View pointerEvents="none" style={{position: 'absolute', top: viewportHeight/2-40 , bottom: viewportHeight/2-30, left: viewportWidth/2-20 , right: viewportWidth/2-20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
                 <Image style={{ height:53, width:51}} source={{uri: markerImage}}/>
              </View>
              :
              <View pointerEvents="none" style={{position: 'absolute', top: viewportHeight/2-80 , bottom: viewportHeight/2-30, left: viewportWidth/2-20 , right: viewportWidth/2-20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
                 <Image style={{ height:53, width:51}} source={{uri: markerImage}}/>
              </View>}
                {/*<Marker 
                    coordinate={ this.state.region }
                    draggable
                />
                </MapView> */}
            
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

export default connect(mapStateToProps, bindActions)(Editubica);


