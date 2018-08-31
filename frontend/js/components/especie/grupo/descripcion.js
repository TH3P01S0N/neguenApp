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
import {Image, ActivityIndicator, TouchableOpacity, ScrollView, KeyboardAvoidingView,StyleSheet,TextInput, Dimensions,Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import { NavigationActions } from "react-navigation";
import {isGoBack} from "../../../actions/goback_action";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import {url_API} from '../../../config';
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const colores = [   '#86C290', '#B4922B', '#BE742E', '#4DC0DE', '#9EAA36', '#007090', '#816A27', '#0093BF'];
const hongo  = uri + "/hongo.png";// require("../../../images/1-hongo.png");
const rana =  uri + "/rana.png"; 
const llama = uri + "/llama.png"; 
const pajaro = uri + "/pajaro.png"; 
const flor = uri + "/flor.png"; 
const caracol = uri + "/caracol.png"; 
const cucaracha = uri + "/cucaracha.png"; 
const pez = uri + "/pez.png"; 
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
class Descripcion_e extends Component{
    constructor(props) {
        super(props);
        this.state = {  GrupoEspecie:"", 
          descripcion:"", loading:false
          };
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
          this.setState({descripcion:values});
        }
        Keyboard.dismiss();
      }
      navegar = ()=>{
        const {modulo, id} = this.props.navigation.state.params;
        if(modulo=="especie"){
          this.setState({loading:true});
          var data = {descripcion: this.state.descripcion, id:id }
          fetch( url_API + 'especie/editdescripcion', {
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
              if(modulo=="especie"){
                this.props.isGoBack();
                this.props.navigation.goBack();
              }
            }
            else {}
          })
        } else {
            const {email} = this.props.navigation.state.params;
            const {nombre, nombreCient} = this.props.navigation.state.params;
            const {GrupoEspecie} = this.props.navigation.state.params;
            const {ImageSource} = this.props.navigation.state.params;
            const {AutorFoto} = this.props.navigation.state.params;
            const {modulo} = this.props.navigation.state.params;
            const {keyAvist} = this.props.navigation.state.params;
            const {cambioFoto} = this.props.navigation.state.params;
            const navigateAction = NavigationActions.navigate({
              routeName: "Area_e",
              params: {nombre: nombre, nombreCient:nombreCient, GrupoEspecie:GrupoEspecie, email:email, ImageSource:ImageSource, cambioFoto:cambioFoto,
                AutorFoto:AutorFoto, descripcion:this.state.descripcion, modulo:modulo, keyAvist:keyAvist },
              actions: [NavigationActions.navigate({ routeName: 'Area_e' })],
            })
            this.props.navigation.dispatch(navigateAction);
      }}
    static navigationOptions = {
        header: null
      };
    render() {
        const { region } = this.props;
        const { navigate } = this.props.navigation;
        const {GrupoEspecie, ImageSource} = this.props.navigation.state.params;
        return (
          <DismissKeyboard>
          <Container style={styles.container}>
            <Header  style={styles.header}>
            <Left style={{flex:1}}>
              <Button transparent  onPress={() => this.props.navigation.goBack()}>
                <Icon style={{color: '#4A4A4A'}} name="ios-arrow-back" />
              </Button>
            </Left>
            <Body style={{flex:5,  justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#4D4D4D', fontSize: 18, marginRight: 70, fontWeight: 'bold'}}>
                Acerca de esta especie
                </Text>
            </Body>
            </Header>
            <View style={{flex:1, marginLeft:40, marginRight:40, marginTop:30}}>
                <KeyboardAvoidingView  behavior='position'>
                  <View style={{justifyContent:'center', alignItems: 'center', marginTop:0, marginBottom:25}}>
                      <Image style={{width:140, height:140, borderRadius:100, borderColor: colores[GrupoEspecie-1],borderWidth:3.5}} source={ImageSource} />
                  </View>
                  <Text style={{color: '#ddd93d', fontSize: viewportWidth*.04, marginLeft:25 }}>
                          Descripcion </Text>
                  <Item style={{marginTop:0, borderColor: '#ddd93d'}} >
                        <FontAwesome name={'pencil'}style= {{color: '#ddd93d', marginTop:90}} size={23}/>
                        <TextInput underlineColorAndroid='transparent' style={{flex:1, fontSize:viewportWidth*.04}} numberOfLines={6} maxLength={500} enablesReturnKeyAutomatically={true}
                        placeholder={"Describe la especie aquí.  ¿Cómo \n la reconocemos, de que tamaño \n es, color? ¿De qué se alimenta, \nquién se alimenta de ella? Sabes \nalgo de su comportamiento o de \nsus ciclos de vida?"}
                        value={this.state.descripcion} onChangeText={text => this.setState({ descripcion: text})} multiline={true}>
                        </TextInput>
                  </Item>
                  <Text style={{fontSize:viewportWidth*.04, color:"#1E1E32", textAlign:"right" }} >{this.state.descripcion.length}/500</Text>
                  <TouchableOpacity  style= {[this.state.descripcion.length==0 ? styles.btnRegisterOpc : styles.btnRegister]} onPress={this.navegar}
                  disabled={ this.state.loading} >
                  {this.state.loading ? <ActivityIndicator/> : this.state.descripcion.length==0 ?
                    <Text capitalize={false} style={styles.textGuardarOpc}>
                    Completar más tarde</Text>:
                    <Text capitalize={false} style={styles.textGuardar}>
                    Guardar descripción</Text>
                  }
                  </TouchableOpacity>     
                  <View style={{ height: 100 }} />
                </KeyboardAvoidingView>
            </View> 
          </Container>
          </DismissKeyboard>
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

export default connect(mapStateToProps, bindActions)(Descripcion_e);

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
)(Descripcion_e);
Grupo_eSwag.navigationOptions = {
  header: null
};
export default Grupo_eSwag;*/
