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
import {Image, TouchableOpacity, ScrollView, FlatList, KeyboardAvoidingView, Dimensions} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
import { List, ListItem, SearchBar, colors } from "react-native-elements";
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const hongo  = uri + "/hongo.png";// require("../../../images/1-hongo.png");
const rana =  uri + "/rana.png"; 
const llama = uri + "/llama.png"; 
const pajaro = uri + "/pajaro.png"; 
const flor = uri + "/flor.png"; 
const caracol = uri + "/caracol.png"; 
const cucaracha = uri + "/cucaracha.png"; 
const pez = uri + "/pez.png";
const advertencia = uri+"/advertencia.png";
const temperatura = uri+"/temp.png";
const huella = uri+"/huella.png";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
class Terminar extends Component {
  constructor(props){
    super(props);
    this.state={
    especie:"",  ImagenGrupoEspecie: null, suelo:"/" , temp:"/",
        ImageSource: null, amenaza:"/",
       proyectos: [{
         id: 1, title: "Mariposas de Santiago", equipo:12
       },
      {
        id: 2, title: "Mariposas UC", equipo:23
      }]
    };
  }
  static navigationOptions = {
    header: null
  };
  static propTypes = {
    name: React.PropTypes.string,
    index: React.PropTypes.number,
    list: React.PropTypes.arrayOf(React.PropTypes.string),
    openDrawer: React.PropTypes.func
  };
  componentDidMount() {
    const {ImageSource} = this.props.navigation.state.params;
    const {email} = this.props.navigation.state.params;
    const {grupoEspecie} = this.props.navigation.state.params;
    const {latitude} = this.props.navigation.state.params;
    const {longitude} = this.props.navigation.state.params; 
    const {especie} = this.props.navigation.state.params;
    const {amenaza} = this.props.navigation.state.params;
    const {temp} = this.props.navigation.state.params;
    const {suelo} = this.props.navigation.state.params;
    const {fecha_nac} = this.props.navigation.state.params;
    const {comentario} = this.props.navigation.state.params;
    var data = {
      email: email,
      ImageSource: ImageSource,
      foto: ImageSource.name,
      grupoEspecie: grupoEspecie,
      latitude: latitude,
      longitude: longitude,
      especie: especie,
      fecha_nac:fecha_nac,
      amenaza: amenaza,
      temp: temp,
      suelo:suelo,
      comentario:comentario
    }
    console.log(data);
    if(grupoEspecie==1) this.setState({ImagenGrupoEspecie:hongo, amenaza:amenaza, suelo:suelo, temp:temp});
    if(grupoEspecie==2) this.setState({ImagenGrupoEspecie:rana, amenaza:amenaza, suelo:suelo, temp:temp});
    if(grupoEspecie==3) this.setState({ImagenGrupoEspecie:llama, amenaza:amenaza, suelo:suelo, temp:temp});
    if(grupoEspecie==4) this.setState({ImagenGrupoEspecie:pajaro, amenaza:amenaza, suelo:suelo, temp:temp});
    if(grupoEspecie==5) this.setState({ImagenGrupoEspecie:flor, amenaza:amenaza, suelo:suelo, temp:temp});
    if(grupoEspecie==6) this.setState({ImagenGrupoEspecie:caracol, amenaza:amenaza, suelo:suelo, temp:temp});
    if(grupoEspecie==7) this.setState({ImagenGrupoEspecie:cucaracha, amenaza:amenaza, suelo:suelo, temp:temp});
    if(grupoEspecie==8) this.setState({ImagenGrupoEspecie:pez, amenaza:amenaza, suelo:suelo, temp:temp});

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
 
  render() {
    const { props: { name, index, list } } = this;
    const { navigate } = this.props.navigation;
    const {ImageSource} = this.props.navigation.state.params;
    return (
      <Container style={styles.container}>
       <TouchableOpacity style={{zIndex: 10, opacity: 1, flex:1}} activeOpacity={1}  onPress={this.guardar}>
        <View style={{justifyContent:'center', alignItems: 'center', marginTop:40}}>
        <Image source={{uri: this.state.ImagenGrupoEspecie}}
          style={{width:viewportWidth*.4, height:viewportWidth*.4, borderRadius:20}}></Image>
        </View>
        <View style={{flex:1,marginLeft: viewportWidth*0.089, marginRight:viewportWidth*0.089 }}>
          {(this.state.amenaza=="/" || this.state.suelo=="/" || this.state.temp=="/") &&
            <Text style={{fontSize:viewportWidth*.042, color: '#3a3a3a', marginTop:20, 
            fontWeight:'bold' , textAlign:'center', justifyContent:'center' }}>
            No te olvides de completar tu registro más adelante</Text>
          }
          {(this.state.amenaza!="/" && this.state.suelo!="/" && this.state.temp!="/") &&
            <Text style={{fontSize:viewportWidth*.042, color: '#3a3a3a', marginTop:20, 
            fontWeight:'bold' , textAlign:'center', justifyContent:'center' }}>
            Felicidades, has completado tu registro</Text>
          }
          <View style={{flexDirection: 'column', marginTop:40, marginBottom:40}}>
              <View style={styles.matriz}>       
                  <Image source={{uri:advertencia}} style={ styles.shadow }></Image>
                  <Image source={{uri:huella}} style={ styles.shadow }></Image>
                  <Image source={{uri:temperatura}} style={ styles.shadow }></Image>
              </View>  
              <View style={{flex: 1, justifyContent: 'space-between', alignItems: 'center', 
              flexDirection: 'row', padding:4, marginTop:viewportWidth*0.1}}>
                      <Text style={{fontWeight:'bold', color:'#4A4A4A'}}>Amenaza   </Text>
                      <Text style={{fontWeight:'bold', color:'#4A4A4A'}}>   Suelo</Text>
                      <Text style={{fontWeight:'bold', color:'#4A4A4A'}}>Temperatura</Text>
              </View>
          </View>
          <Text style={{fontSize:viewportWidth*.043, color: '#3a3a3a', marginTop:1, fontWeight:'bold',
        textAlign:'center', justifyContent:'center' }}>
            Este registro se agregó a los  proyectos:</Text>
          <ScrollView style={{flex:1}}>
            <FlatList
                  data={this.state.proyectos}
                  extraData={this.state.proyectos}
                  renderItem={({ item }) => (
                    <ListItem
                      //roundAvatar
                      title={item.title}
                      titleStyle={{fontSize: viewportWidth*.04}}
                      titleContainerStyle={{marginLeft:20}}
                      //subtitle={`'${item.equipo}' integrantes`}
                      subtitle={item.equipo}
                      subtitleContainerStyle={{marginLeft:20}}
                      subtitleStyle={{fontSize: viewportWidth*.038}}
                      //avatar={{ uri: item.picture.thumbnail }}
                      containerStyle={{ borderBottomWidth: 0 }}
                     // onPress = {() => console.log(this.state.listPress2)}
                      //onPress={() => this.OnPressEvent(item.email) }
                      leftIcon={<FontAwesome name="book" size={25} style={ {color: '#4A4A4A'}} />}
                      hideChevron={true}
                     // rightIcon={<FontAwesome name="check" size={25} style={{color: '#4A4A4A'}} />}
                    />
                  )}
                  keyExtractor={item => item.id}
                //  ItemSeparatorComponent={this.renderSeparator}
                 // ListHeaderComponent={this.renderHeader}
                //  ListFooterComponent={this.renderFooter2}
                  //onRefresh={this.handleRefresh}
                //  refreshing={this.state.refreshing}
                />
          </ScrollView>
        </View>
        </TouchableOpacity>
      </Container>
    );
  }
}


const TerminarSwag = reduxForm(
  {
    form: "test"
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Terminar);
TerminarSwag.navigationOptions = {
  header: null
};
export default withNavigation(TerminarSwag);

