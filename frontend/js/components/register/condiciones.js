import React, { Component } from "react";
const {Dimensions} = require('react-native');
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  TextInput,
  Input,
  Button,
  Icon,
  Left,
  Item,
  Right,
  Body,
  Radio,
  ListItem,
  StyleProvider
} from "native-base";
import { Field, reduxForm } from "redux-form";
import styles from "./styles";
import { StyleSheet, KeyboardAvoidingView, TouchableOpacity, Alert, ActivityIndicator, View, AsyncStorage, ScrollView } from "react-native";
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import HTMLView from 'react-native-htmlview';
import {texto} from "./texto";


class Condiciones extends Component{
    constructor(props){
        super(props);
        this.state={
          
        };
        this.submitReady = this.submitReady.bind(this);
      }
      static navigationOptions = {
        header: null
      };
      submitReady = () =>{
        const {nombre,correo,contras,fecha,localidad,radio,facebook} = this.props.navigation.state.params;
        const navigateAction = NavigationActions.navigate({
            routeName: "Welcome",
            params: {nombre, correo, contras, fecha, localidad,
               radio, facebook},
            actions: [NavigationActions.navigate({ routeName: 'Welcome' })],
          })
          this.props.navigation.dispatch(navigateAction); 
      }
      render(){
        const { props: { name, index, list } } = this;
        return(
            <Container style={styles.container}>
                <Header style={styles.header}>
                <Left style={{flex:1}}>
                    <Button transparent  onPress={() => this.props.navigation.goBack()}>
                    <Icon style={{color: '#787878'}} name="ios-arrow-back" />
                    </Button>
                </Left>
        
                <Body style={{flex:5,  justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#1E1E32', fontSize: 17, textAlign:'center', fontWeight:'bold'}}>Términos y condiciones</Text>
                </Body>
        
                <Right />
                </Header>
            <ScrollView style={{flex:1, paddingHorizontal:30, marginBottom:20}}>
                <HTMLView  stylesheet={styleshtml}
                    value={texto} style={{flex:1, marginHorizontal: 0, marginVertical: 20, flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap'}}
                ></HTMLView>
                <TouchableOpacity  style= {styles.btnRegister} onPress= { this.submitReady} >
                    <Text capitalize={false} style={{color: '#1E1E32',fontSize:viewportHeight*.0256}}>Acepto los términos y condicones</Text>
                </TouchableOpacity>
            </ScrollView>
            </Container>            
        )
      }
}
const styleshtml = StyleSheet.create({
    a: {
      color:  '#787878', 
      fontSize:13, textAlign:'justify'
      // make links coloured pink
    },
    
  });
const CondiSwag = reduxForm(
    {
      form: "test"
    },
    function bindActions(dispatch) {
      return {
        setUser: name => dispatch(setUser(name))
      };
    }
  )(Condiciones);
  CondiSwag.navigationOptions = {
    header: null
  };
  export default withNavigation(CondiSwag);