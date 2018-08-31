import React, { Component } from "react";
import { connect } from "react-redux";
const {Dimensions} = require('react-native');
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  //TextInput,
  Input,
  Button,
  Icon,
  Left,
  Item,
  Right,
  Body,
  Radio,
} from "native-base";
import { openDrawer } from "../../actions/drawer";
import BlankPage2 from "../blankPage2";
import DrawBar from "../DrawBar";
import {url_API} from "../../config";
import {ActivityIndicator, TextInput, Image, KeyboardAvoidingView, TouchableOpacity, View, ScrollView, AsyncStorage } from "react-native";
import { Field, reduxForm } from "redux-form";
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
class Acerca extends Component  {
    constructor(props){
        super(props);
        this.state={
            arbol1:false, arbol2:false, arbol3:false, arbol4:false, arbol5:false, numero:0, enviada:false
        }
    }
    static navigationOptions = {
        header: null
      };
    guardar = () => { 
        console.log("guardar")  ;
        const navigateAction = NavigationActions.reset({
          index: 0,
          key: null,
          //params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, especie: this.state.especie },
          actions: [NavigationActions.navigate({ routeName: 'Mapa' })],
        })
        this.props.navigation.dispatch(navigateAction);
    }
    enviar = () => { 
        const {nombre} = this.props.navigation.state.params;
        var data = {nombre , calificacion:this.state.numero} 
        fetch(url_API+'mail/enviarCalif', {
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
                this.setState({enviada:true});
            })
    }
      render() {
        const { props: { name, index, list } } = this;
        const { navigate } = this.props.navigation;
        const {arbol1,arbol2,arbol3,arbol4, arbol5, enviada} = this.state;
       // console.log("nombre ",this.props.navigation.state.params );
        return(
            <Container style={{flex:1,justifyContent: 'center', paddingHorizontal: 0, backgroundColor: '#FBFAFA',}}>
                <Header style={{flexGrow: 1, backgroundColor: '#FBFAFA'}}>
                <Left>
                    <Button transparent  onPress={() => DrawerNav.navigate("DrawerOpen")}>
                    <Image source={{uri: uri+"/person.png"}} style={{ width:viewportHeight*.035, height:viewportHeight*.035,marginVertical:viewportHeight*.015}}/>
                    </Button>
                </Left>

                <Body style={{flex:3, justifyContent: 'center', alignItems:'center'}} >
                    <Text style={{color: '#4A4A4A', fontSize:16, marginLeft:20}}>Acerca de Neguén</Text>
                </Body>
                <Right style={{flex:1}} >
                    <Button transparent onPress={this.guardar} ><Image source={{uri:uri+"/neguen.png"}} style={{width:15, height:23.2}} /></Button>
                </Right>
                </Header>
                <ScrollView style={{flex:1, marginVertical:20, paddingHorizontal:30}}>
                    <Text style={{color:"#787878", fontSize:viewportHeight*.021,textAlign:'justify'}}>
                        Neguén es una herramienta digital para unir a las
                        personas en torno al desafío de difundir,
                        conservar y restaurar la naturaleza de Chile.
                    </Text>
                    <Text style={{color:"#787878", fontSize:viewportHeight*.021, marginTop:20,textAlign:'justify'}}>
                    Partimos de una premisa simple y muy conocida:
                    “Nadie cuida lo que no conoce” y le sumamos una
                    segundo parte, que la mejor forma de aprender es
                    de la mano de quienes confiamos y con quienes
                    compartimos intereses.
                    </Text>
                    <Text style={{color:"#787878", fontSize:viewportHeight*.021, paddingVertical:20, textAlign:'justify', borderBottomWidth:2, borderBottomColor:'#ddd93d'}}>
                    En Chile viven miles de personas que desde la
                    ciencia, su historia o sus propias motivaciones han
                    construido una relación muy valiosa con la
                    biodiversidad, con distintas comunidades y con
                    los conocimientos que juntos han conquistado.
                    Ellas son el corazón de esta herramienta. Neguén
                    recoge esa fortaleza para que el conocimiento
                    viaje a través de las personas, sus intereses y sus
                    experiencias. Para que se transforme en acción y
                    mejores desiciones, para que a través de la
                    colaboración, todos tengamos la oportunidad de
                    aprender y compartir lo que nos une a la
                    naturaleza. 
                    </Text>
                    <Text style={{color:"#787878", fontSize:viewportHeight*.021, textAlign:'center', marginTop:20}}>
                        Califica Neguén.
                    </Text>
                    <Text style={{color:"#787878", fontSize:viewportHeight*.021, textAlign:'center'}}>
                        Tu opinión nos ayuda a mejorar.
                    </Text>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:40, marginVertical:20}}>
                        <TouchableOpacity onPress={ ()=> this.setState({arbol5: false,arbol4: false, arbol3:false, arbol2:false, arbol1:true, numero:1}) }>
                        <Image source={arbol1 ? {uri: uri+'/arbolitoPress.png'}: {uri: uri+'/arbolito.png'}}  style={{height:35, width:35, marginRight:0}}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ ()=> this.setState({arbol5: false,arbol4: false, arbol3:false, arbol2:true, arbol1:true, numero:2}) }>
                        <Image source={arbol2 ? {uri: uri+'/arbolitoPress.png'}:{uri: uri+'/arbolito.png'}}   style={{height:35, width:35, marginRight:0}}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ ()=> this.setState({arbol5: false,arbol4: false, arbol3:true, arbol2:true, arbol1:true, numero:3}) }>
                        <Image source={arbol3 ? {uri: uri+'/arbolitoPress.png'}:{uri: uri+'/arbolito.png'}}  style={{height:35, width:35, marginRight:0}}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ ()=> this.setState({arbol5: false,arbol4: true, arbol3:true, arbol2:true, arbol1:true, numero:4}) }>
                        <Image source={arbol4 ? {uri: uri+'/arbolitoPress.png'}:{uri: uri+'/arbolito.png'}}  style={{height:35, width:35, marginRight:0}}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ ()=> this.setState({arbol5: true,arbol4: true, arbol3:true, arbol2:true, arbol1:true, numero:5}) }>
                        <Image source={arbol5 ? {uri: uri+'/arbolitoPress.png'}:{uri: uri+'/arbolito.png'}}  style={{height:35, width:35, marginRight:0}}></Image>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity  style= {{padding: 10, paddingVertical: 15, marginTop: 16, marginLeft:0, marginRight: 10, alignItems: 'center', backgroundColor: '#DEDA3E', borderRadius:5,}} 
                        onPress= {this.enviar} disabled={enviada} >
                         <Text capitalize={false} style={{color: '#1E1E32', fontSize:15, marginRight: 10}}>{enviada ? "Gracias por calificarnos" : "Enviar calificación" }</Text>
                    </TouchableOpacity>
                </ScrollView>
            </Container>
        );
      }
}
const RegSwag = reduxForm(
    {
      form: "test"
    },
    function bindActions(dispatch) {
      return {
        setUser: name => dispatch(setUser(name)),
        openDrawer: () => dispatch(openDrawer())
      };
    }
  )(Acerca);
  RegSwag.navigationOptions = {
    header: null
  };
  const DrawNav = DrawerNavigator(
    {
      Registros: { screen: RegSwag },
      BlankPage2: { screen: BlankPage2 },
      
    },
    {
      contentComponent: props => <DrawBar {...props} />
    }
  );
  const DrawerNav = null;
  DrawNav.navigationOptions = ({ navigation }) => {
    DrawerNav = navigation;
    return {
      header: null
    };
  };
  export default DrawNav;