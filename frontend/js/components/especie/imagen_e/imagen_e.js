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
import { Field, reduxForm, autofill } from "redux-form";
import { SearchBar, List, ListItem, colors, Avatar } from 'react-native-elements';
import {Image,FlatList, Keyboard, TouchableOpacity, ScrollView, KeyboardAvoidingView,StyleSheet,TextInput, Dimensions,Platform, PermissionsAndroid,} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from "react-navigation";
import ImagePicker from 'react-native-image-picker';
import {url_API} from '../../../config';
const { width, height } = Dimensions.get('window');
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const colores = [   '#86C290', '#B4922B', '#BE742E', '#4DC0DE', '#9EAA36', '#007090', '#816A27', '#0093BF'];
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const uri_foto = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/uploads/";
const hongo  = uri + "/hongo.png";// require("../../../images/1-hongo.png");
const rana = uri + "/rana.png";
const llama = uri + "/llama.png";
const pajaro = uri + "/pajaro.png";
const flor = uri + "/flor.png";
const caracol = uri + "/caracol.png";
const cucaracha = uri + "/cucaracha.png";
const pez = uri + "/pez.png";
const fotoEspecie= "";

class Imagen_e extends Component{
    constructor(props) {
        super(props);
        this.state = {
          autor: 0, textLength: 0,  ImageSource: null, films: [],  query:'', email:"", keyAvist:"", cambioFoto:false
         , dataSource: [] , listUser:[], 
        };
      }
     
    static navigationOptions = {
        header: null
      };
    componentDidMount() {
    //  const { props: { name, index, list } } = this;
    //  const {especie} = this.props.navigation.state.params;
      const {email} = this.props.navigation.state.params;
      const {keyAvist} = this.props.navigation.state.params;
      const {modulo} = this.props.navigation.state.params;
      Keyboard.dismiss();
      fetch(url_API+ 'users/list_email_name', {
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
          if(modulo=="editAvist"){
            const {ImagenSource} = this.props.navigation.state.params;
            var autor = this.emaililter(email, response);
            let source = { uri: ImagenSource,
              type: 'image/jpeg', 
              name: email + '.e.'+ (Math.floor(Math.random()*99999999)+10000000) + '.jpg' };
            this.setState({ImageSource:source, query:autor[0].nombre, autor: autor[0].id, films:response, email:email, keyAvist:keyAvist});
          }
          if(modulo=="avist"){
            const {ImagenSource} = this.props.navigation.state.params;
           // var email_copy = email.toUpperCase();
           // var response_copy = response;
          //  const email_filter = response_copy.filter((usuarios)=>
            //usuarios.email.toUpperCase().indexOf(email_copy) > -1
            //)
           var autor = this.emaililter(email, response);
           ImagenSource.name=email + '.e.'+ (Math.floor(Math.random()*99999999)+10000000) + '.jpg' ;
            this.setState({ImageSource:ImagenSource, query:autor[0].nombre, autor: autor[0].id, films:response, email:email, keyAvist:keyAvist});
          }else{
            this.setState({films: response, email:email, keyAvist:keyAvist});}
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
        return [];
      }
      const { films } = this.state;
      let newData = this.dataFilter(query, films); 
      this.setState({dataSource:newData});
      //return films.filter(film => film.title.search(regex) >= 0);
      //return films.filter(film => film.nombre.search(regex) >= 0);
    }
    dataFilter(text, data){
      return data.filter(function(item){
          const itemData = item.nombre.toUpperCase().trim()
          const textData = text.toUpperCase()
          return itemData.indexOf(textData) ==0
      })
    }
    emaililter(text, data){
      return data.filter(function(item){
          const itemData = item.email//.toUpperCase()
          const textData = text//.toUpperCase()
          return itemData.indexOf(textData) ==0
      })
    }
    removeUsers(array, element) {
      return array.filter(e => e.idEspecie !== element);
    }
    _handleRemoveItem  (idEspecie)  {
      var listEspecies = this.state.listEspecies;
      var especies_copy = this.state.especies;
      var especies_copy_copy = this.removeEspecies(especies_copy, idEspecie);
      var listEspeciesCopy = this.remove(listEspecies, idEspecie);
      this.setState({listEspecies:listEspeciesCopy, especie:especies_copy_copy});
      //console.log("especies_copy: ", especies_copy_copy);
    }
    _handleRenderItem  (query, idUsuario, email,  isSpecie) {
      var especies_copy = this.state.especies;
      var listEspecies = this.state.listEspecies;
      listEspecies.push({id:idEspecie, nombre:query, nombreCient:nombreCient, grupoEspecie:grupoEspecie })
      especies_copy.push({nombre: query, idEspecie:idEspecie});
      this.setState({query:query, idEspecie:idEspecie, isSpecie:idEspecie, especies:especies_copy, listEspecies:listEspecies});
     // console.log("especies: ", listEspecies);
    }
    _handle = ( query, idUsuario, email, isSpecie) =>{
      const dataSource = this.state.dataSource;
     // console.log("ispress " , this._isPress(idEspecie));
      if(this.state.autor!=idUsuario){
        //this._handleRenderItem(query, idUsuario, email,  isSpecie);
        this.setState({query:query, autor:idUsuario})
      }
      else {
       // this._handleRemoveItem(idUsuario);
        this.setState({autor:0});
      }
      this.setState({dataSource});
    }
    isPress = (idUsuario) => {
      var listUser = this.state.listUser;
      var press=false;
      for(var i=0, len=listUser.length; i< len; i++  ){
        if(listUser[i].id==idUsuario){
          press=true;
          break;
        }
      }
      return press;
    }
    _isPress (idUsuario) {
      var press=false;
      var listUser = this.state.listUser;
      for(var i=0, len=listUser.length; i< len; i++  ){
        if(listUser[i].id==idUsuario){
          press=true;
          break;
        }
      }
      return press;
    }

    selectPhotoTapped() {
      const options = {
        quality: 0.6,
        maxWidth: 500,
        maxHeight: 500,
        title: 'Seleccionar foto',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Tomar foto',
        chooseFromLibraryButtonTitle: 'Galería',
        storageOptions: {
          skipBackup: true,
          path: 'Neguen'
        }
      };
      ImagePicker.showImagePicker(options, (response) => {
        //console.log('Response = ', response);
        const {correo} = this.props.navigation.state.params;
        if (response.didCancel) {
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        }
        else {
          let source = { uri: response.uri,
            type: 'image/jpeg',
            //name: 'myImage' + '-' + Date.now() + '.jpg' 
            name: this.state.email + '.e.'+ (Math.floor(Math.random()*99999999)+10000000) + '.jpg' };
          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };  
          this.setState({ 
            ImageSource: source, cambioFoto:true
          });
        }
      });
    };
      listo = () => {
       // console.log("film: ", films);
        console.log("id: ", this.state.autor);
        var id=this.state.autor;
        //if( length==0) id=0;
        //else id=films[0].id;
        const {email} = this.props.navigation.state.params;
        const {nombre, nombreCient} = this.props.navigation.state.params;
        const {GrupoEspecie} = this.props.navigation.state.params;
        const {modulo} = this.props.navigation.state.params;
        const navigateAction = NavigationActions.navigate({
          routeName: "Descripcion_e",
          params: {nombre: nombre, nombreCient:nombreCient, GrupoEspecie:GrupoEspecie, email:email, ImageSource:this.state.ImageSource,
             AutorFoto:id, modulo:modulo, keyAvist:this.state.keyAvist, cambioFoto:this.state.cambioFoto  }, //falta el grupo seleccionado
          actions: [NavigationActions.navigate({ routeName: 'Descripcion_e' })],
        })
        this.props.navigation.dispatch(navigateAction);
      }
    render() {
      const { query, ImageSource } = this.state;
     // const films = this.findFilm(query);
     // const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
      const {GrupoEspecie} = this.props.navigation.state.params;
        const { navigate } = this.props.navigation;
        return (
          <Container style={styles.container}>
            <Header  style={styles.header}>
            <Left style={{flex:1}}>
              <Button transparent  onPress={() => this.props.navigation.goBack() /*=> this.props.navigation.navigate({routeName:"Avistamiento", key:this.state.keyAvist})}>*/ }>
                <Icon style={{color: '#4A4A4A'}} name="ios-arrow-back" />
              </Button>
            </Left>
            <Body style={{flex:5,  justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#4D4D4D', fontSize: 20, marginRight: 70, fontWeight: 'bold',}}>
                Nueva especie
                </Text>
            </Body>
            </Header>
            <ScrollView style={{flex:1}}>
           
            <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={190} style={{flex:1}} >
              
              <View style={{flex: 1,justifyContent:'center', alignItems: 'center', marginTop:25, marginBottom:25}}>
                <TouchableOpacity  style={styles.profilepic} onPress={this.selectPhotoTapped.bind(this)}>
                <View>
                  { this.state.ImageSource === null ? <Icon style={{color: '#4A4A4A'}} name="camera" /> :
                    <Image style={{width:140, height:140, borderRadius:100, borderColor: colores[GrupoEspecie-1],borderWidth:3.5}} source={this.state.ImageSource} />
                  }
                </View>
                </TouchableOpacity>
              </View>  
           
                <View style={{flex: 1, justifyContent:'center',}}>
                    <View style={{ marginHorizontal:40}} >
                        <Item style={{marginTop:3, borderColor: '#ddd93d'}} >
                          <FontAwesome name={'search'}style= {{color: '#ddd93d'}} size={22}/>
                           <Input underlineColorAndroid='#c4c4c4' style={{fontSize:17}} 
                          value={query} onChangeText={text =>  this.findFilm(text)} 
                          ></Input>        
                        </Item>
                        <Text style={{color: '#ddd93d', fontSize: viewportWidth*.04, marginBottom:15, marginLeft:20 }}>
                        Autor de la fotografía</Text>
                      </View>

                      <List containerStyle={{flex:1, borderTopWidth: 0, borderBottomWidth: 0, marginTop:10 }}>
                      <FlatList
                        data={this.state.dataSource}
                        extraData={this.state}
                        renderItem={({ item }) => (
                          <ListItem
                            roundAvatar
                            title={item.nombre}
                            subtitle={`${item.email}`}
                            avatar={<Avatar rounded medium style={{backgroundColor:'rgba(0,0,0,0'}} source={{ uri:uri_foto+item.email+'/'+item.email+'.jpg'  }} />}
                            containerStyle={[this.state.autor==item.id ? styles.UserPress : styles.UserUnPress ]}
                            hideChevron
                            titleStyle={{fontSize:16, fontFamily:"notoserif"}}
                            subtitleStyle={{fontSize:14}}
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
                  </View> 
                                         
              </KeyboardAvoidingView>
              <View style={{height:50}}/>
           </ScrollView>
           <TouchableOpacity  style= {[(this.state.autor==0 || this.state.ImageSource==null) ? styles.btnRegister : styles.botonGuardar]} onPress={() => this.listo()} 
                    disabled={(this.state.autor==0 || this.state.ImageSource==null)}>
                    {/*//disabled={(this.state.autor>0 && this.state.ImageSource==null) || (this.state.autor<1 && this.state.ImageSource!=null) } >*/}
                      <Text capitalize={false} style={{fontWeight:'bold', fontSize:20}}>
                     Guardar</Text>
                    </TouchableOpacity> 
          <View style={{height:20}}/>
          </Container>
         
        );
      }

}

const Imagen_eSwag = reduxForm(
  {
    form: "test"
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Imagen_e);
Imagen_eSwag.navigationOptions = {
  header: null
};
export default Imagen_eSwag;
