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
import {Dimensions, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView,StyleSheet,Aler, TextInput, FlatList, ActivityIndicator} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from "react-navigation";
import { List, ListItem, SearchBar, colors } from "react-native-elements";
import {url_API} from "../../../config";
import {isGoBack} from "../../../actions/goback_action";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
//const { width, height } = Dimensions.get('window');
const uri_foto_user = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/uploads/";
class Equipo extends Component{
 
    constructor(props) {
        super(props);
        this.state = {
          usuarios:[], loading: true, data: [], page: 1, seed: 1, error: null, refreshing: false, data2:[], loading:false,
          seed2:2, listPress:  {emails: [], press:[] } , listPress2: {  emails: [], press: [], fotos: [], id:[] }
          , text:""
        };
         // this.renderInput = this.renderInput.bind(this);
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
      componentDidMount() {
        const {email, values, id, modulo, especie,polylines } = this.props.navigation.state.params; 
        console.log("polylines ", polylines);

        if(modulo=="proyecto")
        this.makeRemoteRequest();
        else 
        this.makeRemoteRequest2();      
        
      }
      filterSearch(text){
        this.setState({text})
        //let newData = this.dataFilter(text, this.state.especies);
       // let newProy = this.dataFilter(text, this.state.proyectos);
        let newUser = this.dataFilter(text, this.state.usuarios);
        this.setState({
            isLoaded: true,  // this.state.dataSource_proy.cloneWithRows(newProy),
             data2:newUser,
        })
    }
    dataFilter(text, data){
      return data.filter(function(item){
          const itemData = item.nombre.toUpperCase()
          const textData = text.toUpperCase()
          return itemData.indexOf(textData) ==0
      })
    }
      makeRemoteRequest = () => {
        const { page, seed } = this.state;
        const {email, values, id, modulo} = this.props.navigation.state.params;
        //this.setState({ loading: true });
        const url2 = url_API + 'proyecto/getproyectoequipo';
        var data = {id:id}
        fetch(url2, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },body:  JSON.stringify(data)
        })
          .then(res => res.json())
          .then(res => {
            console.log("equipo:  ", res);
            this.setState({
              data2: page === 1 ? res.dat : [...this.state.data2, ...res],
              error: res.error || null,
             // loading: false,
              refreshing: false,
              usuarios: res.dat,
              listPress2: res.respuesta
            });
            /*let users;
            users = res.map(el =>( 
              this.setState({
                listPress2: [... this.state.listPress2, {emails: el.email, press: false, fotos: "-", id:el.id }]
              })
             ) );*/
            
          })
          .catch(error => {
            this.setState({ error, loading: false });
          });
      };
    
      makeRemoteRequest2 = () => {
        const { page, seed2 } = this.state;
        const {email, values, id} = this.props.navigation.state.params;
        const url = `https://randomuser.me/api/?seed=${seed2}&page=${page}&results=8`;
        //this.setState({ loading: true });
        const url2 = url_API + 'users/list_email_name';
        let users;
        fetch(url2, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(res => {
            console.log("equipo: ", res);
            this.setState({
              data2: page === 1 ? res : [...this.state.data2, ...res],
              error: res.error || null,
              loading: false,
              refreshing: false,
             // listPress: page === 1 ? res.results: [...this.state.listPress, ...res.results.id.value]
            });
            var lisPress_aux = [];
            for (var i = 0, len = res.length; i < len; i++){
              lisPress_aux.push({emails: res[i].email, press:false, foto:"--", id:res[i].id });
            }
            this.setState({listPress2:lisPress_aux, usuarios: res});
           /* users = res.map(el =>( 
              this.setState({
                listPress2: [... this.state.listPress2, {emails: el.email, press: false, fotos: "--", id:el.id }]
              })
             ) );*/
             var data = {id: id};
           /*  fetch(url_API+ 'proyecto/getproyectoequipo', {
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
                  var newUser = users;
                  console.log("response Especie: ", response);
                  console.log("newuser: ", newUser);
                  for (var i = 0, len = response.length; i < len; i++){
                    let index = newUser.findIndex(el => el.id === response[i].idUsuarios);
                    console.log("index i", i, index);
                  }
              })*/
          })
          .catch(error => {
            this.setState({ error, loading: false });
          });
      };

      handleRefresh = () => {
        this.setState(
          {
            page: 1,
            seed: this.state.seed + 1,
            refreshing: true
          },
          () => {
            this.makeRemoteRequest();
          }
        );
      };
    
      handleLoadMore = () => {
        this.setState(
          {
            page: this.state.page + 1
          },
          () => {
            this.makeRemoteRequest();
          }
        );
      };
    
      renderSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "86%",
              backgroundColor: "#CED0CE",
              marginLeft: "14%"
            }}
          />
        );
      };
    
      renderHeader = () => {
        return (
          <View>
          <SearchBar  containerStyle={{backgroundColor: 'white', borderBottomWidth:0, borderTopWidth:0}}
            underlineColorAndroid='transparent' icon={{name:'search', color: '#4A4A4A', size:24 }}
           showLoading platform="android" onChangeText={(text) => this.filterSearch(text)} placeholder="Buscar..."
           value={this.state.text} cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
           inputStyle={{fontSize:16, backgroundColor:'white', color:'#4D4D4D', marginLeft:15, paddingRight:16, marginBottom:2  }}
           />
           <View style={{height:1, backgroundColor:'#DEDA3E', marginHorizontal:25 }}/>
           <Text style={{color: '#ddd93d', fontSize: viewportWidth*.04, marginBottom:30, marginLeft:20 }}>
                  Agregar usuario
                  </Text>
          <Text style={{paddingLeft: 20, padding: 5, backgroundColor: '#f2f2f5'}}>Usuarios de neguén</Text>
          </View>);
      };
      
      renderFooter = () => {
        if (!this.state.loading) return null;
    
        return (
          <View
            style={{
              paddingVertical: 20,
              borderTopWidth: 1,
              borderColor: "#CED0CE"
            }}
          >
            <ActivityIndicator animating size="large" />
          </View>
        );
      };
      OnPressEvent=(correo) => {
        let newUser = [... this.state.listPress2];
        let data2 = [... this.state.data2];
        //console.log(newUser[0].emails);
        //console.log("newUser 0 : " , this.state.listPress2);
        let index = newUser.findIndex(el => el.emails === correo);
        data2[0] = {... data2[0], gender: "male"};
        newUser[index] = {... newUser[index], press: !this.state.listPress2[index].press};
        //console.log("index ", index, "newUser 1 : ", newUser);
        this.setState({listPress2: newUser, data2: data2});

        //return false;
      }
      isListPress = (correo) => {
        //console.log("prueba: ", this.state.listPress2);
        if (!this.state.listPress2.length ) {
         // console.log("falso: ", this.state.listPress2);
          return false;
        }
        let newUser = [... this.state.listPress2];
        let index = newUser.findIndex(el => el.emails === correo);
        //console.log(newUser);
        return newUser[index].press;
      }
      OnPressEventDos=(correo) => {
         let newUser = [... this.state.listPress];
         let data = [... this.state.data];
        //console.log(newUser[0].emails);
        // console.log("newUser 0 : " , this.state.listPress);
         let index = newUser.findIndex(el => el.emails === correo);
         data[0] = {... data[0], gender: "male"};
         newUser[index] = {... newUser[index], press: !this.state.listPress[index].press};
        // console.log("index ", index, "newUser 1 : ", newUser);
         this.setState({listPress: newUser, data: data});
 
         //return false;
       }
       isListPressDos = (correo) => {
         //console.log("prueba: ", this.state.listPress2);
         if (!this.state.listPress.length ) {
          // console.log("falso: ", this.state.listPress2);
           return false;
         }
         let newUser = [... this.state.listPress];
         let index = newUser.findIndex(el => el.emails === correo);
        // console.log(newUser);
         return newUser[index].press;
       }
    static navigationOptions = {
        header: null
      };
      submitReady = () => {
        var usuarios = [];
        var listUser = this.state.listPress2;
        for (let i =0; i<listUser.length; i++){
          if(listUser[i].press===true){
            usuarios.push(listUser[i].id);
          }
        }
        const { props: { name, index, list } } = this;
        const {nombre, grupoEspecie, email} = this.props.navigation.state.params;
        const {pregunta} = this.props.navigation.state.params;
        const {objetivos} = this.props.navigation.state.params;
        const {polylines} = this.props.navigation.state.params;
        const {region} = this.props.navigation.state.params;
        const {especie, modulo, id} = this.props.navigation.state.params;
        if(modulo=="proyecto"){
          this.setState({loading:true});
          var data = {usuarios: usuarios, id:id }
          console.log("listo email: ", email, data);
          fetch( url_API + 'proyecto/editequipo', {
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

        } else {
          var data = {nombre, pregunta, objetivos, email, polylines, especie, usuarios, grupoEspecie };
          console.log("equipo data: ", data);
         /* fetch(url_API+'proyecto/create', {
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
              if(response.message){*/
                const navigateAction = NavigationActions.navigate({
                  routeName: "Crear",
                  params: {nombre: nombre, pregunta: pregunta, objetivos: objetivos, email:email,
                    listUser: this.state.listPress2, polylines: polylines, region: region, usuarios:usuarios,
                    especie:especie, grupoEspecie:grupoEspecie},
                  actions: [NavigationActions.navigate({ routeName: 'Crear' })],
                  //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
                })
                this.props.navigation.dispatch(navigateAction);
              }
         //   })        }
      }
    render() {
        const { region } = this.props;
        const { navigate } = this.props.navigation;
        const { query } = this.state;
        const {modulo} = this.props.navigation.state.params;
        if (this.state.loading) {
          return (
            <View style={{flex: 1, paddingTop: 20, borderColor: "#CED0CE"}}>
              <ActivityIndicator />
            </View>
          );
        }
        return (
          <Container style={styles.container}>
            <Header  style={styles.header}>
            <Left style={{flex:1}}>
              <Button transparent  onPress={() => this.props.navigation.goBack()}>
                <Icon style={{color: '#4A4A4A'}} name="ios-arrow-back" />
              </Button>
            </Left>
            <Body style={{flex:4,  justifyContent: 'center', alignItems: 'center', marginLeft:40}}>
              {/*  <Text style={{color: '#4D4D4D', fontSize: 20, fontWeight: 'bold',}}>Equipo</Text>*/}
                <Title style={{color: '#4D4D4D', fontSize: 20}}>Equipo</Title>
            </Body>
            <Right style={{flex:2}}>
              <Button transparent onPress= { this.submitReady}>
                <Text capitalize={false} style ={{color: '#ddd93d', fontSize: 17}}>{modulo=="proyecto" ? "Guardar" : "Guardar"}</Text></Button>
            </Right>
            </Header>
           
            <ScrollView style={{flex:1}} >
              <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                  <FlatList
                    data={this.state.data2}
                    extraData={this.state}
                    renderItem={({ item }) => (
                      <ListItem
                        roundAvatar
                        title={item.nombre}
                        subtitle={`${item.email}`}
                        avatar={{ uri: uri_foto_user+item.email+"/"+item.email+".jpg"}}
                        containerStyle={{ borderBottomWidth: 0 }}
                      // onPress = {() => console.log(this.state.listPress2)}
                        onPress={() => this.OnPressEvent(item.email) }
                        rightIcon={<TouchableOpacity onPress={() => this.OnPressEvent(item.email) } 
                        style={[this.isListPress(item.email) ? styles.botonEliminar : styles.botonAgregar ]}>
                        <Text style={{fontSize:viewportWidth*.032}}>{this.isListPress(item.email) ? "Eliminar" : "Agregar"}</Text></TouchableOpacity>}
                      // rightIcon={<FontAwesome name="check" size={25} style={{color: '#4A4A4A'}} />}
                      />
                    )}
                    keyExtractor={item => item.email}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListHeaderComponent={this.renderHeader}
                    //ListFooterComponent={this.renderFooter2}
                    //onRefresh={this.handleRefresh}
                    refreshing={this.state.refreshing}
                  />
              </List>
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

export default connect(mapStateToProps, bindActions)(Equipo);
