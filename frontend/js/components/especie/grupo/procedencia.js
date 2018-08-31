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
  InputGroup,
  Picker
} from "native-base";
import { Field, reduxForm } from "redux-form";
import { Image, TouchableOpacity, ScrollView ,StyleSheet,TextInput, Dimensions,Platform, Keyboard,  Alert, ActivityIndicator} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import { NavigationActions } from "react-navigation";
import {isGoBack} from "../../../actions/goback_action";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import {url_API} from '../../../config';
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const ex  = uri + "/ex.png";// require("../../../images/1-hongo.png");
const ew =  uri + "/ew.png"; 
const se =  uri + "/se.png"; 
const cr = uri + "/cr.png"; 
const en = uri + "/en.png"; 
const vu = uri + "/vu.png"; 
const nt = uri + "/nt.png"; 
const lc = uri + "/lc.png"; 
const ticket = uri + "/ticket.png"; 

class Procedencia extends Component{
    constructor(props) {
        super(props);
        this.state = {  GrupoEspecie:"", procedencia:"Introducida", loading:false,
          nombre:"", ex_press:false, ew_press:false,cr_press:false,en_press:false,vu_press:false,nt_press:true,
          lc_press:false, se_press:false, estadoConservacion:"NT", modulo:""
          };
          this.handleEstado = this.handleEstado.bind(this);
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
        const {email} = this.props.navigation.state.params;
        const {values} = this.props.navigation.state.params;
       // const {estadoConservacion} = this.props.navigation.state.params;
        if(values){
          this.handleEstado(values.estadoConservacion);
          if(values.procedencia.length>0)
          this.setState({procedencia:values.procedencia});
        }
        Keyboard.dismiss();
       // console.log("grupo procedencia: ", this.props.navigation.state.params);
      }
      insertUbicacion(idEspecie){
        const {polylines} = this.props.navigation.state.params;
        var data = {polylines: polylines, idEspecie:idEspecie};
        console.log("especie coords: ", data);
        fetch(url_API+'especie/insertubic', {
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
              console.log("response: ", response);
              
            })
      }
      navegar = ()=>{
        this.setState({loading:true});
        const {email} = this.props.navigation.state.params;
        const {nombre, nombreCient, polylines} = this.props.navigation.state.params;
        const {GrupoEspecie} = this.props.navigation.state.params;
        const {ImageSource} = this.props.navigation.state.params;
        const {AutorFoto} = this.props.navigation.state.params;
        const {descripcion} = this.props.navigation.state.params;
        const {modulo} = this.props.navigation.state.params;
        const {id} = this.props.navigation.state.params;
        const {keyAvist} = this.props.navigation.state.params;
        const {cambioFoto} = this.props.navigation.state.params;
        if(cambioFoto==true || modulo=="avist" || modulo=="especie"){
            const formData = new FormData();
            formData.append('email', email);
            formData.append('nombre', nombre);
            formData.append('nombreCient', nombreCient);
            formData.append('grupoEspecie', GrupoEspecie);
            if(ImageSource==null){
            formData.append('image', null);
            formData.append('foto', '/');  
            }
            else {
            formData.append('foto', ImageSource.name);
            formData.append('image', ImageSource);
            }
            formData.append('AutorFoto', AutorFoto);
            formData.append('descripcion', descripcion);
            formData.append('procedencia', this.state.procedencia);
            formData.append('estadoConservacion', this.state.estadoConservacion);   
            formData.append('id', id);   
            formData.append('cambioFoto', cambioFoto);
            formData.append('modulo',modulo);  
            console.log("formData: ", formData);
            fetch(url_API+ 'especie/create', {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json'
                    },
                    body: formData
                })
                .then(function(response) {
                    if (response.status >= 400) {
                      throw new Error("Bad response from server");
                    }
                    return response.json();
                }).then(response=>{
                  console.log("response: ", response);
                  this.setState({loading: false});
                  if(response.success){
                    if(modulo=="especie"){
                      this.props.isGoBack();
                      this.props.navigation.goBack();
                    } else {
                        if(polylines[0]){
                          console.log("poly :",polylines);
                          if(polylines[0].coordinates.length>0)
                          this.insertUbicacion(response.message);}
                        /* const navigateAction = NavigationActions.reset({
                            index:0,
                            key: null,
                            actions: [NavigationActions.navigate({ routeName: "Terminar_e",
                            params: {email:email, GrupoEspecie: GrupoEspecie, ImageSource: ImageSource, idInsert:response.message,
                            procedencia:this.state.procedencia, estadoConservacion:this.state.estadoConservacion, 
                            descripcion:descripcion, nombre:nombre }
                            })],
                          })*/
                          const navigateAction = NavigationActions.navigate({
                            routeName: "Terminar_e",
                            params: {nombre: nombre, nombreCient:nombreCient, GrupoEspecie:GrupoEspecie, email:email, ImageSource:ImageSource,
                              AutorFoto:AutorFoto, descripcion:descripcion, modulo:modulo, keyAvist:keyAvist, idInsert:response.message,
                              procedencia:this.state.procedencia, estadoConservacion:this.state.estadoConservacion, descripcion:descripcion, nombre:nombre
                              },
                            actions: [NavigationActions.navigate({ routeName: 'Terminar_e' })],
                          })
                          this.props.navigation.dispatch(navigateAction);         
                      }
                  }
                  else {
                    alert(response.message);
                  }
                })
          } else { //AQUI ENTRA SOLO CUANDO VIENE DE EDITAR AVISTAMIENTO Y NO CAMBIO LA FOTO
            var datas={ email:email, nombre:nombre, nombreCient:nombreCient, grupoEspecie:GrupoEspecie,
            foto: ImageSource.name , image:null, imagen:ImageSource , AutorFoto:AutorFoto, descripcion:descripcion, modulo:modulo, cambioFoto:cambioFoto,
            procedencia:this.state.procedencia, estadoConservacion:this.state.estadoConservacion, id:id }
            fetch(url_API+ 'especie/create', {
              method: 'POST',
              headers: {
                'Accept': 'application/json', 'Content-Type': 'application/json'
              },
              body: JSON.stringify(datas)
            })
            .then(function(response) {
                if (response.status >= 400) {
                  throw new Error("Bad response from server");
                }
                return response.json();
            }).then(response=>{
              console.log("response: ", response);
              this.setState({loading: false});
              if(response.success){
                if(polylines){
                  if(polylines[0].coordinates.length>0)
                  this.insertUbicacion(response.message);}
                    const navigateAction = NavigationActions.navigate({
                      routeName: "Terminar_e",
                      params: {nombre: nombre, nombreCient:nombreCient, GrupoEspecie:GrupoEspecie, email:email, ImageSource:ImageSource,
                      AutorFoto:AutorFoto, descripcion:descripcion, modulo:modulo, keyAvist:keyAvist, idInsert:response.message,
                      procedencia:this.state.procedencia, estadoConservacion:this.state.estadoConservacion, descripcion:descripcion, nombre:nombre
                      },
                      actions: [NavigationActions.navigate({ routeName: 'Terminar_e' })],
                      })
                    this.props.navigation.dispatch(navigateAction);         
              }
              else {
                alert(response.message);
              }
            })
          }
        
      }
      handleEstado = (select) => {
          this.setState({ex_press:false, ew_press:false,cr_press:false,en_press:false,vu_press:false,nt_press:false,
          lc_press:false, se_press:false});
          if(select==1) this.setState({ex_press:true, estadoConservacion:"EX"});
          if(select==2) this.setState({ew_press:true, estadoConservacion:"EW"});
          if(select==3) this.setState({cr_press:true, estadoConservacion:"CR"});
          if(select==4) this.setState({en_press:true, estadoConservacion:"EN"});
          if(select==5) this.setState({vu_press:true, estadoConservacion:"VU"});
          if(select==6) this.setState({nt_press:true, estadoConservacion:"NT"});
          if(select==7) this.setState({lc_press:true, estadoConservacion:"LC"});
          if(select==8) this.setState({se_press:true, estadoConservacion:"SE"});
      }
    static navigationOptions = {
        header: null
      };
    render() {
        const { region } = this.props;
        const { navigate } = this.props.navigation;
        return (
          <Container style={styles.container}>
            <Header  style={styles.header}>
            <Left style={{flex:1}}>
              <Button transparent  onPress={() => this.props.navigation.goBack()}>
                <Icon style={{color: '#4A4A4A'}} name="ios-arrow-back" />
              </Button>
            </Left>
            <Body style={{flex:5,  justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#4D4D4D', fontSize: 18, marginRight: 70, fontWeight: 'bold'}}>
                Información de la especie
                </Text>
            </Body>
            </Header>
            <View style={{flex:1, marginTop:20}}>
              <Text  style={{ fontSize:viewportWidth*.037, marginHorizontal:40}}>Seleccione su procedencia</Text>
              <Picker
                  style={{borderWidth:2,color:'#ddd93d', marginHorizontal:40, borderBottomWidth:10, borderBottomColor:'#ddd93d'}}
                  itemStyle={{fontWeight:'bold' }}
                  selectedValue={this.state.procedencia}
                  onValueChange={(pick) => this.setState({procedencia: pick})}>
                  <Picker.Item label="Introducida" value="Introducida" />
                  <Picker.Item label="Nativa" value="Nativa"/>
                  <Picker.Item label="Endémica" value="Endémica" />
              </Picker>
              <View style={{width:viewportWidth, height:0.8, backgroundColor: '#c6c6c6',borderRadius: 10,
               marginTop:10}} />
              <View style={{flex:1, marginTop:15, marginHorizontal:40}}>
              <Text  style={{ fontSize:viewportWidth*.037, marginBottom:20}}>Seleccione su estado de conservación</Text>
              <Text  style={{ fontSize:viewportWidth*.035, fontWeight:'bold'}}>Bajo riesgo</Text>
              <View style={{flexDirection:'row', flex:1, marginTop:12, marginBottom:10}}>
                  <TouchableOpacity style={{width:viewportWidth*.25, height:viewportWidth*.25}}onPress={()=>this.handleEstado(6) }>
                      <Image source={{uri:nt}} style={{width:viewportWidth*.22, height:viewportWidth*.22}} ></Image>
                      {this.state.nt_press && <Image source={{uri:ticket}} style={{width:21, height:21, position: 'absolute', right:14, bottom:28, zIndex:10 }} ></Image>}
                  </TouchableOpacity>
                  <TouchableOpacity style={{marginLeft:0, width:viewportWidth*.25, height:viewportWidth*.25}}onPress={()=>this.handleEstado(7) } >
                      <Image source={{uri:lc}} style={{width:viewportWidth*.22, height:viewportWidth*.22}} ></Image>
                      {this.state.lc_press && <Image source={{uri:ticket}} style={{width:21, height:21, position: 'absolute', right:14, bottom:28, zIndex:10 }} ></Image>}
                  </TouchableOpacity>
              </View>
              <Text  style={{ fontSize:viewportWidth*.035,fontWeight:'bold'}}>Amenazada</Text>
              <View style={{flexDirection:'row', flex:1, marginTop:10, marginBottom:10}}>
                  <TouchableOpacity style={{width:viewportWidth*.25, height:viewportWidth*.25}} onPress={()=>this.handleEstado(3) }>
                      <Image source={{uri:cr}} style={{width:viewportWidth*.22, height:viewportWidth*.22}} ></Image>
                      {this.state.cr_press && <Image source={{uri:ticket}} style={{width:21, height:21, position: 'absolute', right:14, bottom:28, zIndex:10 }} ></Image>}
                  </TouchableOpacity>
                  <TouchableOpacity style={{marginLeft:0, width:viewportWidth*.25, height:viewportWidth*.25}} onPress={()=>this.handleEstado(4) }>
                      <Image source={{uri:en}} style={{width:viewportWidth*.22, height:viewportWidth*.22}} ></Image>
                      {this.state.en_press && <Image source={{uri:ticket}} style={{width:21, height:21, position: 'absolute', right:14, bottom:28, zIndex:10 }} ></Image>}
                  </TouchableOpacity>
                  <TouchableOpacity style={{marginLeft:0, width:viewportWidth*.25, height:viewportWidth*.25}}onPress={()=>this.handleEstado(5) } >
                      <Image source={{uri:vu}} style={{width:viewportWidth*.22, height:viewportWidth*.22}} ></Image>
                      {this.state.vu_press && <Image source={{uri:ticket}} style={{width:21, height:21, position: 'absolute', right:14, bottom:28, zIndex:10 }} ></Image>}
                  </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text  style={{marginTop:20, fontSize:viewportWidth*.035, fontWeight:'bold'}}> Extinta</Text>
                <Text  style={{marginTop:10,width:90, fontSize:viewportWidth*.035, fontWeight:'bold'}}>Sin estado de conservación</Text>    
              </View>  
              <View style={{flexDirection:'row', flex:1, marginTop:10, marginBottom: 0, justifyContent:'space-between' }}>
                  <View style={{flex:1, flexDirection:'row',}}>
                    <TouchableOpacity style={{width:viewportWidth*.25, height:viewportWidth*.25}} onPress={()=>this.handleEstado(1) } >                      
                        <Image source={{uri:ex}} style={{width:viewportWidth*.22, height:viewportWidth*.22, zIndex:-1}} ></Image>
                        {this.state.ex_press && <Image source={{uri:ticket}} style={{width:21, height:21, position: 'absolute', right:14, bottom:28, zIndex:10 }} ></Image>}
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginLeft:0, width:viewportWidth*.25, height:viewportWidth*.25}}onPress={()=>this.handleEstado(2) } >
                        <Image source={{uri:ew}} style={{width:viewportWidth*.22, height:viewportWidth*.22}} ></Image>
                        {this.state.ew_press && <Image source={{uri:ticket}} style={{width:21, height:21, position: 'absolute', right:14, bottom:28, zIndex:10 }} ></Image>}
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={{width:viewportWidth*.25, height:viewportWidth*.25, marginRight:5}} onPress={()=>this.handleEstado(8) } >                      
                        <Image source={{uri:se}} style={{width:viewportWidth*.22, height:viewportWidth*.22, zIndex:-1}} ></Image>
                        {this.state.se_press && <Image source={{uri:ticket}} style={{width:21, height:21, position: 'absolute', right:14, bottom:28, zIndex:10 }} ></Image>}
                    </TouchableOpacity>
              </View>
            </View>
                  <TouchableOpacity  style= {styles.botonProceden} onPress={this.navegar} disabled={this.state.loading}  >
                   {this.state.loading ? <ActivityIndicator/>: <Text capitalize={false} style={{ fontSize:18}}>Guardar especie</Text>}
                  </TouchableOpacity>        
                
            </View> 
          </Container>
        
        );
      }

}
//especie
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

export default connect(mapStateToProps, bindActions)(Procedencia);
/*
const Grupo_eSwag = reduxForm(
  {
    form: "test"
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Procedencia);
Grupo_eSwag.navigationOptions = {
  header: null
};
export default Grupo_eSwag;
*/