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
import Autocomplete from 'react-native-autocomplete-input';
import { SearchBar, List, ListItem, colors, Avatar } from 'react-native-elements';
import { Field, reduxForm } from "redux-form";
import {Image, ActivityIndicator, TouchableOpacity, ScrollView, KeyboardAvoidingView,StyleSheet,FlatList, Dimensions,Platform, PermissionsAndroid, Alert, TextInput} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from "react-navigation";
import {url_API} from '../../../config';
import {isGoBack} from "../../../actions/goback_action";
import {isGoBackEditOff  } from "../../../actions/gobackEdit_action_off";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const hongo  = uri + "/hongo3.png";// require("../../../images/1-hongo.png");
const rana =  uri + "/rana3.png"; 
const llama = uri + "/llama3.png"; 
const pajaro = uri + "/pajaro3.png"; 
const flor = uri + "/flor3.png"; 
const caracol = uri + "/caracol3.png"; 
const cucaracha = uri + "/cucaracha3.png"; 
const pez = uri + "/pez3.png";
const grupos = [hongo, rana, llama, pajaro, flor, caracol, cucaracha, pez];
class Especie extends Component{
   renderFilm(film) {
    //console.log("film e : ", film);
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
    return (
      <View style={{flexDirection: 'row', marginLeft:10}} >
        <Image source={{uri: ImagenGrupoEspecie}}
                  style={{height:viewportWidth*0.13, width:viewportWidth*0.13}}></Image>
        <View style={{flex:1,justifyContent: 'space-between', flexDirection:'row', marginRight:10}}>
        <View style={{marginLeft:20, flexDirection: 'column',}} >
        {/* <Text style={{fontSize: 18, fontWeight: '500', marginBottom: 10,marginTop: 10, textAlign: 'center'}}>{roman}. {title}</Text>*/}
          <Text style={{fontSize:viewportWidth*.040, fontWeight: 'bold', marginBottom: 5,marginTop: 1, textAlign: 'left'}}>{nombre}</Text>
          <Text style={{fontSize:viewportWidth*.036, marginBottom: 10,marginTop: 1, textAlign: 'left'}}>{nombreCient}</Text>
        </View>
        <TouchableOpacity style={{marginTop:10}} onPress={() => _handleRemoveItem(id) } >
          <FontAwesome size={23} style={{color: '#4A4A4A'}} name="close" />
        </TouchableOpacity>
      </View>
      </View>
    );
  }
    constructor(props) {
        super(props);
        this.state = {
          films: [], email:"", idEspecie:0, especies: [], listEspecies:[], contentScroll:{flex:1},
          query: '', isSpecie: false, loading:false, dataSource: [], flag:false
          };
          this.OnChange = this.OnChange.bind(this);
          //this._handleRemoveItem = this._handleRemoveItem(this);
         // this.renderInput = this.renderInput.bind(this);
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
        console.log("isgoback");
        this.props.isGoBack(true);
    }  
    isGoBackEditOff() {
      console.log("isgoback off");
        this.props.isGoBackEditOff();
    }
    static navigationOptions = {
        header: null
      };
    _grupoEspecie = (grupoEspecie) => {
        var ImagenGrupoEspecie = "";
        if(grupoEspecie==1) return hongo;
        if(grupoEspecie==2) return rana;
        if(grupoEspecie==3) return llama;
        if(grupoEspecie==4) return pajaro;
        if(grupoEspecie==5) return flor;
        if(grupoEspecie==6) return caracol;
        if(grupoEspecie==7) return cucaracha;
        if(grupoEspecie==8) return pez;
    }
    componentWillReceiveProps(newProps) {
      if(this.props.flag2 && !this.state.flag){
        console.log("props_flag2", this.state.flag);
        this.props.isGoBackEditOff();
        this.fetchEspecie();
      }
     // console.log("props2: ", this.props.flag, this.state.flag );
    }
    fetchEspecie(){
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
            const {grupoEspecie} = this.props.navigation.state.params;
            var data_copy = response;
            var objectArray = [];
            for(var i=0, len=data_copy.length; i< len; i++  ){
              for(var j=0, len_=grupoEspecie.length; j< len_; j++  ){
                if(data_copy[i].grupoEspecie==grupoEspecie[j])
                  objectArray.push(data_copy[i]);
                }
            } 
            this.setState({films: objectArray, listEspecies:[], especies:[], query:"", flag:true});
        })
    }
    componentDidMount() {
      const {email, values} = this.props.navigation.state.params;
      if(values){
        var listEspecies = values.listEspecies;
        var especies_copy = [];
        
        for (var i = 0, len = values.listEspecies.length; i < len; i++){
          especies_copy.push({nombre: values.listEspecies[i].nombre, idEspecie:values.listEspecies[i].id});
        }
        this.setState({listEspecies:listEspecies, especies:especies_copy});
      }
      console.log("values ", values);
      console.log("grupo email: ", email, listEspecies, especies_copy);
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
              var {grupoEspecie} = this.props.navigation.state.params;
              var data_copy = response;
              var objectArray = [];
              if(!grupoEspecie){
                if(values){
                  grupoEspecie=values.grupoEspecie;
                  for(var i=0, len=data_copy.length; i< len; i++  ){
                    for(var j=0, len_=grupoEspecie.length; j< len_; j++  ){
                      if(data_copy[i].grupoEspecie==grupoEspecie[j].idGrupoEspecie){
                        var token =false;
                        for(var k=0, len_k=values.listEspecies.length; k<len_k; k++){
                          if(data_copy[i].id==values.listEspecies[k].id) {
                            token=true;
                            break;
                          }
                        }
                          if(token==false)
                            objectArray.push(data_copy[i]);
                          }
                      }
                  } 
                }
              } else {
              for(var i=0, len=data_copy.length; i< len; i++  ){
                for(var j=0, len_=grupoEspecie.length; j< len_; j++  ){
                  if(data_copy[i].grupoEspecie==grupoEspecie[j])
                    objectArray.push(data_copy[i]);
                  }
              } }
              this.setState({films: objectArray,  email:email});
              console.log("lista ", objectArray, grupoEspecie);
          })
    }
    OnChange =(text) =>{
      console.log(text);
      this.setState({
        query: text,
        isSpecie: true
      });
    }
    findFilm(query) {
      this.setState({query});
      if (query === ''  ) {
        this.setState({dataSource:[]})
        return [];
      }
      const { films } = this.state;
      //const regex = new RegExp(`${query.trim()}`);   
      //return films.filter(film => film.title.search(regex) >= 0);
      let newData = this.dataFilter(query, films);
      this.setState({dataSource:newData});
      //return newData;
      //return films.filter(film => film.nombre.search(query) >= 0);
    }
    dataFilter(text, data){
     return data.filter(function(item){
          const itemData = item.nombre.toUpperCase().trim()
          const textData = text.toUpperCase()
          return itemData.indexOf(textData) == 0 
      })
    }

    listo = (films) => {
      const { props: { name, index, list } } = this;
      const {nombre, email, grupoEspecie, modulo, id} = this.props.navigation.state.params;
      if(modulo=="proyecto"){
        this.setState({loading:true});
        var data = {especies: this.state.especies, id:id }
        console.log("listo email: ", email, data);
        fetch( url_API + 'proyecto/editespecies', {
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
      console.log("especies: ", this.state.especies);
      const navigateAction = NavigationActions.navigate({
        routeName: "Equipo",
        params: {nombre: nombre, pregunta: pregunta, objetivos: objetivos,polylines: polylines, region: region, especie: this.state.especies, email:email, grupoEspecie:grupoEspecie }, 
        actions: [NavigationActions.navigate({ routeName: 'Equipo' })],
      })
      this.props.navigation.dispatch(navigateAction);
      }
    }
     remove(array, element) {
      return array.filter(e => e.id !== element);
    }
    removeEspecies(array, element) {
      return array.filter(e => e.idEspecie !== element);
    }
    _handleRemoveItem  (idEspecie)  {
      var listEspecies = this.state.listEspecies;
      var especies_copy = this.state.especies;
      
      var especies_copy_copy = this.removeEspecies(especies_copy, idEspecie);
      var listEspeciesCopy = this.remove(listEspecies, idEspecie);
      this.setState({listEspecies:listEspeciesCopy, especies:especies_copy_copy});
      //console.log("especies_copy: ", especies_copy_copy);
    }
    handleRemoveItem = (query, idEspecie, nombreCient, grupoEspecie) => {
      var listEspecies = this.state.listEspecies;
      var especies_copy = this.state.especies;
      var dataSourceCopy = this.state.dataSource;
      var especies_copy_copy = this.removeEspecies(especies_copy, idEspecie);
      var listEspeciesCopy = this.remove(listEspecies, idEspecie);
      dataSourceCopy.push({id:idEspecie, nombre:query, nombreCient:nombreCient, grupoEspecie:grupoEspecie});
      this.setState({listEspecies:listEspeciesCopy, especies:especies_copy_copy, films:dataSourceCopy});
     // console.log("especies_copy: ", especies_copy_copy);
    }
    eliminar = (nombre, id, nombreCient, grupoEspecie) => {
      Alert.alert("Atención", '¿Quieres borrar '+nombre+' de las especies seleccionadas?', [
        {text: 'Sí', onPress: () => this.handleRemoveItem(nombre, id, nombreCient, grupoEspecie) },
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    ]);
    }
    _handleRenderItem = (query, idEspecie, nombreCient, grupoEspecie, isSpecie) => {
      var especies_copy = this.state.especies;
      var listEspecies = this.state.listEspecies;
      listEspecies.push({id:idEspecie, nombre:query, nombreCient:nombreCient, grupoEspecie:grupoEspecie })
      especies_copy.push({nombre: query, idEspecie:idEspecie});
      var dataSourceCopy = this.remove(this.state.dataSource, idEspecie);
      var dataRows = this.remove(this.state.films, idEspecie);
      this.setState({films:dataRows,  idEspecie:idEspecie, isSpecie:idEspecie, especies:especies_copy, listEspecies:listEspecies, dataSource:dataSourceCopy});
     // console.log("especies: ", listEspecies);
    }
    _handle = ( query, idEspecie, nombreCient, grupoEspecie, isSpecie) =>{
      const dataSource = this.state.dataSource;
     // console.log("ispress " , this._isPress(idEspecie));
      if(!this._isPress(idEspecie)){
        this._handleRenderItem(query, idEspecie, nombreCient, grupoEspecie, isSpecie);
      }
      else {
        this._handleRemoveItem(idEspecie);
      }
      this.setState({dataSource});
    }
    isPress = (idEspecie) => {
      var listEspecies = this.state.listEspecies;
      var press=false;
      for(var i=0, len=listEspecies.length; i< len; i++  ){
        if(listEspecies[i].id==idEspecie){
          press=true;
          break;
        }
      }
     // console.log("press ",press, idEspecie );
      return press;
    }
    _isPress (idEspecie) {
      var press=false;
      var listEspecies = this.state.listEspecies;
      for(var i=0, len=listEspecies.length; i< len; i++  ){
        if(listEspecies[i].id==idEspecie){
          press=true;
          break;
        }
      }
      return press;
    }
    renderHeader = () => {
      return( 
            <View style={{width:viewportWidth, height:1.2, backgroundColor: '#ddd93d', borderRadius: 10,
          marginTop:10}} />
         );
    };
    agregarEspecie = () => {
      const navigateAction = NavigationActions.navigate({
        routeName: "Grupo_e",
       // params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, especie: films[0].id},
        params:{email:this.state.email, modulo:"crear_proy", keyAvist:this.props.navigation.state.key },
        actions: [NavigationActions.navigate({ routeName: 'Grupo_e' })],
        //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
      })
      this.props.navigation.dispatch(navigateAction);
    }
    render() {
        const { navigate } = this.props.navigation;
        const { query, dataSource, listEspecies } = this.state;
        var KeyboardAvoidingView_ = -130 - listEspecies.length*25 - dataSource.length*25;
        console.log("datasource listespecie ", dataSource.length, listEspecies.length);
       // const films = this.findFilm(query);
       // const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        return (
          <Container style={styles.container}>
            <Header  style={styles.header}>
            <Left style={{flex:1}}>
              <Button transparent  onPress={() => this.props.navigation.goBack()}>
                <Icon style={{color: '#4A4A4A'}} name="ios-arrow-back" />
              </Button>
            </Left>
            <Body style={{flex:5,  justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#4D4D4D', fontSize: 17, marginRight: 70, fontWeight: 'bold',}}>
                Especies de investigación
                </Text>
            </Body>
            </Header>
              <ScrollView contentContainerStyle={this.state.contentScroll} >
                <KeyboardAvoidingView  behavior="position"
                //behavior={ this.state.listEspecies.length > 0 || dataSource.length>0 ? "padding" : "position"}
                 keyboardVerticalOffset={this.state.listEspecies.length > 0 || dataSource.length>0 ? KeyboardAvoidingView_ : -30} style={{flex:1, flexDirection:'column', justifyContent:'space-between'}}>
                <View style={{ marginTop: 20, }}>           
                  <Text style={{fontSize: 16, textAlign:'center', justifyContent:'center', padding:10, marginHorizontal: 30,  color:'#4A4A4A'}}>
                      Si vas a trabajar con especies particulares, seleccionalas aquí.
                    </Text>
                  
                      <View style={{ marginHorizontal:30}} >
                        <Item style={{marginTop:3, borderColor: '#ddd93d'}} >
                          <FontAwesome name={'search'}style= {{color: '#ddd93d'}} size={23}/>
                           <Input underlineColorAndroid='#c4c4c4' style={{fontSize:17}} 
                          value={query} onChangeText={text =>  this.findFilm(text)} 
                          ></Input>        
                        </Item>
                        <Text style={{color: '#ddd93d', fontSize: viewportWidth*.04, marginBottom:15, marginLeft:20 }}>
                          Nombre especie </Text>
                      </View>
                    
                      <ScrollView 
                        onTouchStart={(ev)=>{ this.setState({contentScroll:{flex:1}});}}
                        onTouchEnd={(e) => { this.setState({ contentScroll: {} }); }}
                        onMomentumScrollEnd={(e) => { this.setState({ contentScroll: {} }); }}
                        onScrollEndDrag={(e) => { this.setState({ contentScroll: {} }); }}
                        style={{maxHeight:viewportHeight*.28, borderTopWidth: 0, borderBottomWidth: 0, marginTop:3}}
                      //style={[this.state.dataSource.length>0 ? {maxHeight:viewportHeight*.28, borderTopWidth: 0, borderBottomWidth: 0, marginTop:3}:
                        //{maxHeight:viewportHeight*.05, borderTopWidth: 0, borderBottomWidth: 0, marginTop:3} ]}>
                        >
                        <FlatList
                          data={this.state.dataSource}
                          extraData={this.state}
                         // style={this.state.dataSource.length>0 && {height:viewportHeight*.28,}}
                          renderItem={({ item }) => (
                            <ListItem
                              roundAvatar
                              title={item.nombre}
                              subtitle={`${item.nombreCient}`}
                              avatar={<Avatar rounded medium style={{backgroundColor:'rgba(0,0,0,0'}} source={{ uri: this._grupoEspecie(item.grupoEspecie) }} />}
                              containerStyle={[this.isPress(item.id) ? styles.especiePress : styles.especieUnPress ]}
                              hideChevron
                              titleStyle={{fontSize:17, fontFamily:"notoserif"}}
                              subtitleStyle={{fontSize:15}}
                            // onPress = {() => console.log(this.state.listPress2)}
                              onPress={() => this._handleRenderItem(item.nombre, item.id, item.nombreCient, item.grupoEspecie, true) }
                            />
                            )}
                          keyExtractor={item => item.id}
                        // ItemSeparatorComponent={this.renderSeparator}
                          // ListHeaderComponent={this.renderHeader}
                          //  ListFooterComponent={this.renderFooter2}
                          //onRefresh={this.handleRefresh}
                          // refreshing={this.state.refreshing}
                        />
                      
                      </ScrollView>
                      <TouchableOpacity style={{flexDirection: 'row', marginHorizontal:15}} onPress={ this.agregarEspecie} >
                          <MaterialCommunityIcons  name="plus" size={45}/>
                          <Title style={{color: '#4A4A4A', fontSize: 17, marginLeft:20, marginTop:10}}>Agregar especie</Title>
                        </TouchableOpacity> 
                      {this.state.listEspecies.length > 0 ?
                      <View>
                      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, marginTop:3 }}>
                        <FlatList
                          data={this.state.listEspecies}
                          extraData={this.state}
                          renderItem={({ item }) => (
                            <ListItem
                              roundAvatar
                              title={item.nombre}
                              subtitle={`${item.nombreCient}`}
                              avatar={<Avatar rounded medium style={{backgroundColor:'rgba(0,0,0,0)'}} source={{ uri: this._grupoEspecie(item.grupoEspecie) }} />}
                              containerStyle={[this.isPress(item.id) ? styles.especiePress : styles.especieUnPress ]}
                              hideChevron
                              titleStyle={{fontSize:17, fontFamily:"notoserif"}}
                              subtitleStyle={{fontSize:15}}
                              onPress={() => this.eliminar(item.nombre, item.id, item.nombreCient, item.grupoEspecie) }
                            />
                            )}
                          keyExtractor={item => item.id}
                        // ItemSeparatorComponent={this.renderSeparator} // quieres borrar perro de las especies seleccionadas
                           //ListHeaderComponent={this.renderHeader}
                           ListHeaderComponent={ () =>
                             <View style={{ marginHorizontal:30,}} >
                                <View style={{width:viewportWidth*.85, height:1.1, backgroundColor: '#ddd93d',borderRadius: 10,
                                marginBottom:10}} /> 
                                <Text style={{color: '#ddd93d', fontSize: viewportWidth*.04, marginBottom:15, marginLeft:20 }}>
                                  Especies seleccionadas </Text>
                              </View>
                              }
                          //  ListFooterComponent={this.renderFooter2}
                          //onRefresh={this.handleRefresh}
                          // refreshing={this.state.refreshing}
                        /> 
                      </List>
                        <View style={{ marginLeft: 20, marginRight: 20, marginTop: 0, marginBottom: 0,padding: 20}}>        
                        { (this.state.especies.length===0)  ?
                        <TouchableOpacity  style= {{padding: 15,marginTop: 0, marginHorizontal: 2 , borderRadius:5,
                          alignItems: 'center', backgroundColor: '#ddd93d', alignSelf: "stretch"}} 
                          onPress={() => this.listo(1)} >
                          <Text capitalize={false} style={{fontWeight:'bold', fontSize:18}}>Omitir</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity disabled={this.state.loading} style= {{padding: 15,marginTop: 30, marginHorizontal: 2,
                          borderRadius:5, alignItems: 'center', backgroundColor: '#ddd93d', alignSelf: "stretch"}} 
                        onPress={() => this.listo(this.state.idEspecie)} >
                      {this.state.loading ? <ActivityIndicator/> :  <Text capitalize={false} style={{fontWeight:'bold', fontSize:18}}>Guardar</Text>}
                        </TouchableOpacity>
                       
                        }          
                      </View>
                      </View>
                      : 
                    <View/>
                    }
                </View>
               
                 <View style={{ height:30}}/>
            {this.state.listEspecies.length == 0 && this.state.dataSource.length>0 &&
            <View style={{ marginLeft: 20, marginRight: 20, marginTop: 0, marginBottom: 0,padding: 20}}>        
                { (this.state.especies.length===0)  ?
                <TouchableOpacity  style= {{padding: 15,marginTop: 0, marginHorizontal: 2 , borderRadius:5,
                  alignItems: 'center', backgroundColor: '#ddd93d', alignSelf: "stretch"}} 
                  onPress={() => this.listo(1)} >
                  <Text capitalize={false} style={{fontWeight:'bold', fontSize:18}}>Omitir</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity disabled={this.state.loading} style= {{padding: 15,marginTop: 30, marginHorizontal: 2,
                  borderRadius:5, alignItems: 'center', backgroundColor: '#ddd93d', alignSelf: "stretch"}} 
                 onPress={() => this.listo(this.state.idEspecie)} >
               {this.state.loading ? <ActivityIndicator/> :  <Text capitalize={false} style={{fontWeight:'bold', fontSize:18}}>Guardar</Text>}
                 </TouchableOpacity>
                }          
              </View> }
            </KeyboardAvoidingView>
              
           </ScrollView>
           {this.state.listEspecies.length == 0 && this.state.dataSource.length==0 &&
            <View style={{ marginLeft: 20, marginRight: 20, marginTop: 0, marginBottom: 0,padding: 20}}>        
                { (this.state.especies.length===0)  ?
                <TouchableOpacity  style= {{padding: 15, marginHorizontal: 2 , borderRadius:5,
                  alignItems: 'center', backgroundColor: '#ddd93d', alignSelf: "stretch"}} 
                  onPress={() => this.listo(1)} >
                  <Text capitalize={false} style={{fontWeight:'bold', fontSize:18}}>Omitir</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity disabled={this.state.loading} style= {{padding: 15,marginTop: 30, marginHorizontal: 2,
                  borderRadius:5, alignItems: 'center', backgroundColor: '#ddd93d', alignSelf: "stretch"}} 
                 onPress={() => this.listo(this.state.idEspecie)} >
               {this.state.loading ? <ActivityIndicator/> :  <Text capitalize={false} style={{fontWeight:'bold', fontSize:18}}>Guardar</Text>}
                 </TouchableOpacity>
                }          
              </View> }
          </Container>
        
        );
      }

}
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

export default connect(mapStateToProps, bindActions)(Especie);

