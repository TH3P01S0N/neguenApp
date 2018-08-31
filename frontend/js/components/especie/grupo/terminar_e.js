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
  Thumbnail
} from "native-base";
import { Field, reduxForm } from "redux-form";
import {Image, TouchableOpacity, ScrollView, FlatList, KeyboardAvoidingView, Dimensions} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
import { List, ListItem, SearchBar, colors } from "react-native-elements";
import {isGoBack} from "../../../actions/goback_action";
import {isGoBackEdit} from "../../../actions/gobackEdit_action";
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const hongo  = uri + "/hongo2.png";// require("../../../images/1-hongo.png");
const rana =  uri + "/rana2.png"; 
const llama = uri + "/llama2.png"; 
const pajaro = uri + "/pajaro2.png"; 
const flor = uri + "/flor2.png"; 
const caracol = uri + "/caracol2.png"; 
const cucaracha = uri + "/cucaracha2.png"; 
const pez = uri + "/pez2.png";
const advertencia = uri+"/advertencia.png";
const temperatura = uri+"/temp.png";
const huella = uri+"/huella.png";
const ex  = uri + "/ex.png";// require("../../../images/1-hongo.png");
const ew =  uri + "/ew.png"; 
const cr = uri + "/cr.png"; 
const en = uri + "/en.png"; 
const vu = uri + "/vu.png"; 
const nt = uri + "/nt.png"; 
const lc = uri + "/lc.png"; 
const se =  uri + "/se.png"; 
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
class Terminar_e extends Component {
  constructor(props){
    super(props);
    this.state={
    especie:"",  ImagenGrupoEspecie: null, suelo:"/" , temp:"/",
        ImageEspecie: {uri:null, name:""}, nombre:"", descripcion:"", procedencia:"", estadoConservacion:null
    };
  }
  static navigationOptions = {
    header: null
  };
  static propTypes = {
    name: React.PropTypes.string,
    index: React.PropTypes.number,
    list: React.PropTypes.arrayOf(React.PropTypes.string),
    openDrawer: React.PropTypes.func,
    isGoBack: React.PropTypes.func,
    isGoBackEdit: React.PropTypes.func
  };
  isGoBack() {
    //  console.log("isgoback");
        this.props.isGoBack(true);
    }
  isGoBackEdit() {
    //  console.log("isgoback");
        this.props.isGoBackEdit(true);
    }
  componentDidMount() {
    const {email} = this.props.navigation.state.params;
    const {nombre} = this.props.navigation.state.params;
    const {GrupoEspecie} = this.props.navigation.state.params;
    const {ImageSource} = this.props.navigation.state.params;
    const {descripcion} = this.props.navigation.state.params;
    const {procedencia} = this.props.navigation.state.params;
    const {estadoConservacion} = this.props.navigation.state.params;
    const {modulo} = this.props.navigation.state.params;
    if(GrupoEspecie==1) this.setState({ImagenGrupoEspecie:hongo, nombre:nombre, descripcion:descripcion, procedencia:procedencia});
    if(GrupoEspecie==2) this.setState({ImagenGrupoEspecie:rana, nombre:nombre, descripcion:descripcion, procedencia:procedencia});
    if(GrupoEspecie==3) this.setState({ImagenGrupoEspecie:llama, nombre:nombre, descripcion:descripcion, procedencia:procedencia});
    if(GrupoEspecie==4) this.setState({ImagenGrupoEspecie:pajaro, nombre:nombre, descripcion:descripcion, procedencia:procedencia});
    if(GrupoEspecie==5) this.setState({ImagenGrupoEspecie:flor, nombre:nombre, descripcion:descripcion, procedencia:procedencia});
    if(GrupoEspecie==6) this.setState({ImagenGrupoEspecie:caracol, nombre:nombre, descripcion:descripcion, procedencia:procedencia});
    if(GrupoEspecie==7) this.setState({ImagenGrupoEspecie:cucaracha, nombre:nombre, descripcion:descripcion, procedencia:procedencia});
    if(GrupoEspecie==8) this.setState({ImagenGrupoEspecie:pez, nombre:nombre, descripcion:descripcion, procedencia:procedencia});
    if(estadoConservacion=="EX") this.setState({ estadoConservacion:ex});
    if(estadoConservacion=="EW") this.setState({ estadoConservacion:ew});
    if(estadoConservacion=="CR") this.setState({ estadoConservacion:cr});
    if(estadoConservacion=="EN") this.setState({ estadoConservacion:en});
    if(estadoConservacion=="VU") this.setState({ estadoConservacion:vu});
    if(estadoConservacion=="NT") this.setState({ estadoConservacion:nt});
    if(estadoConservacion=="LC") this.setState({ estadoConservacion:lc});
    if(estadoConservacion=="SE") this.setState({ estadoConservacion:se});
    this.setState({ImageEspecie: ImageSource});
    if(modulo=="avist")
    this.props.isGoBack();
    //if( modulo=="editAvist")
   // this.props.isGoBackEdit();
  }
  guardar = () => {
    
    const navigateAction = NavigationActions.reset({
      index: 0,
      key: null,
      //params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, especie: this.state.especie },
      actions: [NavigationActions.navigate({ routeName: 'Mapa' })],
    })
    this.props.navigation.dispatch(navigateAction);
  }
  navegar = ()=>{
    const {email} = this.props.navigation.state.params;
    const {idInsert} = this.props.navigation.state.params;
    const navigateAction = NavigationActions.navigate({
          routeName: "ConsultarEspecie",
          params: {idEspecie:idInsert, email: email, fromDrawBar: false, verificado:"si" },
          actions: [NavigationActions.navigate({ routeName: "ConsultarEspecie" })],
          //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
        })
        this.props.navigation.dispatch(navigateAction);
  }
  navegarVolver = (navegar_modulo, keyAvist) => {
    if(navegar_modulo=="Avistamiento"){
      this.props.isGoBack();
    }
    if(navegar_modulo=="EditEspecie" || navegar_modulo=="Especie"){
      this.props.isGoBackEdit();
    }
    this.props.navigation.navigate({routeName:navegar_modulo, key:keyAvist})
  }
  render() {
    const { props: { name, index, list } } = this;
    const { navigate } = this.props.navigation;
    const {ImageSource} = this.props.navigation.state.params;
    const {modulo, descripcion} = this.props.navigation.state.params;
    var navegar_modulo="";
    if(modulo=="avist") navegar_modulo="Avistamiento";
    if(modulo=="editAvist") navegar_modulo="EditEspecie";
    if(modulo=="crear_proy") navegar_modulo="Especie";
    const {keyAvist} = this.props.navigation.state.params;
    console.log(this.props.navigation.state);
    return (
      <Container style={styles.container}>
        <Header  style={{backgroundColor: 'transparent',height:40, elevation:0}}>
          <Left style={{flex:1}}>
            <Button transparent onPress={this.guardar}>
              <Image source={{uri:uri+"/neguen.png"}} style={{width:15, height:23.2}}   />
            </Button>
          </Left>
        </Header>
       <View style={{ flex:1,  backgroundColor:'rgba(222,218,62,0.2)'}}>
          <View style={{justifyContent:'center', alignItems: 'center', marginTop:0, paddingHorizontal:30,}}>
            <Text style={{fontSize:viewportWidth*.08, color: '#787878', marginTop:3, 
                fontWeight:'bold' , textAlign:'center', justifyContent:'center' }}>
                Felicidades</Text>
            <Text style={{fontSize:viewportWidth*.035, color: '#787878', marginTop:5, marginHorizontal:0,
                 textAlign:'center', justifyContent:'center' }}>
                ¡Has añadido una nueva especie a la comunidad!</Text>
            <View style={{width:viewportHeight*.304+20, height:viewportHeight*.304+55, alignItems:'center'}}>
              <Image style={{width:viewportHeight*.304, height:viewportHeight*.304, marginTop:20,borderRadius:90, borderWidth:3, borderColor:'#ddd93d'}} source={this.state.ImageEspecie} />
              <Image source={{uri:this.state.ImagenGrupoEspecie}} style={{height:viewportWidth*0.14, width: viewportWidth*0.14,position:'absolute', bottom:10, left:200/2-(viewportWidth*0.14)/2}}></Image>
            </View>
              {/* <Image source={{uri: this.state.ImageEspecie.uri}}
              style={{width:viewportWidth*.4, height:viewportWidth*.4, borderRadius:20}}></Image>*/}
          </View>
                      
            <View style={{flexDirection: 'column', marginTop:1, marginBottom:8, marginHorizontal:40, marginTop:10}}>    
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text style={{fontWeight:'bold', fontSize:viewportWidth*.045, color:'#4A4A4A'}}>{this.state.nombre}</Text>
                    <Text style={{fontSize:viewportWidth*.045, color: '#BEBEBE', fontWeight:'bold',
                      textAlign:'center', justifyContent:'center' }}>{this.state.procedencia}</Text>
              </View>
                
            </View>
            <View style={{backgroundColor:'white',paddingHorizontal:40,}}>
            <Text style={{fontSize:viewportWidth*.035, color: '#ddd93d', marginTop:10, 
                fontWeight:'bold' , textAlign:'left', justifyContent:'center' }}>
                Descripción general</Text>
                <View style={{width:viewportWidth*.75, height:1.2, backgroundColor: '#DEDA3E', marginLeft: 0, marginRight: 25,borderRadius: 10,
               marginTop:0}} />
            <ScrollView style={{height:viewportHeight*.161, backgroundColor:'white'}}>
                <Text style={{textAlign:'center', fontSize:viewportWidth*.035, color:'#4A4A4A', marginTop:10}}>{descripcion}</Text>
            </ScrollView>
            </View>
            </View> 
          <TouchableOpacity style={styles.botonTerminar}  onPress={(modulo=="avist" || modulo=="editAvist" || modulo=="crear_proy" )?  ()=> this.navegarVolver(navegar_modulo,keyAvist) : this.navegar}>
          {/*()=> this.props.navigation.navigate({routeName:navegar_modulo, key:keyAvist}) : this.navegar}>*/}
              <Text capitalize={false} style={{fontWeight:'bold', fontSize:18}}>{(modulo=="avist" || modulo=="editAvist" ) ? "Regresar al avistamiento" : (modulo=="crear_proy") ? "Regresar al proyecto": "Ir a mi especie"}</Text>
          </TouchableOpacity>
        
        
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    isGoBack: () => dispatch(isGoBack()),
    isGoBackEdit: () => dispatch(isGoBackEdit())
  };
}

const mapStateToProps = state => ({
  name: state.user.name,
  index: state.list.selectedIndex,
  list: state.list.list,
 // flag: state.goback_reducer.flag,
 // flag2: state.gobackEdit_reducer.flag
});

export default connect(mapStateToProps, bindActions)(Terminar_e);

/*
const TerminarSwag = reduxForm(
  {
    form: "test"
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Terminar_e);
TerminarSwag.navigationOptions = {
  header: null
};
export default withNavigation(TerminarSwag);
*/
