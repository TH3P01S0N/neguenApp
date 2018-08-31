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
import {url_API} from '../../../config';
import {isGoBack} from "../../../actions/goback_action";
import {textoGrupos} from '../textGrupos';
import HTMLView from 'react-native-htmlview';
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const hongo  = uri + "/hongo.png";// require("../../../images/1-hongo.png");
const rana =  uri + "/rana.png"; 
const llama = uri + "/llama.png"; 
const pajaro = uri + "/pajaro.png"; 
const flor = uri + "/flor.png"; 
const caracol = uri + "/caracol.png"; 
const cucaracha = uri + "/cucaracha.png"; 
const pez = uri + "/pez.png"; 
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

class EditGrupos extends Component{
    constructor(props) {
        super(props);
        this.state = {
             id:0, loading:false, pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,
            pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false, ImagenGrupo: null, idGrupoEspecie:0,
            modulo:""
          };
         // this.handle = this.handle.bind(this);
      }
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
    guardar = () => {
      this.setState({loading:true});
      var data ={
        idGrupoEspecie: this.state.idGrupoEspecie, id: this.state.id, fromDrawBar:false
      }
      fetch(url_API+ this.state.modulo+ '/editgrupos', {
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
                console.log("response grupos: ", response);
              }
            })
      
     /* const navigateAction = NavigationActions.navigate({
        routeName: "Mapear",
        params: {fecha_nac:fecha_nac, grupoEspecie: grupoEspecie, ImageSource: ImageSource,
           email: email, grupoEspecie:grupoEspecie, latitude:latitude, longitude:longitude, comentario:comentario,
           especie:especie, amenaza: amenaza, temp:this.state.temp, suelo:suelo },
        actions: [NavigationActions.navigate({ routeName: "Mapear" })],
        //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
      })
      this.props.navigation.dispatch(navigateAction);*/
    }
    componentDidMount(){
      const {values} = this.props.navigation.state.params;
      const {id} = this.props.navigation.state.params; 
      const {fromDrawBar} = this.props.navigation.state.params;
      const {modulo} = this.props.navigation.state.params;
      console.log(this.props.navigation.state.params);
      if(values==1) this.setState({pressHongo:true, id:id, ImagenGrupo:hongo, idGrupoEspecie:1,  fromDrawBar:fromDrawBar, modulo:modulo });
      if(values==2) this.setState({pressRana:true, id:id, ImagenGrupo:rana, idGrupoEspecie:2,  fromDrawBar:fromDrawBar, modulo:modulo});
      if(values==3) this.setState({pressLlama:true, id:id, ImagenGrupo:llama, idGrupoEspecie:3,  fromDrawBar:fromDrawBar, modulo:modulo});
      if(values==4) this.setState({pressPajaro:true, id:id, ImagenGrupo:pajaro, idGrupoEspecie:4,  fromDrawBar:fromDrawBar, modulo:modulo});
      if(values==5) this.setState({pressFlor:true, id:id, ImagenGrupo:flor, idGrupoEspecie:5,  fromDrawBar:fromDrawBar, modulo:modulo});
      if(values==6) this.setState({pressCaracol:true, id:id, ImagenGrupo:caracol, idGrupoEspecie:6,  fromDrawBar:fromDrawBar, modulo:modulo});
      if(values==7) this.setState({pressCucar:true, id:id, ImagenGrupo:cucaracha, idGrupoEspecie:7,  fromDrawBar:fromDrawBar, modulo:modulo});
      if(values==8) this.setState({pressPez:true, id:id, ImagenGrupo:pez, idGrupoEspecie:8,  fromDrawBar:fromDrawBar, modulo:modulo});
    }
    handleGroup = (value) =>{
      var {idGrupoEspecie, pressCaracol, pressCucar, pressFlor, pressHongo, pressLlama, pressPajaro, pressPez, pressRana} = this.state; 
      if(idGrupoEspecie==0) this.refs.scroll.scrollTo({y:viewportHeight*0.65,animated: true});
      if(value==idGrupoEspecie) idGrupoEspecie=0;
     else idGrupoEspecie=value;
     console.log(value, idGrupoEspecie);
      if(value==1) this.setState({pressHongo:!pressHongo, idGrupoEspecie:idGrupoEspecie,pressRana: false, pressLlama: false, pressPajaro: false, pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false });
      if(value==2) this.setState({pressRana:!pressRana, idGrupoEspecie:idGrupoEspecie,pressHongo: false,pressLlama: false, pressPajaro: false,pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false });
      if(value==3) this.setState({pressLlama:!pressLlama, idGrupoEspecie:idGrupoEspecie, pressHongo: false, pressRana: false,pressPajaro: false,pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false});
      if(value==4) this.setState({pressPajaro:!pressPajaro, idGrupoEspecie:idGrupoEspecie, pressHongo: false, pressRana: false, pressLlama: false,pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false});
      if(value==5) this.setState({pressFlor:!pressFlor, idGrupoEspecie:idGrupoEspecie, pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,pressCaracol: false, pressCucar: false, pressPez: false});
      if(value==6) this.setState({pressCaracol:!pressCaracol, idGrupoEspecie:idGrupoEspecie, pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,pressFlor: false, pressCucar: false, pressPez: false});
      if(value==7) this.setState({pressCucar:!pressCucar, idGrupoEspecie:idGrupoEspecie,pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,pressFlor: false, pressCaracol: false,pressPez: false });
      if(value==8) this.setState({pressPez:!pressPez, idGrupoEspecie:idGrupoEspecie, pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,pressFlor: false, pressCaracol: false, pressCucar: false});
    }
    static navigationOptions = {
        header: null
      };
    render() {
        const { region } = this.props;
        const { navigate } = this.props.navigation;
        const {pressCaracol,pressCucar,pressFlor,pressHongo,pressLlama, pressPajaro, pressPez, pressRana} = this.state;
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
                Editar grupo
                </Text>
            </Body>
        </Header>
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={{uri:this.state.ImagenGrupo}}
            style={{width:100, height:100, marginBottom:20}} ></Image>        
            <Text style={{fontSize:17, color: '#3a3a3a', marginTop:20, marginLeft: 0 }}>
                ¿A qué grupos crees que corresponde?</Text>
                
                <View style={styles.gridBox}>
                  
                  <Button transparent style={styles.box} onPress={()=> this.handleGroup(5)}>
                    <Image source={pressFlor ? {uri:uri+'/flor2.png'} : {uri: flor}} style={ styles.shadow }></Image>
                  </Button>
                  <Button transparent style={styles.box} onPress={()=> this.handleGroup(2) }>
                    <Image source={pressRana ? {uri:uri+'/rana2.png'}: {uri:rana}} style={styles.shadow }></Image>
                  </Button>
                  <Button transparent style={styles.box} onPress={ ()=> this.handleGroup(3) }>
                  <Image source={pressLlama ? {uri:uri+'/llama2.png'}: {uri:llama}} style={styles.shadow }></Image>
                  </Button>
                  <Button transparent style={styles.box} onPress={ ()=> this.handleGroup(4) }>
                    <Image source={pressPajaro ? {uri:uri+'/pajaro2.png'}: {uri: pajaro}} style={styles.shadow }></Image>
                  </Button>
              </View>
              {(this.state.idGrupoEspecie > 1 && this.state.idGrupoEspecie<6) &&
                <View style={{flexWrap: 'wrap', marginHorizontal:30, }}>
                  <Text style={{color:colores[this.state.idGrupoEspecie-1], fontWeight:'bold', fontFamily:'notoserif' }} >{textoGrupos[this.state.idGrupoEspecie-1].titulo}: </Text> 
                  <HTMLView style={{flex:1, flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap'}} 
                  stylesheet={styleshtml}  value={textoGrupos[this.state.idGrupoEspecie-1].text} />
               </View>                 
              }
              <View style={styles.gridBox}>
                  <Button transparent style={styles.box} onPress={ ()=> this.handleGroup(1) }>
                  <Image source={this.state.pressHongo ? {uri:uri+'/hongo2.png'} : {uri: hongo}} style={styles.shadow }></Image>
                  </Button>
                  <Button transparent style={styles.box} onPress={ ()=> this.handleGroup(6) }>
                  <Image source={this.state.pressCaracol ? {uri:uri+'/caracol2.png'} : {uri: caracol}} style={styles.shadow }></Image>
                  </Button>
                  <Button transparent style={styles.box}onPress={ ()=> this.handleGroup(7)}>
                  <Image source={this.state.pressCucar ? {uri:uri+'/cucaracha2.png'} : {uri: cucaracha}} style={styles.shadow }></Image>
                  </Button>
                  <Button transparent style={styles.box}onPress={()=> this.handleGroup(8)}>
                  <Image source={this.state.pressPez ? {uri:uri+'/pez2.png'} : {uri: pez}} style={styles.shadow }></Image>
                  </Button>
              </View>
              {((this.state.idGrupoEspecie > 5 && this.state.idGrupoEspecie<9)|| this.state.idGrupoEspecie==1) &&
                <View style={{flexWrap: 'wrap', marginHorizontal:30, }}>
                  <Text style={{color:colores[this.state.idGrupoEspecie-1], fontWeight:'bold', fontFamily:'notoserif' }} >{textoGrupos[this.state.idGrupoEspecie-1].titulo}: </Text> 
                  <HTMLView style={{flex:1, flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap'}} 
                  stylesheet={styleshtml}  value={textoGrupos[this.state.idGrupoEspecie-1].text} />
               </View> 
              }
                       
        </View>
        <TouchableOpacity  
                    onPress={this.guardar}             
                    style={{ padding: 10, marginLeft: 30, marginRight:30, marginBottom:30, alignItems: 'center', backgroundColor: '#DEDA3E',borderRadius:5, paddingVertical:15}}>
                    {(this.state.loading)?
                    <ActivityIndicator/>:
                    <Text style={{color: '#4A4A4A', textAlign: 'center', fontSize:18}}>
                        Guardar</Text>       }                   
                  </TouchableOpacity>
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

export default connect(mapStateToProps, bindActions)(EditGrupos);

/*
const EdittempSwag = reduxForm(
  {
    form: "test"
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Edittemp);
EdittempSwag.navigationOptions = {
  header: null
};
export default EdittempSwag;
*/