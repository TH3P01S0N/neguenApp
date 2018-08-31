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
  List,
  Item,
  Input
} from "native-base";
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
import { Field, reduxForm } from "redux-form";
import { Image, KeyboardAvoidingView, TouchableOpacity, Alert, ScrollView, Dimensions } from "react-native";
import styles from "./styles";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const hongo  = uri + "/hongosolo.png";// require("../../../images/1-hongo.png");
const rana = uri + "/ranasolo.png";
const llama = uri + "/llamasolo.png";
const pajaro = uri + "/pajarosolo.png";
const flor = uri + "/florsolo.png";
const caracol = uri + "/caracolsolo.png";
const cucaracha = uri + "/cucarachasolo.png";
const pez = uri + "/pezsolo.png";
const validate = values => {
  const error= {};
  return error;
}
class Amapear extends Component {
  constructor(props){
    super(props);
    
    this.submitReady = this.submitReady.bind(this);
  }
  
  static navigationOptions = {
    header: null
  };
  static propTypes = {
    name: React.PropTypes.string,
    index: React.PropTypes.number,
    list: React.PropTypes.arrayOf(React.PropTypes.string),
    openDrawer: React.PropTypes.func
  };
  submitReady = ()=>{
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'Mapa' })],
      //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
    })
    this.props.navigation.dispatch(actionToDispatch)
  }
 
  render() {
    const { props: { name, index, list } } = this;
    const { navigate } = this.props.navigation;
    const {genero, ImageSource, nombre, localidad} = this.props.navigation.state.params;
    const {grupos} = this.props.navigation.state.params;
    return (
      <Container style={styles.container}>       
          <Header style={styles.header}>
          <Left/>

          <Body style={{flex:5,  justifyContent: 'center', alignItems: 'center', backgroundColor:'#FFFFFF'}}>
            <Text style={{color: '#1E1E32', fontSize: 19, textAlign:'center', fontWeight:'bold'}}>
            {genero=='Mujer' ? "     ¡Bienvenida!" : "     ¡Bienvenido!" }
            </Text>
          </Body>

          <Right />
        </Header>

        <View style={styles.content}>  
        { ImageSource === null ? 
        <View style={{width:viewportHeight*.36, alignItems:'center',
        justifyContent:'center', height:viewportHeight*.36, borderRadius:(viewportHeight*.36)/2 }}>
          <Icon style={{color: '#4A4A4A'}} name="camera" /></View>:
        <Image style={{ width:viewportHeight*.36, height:viewportHeight*.36, borderRadius:(viewportHeight*.36)/2, borderWidth:3, borderColor:'#DEDA3E'}}
        source={ImageSource} />}
         <Text style={{color: '#DEDA3E', fontSize: viewportHeight*.04, textAlign:'center', marginTop:15}}>{nombre}</Text>  
         <Text style={{color: '#787878', fontSize: viewportHeight*.025, textAlign:'center'}}>{localidad}</Text> 
         <View style={{backgroundColor:'#DEDA3E', height:1, width:viewportWidth*.8, marginTop:15}} />
            <View style={styles.scrollContainer}>
                  <View style={styles.viewGrid}>
                    {grupos.includes(5) &&
                      <View  style={styles.box} >
                        <Image source={{uri:flor}} style={styles.shadow}></Image>
                      </View>}
                      {grupos.includes(2) &&
                      <View  style={styles.box} >
                        <Image source={{uri:rana}} style={styles.shadow}></Image>
                      </View> }
                      {grupos.includes(3) &&
                      <View  style={styles.box} >
                        <Image source={{uri:llama}} style={styles.shadow}></Image>
                      </View>}
                      {grupos.includes(4) &&
                      <View  style={styles.box} >
                        <Image source={{uri:pajaro}} style={styles.shadow}></Image>
                      </View>}
                      {grupos.includes(1) &&
                      <View  style={styles.box} >
                        <Image source={{uri:hongo}} style={styles.shadow}></Image>
                      </View>}
                      {grupos.includes(6) &&
                      <View  style={styles.box} >
                        <Image source={{uri:caracol}} style={styles.shadow}></Image>
                      </View> }
                      {grupos.includes(7) &&
                      <View  style={styles.box} >
                        <Image source={{uri:cucaracha}} style={styles.shadow}></Image>
                      </View>}
                      {grupos.includes(8) &&
                      <View  style={styles.box} >
                        <Image source={{uri:pez}} style={styles.shadow}></Image>
                      </View>}
                      
                  </View>
              </View>
               
              <TouchableOpacity  style= {styles.btnRegister} onPress= { this.submitReady} >
                <Text capitalize={false} style={styles.texto}>Empezar</Text>
             </TouchableOpacity>
        </View>
      </Container>
    );
  }
  
}

const AmapearSwag = reduxForm(
  {
    form: "test",
    validate
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Amapear);
AmapearSwag.navigationOptions = {
  header: null
};
export default AmapearSwag;
