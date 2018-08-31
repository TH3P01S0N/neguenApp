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
import {Image, TouchableOpacity,StyleSheet,  Dimensions,Platform, Alert, ActivityIndicator} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from "react-navigation";

const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const temp_left = uri+"/temp_left.png";
const temp_right = uri+"/temp_right.png";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
const slideHeight = viewportHeight * 0.36;// 0.36;
const sliderWidth = viewportWidth;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(1);
const itemWidth = slideWidth + itemHorizontalMargin * 2;
class Temperatura extends Component{
    constructor(props) {
        super(props);
        this.state = {
            temp: 20, loading:false
          };
         // this.handle = this.handle.bind(this);
      }
     
    guardar = () => {
      const {ImageSource, modulo, keyAvist, id, localidad} = this.props.navigation.state.params;
      const {email} = this.props.navigation.state.params;
      const {grupoEspecie} = this.props.navigation.state.params;
      const {latitude} = this.props.navigation.state.params;
      const {longitude} = this.props.navigation.state.params; 
      const {especie} = this.props.navigation.state.params;
      const {fecha_nac} = this.props.navigation.state.params;
      const {comentario} = this.props.navigation.state.params;
      var amenaza,suelo = null;
      if(this.props.navigation.state.params.amenaza) amenaza = this.props.navigation.state.params.amenaza;
      else  amenaza="/";
      if(this.props.navigation.state.params.suelo) suelo = this.props.navigation.state.params.suelo;
      else  suelo="/";
      const navigateAction = NavigationActions.navigate({
        routeName: "Mapear",
        params: {fecha_nac:fecha_nac, grupoEspecie: grupoEspecie, ImageSource: ImageSource,localidad,
         modulo:modulo,  email: email, grupoEspecie:grupoEspecie, latitude:latitude, longitude:longitude, comentario:comentario,
        keyAvist:keyAvist, id,  especie:especie, amenaza: amenaza, temp:this.state.temp, suelo:suelo },
        actions: [NavigationActions.navigate({ routeName: "Mapear" })],
        //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
      })
      this.props.navigation.dispatch(navigateAction);
    }
    componentDidMount(){
      this.setState({loading:true});
      const {latitude} = this.props.navigation.state.params;
    const {longitude} = this.props.navigation.state.params; 
      const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=0044498efd78fadd1294f8203e85b3db`;
      fetch(url, {
        method: 'GET',
        headers: {  
        'Accept': 'application/json',
        'Content-Type': 'application/json', }       
      })
      .then(function(response) {
        if (response.status >= 400) {
          console.log("no hay respuesta de openweather map: ", response);
          this.setState({loading:true});
        }
        return response.json();})
          .then(response => {
            this.setState({temp:Math.floor(response.main.temp), loading:false});
            console.log(response);
            console.log(response.main.temp);
          })
          .catch(error => {
            this.setState({ error, loading: false });
          });
    }
    handleTemp = (value) =>{
      var tempCopy = this.state.temp;
      this.setState({temp: tempCopy+value});
    }
    static navigationOptions = {
        header: null
      };
    render() {
        const { region } = this.props;
        const { navigate } = this.props.navigation;
        //const example2 = this.momentumExample(2, 'Momentum | Left-aligned | Active animation');
        return (
          <Container style={styles.container}>
            <Header  style={styles.header}>
            <Left style={{flex:1}}>
                <Button transparent onPress={this.submitReady}onPress={() => this.props.navigation.goBack()}>
                    <Icon style={{color: '#4A4A4A'}} name="ios-close" size={50} />
                </Button>
            </Left>
            <Body style={{flex:4,  justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#4D4D4D', fontSize:viewportWidth*.04, marginRight: 70, fontWeight: 'bold',}}>
                Temperatura del aire
                </Text>
            </Body>
        </Header>
        <View style={{flex:1, justifyContent:'center', alignItems:'center', marginTop:30}}>
            
              
              <View style={styles.matriz2}>
                <TouchableOpacity transparent  onPress={ ()=> this.handleTemp(-1) }>
                  <Image source={{uri:temp_left}} style={{height:76, width:viewportWidth*.14} }></Image>
                </TouchableOpacity>
                {(this.state.loading) ?
                <ActivityIndicator/> :
                  <Text style={{color: '#FA511D', textAlign: 'center', fontSize:70, fontWeight:"bold", marginLeft:30, marginRight:26}}>{this.state.temp}°</Text>
                 }
                <TouchableOpacity transparent  onPress={ ()=> this.handleTemp(1) }>
                  <Image source={{uri:temp_right}} style={{height:76, width:viewportWidth*.14}}></Image>
                </TouchableOpacity>
              </View>
              <Text style={{color: '#787878', fontSize:viewportWidth*.035, marginRight: 30,fontFamily:"notoserif",
              textAlign: 'center', marginLeft:30, marginTop:40}}>
                Temperatura sugerida por Open Weather Map
                </Text>
            
              <Text style={{color: '#DEDA3E', fontSize:viewportWidth*.06, marginRight: 30,fontFamily:"notoserif",
              textAlign: 'center', marginLeft:30, marginTop:70}}>
                Si tienes información más precisa de la temperatura, usa las flechas para ajustarla
                </Text>
            
            </View>
            {(!this.state.loading) &&
              <View style={{marginLeft: 20, marginRight: 20, marginTop: 0, marginBottom: 20,padding: 20}}>
                  <TouchableOpacity  
                    onPress={this.guardar}             
                    style={{ padding: 10, paddingVertical:15, marginTop: 1, alignItems: 'center', backgroundColor: '#DEDA3E', borderRadius:5}}>
                    <Text style={{color: '#4A4A4A', textAlign: 'center', fontSize:18,fontFamily:"notoserif"}}>
                        Guardar</Text>                          
                  </TouchableOpacity>
              </View>} 
            
            
          </Container>

        
        );
      }

}

const TemperaturaSwag = reduxForm(
  {
    form: "test"
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Temperatura);
TemperaturaSwag.navigationOptions = {
  header: null
};
export default TemperaturaSwag;
