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
import {Image, TouchableOpacity, ScrollView, KeyboardAvoidingView,StyleSheet,Aler, Dimensions,Platform, PermissionsAndroid, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from "react-navigation";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const crear_proyecto  = uri + "/crear_proyecto.png";
class Proyecto extends Component{
    constructor(props) {
        super(props);
        this.state = {
          };
      }
     
    static navigationOptions = {
        header: null
      };
    render() {
        const { region } = this.props;
        const { navigate } = this.props.navigation;
        const {email, modulo} = this.props.navigation.state.params;
        return (
          <Container style={styles.container}>
            <Header  style={styles.header}>
            <Left style={{flex:1}}>
                <Button transparent onPress={this.submitReady}onPress={() => this.props.navigation.goBack()}>
                    <Icon style={{color: '#4A4A4A'}} name="ios-close" size={50} />
                </Button>
            </Left>
            <Body style={{flex:5,  justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#4D4D4D', fontSize: 20, marginRight: 70, fontWeight: 'bold',}}>
                Crear proyecto
                </Text>
            </Body>
            </Header>
            <View style={styles.content}>
             {/* <FontAwesome  name="book" size={viewportWidth*.3} style={{color: 'black'}}
              />*/}
              <Image source={{uri: crear_proyecto}} style={ {width:viewportWidth*.22, height:(viewportWidth*.22)-5} }></Image>
              <Text style={{color: '#4D4D4D', fontSize: viewportWidth*.048, margin: 30, marginTop:15, textAlign: 'center' }}>
              Un proyecto es una herramienta para trabajar en equipo y registrar en conjunto la biodiversidad de un lugar.
                </Text>
                <Text style={{color: '#4D4D4D', fontSize: viewportWidth*.048, marginHorizontal: 30, marginTop:0, textAlign: 'center' }}>
                Mientras más registros realicen y aprendan de las especies de un lugar, mejor preparados estarán para realizar acciones de conservación o restauración ambiental.
                </Text>
                <Text style={{color: '#ddd93d', fontSize: viewportWidth*.048, marginHorizontal: 30, marginTop:20, textAlign: 'center' }}>
                ¡Sigue los pasos y éxito con el proyecto!
                </Text>
              <TouchableOpacity  style= {styles.btnRegister} onPress={() => navigate("Nombre", {navigation: this.props.navigation, email:email, modulo:modulo})} >
                <Text capitalize={false} style={{fontWeight:'bold', fontSize:20}}>Comenzar</Text>
             </TouchableOpacity>
            </View>
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
)(Proyecto);
ProyectoSwag.navigationOptions = {
  header: null
};
export default ProyectoSwag;
