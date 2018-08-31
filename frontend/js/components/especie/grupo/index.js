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
import {Image, ActivityIndicator, TouchableOpacity, ScrollView, KeyboardAvoidingView,StyleSheet,TextInput, Dimensions,Platform, PermissionsAndroid, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from "react-navigation";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import {isGoBack} from "../../../actions/goback_action";
import {url_API} from '../../../config';
import HTMLView from 'react-native-htmlview';
import {textoGrupos} from '../../avistamiento/textGrupos'
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const hongo  = uri + "/hongo.png";// require("../../../images/1-hongo.png");
const rana =  uri + "/rana.png"; 
const llama = uri + "/llama.png"; 
const pajaro = uri + "/pajaro.png"; 
const flor = uri + "/flor.png"; 
const caracol = uri + "/caracol.png"; 
const cucaracha = uri + "/cucaracha.png"; 
const pez = uri + "/pez.png"; 
const colores = [   '#86C290', '#B4922B', '#BE742E', '#4DC0DE', '#9EAA36', '#007090', '#816A27', '#0093BF'];

class Grupo_e extends Component{
    constructor(props) {
        super(props);
        this.state = {  GrupoEspecie:"", nav:false, modulo:"",primerBoton:false,
          nombre:"", loading:false, grupoEspecie:"", nombreCient:""
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
      listo = (GrupoEspecie) => {
        var {grupoEspecie} = this.state;
        var esp ="";
        var copyGrupoEspecie=GrupoEspecie;
        if(grupoEspecie==GrupoEspecie){
           copyGrupoEspecie=0;
           esp = "";  }
        else{
          if(GrupoEspecie==1) esp=uri+'/hongo2.png';
          if(GrupoEspecie==2) esp=uri+'/rana2.png';
          if(GrupoEspecie==3) esp=uri+'/llama2.png';
          if(GrupoEspecie==4) esp=uri+'/pajaro2.png';
          if(GrupoEspecie==5) esp=uri+'/flor2.png';
          if(GrupoEspecie==6) esp=uri+'/caracol2.png';
          if(GrupoEspecie==7) esp=uri+'/cucaracha2.png';
          if(GrupoEspecie==8) esp=uri+'/pez2.png';
        }
        this.setState({ grupoEspecie:copyGrupoEspecie, GrupoEspecie:esp});
      //GrupoEspecie: link imagen
      // grupoEspecie: numero
      }
      componentWillMount(){
        const {modulo, values} = this.props.navigation.state.params;
        const {ImagenGrupoEspecie} = this.props.navigation.state.params;
        const {grupoespecie} = this.props.navigation.state.params;
        if( modulo=="avist" || modulo=="editAvist" ) this.setState({nav:true, grupoEspecie:grupoespecie, GrupoEspecie:ImagenGrupoEspecie});
        if(modulo=="especie") this.setState({ nombre:values.nombre, nombreCient:values.nombreCient,  grupoEspecie:values.grupoEspecie, GrupoEspecie:values.ImagenGrupoEspecie });
      }
      navegar = ()=>{
        const {email} = this.props.navigation.state.params;
        const {modulo} = this.props.navigation.state.params;
        const {id} = this.props.navigation.state.params;
        const {keyAvist} = this.props.navigation.state.params;
        const {ImageSource} = this.props.navigation.state.params;
        var data = { nombre: this.state.nombre, nombreCient: this.state.nombreCient, modulo: modulo, id:id};
        if(this.state.nombre.length<3){
        Alert.alert("Nombre debe  tener más de dos caracteres.")
        return
        }
        this.setState({loading:true});
        fetch(url_API+ 'especie/especie_exist', {
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
              //console.log("response Especie: ", response);
              this.setState({loading:false});
              if(response.success){
                if(modulo=="especie"){
                  this.props.isGoBack();
                  this.props.navigation.goBack();
                } else {
                  const navigateAction = NavigationActions.navigate({
                    routeName: "Imagen_e",
                    params: {nombre: data.nombre, nombreCient:data.nombreCient, GrupoEspecie:this.state.grupoEspecie, email:email, modulo:modulo, keyAvist:keyAvist, ImagenSource:ImageSource}, 
                    actions: [NavigationActions.navigate({ routeName: 'Imagen_e' })],
                  })
                  this.props.navigation.dispatch(navigateAction);
                }
              }
              else {
                Alert.alert("Ya existe una especie con este  nombre");
              }
          })
      }
    static navigationOptions = {
        header: null
      };
    render() {
        const { region } = this.props;
        const { navigate } = this.props.navigation;
        const {GrupoEspecie, grupoEspecie} = this.state;
        return (
          <Container style={styles.container}>
            <Header  style={styles.header}>
            <Left style={{flex:1}}>
              <Button transparent  onPress={() => this.props.navigation.goBack()}>
                <Icon style={{color: '#4A4A4A'}} name="ios-arrow-back" />
              </Button>
            </Left>
            <Body style={{flex:5,  justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#4D4D4D', fontSize: 18, marginRight: 70, fontWeight: 'bold',}}>
              {(!this.state.nav) ?  "Crear especie" : "Nombrar especie"}
                </Text>
            </Body>
            </Header>
            {(this.state.nav) ?
            <View style={{flex:1, marginLeft:40, marginRight:40}}>
                <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-20} style={{flex:1}}>
                  <View style={{ justifyContent:'center', alignItems:'center', margin:30, marginTop:50}}>
                    <Image source={{uri: this.state.GrupoEspecie}} style={{height:viewportWidth*.3, width:viewportWidth*.3}}></Image>
                 </View>
                 
                  <Item style={{marginTop:3, borderColor: '#ddd93d', }} >
                    <FontAwesome name={'pencil'}style= {{color: '#ddd93d'}} size={23}/>
                    <Input underlineColorAndroid='#c4c4c4' style={{fontSize:17,height:40}} 
                     value={this.state.nombre} onChangeText={text => this.setState({ nombre: text})}>
                    </Input>
                  </Item>
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}> 
                    <Text style={{color: '#ddd93d', fontSize: viewportWidth*.04,  textAlign: 'center', marginBottom:30 }}>
                    Nombre común</Text>
                     {/* <Text style={{fontSize:viewportWidth*.04, color:"#1E1E32"}}>{this.state.nombre.length}/100</Text>*/}
                </View>
                <Item style={{marginTop:3, borderColor: '#ddd93d', }} >
                    <FontAwesome name={'pencil'}style= {{color: '#ddd93d'}} size={23}/>
                    <Input underlineColorAndroid='#c4c4c4' style={{fontSize:17,height:40}} 
                     value={this.state.nombreCient} onChangeText={nombreCient => this.setState({nombreCient})}>
                    </Input>
                  </Item>
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}> 
                    <Text style={{color: '#ddd93d', fontSize: viewportWidth*.04,  textAlign: 'center', marginBottom:30 }}>
                    Nombre científico</Text>
                     {/* <Text style={{fontSize:viewportWidth*.04, color:"#1E1E32"}}>{this.state.nombre.length}/100</Text>*/}
                </View>
                 {/* <Text>{this.state.nombre_comun.length}/50</Text> */} 
                 
                  <TouchableOpacity  style= {styles.botonNombrar} onPress={this.navegar} disabled={this.state.nombre.length==0 || this.state.loading } >
                  {this.state.loading ? <ActivityIndicator/> :  <Text capitalize={false} style={{fontWeight:'bold', fontSize:18}}>Guardar nombre</Text>}
                  </TouchableOpacity>        
                  
                  </KeyboardAvoidingView>
            </View> :
            <View style={grupoEspecie>0 ? styles.content2 : styles.content}>
            
              <Text style={{fontSize: viewportWidth*.04, textAlign:'center', justifyContent:'center', padding:10, marginLeft: 40, marginRight:40,marginTop: 0, color:'#4A4A4A'}}>
              ¿A qué grupo pertenece la especie?
              </Text>
            <ScrollView style={styles.scrollContainer}>
            <View style={styles.viewGrid}>
                <Button transparent style={styles.box} onPress={() => this.listo(5) }>
                  <Image source={grupoEspecie==5 ? {uri:uri+'/flor2.png'} : {uri: flor}} style={styles.shadow}></Image>
                </Button>
                <Button transparent style={styles.box} onPress={ () => this.listo(2) }>
                  <Image source={grupoEspecie==2 ? {uri:uri+'/rana2.png'}: {uri:rana}} style={styles.shadow}></Image>
                </Button>
                <Button transparent style={styles.box} onPress={ () => this.listo(3) }>
                <Image source={grupoEspecie==3 ? {uri:uri+'/llama2.png'}: {uri:llama}} style={styles.shadow}></Image>
                </Button>
                <Button transparent style={styles.box} onPress={ () => this.listo(4) }>
                  <Image source={grupoEspecie==4 ? {uri:uri+'/pajaro2.png'}: {uri: pajaro}} style={styles.shadow}></Image>
                </Button>
              </View>
              {(grupoEspecie > 1 && grupoEspecie<6) &&
                    <View style={{flexWrap: 'wrap', marginHorizontal:30, }}>
                      <Text style={{color:colores[grupoEspecie-1], fontWeight:'bold', fontFamily:'notoserif' }} >{textoGrupos[grupoEspecie-1].titulo}: </Text> 
                      <HTMLView style={{flex:1, flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap'}} 
                      stylesheet={styleshtml}  value={textoGrupos[grupoEspecie-1].text} />
                   </View>                 
                  }
              <View style={styles.viewGrid}>
                <Button transparent style={styles.box} onPress={ () => this.listo(1) }>
                <Image source={grupoEspecie==1 ? {uri:uri+'/hongo2.png'} : {uri: hongo}} style={styles.shadow}></Image>
                </Button>
                <Button transparent style={styles.box} onPress={ () => this.listo(6) }>
                <Image source={grupoEspecie==6 ? {uri:uri+'/caracol2.png'} : {uri: caracol}} style={styles.shadow}></Image>
                </Button>
                <Button transparent style={styles.box} onPress={ () => this.listo(7) }>
                <Image source={grupoEspecie==7 ? {uri:uri+'/cucaracha2.png'} : {uri: cucaracha}} style={styles.shadow}></Image>
                </Button>
                <Button transparent style={styles.box}onPress={ () => this.listo(8) }>
                <Image source={grupoEspecie==8 ? {uri:uri+'/pez2.png'} : {uri: pez}} style={styles.shadow}></Image>
                </Button>
            </View>
            {((grupoEspecie > 5 && grupoEspecie<9) || grupoEspecie==1) &&
                    <View style={{flexWrap: 'wrap', marginHorizontal:30, }}>
                      <Text style={{color:colores[grupoEspecie-1], fontWeight:'bold', fontFamily:'notoserif' }} >{textoGrupos[grupoEspecie-1].titulo}: </Text> 
                      <HTMLView style={{flex:1, flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap'}} 
                      stylesheet={styleshtml}  value={textoGrupos[grupoEspecie-1].text} />
                   </View>                 
                }
          
              <Text style={{fontSize: 19, textAlign:'center', justifyContent:'center', padding:10, marginLeft: 40, marginRight:40, marginTop: 20, color:'#DEDA3E'}}>
              Asegúrate de revisar bibliografía actualizada o conocer muy bien la especie al momento de crearla.
              </Text>
              <Text style={{fontSize: 19, textAlign:'center', justifyContent:'center', padding:10, marginLeft: 40, marginRight:40, marginTop: 10, color:'#DEDA3E'}}>
              ¡Muchos aprenderán de ella gracias a ti!
              </Text>
              <TouchableOpacity  style= {styles.botonIndex} onPress={() => this.setState({nav:true})}
                    disabled={grupoEspecie<1 } >
                  {this.state.loading ? <ActivityIndicator/> :  <Text capitalize={false} style={{fontWeight:'bold', fontSize:20}}>Guardar</Text>}
            </TouchableOpacity>
            <View style={{height:100}}/>
              </ScrollView>
            </View>}
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
//especie
/*const Grupo_eSwag = reduxForm(
  {
    form: "test",
    validate
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Grupo_e);
Grupo_eSwag.navigationOptions = {
  header: null
};
export default Grupo_eSwag;
*/
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

export default connect(mapStateToProps, bindActions)(Grupo_e);