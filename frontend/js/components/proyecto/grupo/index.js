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
import {Image, TouchableOpacity, ScrollView, KeyboardAvoidingView,StyleSheet,ActivityIndicator, Dimensions,Platform, PermissionsAndroid, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from "react-navigation";
import {url_API} from '../../../config';
import {isGoBack} from "../../../actions/goback_action";
import HTMLView from 'react-native-htmlview';
import {textoGrupos} from '../../avistamiento/textGrupos';
const { width, height } = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const hongo  = uri + "/hongo.png";// require("../../../images/1-hongo.png");
const rana = uri + "/rana.png";
const llama = uri + "/llama.png";
const pajaro = uri + "/pajaro.png";
const flor = uri + "/flor.png";
const caracol = uri + "/caracol.png";
const cucaracha = uri + "/cucaracha.png";
const pez = uri + "/pez.png";
const colores = [   '#86C290', '#B4922B', '#BE742E', '#4DC0DE', '#9EAA36', '#007090', '#816A27', '#0093BF'];

const validate = values => {
  const error= {};
  error.nombre='';
  var nm = values.nombre;
  if(values.nombre === undefined){
    nm = '';
  }

  return error;
}
class Grupo extends Component{
    constructor(props) {
        super(props);
        this.state = {grupoEspecie:"", pressHongo2: false, pressRana2: false, pressLlama2: false, pressPajaro2: false,
          pressFlor2: false, pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,  loading:false,
            pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false,  ImageSource: null,
            pressCaracol2: false, pressCucar2: false, pressPez2: false
          };
        //  this.renderInput = this.renderInput.bind(this);
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
    componentDidMount(){
      const {email, values} = this.props.navigation.state.params;
      console.log("grupo email: ", email, values);
      if(values){
        for (var i = 0, len = values.length; i < len; i++){
          if(values[i].idGrupoEspecie==1){
             this.setState({pressHongo:true});
             continue;}
          if(values[i].idGrupoEspecie==2){
             this.setState({pressRana2:true});
            continue;}
          if(values[i].idGrupoEspecie==3){
             this.setState({pressLlama2:true});
            continue;}
          if(values[i].idGrupoEspecie==4){
             this.setState({pressPajaro2:true});
            continue;}
          if(values[i].idGrupoEspecie==5){
             this.setState({pressFlor2:true});
            continue;}
          if(values[i].idGrupoEspecie==6){
             this.setState({pressCaracol2:true});
            continue;}
          if(values[i].idGrupoEspecie==7){
             this.setState({pressCucar2:true});
            continue;}
          if(values[i].idGrupoEspecie==8){
             this.setState({pressPez2:true});
            continue;}
        }
        //this.setState({nombre:values});
    }
  }

      listo = () => {
        var grupoEspecie = [];
        const {modulo} = this.props.navigation.state.params;
        if(this.state.pressHongo2) grupoEspecie.push(1);
        if(this.state.pressRana2) grupoEspecie.push(2);
        if(this.state.pressLlama2) grupoEspecie.push(3);
        if(this.state.pressPajaro2) grupoEspecie.push(4);
        if(this.state.pressFlor2) grupoEspecie.push(5);
        if(this.state.pressCaracol2) grupoEspecie.push(6);
        if(this.state.pressCucar2) grupoEspecie.push(7);
        if(this.state.pressPez2) grupoEspecie.push(8);
        if(grupoEspecie.length>0){
            const { props: { name, index, list } } = this;
            const {nombre, email, id} = this.props.navigation.state.params;
            if(modulo=="proyecto"){
              this.setState({loading:true});
              var data = {grupoEspecie: grupoEspecie, id:id }
              fetch( url_API + 'proyecto/editgrupo', {
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
                if(response.success){
                  if(modulo=="proyecto"){
                    this.props.isGoBack();
                    this.props.navigation.goBack();
                  }
                }
                else {}
              })
            } else{
            const {pregunta} = this.props.navigation.state.params;
            const {objetivos} = this.props.navigation.state.params;
            const {polylines} = this.props.navigation.state.params;
            const {region} = this.props.navigation.state.params;
            //console.log("region(grupo): ", region);
            const navigateAction = NavigationActions.navigate({
              routeName: "Especie",
              params: {nombre: nombre, pregunta: pregunta, objetivos: objetivos,polylines: polylines, region: region,email:email, grupoEspecie:grupoEspecie }, //falta el grupo seleccionado
              actions: [NavigationActions.navigate({ routeName: 'Especie' })],
            })
            this.props.navigation.dispatch(navigateAction);
          }
          }
      }
      handleGroup = (value) =>{
        var {grupoEspecie, pressCaracol, pressCucar, pressFlor, pressHongo, pressLlama, pressPajaro, pressPez, pressRana} = this.state; 
        if(value==grupoEspecie) grupoEspecie=0;
       else grupoEspecie=value;
        // this.setState({pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,
       //   pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false}); 
         //<Text style={{color:colores[this.state.idGrupoEspecie-1], fontWeight:'bold', fontFamily:'notoserif' }} >{textoGrupos[this.state.idGrupoEspecie-1].titulo}</Text> 
            //   <Text style={{color:colores[this.state.idGrupoEspecie-1], textAlign:'justify', fontFamily:'notoserif' }}>{textoGrupos[this.state.idGrupoEspecie-1].text}</Text>
        if(value==1) this.setState({pressHongo:!pressHongo, grupoEspecie:grupoEspecie,pressRana: false, pressLlama: false, pressPajaro: false, pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false });
        if(value==2) this.setState({pressRana:!pressRana, grupoEspecie:grupoEspecie,pressHongo: false,pressLlama: false, pressPajaro: false,pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false });
        if(value==3) this.setState({pressLlama:!pressLlama, grupoEspecie:grupoEspecie, pressHongo: false, pressRana: false,pressPajaro: false,pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false});
        if(value==4) this.setState({pressPajaro:!pressPajaro, grupoEspecie:grupoEspecie, pressHongo: false, pressRana: false, pressLlama: false,pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false});
        if(value==5) this.setState({pressFlor:!pressFlor, grupoEspecie:grupoEspecie, pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,pressCaracol: false, pressCucar: false, pressPez: false});
        if(value==6) this.setState({pressCaracol:!pressCaracol, grupoEspecie:grupoEspecie, pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,pressFlor: false, pressCucar: false, pressPez: false});
        if(value==7) this.setState({pressCucar:!pressCucar, grupoEspecie:grupoEspecie,pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,pressFlor: false, pressCaracol: false,pressPez: false });
        if(value==8) this.setState({pressPez:!pressPez, grupoEspecie:grupoEspecie, pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,pressFlor: false, pressCaracol: false, pressCucar: false});
      }
    static navigationOptions = {
        header: null
      };
    render() {
        const {grupoEspecie, pressFlor2, pressHongo2,pressRana2, pressLlama2, pressFlor,pressPajaro2,pressCaracol2, pressCucar2,pressPez2, pressHongo,pressRana, pressLlama ,pressPajaro,pressCaracol, pressCucar, pressPez} = this.state;
        const { navigate } = this.props.navigation;
        return (
          <Container style={{flex:1, backgroundColor: '#FFFFFF',paddingHorizontal: 0,}}>
            <Header  style={styles.header}>
            <Left style={{flex:1}}>
              <Button transparent  onPress={() => this.props.navigation.goBack()}>
                <Icon style={{color: '#4A4A4A'}} name="ios-arrow-back" />
              </Button>
            </Left>
            <Body style={{flex:5,  justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#4D4D4D', fontSize: 18, marginRight: 70, fontWeight: 'bold',}}>
                Grupos de investigación
                </Text>
            </Body>
            </Header>
            
            <ScrollView style={grupoEspecie>0 ? {flex:1,backgroundColor: '#F2F1E1'}: {flex:1}}>
            <View style={{marginTop:30}} />
            <View style={styles.viewGrid2}>
                <TouchableOpacity transparent style={styles.box} onLongPress={() => this.setState({pressFlor2:!pressFlor2})}
                  onPress={ ()=> this.handleGroup(5) }>{pressFlor2 ?
                    <Image source={{uri:uri+'/flor4.png'}} style={styles.shadow}></Image>
                  :<Image source={pressFlor ? {uri:uri+'/flor2.png'} : {uri: flor}} style={styles.shadow}></Image>
                }
                </TouchableOpacity>
                <Button transparent style={styles.box} onLongPress={() => this.setState({pressRana2:!pressRana2})}
                onPress={()=> this.handleGroup(2) }>{pressRana2 ? 
                  <Image source={{uri:uri+'/rana4.png'}} style={styles.shadow}></Image>    
                 :<Image source={this.state.pressRana ? {uri:uri+'/rana2.png'}: {uri:rana}} style={styles.shadow}></Image>
                }</Button>
                <Button transparent style={styles.box} onLongPress={() => this.setState({pressLlama2:!pressLlama2})}
                onPress={()=> this.handleGroup(3) }>{pressLlama2 ?
                  <Image source={{uri:uri+'/llama4.png'}} style={styles.shadow}></Image>
                  :<Image source={this.state.pressLlama ? {uri:uri+'/llama2.png'}: {uri:llama}} style={styles.shadow}></Image>
                }</Button>
                <Button transparent style={styles.box} onLongPress={() => this.setState({pressPajaro2:!pressPajaro2})}
                onPress={()=> this.handleGroup(4) }>{pressPajaro2 ?
                  <Image source={{uri:uri+'/pajaro4.png'}} style={styles.shadow}></Image>
                  :<Image source={this.state.pressPajaro ? {uri:uri+'/pajaro2.png'}: {uri: pajaro}} style={styles.shadow}></Image>
                }</Button>
            </View>
            {(this.state.grupoEspecie > 1 && this.state.grupoEspecie<6) &&
              <View style={{flexWrap: 'wrap', marginHorizontal:30, marginVertical:10 }}>
                  <Text style={{color:colores[this.state.grupoEspecie-1], fontWeight:'bold', fontFamily:'notoserif' }} >{textoGrupos[this.state.grupoEspecie-1].titulo}: </Text> 
                  <HTMLView style={{flex:1, flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap'}} 
                    stylesheet={styleshtml}  value={textoGrupos[this.state.grupoEspecie-1].text} />
              </View>                 
            }
            <View style={styles.viewGrid2}>
                <Button transparent style={styles.box} onLongPress={() => this.setState({pressHongo2:!pressHongo2})}
                onPress={()=> this.handleGroup(1) }>{pressHongo2 ?
                  <Image source={{uri:uri+'/hongo4.png'}} style={styles.shadow}></Image>
                  :<Image source={pressHongo ? {uri:uri+'/hongo2.png'} : {uri: hongo}} style={styles.shadow}></Image>
                }</Button>
                <Button transparent style={styles.box} onLongPress={() => this.setState({pressCaracol2:!pressCaracol2})}
                onPress={()=> this.handleGroup(6)}>{pressCaracol2 ?
                  <Image source={{uri:uri+'/caracol4.png'}} style={styles.shadow}></Image>
                  :<Image source={this.state.pressCaracol ? {uri:uri+'/caracol2.png'} : {uri: caracol}} style={styles.shadow}></Image>
                }</Button>
                <Button transparent style={styles.box} onLongPress={() => this.setState({pressCucar2:!pressCucar2})}
                onPress={()=> this.handleGroup(7)}>{pressCucar2 ?
                  <Image source={{uri:uri+'/cucaracha4.png'}} style={styles.shadow}></Image>
                  :<Image source={this.state.pressCucar ? {uri:uri+'/cucaracha2.png'} : {uri: cucaracha}} style={styles.shadow}></Image>
                }</Button>
                <Button transparent style={styles.box} onLongPress={() => this.setState({pressPez2:!pressPez2})}
                onPress={ ()=> this.handleGroup(8) }>{pressPez2 ?
                  <Image source={{uri:uri+'/pez4.png'}} style={styles.shadow}></Image>
                  :<Image source={this.state.pressPez ? {uri:uri+'/pez2.png'} : {uri: pez}} style={styles.shadow}></Image>
               }</Button>
            </View>
            {((this.state.grupoEspecie > 5 && this.state.grupoEspecie<9) || this.state.grupoEspecie==1 )&&
              <View style={{flexWrap: 'wrap', marginHorizontal:30, marginTop:20}}>
                  <Text style={{color:colores[this.state.grupoEspecie-1], fontWeight:'bold', fontFamily:'notoserif' }} >{textoGrupos[this.state.grupoEspecie-1].titulo}: </Text> 
                  <HTMLView style={{flex:1, flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap'}} 
                    stylesheet={styleshtml}  value={textoGrupos[this.state.grupoEspecie-1].text} />
              </View>                 
            }
           { grupoEspecie==0 &&
            <View style={{marginVertical:30}}>
              <Text style={{fontSize: 17, textAlign:'center', justifyContent:'center', padding:10, marginLeft: 40, marginRight:40, color:'#DEDA3E'}}>
                Seleccione él o los grupos de especies que vas a investigar en tu proyecto
              </Text>
              <Text style={{fontSize: 17, textAlign:'center', justifyContent:'center', padding:10, marginLeft: 40, marginRight:40, color:'#787878'}}>
              Mantén presionado el ícono por unos segundos para confirmar tu selección 
              </Text>
            </View>}
            <TouchableOpacity  style= {styles.btnGrupo} onPress={ this.listo} >
            {this.state.loading ? <ActivityIndicator/> :  <Text capitalize={false} style={styles.texto}>Guardar</Text>}
             </TouchableOpacity>
            
          </ScrollView>  
          </Container>
        
        );
      }

}
const styleshtml = StyleSheet.create({
  a: {
    color:  '#86C290', // make links coloured pink
  },
  bb: {
    color:'#B4922B'
  },
  c: {color:'#BE742E'},
  d: {color:'#4DC0DE'},
  e: {color:'#9EAA36'},
  f: {color:'#007090'},
  g: {color:'#816A27'},
  hh: {color:'#0093BF'}
});
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

export default connect(mapStateToProps, bindActions)(Grupo);
