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
import {  List, ListItem, Avatar } from 'react-native-elements';
import {url_API} from '../../config';
import {Image, FlatList, TouchableOpacity, ScrollView, KeyboardAvoidingView, Dimensions, Alert, TextInput, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from "./styles";
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
import { isGoBack } from "../../actions/goback_action";
import { isGoBackOff } from "../../actions/goback_action_off";
import {textoGrupos} from './textGrupos';
import HTMLView from 'react-native-htmlview';
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
class Avistamiento extends Component {
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
      <View style={{flexDirection: 'row', marginLeft:0}} >
        <Image source={{uri: ImagenGrupoEspecie}}
                  style={{height:viewportWidth*0.13, width:viewportWidth*0.13}}>
                  </Image>
        <View style={{marginLeft:20, flexDirection: 'column',}} >
        {/* <Text style={{fontSize: 18, fontWeight: '500', marginBottom: 10,marginTop: 10, textAlign: 'center'}}>{roman}. {title}</Text>*/}
          <Text style={{color: '#4A4A4A', fontSize:viewportWidth*.040, fontWeight: 'bold', marginBottom: 5,marginTop: 1, textAlign: 'left'}}>{nombre}</Text>
          <Text style={{color: '#4A4A4A',fontSize:viewportWidth*.036, marginBottom: 10,marginTop: 1, textAlign: 'left'}}>{nombreCient}</Text>
        </View>
      </View>
    );
  }
  constructor(props){
    super(props);
    this.state={
    especie:0,  pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,
       pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false, ImageSource: null,
       films: [], id:0, query:'', flag:false, primerBoton:false, idGrupoEspecie:0, dataSource:[]
    };
    this.mapear = this.mapear.bind(this)
  }
  static navigationOptions = {
    header: null
  };
  static propTypes = {
    name: React.PropTypes.string,
    index: React.PropTypes.number,
    list: React.PropTypes.arrayOf(React.PropTypes.string),
    openDrawer: React.PropTypes.func,
    flag: React.PropTypes.bool,
    isGoBackOff: React.PropTypes.func
  };
  isGoBackOff() {
    console.log("isgoback off");
      this.props.isGoBackOff();
  }
  fetchEspecies(){
    const {email} = this.props.navigation.state.params;
    this.setState({flag:true, email:email});
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
          if(this.props.flag){
            this.props.isGoBackOff();
          }
          this.setState({films: response, email:email, flag:true});
      })
  }
  componentWillReceiveProps(newProps) {
    if(this.props.flag && !this.state.flag){
      console.log("props_flag", this.state.flag);
      this.props.isGoBackOff();
      this.fetchEspecies();
    }
   // console.log("props2: ", this.props.flag, this.state.flag );
  }
  componentDidMount() {
    const {email} = this.props.navigation.state.params;
    this.setState({email:email});
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
          if(this.props.flag){
            this.props.isGoBackOff();
          }
          this.setState({films: response, email:email});
      })
  }
  _grupoEspecie = (grupoEspecie) => {
    var ImagenGrupoEspecie = "";
    if(grupoEspecie==1) return uri+'/hongo3.png';
    if(grupoEspecie==2) return uri+'/rana3.png';
    if(grupoEspecie==3) return uri+'/llama3.png';
    if(grupoEspecie==4) return uri+'/pajaro3.png';
    if(grupoEspecie==5) return uri+'/flor3.png';
    if(grupoEspecie==6) return uri+'/caracol3.png';
    if(grupoEspecie==7) return uri+'/cucaracha3.png';
    if(grupoEspecie==8) return uri+'/pez3.png';
}
  OnChange =(text) =>{
    this.setState({
      query: text,
      isSpecie: true
    });
  }
  findFilm(query) {
    this.setState({query});
    if (query === ''  ) {
      return [];
    }
    const { films } = this.state;
    //const regex = new RegExp(`${query.trim()}`);   
    let newData = this.dataFilter(query, films);
    this.setState({dataSource:newData});
   // return newData;
    //return films.filter(film => film.nombre.search(query) >= 0);
  }
  dataFilter(text, data){
    return data.filter(function(item){
        const itemData = item.nombre.toUpperCase().trim()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) ==0
    })
  }
  mapear = () => {
    var grupoEspecie=0;
    const {ImageSource, localidad, latitude, longitude, fecha_nac,  especies, grupoEspecieProy} = this.props.navigation.state.params;
    console.log("params: ", this.props.navigation.state.params);
    if(this.state.pressHongo) grupoEspecie=1 ;
    if(this.state.pressRana) grupoEspecie=2;
    if(this.state.pressLlama) grupoEspecie=3;
    if(this.state.pressPajaro) grupoEspecie=4;
    if(this.state.pressFlor) grupoEspecie=5;
    if(this.state.pressCaracol) grupoEspecie=6;
    if(this.state.pressCucar) grupoEspecie=7;
    if(this.state.pressPez) grupoEspecie=8;
    console.log("especie selected ", this.state.especie);
    
    const navigateAction = NavigationActions.navigate({
      routeName: "Mapear",
      params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, latitude:latitude, longitude:longitude,
        email: this.state.email, especie: this.state.especie, fecha_nac:fecha_nac, localidad },
      actions: [NavigationActions.navigate({ routeName: 'Mapear' })],
      //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
    })
    this.props.navigation.dispatch(navigateAction);
  }
  nombrar = () => {
    const { localidad,  especies, grupoEspecieProy} = this.props.navigation.state.params;
    var especie_selected = this.state.especie;
    if(especies){
      if(especies.length>0){
        var flag = false;
        for (var z = 0, len_p = especies.length ; z < len_p; z++){
          if(especies[z].id==especie_selected){
            flag=true;
            break;
          }
        }
        if(flag==false){
          Alert.alert("Atención", 'Esta especie no concuerda con las del proyecto.', [
            {text: 'Continuar', onPress: () => this.mapear() },
            {text: 'Corregir', onPress: () => console.log("cancel press")},
        ]);
        } else{
          this.mapear() 
        }
      }
      else if(grupoEspecieProy){
        var grupoEspecie=0;
        if(this.state.pressHongo) grupoEspecie=1 ;
        if(this.state.pressRana) grupoEspecie=2;
        if(this.state.pressLlama) grupoEspecie=3;
        if(this.state.pressPajaro) grupoEspecie=4;
        if(this.state.pressFlor) grupoEspecie=5;
        if(this.state.pressCaracol) grupoEspecie=6;
        if(this.state.pressCucar) grupoEspecie=7;
        if(this.state.pressPez) grupoEspecie=8;
        var flag = false;
        for (var z = 0, len_p = grupoEspecieProy.length ; z < len_p; z++){
          if(grupoEspecieProy[z].idGrupoEspecie==grupoEspecie){
            flag=true;
            break;
          }
        }
        if(flag==false){
          Alert.alert("Atención", 'Este grupo de especie no concuerda con las del proyecto.', [
            {text: 'Continuar', onPress: () => this.mapear() },
            {text: 'Corregir', onPress: () => console.log("cancel press")},
        ]);
        } else{
          this.mapear() 
        }
      }
    } else {
      this.mapear()
    }
    
  }
  agregarEspecie = () => {
    const {ImageSource} = this.props.navigation.state.params;
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
    console.log(this.props.navigation.state);
    const navigateAction = NavigationActions.navigate({
      routeName: "Grupo_e",
     // params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, especie: films[0].id},
      params:{email:this.state.email, modulo:"avist",ImagenGrupoEspecie:grupoEspecie, keyAvist:this.props.navigation.state.key, ImageSource:ImageSource, grupoespecie:grupoespecie },
      actions: [NavigationActions.navigate({ routeName: 'Grupo_e' })],
      //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
    })
    this.props.navigation.dispatch(navigateAction);
  }
  handleGroup = (value) =>{
    var {idGrupoEspecie, pressCaracol, pressCucar, pressFlor, pressHongo, pressLlama, pressPajaro, pressPez, pressRana} = this.state; 
    if(idGrupoEspecie==0) this.refs.scroll.scrollTo({y:viewportHeight*0.65,animated: true});
    if(value==idGrupoEspecie) idGrupoEspecie=0;
   else idGrupoEspecie=value;
    // this.setState({pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,
   //   pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false}); 
     //<Text style={{color:colores[this.state.idGrupoEspecie-1], fontWeight:'bold', fontFamily:'notoserif' }} >{textoGrupos[this.state.idGrupoEspecie-1].titulo}</Text> 
        //   <Text style={{color:colores[this.state.idGrupoEspecie-1], textAlign:'justify', fontFamily:'notoserif' }}>{textoGrupos[this.state.idGrupoEspecie-1].text}</Text>
    if(value==1) this.setState({pressHongo:!pressHongo, idGrupoEspecie:idGrupoEspecie,pressRana: false, pressLlama: false, pressPajaro: false, pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false });
    if(value==2) this.setState({pressRana:!pressRana, idGrupoEspecie:idGrupoEspecie,pressHongo: false,pressLlama: false, pressPajaro: false,pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false });
    if(value==3) this.setState({pressLlama:!pressLlama, idGrupoEspecie:idGrupoEspecie, pressHongo: false, pressRana: false,pressPajaro: false,pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false});
    if(value==4) this.setState({pressPajaro:!pressPajaro, idGrupoEspecie:idGrupoEspecie, pressHongo: false, pressRana: false, pressLlama: false,pressFlor: false, pressCaracol: false, pressCucar: false, pressPez: false});
    if(value==5) this.setState({pressFlor:!pressFlor, idGrupoEspecie:idGrupoEspecie, pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,pressCaracol: false, pressCucar: false, pressPez: false});
    if(value==6) this.setState({pressCaracol:!pressCaracol, idGrupoEspecie:idGrupoEspecie, pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,pressFlor: false, pressCucar: false, pressPez: false});
    if(value==7) this.setState({pressCucar:!pressCucar, idGrupoEspecie:idGrupoEspecie,pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,pressFlor: false, pressCaracol: false,pressPez: false });
    if(value==8) this.setState({pressPez:!pressPez, idGrupoEspecie:idGrupoEspecie, pressHongo: false, pressRana: false, pressLlama: false, pressPajaro: false,pressFlor: false, pressCaracol: false, pressCucar: false});
  }
  
  _handleRemoveItem  ()  {
    this.setState({especie:0});
    //console.log("especies_copy: ", especies_copy_copy);
  }
  _handleRenderItem  (query, idEspecie) {
    var especie= 0;
    especie=idEspecie;
    this.setState({query:query, especie:especie});
   // console.log("especies: ", listEspecies);
  }
  _handle = ( query, idEspecie) =>{
    const dataSource = this.state.dataSource;
    if(!this._isPress(idEspecie)){
      this._handleRenderItem(query, idEspecie);
    }
    else {
      this._handleRemoveItem();
    }
    this.setState({dataSource});
  }
  isPress = (idEspecie) => {
    var especie = this.state.especie;
    var press=false;
    if(idEspecie==especie){
      press=true;
    }
    return press;
  }
  _isPress (idEspecie) {
    var especie = this.state.especie;
    var press=false;
    if(idEspecie==especie){
      press=true;
    }
    return press;
  }
  primerBoton = () => {
    var {idGrupoEspecie, films}=this.state;
    var objectArray = [];
    for(var i=0, len=films.length; i< len; i++  ){
        if(films[i].grupoEspecie==idGrupoEspecie)
          objectArray.push(films[i]);
    } 
    this.setState({films: objectArray, primerBoton:true});

  }
  render() {
    //<Text>{textoGrupos[this.state.idGrupoEspecie-1]}</Text>const { props: { name, index, list } } = this;

    const { navigate } = this.props.navigation;
    const {ImageSource} = this.props.navigation.state.params;
    const { query, especie } = this.state;
    const {pressCaracol, pressCucar, pressFlor, pressHongo, pressLlama, pressPajaro, pressPez, pressRana, idGrupoEspecie} = this.state;
   // const films = this.findFilm(query);
    //const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    console.log("params ", this.props.navigation.state.params);
    return (
      <Container style={styles.container}>
        <Header  style={styles.header}>
          <Left style={{flex:1}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="ios-arrow-back" style= {{color: '#8c8c8c'}} />
            </Button>
          </Left>

          <Body style={{flex:4,  justifyContent: 'center', alignItems: 'center'}}>
          <Title style={{color: '#4A4A4A', fontSize: 17}}>Especie</Title>
          </Body>

          <Right style={{flex:1}}>
            <Button transparent onPress= { this.submitReady}><FontAwesome name={'ellipsis-v'}style= {{color: '#8c8c8c'}} size={23}/></Button>
          </Right>
        </Header>

        <ScrollView ref="scroll" style={{flex:1}} >
        <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-30} >
          <View style={styles.viewGrid}>
            <View style={styles.processSphere}/>
            <View style={styles.processBar} />
            <View style={styles.processSphereOff}/>
            <View style={styles.processBar} />
            <View style={styles.processSphereOff}/>
          </View>
          <View style={{justifyContent:'center', alignItems: 'center', marginTop:10}}>
          <TouchableOpacity style={{marginTop:2}}>
          <Image source={ImageSource}
            style={{width:viewportWidth, height:viewportHeight*0.45}} ></Image>
          </TouchableOpacity>
        </View>
        <View style={(idGrupoEspecie>0 && !this.state.primerBoton) ? styles.scrollContainer2 : styles.scrollContainer}>
         {(!this.state.primerBoton  ) ?
            <View>
               {/* <Text style={{fontSize:17, color: '#3a3a3a', marginTop:0, marginLeft: 50 }}>
                ¿A qué grupos crees que corresponde?</Text>*/}
                
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
                   <TouchableOpacity  style= {styles.botonTerminar} onPress={() => this.primerBoton() }
                    disabled={!pressCaracol && !pressCucar && !pressFlor && !pressHongo && !pressLlama && !pressPajaro && !pressPez && !pressRana  } >
                  {this.state.loading ? <ActivityIndicator/> :  <Text capitalize={false} style={{fontWeight:'bold', fontSize:20}}>Guardar</Text>}
                  </TouchableOpacity>
                </View>
                  :
                  <View  >
                    <View style={{flex:1, justifyContent:'center'}}>  
                      <View style={{marginHorizontal:30}} >
                        <Item style={{marginTop:10, borderColor: '#ddd93d'}} >
                          <FontAwesome name={'search'}style= {{color: '#ddd93d'}} size={23}/>
                           <Input underlineColorAndroid='#c4c4c4' style={{fontSize:18}} 
                          value={query} onChangeText={text =>  this.findFilm(text)} 
                          ></Input>        
                        </Item>
                        <Text style={{color: '#ddd93d', fontSize: viewportWidth*.04, marginBottom:5, marginLeft:20 }}>
                          Nombre común </Text>
                      </View> 
                      <List containerStyle={{flex:1, borderTopWidth: 0, borderBottomWidth: 0, marginTop:5 }}>
                      <FlatList
                        data={this.state.dataSource}
                        extraData={this.state}
                        renderItem={({ item }) => (
                          <ListItem
                            roundAvatar
                            title={item.nombre}
                            subtitle={`${item.nombreCient}`}
                            avatar={<Avatar rounded medium style={{backgroundColor:'rgba(0,0,0,0)'}} source={{ uri:this._grupoEspecie(item.grupoEspecie) }}/>}
                            containerStyle={[this.isPress(item.id) ? styles.especiePress : styles.especieUnPress]}
                            hideChevron
                            titleStyle={{fontSize:16, fontFamily:"notoserif"}}
                            subtitleStyle={{fontSize:14, fontStyle:'italic'}}
                           // onPress = {() => console.log(this.state.listPress2)}
                            onPress={() => this._handle(item.nombre, item.id, item.email, true) }
                          />
                        )}
                        keyExtractor={item => item.id}
                      // ItemSeparatorComponent={this.renderSeparator}
                        // ListHeaderComponent={this.renderHeader}
                        //  ListFooterComponent={this.renderFooter2}
                        //onRefresh={this.handleRefresh}
                        // refreshing={this.state.refreshing}
                      />
                    </List>

                      <TouchableOpacity style={{flexDirection: 'row', marginHorizontal:15}} onPress={ this.agregarEspecie} >
                        <MaterialCommunityIcons  name="plus" size={45}/>
                        <Title style={{color: '#4A4A4A', fontSize: 17, marginLeft:20, marginTop:10}}>Agregar especie</Title>
                      </TouchableOpacity> 
                      {especie > 0 ?  <TouchableOpacity // botón ingresar
                          style={styles.btnLogin}
                          onPress={() => this.nombrar()}
                          title="Ingresar"> 
                          <Text style={{ textAlign: 'center', fontSize:18}}>
                            Guardar</Text>  
                        </TouchableOpacity> :
                        <TouchableOpacity // botón ingresar
                        style={styles._btnLogin}
                        onPress={() => this.nombrar()}
                        title="Ingresar"> 
                        <Text style={{ textAlign: 'center', fontSize:18}}>
                          Identificar más tarde</Text>  
                      </TouchableOpacity>
                      }
                        </View>
                  </View>
            }
              </View>
              <View style={{height:10, backgroundColor:'#F2F1E1'}}/>
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
    isGoBackOff: () => dispatch(isGoBackOff())
  };
}
const mapStateToProps = state => ({
  name: state.user.name,
  index: state.list.selectedIndex,
  list: state.list.list,
  flag: state.goback_reducer.flag
});

export default connect(mapStateToProps, bindActions)(Avistamiento);

/*
const AvistSwag = reduxForm(
  {
    form: "test"
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Avistamiento);
AvistSwag.navigationOptions = {
  header: null
};
export default withNavigation(AvistSwag);*/

