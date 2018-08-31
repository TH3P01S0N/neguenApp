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
import {Image, TouchableOpacity, ScrollView, KeyboardAvoidingView,StyleSheet,Platform, Dimensions,TextInput, ActivityIndicator} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import {url_API} from '../../../config';
import {isGoBack} from "../../../actions/goback_action";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
//import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from "react-navigation";
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const crear_proyecto  = uri + "/crear_proyecto.png";
const validate = values => {
  const error= {};
  error.nombre='';
  var nm = values.nombre;
  if(values.nombre === undefined){
    nm = '';
  }

  return error;
}
class Nombre extends Component{
    constructor(props) {
        super(props);
        this.state = {
          nombre: "",  loading:false
          };
          this.renderInput = this.renderInput.bind(this);
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
    static navigationOptions = {
        header: null
      };
    componentDidMount(){
        const {email, values} = this.props.navigation.state.params;
        console.log("grupo email: ", email, values);
        if(values){
          this.setState({nombre:values});
      }
    }
    renderInput({ input, label, type, meta: { touched, error, warning } }){
        var hasError= false;
        if(error !== undefined){
          hasError= true;
        }
          return(
            <Item style= {{ margin: 10, marginBottom: 40, marginTop:40 }} error= {hasError}>{
              <Input placeholderTextColor="#4D4D4D" style={{color:'#4D4D4D'}}
                    placeholder={input.name === "nombre" ? "Asigna un nombre a tu proyecto" : null} 
                    value={this.state.nombre} onChangeText={value => this.setState({nombre : value})}
                    {...input}/>
            }
            {hasError ?  <Text>{error}</Text> : <Text />}
           </Item>
            
          )
      }
      listo = () => {
        const {email, modulo, id} = this.props.navigation.state.params;
        const {nombre} = this.props.navigation.state.params;
        if(modulo=="proyecto"){
          this.setState({loading:true});
          var data = {nombre: this.state.nombre, id:id }
          fetch( url_API + 'proyecto/editnombre', {
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
        const navigateAction = NavigationActions.navigate({
          routeName: "Objetivos",
          params: {nombre: this.state.nombre, email:email, modulo:modulo},
          actions: [NavigationActions.navigate({ routeName: 'Objetivos' })],
        })
        this.props.navigation.dispatch(navigateAction);
      }
      }
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
                <Text style={{color: '#4D4D4D', fontSize: viewportHeight*.03 , marginRight: viewportHeight*.1, fontWeight: 'bold',}}>
                Datos del proyecto
                </Text>
            </Body>
            </Header>
           {/* <View style={{flex:1, marginLeft:40, marginRight:40, marginTop:30, }}> */}
              <KeyboardAvoidingView behavior="padding" style={{flex:1, justifyContent: 'space-between', marginHorizontal:viewportHeight*.06}}>
                <View />
                <View style={{alignItems:'center', marginTop:0}}>
                  <Image source={{uri: crear_proyecto}} style={ {width:viewportWidth*.22, height:(viewportWidth*.22)-5} }></Image>
                </View>
                  {/* <Field name="nombre" component={this.renderInput} /> */}
               <View>
                <Item style={{marginTop:3, borderColor: '#ddd93d'}} >
                  <FontAwesome name={'pencil'}style= {{color: '#ddd93d'}} size={23}/>
                  <Input underlineColorAndroid='#c4c4c4' style={{fontSize:viewportHeight*.021, height:viewportHeight*0.06, marginVertical:1}}  enablesReturnKeyAutomatically={true}
                      underlineColorAndroid="#ddd93d" maxLength={30}
                    value={this.state.nombre} onChangeText={value => this.setState({ nombre : value})}>
                  </Input>        
                  </Item>
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}> 
                      <Text style={{color: '#ddd93d', fontSize: viewportWidth*.04,  textAlign: 'center', marginBottom:viewportHeight*.046 }}>
                      Nombre del proyecto</Text>
                        <Text style={{fontSize:viewportWidth*.04, color:"#1E1E32"}}>{this.state.nombre.length}/30</Text>
                  </View>
                </View>
                  <TouchableOpacity  style= {styles.botonNombre} onPress={this.listo} disabled={this.state.nombre.length<3} >
                  {this.state.loading ? <ActivityIndicator/> :  <Text capitalize={false} style={{fontWeight:'bold', fontSize:viewportHeight*.03}}>Guardar</Text>}
                  </TouchableOpacity>
                </KeyboardAvoidingView>
           {/* </View>*/}
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

export default connect(mapStateToProps, bindActions)(Nombre);
/*
const NombreSwag = reduxForm(
  {
    form: "test",
    validate
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Nombre);
NombreSwag.navigationOptions = {
  header: null
};
export default NombreSwag;*/
