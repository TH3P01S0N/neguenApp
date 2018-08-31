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
import {Image, TouchableOpacity, Keyboard, KeyboardAvoidingView,StyleSheet,TextInput, Dimensions,Platform, ActivityIndicator, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from "react-navigation";
import {isGoBack} from "../../../actions/goback_action";
import {url_API} from '../../../config';
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const crear_proyecto  = uri + "/crear_proyecto.png";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const validate = values => {
  const error= {};
  error.nombre='';
  var nm = values.nombre;
  if(values.nombre === undefined){
    nm = '';
  }

  return error;
}
class Objetivos extends Component{
    constructor(props) {
        super(props);
        this.state = {
          pregunta: "", objetivos: "", textLength: 0, loading:false
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
      Keyboard.dismiss();
        const {email, values} = this.props.navigation.state.params;
        console.log("grupo email: ", email, values);
        if(values){
          this.setState({pregunta:values.pregunta, objetivos:values.objetivos});
      }
    }
    renderInput({ input, label, type, meta: { touched, error, warning } }){
        var hasError= false;
        if(error !== undefined){
          hasError= true;
        }
          return(
            <Item style= {{ margin: 10, marginTop:1}} error= {hasError}>{
              (input.name === "pregunta") ?
              <Input placeholderTextColor="#4D4D4D" style={{color:'#4D4D4D', height:80}} 
                    placeholder={input.name === "pregunta" ? "Pregunta de investigación" : null} 
                    value={this.state.pregunta} onChangeText={value => this.setState({pregunta : value})}
                    multiline={true} numberOfLines={3} maxLength={100}
                    {...input}/>
                    :
              <Input placeholderTextColor="#4D4D4D" style={{color:'#4D4D4D', marginBottom: 10, height:100}}
                    placeholder={input.name === "objetivo" ? "Objetivos" : null} 
                    value={this.state.objetivos} onChangeText={value => this.setState({objetivos : value})}
                    multiline={true} numberOfLines={3} maxLength={160}
                    {...input}/>    
            }
            {hasError ?  <Text>{error}</Text> : <Text />}
           </Item>
            
          )
      }
      listo = () => {
        const {modulo, id} = this.props.navigation.state.params;
        const { props: { name, index, list } } = this;
        const {nombre, email} = this.props.navigation.state.params;
        if(modulo=="proyecto"){
          this.setState({loading:true});
          var data = {pregunta: this.state.pregunta, objetivos:this.state.objetivos, id:id }
          fetch( url_API + 'proyecto/editobjetivos', {
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
          //console.log("region(grupo): ", region);
          const navigateAction = NavigationActions.navigate({
            routeName: "Area",
            params: {nombre: nombre, pregunta: this.state.pregunta, objetivos: this.state.objetivos, email:email }, //falta el grupo seleccionado
            actions: [NavigationActions.navigate({ routeName: 'Area' })],
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
                <Text style={{color: '#4D4D4D', fontSize: 19, marginRight: viewportHeight*.1, fontWeight: 'bold',}}>
                Objetivos
                </Text>
            </Body>
            </Header>
            {/*<View style={{alignItems:'center', flex:1, marginTop:30, marginBottom:20}}>*/}
              <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-viewportHeight*.04}  style={{ flex:1,marginBottom:viewportHeight*.046, marginHorizontal:viewportHeight*.046,justifyContent: 'space-between',}}>
                  <View style={{alignItems:'center', marginTop:viewportHeight*.046}}>
                    <Image source={{uri: crear_proyecto}} style={ {width:viewportWidth*.22, height:(viewportWidth*.22)-5} }></Image>
                  </View>
                  <View style={{ marginTop:viewportWidth*.22-60}}>
                    <Item style={{  borderColor: '#ddd93d'}} >
                      <FontAwesome name={'pencil'}style= {{color: '#ddd93d'}} size={23}/>
                      <Input underlineColorAndroid='#ddd93d' style={{fontSize:viewportHeight*.02, height:viewportHeight*0.1, }} numberOfLines={3}  enablesReturnKeyAutomatically={true}
                         placeholderTextColor="#4D4D4D"  maxLength={100}
                        value={this.state.pregunta} onChangeText={value => this.setState({ pregunta : value})} multiline={true}>
                        </Input>
                    </Item>
                    {/* <Field name="pregunta" component={this.renderInput} />*/}
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}> 
                    <Text style={{color: '#ddd93d', fontSize: viewportHeight*.024,  textAlign: 'center', marginBottom:1 }}>
                      Pregunta de investigación</Text>
                      <Text style={{fontSize:viewportHeight*.024,color:"#1E1E32"}}>{this.state.pregunta.length}/100</Text>
                      </View>
                  </View>
                  <View >
                    <Item style={{  borderColor: '#ddd93d'}}>
                      <FontAwesome name={'pencil'}style= {{color: '#ddd93d'}} size={23}/>
                      <Input underlineColorAndroid='#ddd93d' style={{fontSize:viewportHeight*.02,height:viewportHeight*0.1 }} numberOfLines={3} maxLength={160} enablesReturnKeyAutomatically={true}
                      placeholderTextColor="#4D4D4D"
                      value={this.state.objetivos} onChangeText={value => this.setState({ objetivos : value})} multiline={true}>
                      </Input>
                      </Item>
                    {/*  <Field name="objetivo" component={this.renderInput} />  */}
                      <View style={{flexDirection:'row', justifyContent:'space-between'}}>   
                        <Text style={{color: '#ddd93d', fontSize: viewportHeight*.024,  textAlign: 'center', marginBottom:viewportHeight*.046 }}>
                        Objetivos</Text> 
                          <Text style={{fontSize:viewportHeight*.024, color:"#1E1E32"}} >{this.state.objetivos.length}/160</Text>    
                      </View>
                  </View>
                  <View style={{height:viewportHeight*.046 }}/>
                  </KeyboardAvoidingView>
                  <View style={{marginHorizontal: viewportHeight*.046, marginBottom:viewportHeight*.023}}>
                    <TouchableOpacity  style= {styles.boton} onPress={this.listo} 
                      disabled={this.state.objetivos.length<3 || this.state.pregunta.length<3 || this.state.loading} >
                    {this.state.loading ? <ActivityIndicator/> :  <Text capitalize={false} style={{fontWeight:'bold', fontSize:viewportHeight*.031}}>Guardar</Text>}
                    </TouchableOpacity>
                  </View>
               
          {/*  </View>*/}
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

export default connect(mapStateToProps, bindActions)(Objetivos);

/*
const ObjetivoSwag = reduxForm(
  {
    form: "test",
    validate
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Objetivos);
ObjetivoSwag.navigationOptions = {
  header: null
};
export default ObjetivoSwag; */
