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
  Thumbnail
} from "native-base";
import { Field, reduxForm } from "redux-form";
import {ActivityIndicator, ListView, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView,StyleSheet, FlatList, Dimensions,Platform, PermissionsAndroid, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from "react-navigation";
import { SearchBar, List, ListItem, colors } from 'react-native-elements';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import {url_API} from '../../config';
const uri_foto = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/uploads/";
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const goBackIcon = uri+"/goBack.png";
const hongo  = uri + "/hongo.png";// require("../../../images/1-hongo.png");
const rana =  uri + "/rana.png"; 
const llama = uri + "/llama.png"; 
const pajaro = uri + "/pajaro.png"; 
const flor = uri + "/flor.png"; 
const caracol = uri + "/caracol.png"; 
const cucaracha = uri + "/cucaracha.png"; 
const pez = uri + "/pez.png"; 
const proyectos = uri + "/proyectos.png";
class Explorar extends Component{
    constructor(props) {
        super(props);
      //  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
       // const ds_proy = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.state = {email:"", especies:[], text:"", isLoaded: false, isLoading: false, dataSource:[], // ds.cloneWithRows([]),
        consultar:false, proyectos:[], dataSource_proy: [], usuarios:[], dataSource_user:[] }; //ds_proy.cloneWithRows([])  };
      }
      componentDidMount(){
        this.setState({isLoading:true});
        const {email} = this.props.navigation.state.params;
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
                   // console.log("response Especie: ", response);
                    this.setState({especies: response, dataSource: response, email:email,isLoading:false});
                })
            this.makeRemoteRequest();
            this.makeRemoteRequest2();
       // this.setState({temp: values, id: id, fromDrawBar:fromDrawBar});
      }
      makeRemoteRequest = () => {
        fetch(url_API+ 'proyecto/list', {
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
                this.filterSearch("");
                console.log("response Proyecto: ", response);
                this.setState({proyectos: response, dataSource_proy:response});
            })
      }
      makeRemoteRequest2 = () => {
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
                this.filterSearch("");
                console.log("response users: ", response);
                this.setState({usuarios: response, dataSource_user:response});
            })
      }
    consultarEspecie(idEspecie) {
        this.setState({consultar:true});
        const {email} = this.props.navigation.state.params;
        const {fromDrawBar} = this.props.navigation.state.params;
        const {verificado} = this.props.navigation.state.params;
        const navigateAction = NavigationActions.navigate({
          routeName: "ConsultarEspecie",
          params: {idEspecie:idEspecie, email: email, fromDrawBar: false, verificado:verificado },
          actions: [NavigationActions.navigate({ routeName: "ConsultarEspecie" })],
          //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
        })
        this.props.navigation.dispatch(navigateAction);
        this.setState({consultar:false});
      }
    consultarProyecto(idProyecto, cantEquipo) {
        this.setState({consultar:true});
        const {email} = this.props.navigation.state.params;
        const {fromDrawBar} = this.props.navigation.state.params;
        const {verificado} = this.props.navigation.state.params;
        const navigateAction = NavigationActions.navigate({
          routeName: "ConsultarProyecto",
          params: {idProyecto:idProyecto, email: email, fromDrawBar: false, verificado:verificado, cantEquipo:cantEquipo },
          actions: [NavigationActions.navigate({ routeName: "ConsultarProyecto" })],
          //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
        })
        this.props.navigation.dispatch(navigateAction);
        this.setState({consultar:false});
      }
      consultarUser(idUsuario, email_perfil) {
        this.setState({consultar:true});
        const {email} = this.props.navigation.state.params;
        const {fromDrawBar} = this.props.navigation.state.params;
        const {verificado} = this.props.navigation.state.params;
        const navigateAction = NavigationActions.navigate({
          routeName: "ConsultarUser",
          params: {idUsuario:idUsuario, email: email,  verificado:verificado, email_perfil:email_perfil },
          actions: [NavigationActions.navigate({ routeName: "ConsultarUser" })],
          //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
        })
        this.props.navigation.dispatch(navigateAction);
        this.setState({consultar:false});
      }
    renderRow(rowData){
        //console.log("rowData: ", rowData);
        const {grupoEspecie} = rowData.item;
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
            <TouchableOpacity style={{marginVertical: 5}} onPress={()=> this.consultarEspecie(rowData.item.id)}>
                <View>
                    <View style={{flexDirection: 'row',paddingHorizontal: 10,paddingVertical: 1,}}>
                        <Thumbnail source={{uri: ImagenGrupoEspecie}}
                        style={{height:viewportWidth*0.11, width:viewportWidth*0.11, marginRight:15}}></Thumbnail>
                        <View style={styles.footerTextContainer}>
                            <Text style={{fontSize:viewportWidth*.038}}>{rowData.item.nombre}</Text>
                            <Text style={{fontSize:viewportWidth*.038}}>{rowData.item.nombreCient}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    renderProyecto(rowData){
        return (
            <TouchableOpacity style={{marginVertical: 4}} onPress={()=> this.consultarProyecto(rowData.item.id, rowData.item.equipo)} >
                <View>
                    <View style={{flexDirection: 'row',paddingHorizontal: 10,paddingVertical: 1}}>
                        <Thumbnail source={{uri: proyectos}}
                        style={{height:viewportWidth*0.11, width:viewportWidth*0.11, marginRight:15}}></Thumbnail>
                        <Text style={{marginTop:9, fontSize:viewportWidth*.038}} >{rowData.item.nombre}</Text>
                        
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    renderUser(rowData){
        return (
            <TouchableOpacity style={{marginVertical: 4}} onPress={()=> this.consultarUser(rowData.item.id, rowData.item.email)} >
                <View>
                    <View style={{flexDirection: 'row',paddingHorizontal: 10,paddingVertical: 1}}>
                        <Thumbnail source={{uri: uri_foto+rowData.item.email + '/'+ rowData.item.email+ '.jpg'}}
                        style={{height:viewportWidth*0.11, width:viewportWidth*0.11, marginRight:15}}></Thumbnail>
                        <View style={styles.footerTextContainer}>
                            <Text style={{marginTop:9, fontSize:viewportWidth*.038}} >{rowData.item.nombre}</Text>
                            <Text style={{marginTop:9, fontSize:viewportWidth*.038}} >{rowData.item.email}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    filterSearch(text){
        this.setState({text})
        let newData = this.dataFilter(text, this.state.especies);
        let newProy = this.dataFilter(text, this.state.proyectos);
        let newUser = this.dataFilter(text, this.state.usuarios);
        this.setState({
            dataSource: newData,//this.state.dataSource.cloneWithRows(newData),
            isLoaded: true, dataSource_proy: newProy, // this.state.dataSource_proy.cloneWithRows(newProy),
            empty: false, dataSource_user:newUser,
        })
    }
    dataFilter(text, data){
        return data.filter(function(item){
            const itemData = item.nombre.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
    }
    findProyecto(query) {
        this.setState({text})
        let newData = this.dataFilter(text, this.state.proyectos);
        this.setState({
            dataSource_proy: this.state.dataSource_proy.cloneWithRows(newData),
            isLoaded: true,
            empty: false
        })
      }
    renderSeparator = () => {
        return (
          <View style={{width:viewportWidth*.9, height:1.2, backgroundColor: '#c6c6c6', marginLeft: 10, marginRight: 25,borderRadius: 10,
          marginTop:20}} />
        );
      };
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
                <Button transparent onPress={this.submitReady}onPress={() => this.props.navigation.goBack()}>
                <Image style={{width:27, height:27}} source={{uri:goBackIcon}}></Image>
                </Button>
            </Left>
            <Body style={{flex:5,  justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#4D4D4D', fontSize: 18, marginRight: 70, fontWeight: 'bold',}}>
                Explora
                </Text>
            </Body>
            </Header>
            <View style={{flex:1, marginHorizontal:0}}>
                <SearchBar
                    lightTheme
                    icon={{name:'search', color: '#4A4A4A', size:22 }}
                    underlineColorAndroid="transparent"
                    containerStyle={{backgroundColor: 'white',  borderTopWidth:0, borderBottomWidth:0 }}
                    inputStyle={{backgroundColor:'white', marginBottom:0, color:'#4D4D4D', marginLeft:15, paddingRight:16  }}
                    showLoading
                    onChangeText={(text) => this.filterSearch(text)}
                    value={this.state.text}
                    platform="android"
                   cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
                    placeholder='Buscar por especies, personas o proyectos' />
                
                <View style={{height:1, backgroundColor:'#4D4D4D', marginHorizontal:39 }}/>
                {this.state.isLoading ? <ActivityIndicator size="large"/> :
                <View style={{flex:1}}>
                    <View style={{flex:1}} >
                        <FlatList 
                                data={this.state.dataSource}
                                extraData={this.state}
                                style={{flex:1, marginHorizontal: 10}}
                                renderItem={this.renderRow.bind(this)}
                                keyExtractor={item => item.id}
                                ItemSeparatorComponent={ () => <View style={{width:viewportWidth*.8, height:1, backgroundColor: '#c6c6c6', marginLeft: 10, marginRight: 35,borderRadius: 10,
                                marginTop:5}} />}
                                ListHeaderComponent={() => <View><Text>Especies</Text></View> }
                        />
                    </View>
                    <View style={{flex:1, backgroundColor:'#f2f2e1'}}>
                    <FlatList 
                            data={this.state.dataSource_proy }
                            style={{backgroundColor:'#f2f2e1'}}
                            extraData={this.state}
                            style={{flex:1, marginHorizontal: 10}}
                            renderItem={this.renderProyecto.bind(this)}
                            keyExtractor={item => item.id}
                            ItemSeparatorComponent={ () => <View style={{width:viewportWidth*.8, height:1, backgroundColor: '#c6c6c6', marginLeft: 10, marginRight: 35,borderRadius: 10,
                            marginTop:5}} />}
                            ListHeaderComponent={() => <View><Text>Proyectos</Text></View> }
                    />
                    </View> 
                    <View style={{flex:1}} >
                        <FlatList 
                                data={this.state.dataSource_user}
                                extraData={this.state}
                                style={{flex:1, marginHorizontal: 10}}
                                renderItem={this.renderUser.bind(this)}
                                keyExtractor={item => item.id}
                                ItemSeparatorComponent={ () => <View style={{width:viewportWidth*.8, height:1, backgroundColor: '#c6c6c6', marginLeft: 10, marginRight: 35,borderRadius: 10,
                                marginTop:5}} />}
                                ListHeaderComponent={() => <View><Text>Usuarios</Text></View> }
                        />
                    </View>
                </View> }
            {/*    <View style={{flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity>
                        <Image source={{}} />
                    </TouchableOpacity>
        </View>*/}
              {/*  <List containerStyle={{flex:1, borderTopWidth: 0, borderBottomWidth: 0 }}>
                    <FlatList
                    data={this.state.proyectos}
                    extraData={this.state.proyectos}
                    renderItem={({ item }) => (
                        <ListItem
                        //roundAvatar
                        title={item.nombre}
                        subtitle={"equipo: " + item.equipo + " integrantes"}
                        // avatar={{ uri: uri_foto_user+item.email+"/"+item.email+".jpg"}}
                        containerStyle={{ borderBottomWidth: 0 }}
                         //onPress = {() => console.log(item.id)}
                        onPress={() => this.consultarProyecto(item.id, item.equipo) }
                        // rightIcon={<FontAwesome name="check" size={25} style={this.isListPress(item.email) ? {color: '#4A4A4A'} : {color: 'white'}} />}
                        // rightIcon={<FontAwesome name="check" size={25} style={{color: '#4A4A4A'}} />}
                        />
                    )}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={this.renderSeparator}
                    // ListHeaderComponent={this.renderHeader}
                    //  ListFooterComponent={this.renderFooter2}
                    //onRefresh={this.handleRefresh}
                    // refreshing={this.state.refreshing}
                    />
                </List>*/}
               
            </View>
            
          </Container>

        
        );
      }

}

const ProyectoSwag = reduxForm(
  {
    form: "test"
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Explorar);
ProyectoSwag.navigationOptions = {
  header: null
};
export default ProyectoSwag;
