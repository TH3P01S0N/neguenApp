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
import Autocomplete from 'react-native-autocomplete-input';
import {Image, KeyboardAvoidingView, ScrollView, TouchableOpacity,StyleSheet,  Dimensions,Platform, Alert, ActivityIndicator, TextInput} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from "react-navigation";
import {url_API} from '../../../config';
import {isGoBack} from "../../../actions/goback_action";
import {isGoBackEditOff  } from "../../../actions/gobackEdit_action_off";
import HTMLView from 'react-native-htmlview';
import {textoGrupos} from '../textGrupos';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";

const hongo  = uri + "/hongo.png";// require("../../../images/1-hongo.png");
const rana =  uri + "/rana.png"; 
const llama = uri + "/llama.png"; 
const pajaro = uri + "/pajaro.png"; 
const flor = uri + "/flor.png"; 
const caracol = uri + "/caracol.png"; 
const cucaracha = uri + "/cucaracha.png"; 
const pez = uri + "/pez.png"; 
const colores = [  '#86C290', '#B4922B', '#BE742E', '#4DC0DE','#9EAA36' , '#007090', '#816A27', '#0093BF'];

class EditEspecie extends Component{
  static renderFilm(film) {
    //const { title, director, opening_crawl, episode_id } = film;
    const {nombre, nombreCient, grupoEspecie, id} = film;
    var ImagenGrupoEspecie = "";
    if(grupoEspecie==1) ImagenGrupoEspecie=hongo;
    if(grupoEspecie==2) ImagenGrupoEspecie=rana;
    if(grupoEspecie==3) ImagenGrupoEspecie=llama;
    if(grupoEspecie==4) ImagenGrupoEspecie=pajaro;
    if(grupoEspecie==5) ImagenGrupoEspecie=flor;
    if(grupoEspecie==6) ImagenGrupoEspecie=caracol;
    if(grupoEspecie==7) ImagenGrupoEspecie=cucaracha;
    if(grupoEspecie==8) ImagenGrupoEspecie=pez;
    //const roman = episode_id < ROMAN.length ? ROMAN[episode_id] : episode_id;
    return (
      <View style={{flexDirection: 'row', marginLeft:40}} >
        <Image source={{uri: ImagenGrupoEspecie}}
                  style={{height:viewportWidth*0.13, width:viewportWidth*0.13}}>
                  </Image>
        <View style={{marginLeft:20, flexDirection: 'column',}} >
        {/* <Text style={{fontSize: 18, fontWeight: '500', marginBottom: 10,marginTop: 10, textAlign: 'center'}}>{roman}. {title}</Text>*/}
          <Text style={{fontSize:viewportWidth*.040, fontWeight: 'bold', marginBottom: 5,marginTop: 1, textAlign: 'left'}}>{nombre}</Text>
          <Text style={{fontSize:viewportWidth*.036, marginBottom: 10,marginTop: 1, textAlign: 'left'}}>{nombreCient}</Text>
        </View>
      </View>
    );
  }
    constructor(props) {
        super(props);
        this.state = {
          films: [], id:0, loading:false, fromDrawBar: false, query: '', isSpecie: false, idEspecie:0,
          modulo:"", pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false, flag:false,
          pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false, ImagenGrupo: null, idGrupoEspecie:0,
          };
          this.OnChange = this.OnChange.bind(this);
      }
    static propTypes = {
      name: React.PropTypes.string,
      index: React.PropTypes.number,
      list: React.PropTypes.arrayOf(React.PropTypes.string),
      openDrawer: React.PropTypes.func,
      isGoBack: React.PropTypes.func,
      flag: React.PropTypes.bool,
      flag2: React.PropTypes.bool,
      isGoBackEditOff: React.PropTypes.func
      };
    isGoBack() {
    //  console.log("isgoback");
        this.props.isGoBack(true);
    }
    isGoBackEditOff() {
      console.log("isgoback off");
        this.props.isGoBackEditOff();
    }
    guardar = (films) => {
      this.setState({loading:true, flag:true});
      var navegar= "";           
      var data ={
        idEspecie: this.state.idEspecie , id: this.state.id, idGrupoEspecie: this.state.idGrupoEspecie
      }
      //console.log("films: ", films);
     // console.log("guardar: ", data);
      fetch(url_API+ this.state.modulo + '/editespecie', {
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
    fetchEspecie(){
      const {values} = this.props.navigation.state.params;
      const {id} = this.props.navigation.state.params; 
      const {fromDrawBar} = this.props.navigation.state.params; 
      const {modulo} = this.props.navigation.state.params;
      /*
      if(values.idGrupoEspecie==1) this.setState({pressHongo:true, idGrupoEspecie:1});
      if(values.idGrupoEspecie==2) this.setState({pressRana:true, idGrupoEspecie:2});
      if(values.idGrupoEspecie==3) this.setState({pressLlama:true, idGrupoEspecie:3});
      if(values.idGrupoEspecie==4) this.setState({pressPajaro:true, idGrupoEspecie:4});
      if(values.idGrupoEspecie==5) this.setState({pressFlor:true, idGrupoEspecie:5});
      if(values.idGrupoEspecie==6) this.setState({pressCaracol:true, idGrupoEspecie:6});
      if(values.idGrupoEspecie==7) this.setState({pressCucar:true, idGrupoEspecie:7});
      if(values.idGrupoEspecie==8) this.setState({pressPez:true, idGrupoEspecie:8});*/
      fetch(url_API+ 'especie/getnombres', {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
                  //body:  JSON.stringify(data)
              })
              .then(function(response) {
                  if (response.status >= 400) {
                    throw new Error("Bad response from server");
                  }
                  return response.json();
              }).then(response=> {
                  console.log("response Especie: ", response);
                  this.setState({films: response, id: id, fromDrawBar:fromDrawBar, modulo:modulo, flag:true });
              })
    }
    componentWillReceiveProps(newProps) {
      if(this.props.flag2 && !this.state.flag){
        console.log("props_flag2", this.state.flag);
        this.props.isGoBackEditOff();
        this.fetchEspecie();
      }
     // console.log("props2: ", this.props.flag, this.state.flag );
    }
    componentDidMount(){
      const {values} = this.props.navigation.state.params;
      console.log("values ", values);
      const {id} = this.props.navigation.state.params; 
      const {fromDrawBar} = this.props.navigation.state.params; 
      const {modulo} = this.props.navigation.state.params;
      if(values.idGrupoEspecie==1) this.setState({pressHongo:true, idGrupoEspecie:1});
      if(values.idGrupoEspecie==2) this.setState({pressRana:true, idGrupoEspecie:2});
      if(values.idGrupoEspecie==3) this.setState({pressLlama:true, idGrupoEspecie:3});
      if(values.idGrupoEspecie==4) this.setState({pressPajaro:true, idGrupoEspecie:4});
      if(values.idGrupoEspecie==5) this.setState({pressFlor:true, idGrupoEspecie:5});
      if(values.idGrupoEspecie==6) this.setState({pressCaracol:true, idGrupoEspecie:6});
      if(values.idGrupoEspecie==7) this.setState({pressCucar:true, idGrupoEspecie:7});
      if(values.idGrupoEspecie==8) this.setState({pressPez:true, idGrupoEspecie:8});
      fetch(url_API+ 'especie/getnombres', {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
                  //body:  JSON.stringify(data)
              })
              .then(function(response) {
                  if (response.status >= 400) {
                    throw new Error("Bad response from server");
                  }
                  return response.json();
              }).then(response=> {
                  console.log("response Especie: ", response);
                  this.setState({films: response, id: id, fromDrawBar:fromDrawBar, modulo:modulo });
              })

     // this.setState({temp: values, id: id, fromDrawBar:fromDrawBar});
    }
    OnChange =(text) =>{
      console.log(text);
      this.setState({
        query: text,
        isSpecie: true
      });
    }
    findFilm(query) {
      if (query === ''  ) {
        return [];
      }
      const { films, idGrupoEspecie } = this.state;
      //const regex = new RegExp(`${query.trim()}`);
      let newData = this.dataFilter(query, films, idGrupoEspecie);
      //return films.filter(film => film.title.search(regex) >= 0);
      //return films.filter(film => film.nombre.search(query) >= 0);
      return newData;
    }
    dataFilter(text, data, idGrupoEspecie){
      var data_copy = data;
      var objectArray = [];
      for(var i=0, len=data_copy.length; i< len; i++  ){
          if(data_copy[i].grupoEspecie==idGrupoEspecie)
            objectArray.push(data_copy[i]);
      } 
     // console.log(objectArray);
      return objectArray.filter(function(item){
          const itemData = item.nombre.toUpperCase()
          const textData = text.toUpperCase()
          return itemData.indexOf(textData) > -1
      })
    }
    handleGroup = (value) =>{
      var {idGrupoEspecie, pressCaracol, pressCucar, pressFlor, pressHongo, pressLlama, pressPajaro, pressPez, pressRana} = this.state; 
      //if(idGrupoEspecie==0) this.refs.scroll.scrollTo({y:viewportHeight*0.65,animated: true});
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
    agregarEspecie = () => {
      const {values} = this.props.navigation.state.params;
      const {email} = this.props.navigation.state.params;
      var grupoEspecie=0;
      var grupoespecie=0;
      if(this.state.pressHongo){ 
        grupoEspecie=hongo; 
        grupoespecie=1 }
      if(this.state.pressRana){
         grupoEspecie=rana;
        grupoespecie=2}
      if(this.state.pressLlama){
       grupoEspecie=llama;
      grupoespecie=3}
      if(this.state.pressPajaro){
       grupoEspecie=pajaro;
      grupoespecie=4}
      if(this.state.pressFlor){
         grupoEspecie=flor;
        grupoespecie=5}
      if(this.state.pressCaracol){
        grupoespecie=6;
       grupoEspecie=caracol;}
      if(this.state.pressCucar){
       grupoEspecie=cucaracha;
       grupoespecie=7;
      }
      if(this.state.pressPez){
         grupoEspecie=pez;
        grupoespecie=8;}
      console.log("editEspecie props: ",this.props.navigation.state);
      const navigateAction = NavigationActions.navigate({
        routeName: "Grupo_e",
       // params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, especie: films[0].id},
        params:{email:email, modulo:"editAvist",ImagenGrupoEspecie:grupoEspecie, keyAvist:this.props.navigation.state.key, ImageSource:values.ImageSource, grupoespecie:this.state.idGrupoEspecie },
        actions: [NavigationActions.navigate({ routeName: 'Grupo_e' })],
        //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
      })
      this.props.navigation.dispatch(navigateAction);
    }
    static navigationOptions = {
        header: null
      };
    render() {
        const { region } = this.props;
        const { navigate } = this.props.navigation;
        const { query } = this.state;
        const films = this.findFilm(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        const {pressCaracol, pressCucar, pressFlor, pressHongo, pressLlama, pressPajaro, pressPez, pressRana, idGrupoEspecie} = this.state;

        return (
          <Container style={styles.container}>
            <Header  style={styles.header}>
            <Left style={{flex:1}}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                    <Icon style={{color: '#4A4A4A'}} name="ios-close" size={50} />
                </Button>
            </Left>
            <Body style={{flex:4,  justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#4D4D4D', fontSize:viewportWidth*.04, marginRight: 70, fontWeight: 'bold',}}>
                Editar especie
                </Text>
            </Body>
        </Header>
        <ScrollView  style={{flex:1}} >
        <KeyboardAvoidingView behavior='position' style={{}} >
        <View style={{flex:1, justifyContent:'center'}}>
          <Text style={{fontSize:17, color: '#3a3a3a', marginTop:20, marginHorizontal: 30 }}>
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
          <Autocomplete
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={{flex: 1, marginLeft:30, marginRight:30, marginTop:40}} //left: 0, position: 'absolute',right: 0, top: 70,zIndex: 1, 
              //height:200, marginLeft: 40, marginRight: 40, }}
              inputContainerStyle={{borderWidth: 0}}
              data={films.length === 1 && comp(query, films[0].nombre) ? [] : films}      
              placeholder="Nombre  especies"
              renderTextInput={({value}) => (
                <TextInput underlineColorAndroid='#c4c4c4' style={{fontSize:18}} placeholder={"Nombre especie"}
                  value={query} onChangeText={text => this.setState({ query: text})}>
                </TextInput>
              )}
              renderItem={({ nombre, id }) => (
                  <TouchableOpacity onPress={() => this.setState({ query: nombre, idEspecie:id,  isSpecie: true })}//(canonicalName) => this.OnChange(canonicalName)}//() => this.setState({ query: canonicalName })}
                  >
                    <Text style={{ fontSize: 16,margin: 5}}>
                     {/*{title} ({release_date.split('-')[0]})*/}
                      {nombre}
                  </Text>
                </TouchableOpacity>
              )}
              listContainerStyle={{flex:1}}
            />    
             
             <View style={{marginTop: 30}}>
                {films.length > 0 ? (
                  EditEspecie.renderFilm(films[0])
                ) :  (
                  <Text style={{textAlign: 'center'}}>
                  </Text>
                )}
              </View>
            
        </View>
          <TouchableOpacity style={{flexDirection: 'row', marginHorizontal:30}} onPress={ this.agregarEspecie} >
                <MaterialCommunityIcons  name="plus" size={45}/>
                <Title style={{color: '#4A4A4A', fontSize: 17, marginLeft:20, marginTop:10}}>Agregar especie</Title>
          </TouchableOpacity>
          {//(!this.state.loading) &&
            <View style={{marginHorizontal: 20, marginTop: 10, marginBottom: 50,padding: 20}}>
                <TouchableOpacity  disabled={this.state.idEspecie == 0}
                    onPress={() => this.guardar(films)}     disabled={this.state.loading || this.state.idEspecie==0}        
                    style={{ padding: 10, marginTop: 30, alignItems: 'center', backgroundColor: '#DEDA3E', paddingVertical:15, borderRadius:5}}>
                  {(this.state.loading)? <ActivityIndicator/> : <Text style={{color: '#4A4A4A', textAlign: 'center', fontSize:18}}>
                        Guardar</Text>     }                     
                </TouchableOpacity>
            </View>} 
            
          </KeyboardAvoidingView>  
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
    isGoBack: () => dispatch(isGoBack()),
    isGoBackEditOff: () => dispatch(isGoBackEditOff())
  };
}

const mapStateToProps = state => ({
  name: state.user.name,
  index: state.list.selectedIndex,
  list: state.list.list,
  flag: state.goback_reducer.flag,
  flag2: state.goback_reducerEdit.flag
});

export default connect(mapStateToProps, bindActions)(EditEspecie);

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