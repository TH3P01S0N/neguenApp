import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Container,
  Header,
  Title,
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
import {Image, TouchableOpacity, KeyboardAvoidingView, TextInput, ActivityIndicator, Dimensions, ScrollView} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import {isGoBack} from "../../actions/goback_action";
import {url_API} from "../../config";
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const advertencia = uri+"/advertencia.png";
const temperatura = uri+"/temp.png?123";
const huella = uri+"/huella.png";
class Mapear extends Component {
  constructor(props){
    super(props);
    this.renderInput = this.renderInput.bind(this);
    this.nombrar = this.nombrar.bind(this);
    this.state={
      comentario: "", ImageSource: null, loading:false
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
    isGoBack: React.PropTypes.func
  };
  isGoBack() {
    this.props.isGoBack(true);
  }  
  componentDidMount() {
    const {email, values, modulo} = this.props.navigation.state.params;
    var comentario = null;
    console.log("values ", values);
    if(this.props.navigation.state.params.comentario) comentario = this.props.navigation.state.params.comentario;
    else  comentario=this.state.comentario;
    if(values) comentario=values.comentario;
    this.setState({email:email, comentario:comentario});
  }
  nombrar = (navegar) => {    
    const {ImageSource, values} = this.props.navigation.state.params;
    const {email} = this.props.navigation.state.params;
    const {grupoEspecie} = this.props.navigation.state.params;
    const {latitude} = this.props.navigation.state.params;
    const {longitude} = this.props.navigation.state.params; 
    const {especie} = this.props.navigation.state.params;
    const {fecha_nac, modulo, keyAvist, id, localidad} = this.props.navigation.state.params;
    var amenaza,temp,suelo = null;
    var amenazaObj = [];
    var sueloObj = [];
    if(this.props.navigation.state.params.amenaza) amenaza = this.props.navigation.state.params.amenaza;
    else if(values){
      for (var i = 0, len = values.amenaza.length; i < len; i++){
        amenazaObj.push(values.amenaza[i].index);
      }
      amenaza=amenazaObj;}
      else  amenaza="/";
    if(this.props.navigation.state.params.temp) temp = this.props.navigation.state.params.temp;
    else if(values){ temp=values.temp;} else temp="/";
    if(this.props.navigation.state.params.suelo) suelo = this.props.navigation.state.params.suelo;
    else if(values){
      for (var i = 0, len = values.suelo.length; i < len; i++){
        sueloObj.push(values.suelo[i].index);
      }
       suelo=sueloObj;
      } else suelo="/";
    /*var data = {
      email: email,
      image: ImageSource,
      grupoEspecie: grupoEspecie,
      latitude: latitude,
      longitude: longitude,
      especie: especie,
      fecha_nac:fecha_nac,
      amenaza:amenaza,
      temp: temp,
      suelo:suelo,
      comentario:this.state.comentario,
      foto: ImageSource.name,
    }*/
    //console.log(data);
    console.log("ame, suelo, temp ", amenaza, suelo, temp);
    const navigateAction = NavigationActions.navigate({
      routeName: navegar,
      params: {grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: this.state.email, navegar: navegar, fecha_nac:fecha_nac,
     modulo:modulo, keyAvist:keyAvist, latitude:latitude, longitude:longitude, amenaza:amenaza, temp:temp, suelo:suelo, especie:especie,
    comentario:this.state.comentario, id, values, localidad },
      actions: [NavigationActions.navigate({ routeName: navegar })],
      //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
    })
    this.props.navigation.dispatch(navigateAction);
  }
  insertAmenazas = (idAvist) => {
    const {ImageSource} = this.props.navigation.state.params;
    const {email} = this.props.navigation.state.params;
    const {grupoEspecie} = this.props.navigation.state.params;
    const {latitude} = this.props.navigation.state.params;
    const {longitude} = this.props.navigation.state.params; 
    const {especie} = this.props.navigation.state.params;
    const {fecha_nac} = this.props.navigation.state.params;
    var amenaza,suelo, temp = null;
    if(this.props.navigation.state.params.amenaza) amenaza = this.props.navigation.state.params.amenaza;
    else  amenaza="/";
    if(this.props.navigation.state.params.suelo) suelo = this.props.navigation.state.params.suelo;
    else  suelo="/";
    if(this.props.navigation.state.params.temp) temp = this.props.navigation.state.params.temp;
    else  temp="/";
    var data ={
      id: idAvist,
      amenaza: amenaza,
      suelo: suelo
    }
    fetch(url_API+'avistamiento/amenazas', {
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
              this.setState({loading: false});
              if(response.success){
                const navigateAction = NavigationActions.reset({
                  index:0,
                  key: null,
                  actions: [NavigationActions.navigate({ routeName: "Mapa",
                  params: {email:email}
                  // params: {fecha_nac:fecha_nac, grupoEspecie: grupoEspecie, ImageSource: ImageSource, email: email,
                 //   latitude:latitude, longitude:longitude, especie:especie, amenaza:amenaza, temp:temp, suelo:suelo,
                 // especie:especie, comentario:this.state.comentario }
                  })],
                  //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
                })
                this.props.navigation.dispatch(navigateAction);          
              }
              else {
                alert(response.message);
              }
            })
  }
  guardar = () => {
    this.setState({loading:true});
    const {ImageSource} = this.props.navigation.state.params;
    const {email} = this.props.navigation.state.params;
    const {grupoEspecie} = this.props.navigation.state.params;
    const {latitude} = this.props.navigation.state.params;
    const {longitude} = this.props.navigation.state.params; 
    const {especie} = this.props.navigation.state.params;
    const {fecha_nac, modulo, values, keyAvist, id, localidad} = this.props.navigation.state.params;

    var amenaza,temp,suelo = null;
    if(this.props.navigation.state.params.temp) temp = this.props.navigation.state.params.temp;
    else  temp="/";
    if(modulo=="avistamiento"){
      if(this.props.navigation.state.params.amenaza) amenaza = this.props.navigation.state.params.amenaza;
      else if(values.amenaza){
        amenaza=values.amenaza;}
        else  amenaza="/";
        
      if(this.props.navigation.state.params.suelo) suelo = this.props.navigation.state.params.suelo;
      else if(values.suelo){ suelo=values.suelo;} else suelo="/";
      if(this.props.navigation.state.params.temp) temp = this.props.navigation.state.params.temp;
      else if(values.temp){ temp=values.temp;} else temp="/";
      var data ={
        id: id,
        amenaza: amenaza,
        suelo: suelo, temp, descripcion:this.state.comentario
      }
      console.log("data update ", data);
      fetch(url_API+'avistamiento/editmapear', {
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
              this.setState({loading: false});
              if(response.success){
                this.props.isGoBack();
                this.props.navigation.navigate({routeName:"ConsultarAvist", key:keyAvist})          
              }
              else {
                alert(response.message);
              }
            })
    } else {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('image', ImageSource);
    formData.append('grupoEspecie', grupoEspecie);
    formData.append('latitude', latitude);
    formData.append('localidad', localidad);
    formData.append('longitude', longitude);
    formData.append('especie', especie);
    formData.append('fecha', fecha_nac);
    //formData.append('amenaza', amenaza);
    formData.append('temp', temp);
   // formData.append('suelo', suelo);
    formData.append('comentario', this.state.comentario);
    formData.append('foto', ImageSource.name);
    console.log("form: ", formData);
    fetch('http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/api/avistamiento/create', {
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
                this.insertAmenazas(response.message);          
              }
              else {
                alert(response.message);
              }
            })
          }
    
  }
  renderInput({
    input,
    label,
    type,
    meta: { touched, error, warning },
    inputProps
  }) {
    var hasError = false;
    if (error !== undefined) {
      hasError = true;
    }
    return (
      <Item error={hasError}>
          <InputGroup>      
            
            <Input placeholderTextColor="#dbdbdb" type={type} returnKeyType="next"
              placeholder="Nombre especie"  style={{color:'#4A4A4A'}}
              {...input}/>
          </InputGroup>
        {hasError
          ? <Item style={{ borderColor: "transparent" }}>
              <Icon active style={{ color: "red", marginTop: 5 }} name="bug" />
              <Text style={{ fontSize: 15, color: "red" }}>{error}</Text>
            </Item>
          : <Text />}
      </Item>
    );
  }
  render() {
    const { props: { name, index, list } } = this;
    const { navigate } = this.props.navigation;
    const {ImageSource, temp, amenaza, suelo, values, modulo} = this.props.navigation.state.params;
    const{ comentario} = this.state;
    var temp_var, amenaza_var,suelo_var = null;
    if(temp && temp!='/')
      temp_var=temp;
    if(amenaza && amenaza!='/'){
      if(amenaza.length>0)
       amenaza_var=amenaza;  }
    if(suelo && suelo!='/') {
      if(suelo.length>0)
      suelo_var=suelo;}
    if(values){
      temp_var=values.temp;
      amenaza_var=values.amenaza;
      suelo_var=values.suelo;
    }
    return (
      <Container style={styles.container}>
        <Header  style={styles.header}>
          <Left style={{flex:1}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="ios-arrow-back" style= {{color: '#8c8c8c'}} />
            </Button>
          </Left>

          <Body style={{flex:4,  justifyContent: 'center', alignItems: 'center'}}>
          <Title style={{color: '#4A4A4A', fontSize: 17}}>Mapear</Title>
          </Body>

          <Right style={{flex:1}}>
            <Button transparent onPress= { this.submitReady}><FontAwesome name={'ellipsis-v'}style= {{color: '#8c8c8c'}} size={23}/></Button>
          </Right>
        </Header>

        <ScrollView style={{flex:1}}>
          <View style={styles.viewGrid}>
            <View style={styles.processSphere}/>
            <View style={styles.processBar} />
            <View style={styles.processSphere}/>
            <View style={styles.processBar} />
            <View style={styles.processSphere}/>
          </View>
          <KeyboardAvoidingView style={styles.keyboard2}>
              <View style={{justifyContent:'center', alignItems: 'center', marginTop:0}}>         
              <TouchableOpacity style={{marginTop:0}}>
              <Image source={ImageSource}
                style={{width:viewportWidth, height:viewportHeight*.5}} ></Image>
              </TouchableOpacity>
            </View>
            <Item style={{marginTop:0, borderColor: '#ddd93d'}} >
                  <FontAwesome name={'pencil'}style= {{color: '#ddd93d', marginTop:0}} size={23}/>
                  <TextInput placeholderTextColor="#c4c4c4" style={{color:'#4A4A4A', flex:1, fontSize: 15, marginLeft:10, marginRight:10}}
                    placeholder= "Comenta tu registro" underlineColorAndroid='transparent'
                    value={this.state.comentario} onChangeText={comentario => this.setState({comentario})} multiline={true}
                    numberOfLines={2} maxLength={100} />
             </Item>
              <View style={styles.matriz}>
                  <TouchableOpacity transparent onPress={ ()=> this.nombrar("Amenaza") }>
                    {amenaza_var  ? 
                      <View style={{height:viewportHeight*0.1, width:viewportHeight*0.11}}>
                        <View style={{position:'absolute', bottom:0, left:0, height:viewportHeight*0.055, width:viewportHeight*0.055,
                          borderRadius:(viewportHeight*0.055)/2, borderWidth:3, borderColor:'#FA511D', backgroundColor:'white',
                          zIndex:9 }}>
                          <Text style={{color:'#FA511D', textAlign:'center', marginTop:1.5, fontSize:17}}>{amenaza_var.length}</Text>
                        </View>
                        <Image source={ {uri:uri+'/advertencia2.png'}} style={{zIndex:-1, marginTop:5, marginLeft:10, height:viewportHeight*.0718, width:viewportHeight*.083}}></Image>
                      </View>:
                      <View style={{height:viewportHeight*0.0718, width:viewportHeight*0.11}}>
                        <Image source={{uri:advertencia}} style={{height:viewportHeight*.0718, width:viewportHeight*.083, marginLeft:12}}></Image>
                      </View>
                      }
                  </TouchableOpacity>
                  <TouchableOpacity transparent  onPress={ ()=> this.nombrar("Suelo") }>
                      {suelo_var ?
                      <View style={{height:viewportHeight*0.1, width:viewportHeight*0.11}}>
                      <View style={{position:'absolute', bottom:0, left:0, height:viewportHeight*0.055, width:viewportHeight*0.055,
                        borderRadius:(viewportHeight*0.055)/2, borderWidth:3, borderColor:'#FA511D', backgroundColor:'white',
                        zIndex:9 }}>
                        <Text style={{color:'#FA511D', textAlign:'center', marginTop:1.5, fontSize:17}}>{suelo_var.length}</Text>
                      </View>
                      <Image source={ {uri:uri+'/huella2.png'}} style={{zIndex:-1, marginTop:5, marginLeft:10, height:viewportHeight*.071, width:viewportHeight*.078}}></Image>
                    </View>:
                      <View style={{height:viewportHeight*0.071, width:viewportHeight*0.11}}>
                        <Image source={ {uri:huella}} style={{width:viewportHeight*.078, height:viewportHeight*.071, marginLeft:8}}></Image>
                      </View>
                      }
                  </TouchableOpacity>
                  <TouchableOpacity transparent  onPress={ ()=> this.nombrar("Temperatura") }>
                      {temp_var ?
                      <View style={{height:viewportHeight*0.1, width:viewportHeight*0.11, marginRight:10}}>
                        <View style={{position:'absolute', bottom:0, left:0, height:viewportHeight*0.055, width:viewportHeight*0.055,
                          borderRadius:(viewportHeight*0.055)/2, borderWidth:3, borderColor:'#FA511D', backgroundColor:'white',
                          zIndex:9 }}>
                          <Text style={{color:'#FA511D', textAlign:'center', marginTop:1.5, fontSize:17}}>{temp_var}°</Text>
                        </View>
                        <Image source={ {uri:uri+'/temp2.png'}} style={{zIndex:-1, marginTop:5, marginLeft:20, height:viewportHeight*.071, width:viewportHeight*.044}}></Image>
                      </View>:
                      <View style={{height:viewportHeight*0.071, width:viewportHeight*0.11, marginRight:0}}>
                        <Image source={[temp_var ? {uri:uri+'/temp2.png'} : {uri:temperatura}]} style={{marginRight:20, height:viewportHeight*0.071, width:viewportHeight*.044}}></Image>
                      </View>
                      }
                  </TouchableOpacity>
              </View>
              <View style={styles.matrizTexto}>
                <Text style={amenaza_var ? {fontSize:13, color:'#FA511D'}: {fontSize:13, color:'#787878'}}>Amenaza   </Text>
                <Text style={suelo_var ? {fontSize:13, color:'#DEDA3E'} : {fontSize:13, color:'#787878'}}> Suelo</Text>
                <Text style={temp_var ? {fontSize:13, color:'#DEDA3E'}: {fontSize:13, color:'#787878'}}>Temperatura</Text>
              </View>
              {(comentario.length>0 || temp_var  || amenaza_var || suelo_var  ) ?
              <TouchableOpacity  
                  onPress={this.guardar}             
                  style={styles.btnLogin}>
                  {(this.state.loading) ? 
                   <ActivityIndicator/> :
                    <Text style={{color: '#4A4A4A', textAlign: 'center', fontSize:18}}>
                        Subir registro</Text>   }          
              </TouchableOpacity> :
              <TouchableOpacity               
              style={styles._btnLogin}>
                <Text style={{color: '#DEDA3E', textAlign: 'center', fontSize:18}}>
                    Subir registro</Text>          
          </TouchableOpacity>
            }
          </KeyboardAvoidingView>
        </ScrollView>
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

export default connect(mapStateToProps, bindActions)(Mapear);
/*
const MapearSwag = reduxForm(
  {
    form: "test",
    validate
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Mapear);
MapearSwag.navigationOptions = {
  header: null
};
export default withNavigation(MapearSwag);*/

