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
  Thumbnail,
  Row
} from "native-base";
import { Field, reduxForm } from "redux-form";
import {TextInput, FlatList,Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Dimensions, ActivityIndicator, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {  List, ListItem } from 'react-native-elements';
import GeoFencing from 'react-native-geo-fencing';
import { isGoBack } from "../../../actions/goback_action";
import { isGoBackOff } from "../../../actions/goback_action_off";
import {url_API} from '../../../config';
var moment = require('moment');
var esMoment = require('moment/locale/es.js');
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const uri_foto = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/uploads/";
function inside(point, vs) {
    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};
class ShowAvist extends Component {
    constructor(props){
      super(props);
      this.state={
        nombre:"", loading:false, avistamientos:[], likes:[],comentarios:[],loadingComent:false
      };
      this.fetchData = this.fetchData.bind(this);
    }
    static navigationOptions = {
      header: null
    };
    
    fetchProy(){

        const {id, values} = this.props.navigation.state.params;
        var data = {id:id};
        this.setState({loading:true});
        fetch(url_API+'proyecto/proyectoAvist', {
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
            console.log("response show avist proy: ", response);
            var avistamiento_copy = response.avistamientos;
            var avistamiento = [];
            var listEspecies = values.listEspecies;
            var avistamientos= [];
            var likes = response.likes;
            var likes_var = {mg:0, email_like:""};
            var comentarios = response.comentarios;
            var coment_var = [];
            
            var polygon = [];
            var ubicacion = values.ubicacion[0].coordinates;
            for (var z = 0, len_p = ubicacion.length ; z < len_p; z++){
                const item = [ubicacion[z].latitude,ubicacion[z].longitude];
                polygon.push(item);
            }
            for (var x = 0, _len = avistamiento_copy.length ; x < _len; x++){
                for(var y = 0, __len = listEspecies.length ; y < __len; y++){
                    if(avistamiento_copy[x].idEspecie==listEspecies[y].id){
                        let point = [avistamiento_copy[x].latitude,
                            avistamiento_copy[x].longitude ];
                            if( inside(point, polygon)){

                                avistamiento.push(avistamiento_copy[x]); 
                                
                                for (var j = 0, len_ = likes.length ; j < len_; j++){
                                    if(avistamiento_copy[x].idAvist==likes[j].id ){
                                        likes_var.mg=likes[j].mg;
                                        likes_var.email_like=likes[j].email_like;
                                        break;
                                    }                       
                                }
                                for(var l = 0, len__ = comentarios.length ; l < len__; l++){
                                    if(avistamiento_copy[x].idAvist==comentarios[l].idPost){
                                        coment_var.push(comentarios[l]);
                                    }
                                }
                                var array = {idAvist:avistamiento_copy[x].idAvist, abrirComentario:false,
                                    fecha:avistamiento_copy[x].fecha, foto:avistamiento_copy[x].foto, comentario:"",
                                    localidad:avistamiento_copy[x].localidad, email:avistamiento_copy[x].email, idGrupoEspecie:avistamiento_copy[x].idGrupoEspecie,
                                     nombre:avistamiento_copy[x].nombre,likes:likes_var, longitude:avistamiento_copy[x].longitude, latitude: avistamiento_copy[x].latitude,
                                     comentarios:coment_var  }
                                console.log("array ", array);
                                avistamientos.push(array);
                                likes_var={mg:0, email_like:""};
                                coment_var= [];}
                                         
                    }
                }
            }
          /*  console.log("avis" ,avistamiento)
            for (var i = 0, len = avistamiento.length ; i < len; i++){
                for (var j = 0, len_ = likes.length ; j < len_; j++){
                    if(avistamiento[i].idAvist==likes[j].id ){
                        likes_var.mg=likes[j].mg;
                        likes_var.email_like=likes[j].email_like;
                        break;
                    }                       
                }
                for(var l = 0, len__ = comentarios.length ; l < len__; l++){
                    if(avistamiento[i].idAvist==comentarios[l].idPost){
                        coment_var.push(comentarios[l]);
                    }
                }
                var array = {idAvist:avistamiento[i].idAvist, abrirComentario:false,
                    fecha:avistamiento[i].fecha, foto:avistamiento[i].foto, 
                    localidad:avistamiento[i].localidad, email:avistamiento[i].email, idGrupoEspecie:avistamiento[i].idGrupoEspecie,
                     nombre:avistamiento[i].nombre,likes:likes_var, longitude:avistamiento[i].longitude, latitude: avistamiento[i].latitude,
                     comentarios:coment_var  }
               // console.log(array);
                avistamientos.push(array);
                likes_var={mg:0, email_like:""};
                coment_var= [];
            }*/
            console.log(avistamientos)
           this.setState({avistamientos, likes, nombre:values.nombre, loading:false});
        })
    }




    fetchData(){
        const {id, values} = this.props.navigation.state.params;
        console.log("values ", values);
        var data = {id:id};
        this.setState({loading:true});
        fetch(url_API+'especie/showavist', {
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
            console.log("response show avist: ", response);
            var avistamiento = response.avistamientos;
            var avistamientos= [];
            var likes = response.likes;
            var likes_var = {mg:0, email_like:""};
            var comentarios = response.comentarios;
            var coment_var = [];
            for (var i = 0, len = avistamiento.length ; i < len; i++){
                for (var j = 0, len_ = likes.length ; j < len_; j++){
                    if(avistamiento[i].idAvist==likes[j].id ){
                        likes_var.mg=likes[j].mg;
                        likes_var.email_like=likes[j].email_like;
                        break;
                    }                       
                }
                for(var l = 0, len__ = comentarios.length ; l < len__; l++){
                    if(avistamiento[i].idAvist==comentarios[l].idPost){
                        coment_var.push(comentarios[l]);
                    }
                }
                var array = {idAvist:avistamiento[i].idAvist, abrirComentario:false, comentario:"",
                    fecha:avistamiento[i].fecha, foto:avistamiento[i].foto, 
                    localidad:avistamiento[i].localidad, email:avistamiento[i].email, idGrupoEspecie:avistamiento[i].idGrupoEspecie,
                     nombre:avistamiento[i].nombre,likes:likes_var, longitude:avistamiento[i].longitude, latitude: avistamiento[i].latitude,
                     comentarios:coment_var  }
               // console.log(array);
                avistamientos.push(array);
                likes_var={mg:0, email_like:""};
                coment_var= [];
            }
            console.log(avistamientos)
            this.setState({avistamientos, likes, nombre:values.nombre, loading:false});
        })
    }
    abrirComentario(index){
        var {avistamientos} = this.state;
        for (var i = 0, len = avistamientos.length ; i < len; i++){
            avistamientos[i].abrirComentario= false;
        }
        avistamientos[index].abrirComentario= !avistamientos[index].abrirComentario;    
        this.setState({avistamientos});
    }
    MeGusta = (email_like, email, index) => {
        var liked = false;
        var email_copy = email;
        var {avistamientos} = this.state;
        if(email_like==email) {
            liked=true;
            email_copy="";
        }
        var likes_temp=0;
        var like_url="likes/";
        if(liked){ 
          likes_temp=-1;
          like_url=like_url+"deletelike";
        }
        else{
          like_url=like_url+"insertLike";  
          likes_temp=1;
        }
        avistamientos[index].likes.mg=avistamientos[index].likes.mg+likes_temp;
        avistamientos[index].likes.email_like=email_copy;
        console.log("new avist ", avistamientos);
        this.setState({avistamientos});
       // this.setState({ likes:this.state.likes+likes_temp, liked: !this.state.liked});
        var data={email: email, idPost:avistamientos[index].idAvist, categoria:'A'};
        console.log("like data ", data);
        fetch(url_API+like_url, {
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
                      console.log("response like: ", response);
                  })
      }
    VerAvistMapa (Avist) {
        const { values} = this.props.navigation.state.params;
        const navigateAction = NavigationActions.navigate({
          routeName: "verAvistMap",
          params: {Avist, email: this.state.email, ubicacion:values.ubicacion, nombre:this.state.nombre },
          actions: [NavigationActions.navigate({ routeName: "verAvistMap" })],
          //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
        })
        this.props.navigation.dispatch(navigateAction);
      }
    componentDidMount() {
        const { modulo, values} = this.props.navigation.state.params;
        if(modulo=='proyecto')
            this.fetchProy();
        else
            this.fetchData()
    
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
    onChangeComentario = (text, index)=> {
        var {avistamientos} = this.state;
        avistamientos[index].comentario= text;
        this.setState({avistamientos});
    }
    insertComentario (index) {
        var idAvist = this.state.avistamientos[index].idAvist;
        const { email} = this.props.navigation.state.params;
        var descripcion = this.state.avistamientos[index].comentario;
        var {avistamientos} = this.state;
        var comentarios = avistamientos[index].comentarios;
        this.setState({loadingComent:true});
        var data = {email:email ,idPost:idAvist, descripcion, categoria:'A'} 
        fetch(url_API+'comentario/insertcomentario', {
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
              console.log("response comentario: ", response);
              var idInsert = response.result.insertId;
              console.log("index ", index);
              //comentariosUntouched.push({id:index,idUsuario:idUsuario, nombre:nombreUser, email:email, idPost:idProyecto, descripcion: ingresarComentario  });
              //var date = moment().format('DD-MM-YYYY HH:mm');
              if( comentarios.length==0){
                comentarios.push({id:idInsert, nombre:response.nombreUser, idPost:idAvist, descripcion: descripcion });
              }
              else{
              comentarios.unshift({id:idInsert, nombre:response.nombreUser,  idPost:idAvist, descripcion: descripcion   });
              }
              avistamientos[index].comentarios=comentarios;
              avistamientos[index].comentario='';
              avistamientos[index].abrirComentario=false;
              console.log("avist coment ", avistamientos);
              this.setState({avistamientos,  loadingComent:false});
          })
        //var index = (Math.floor(Math.random()*99999999)+10000000);
        
      }
    render(){
        const {nombre, avistamientos, loading} = this.state;
        const { email} = this.props.navigation.state.params;
        return(
        <Container style={styles.container}>
            <Header  style={styles.header}>
            <Left style={{flex:1}}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="ios-arrow-back" style= {{color: '#8c8c8c'}} />
                </Button>
            </Left>
            <Body style={{flex:4,  justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
            <Text style={{color: '#1E1E32', fontSize: viewportHeight*.025 , textAlign:'center', fontWeight:'bold' }}>{nombre}</Text>                
            </Body>

            <Right style={{flex:1}}>
                <Button transparent onPress={this.guardar}>
                    <Image source={{uri:uri+"/neguen.png"}} style={{width:15, height:23.2}}  /></Button>
            </Right>
            </Header>
            <ScrollView style={{flex:1}}>
               {loading ?
               <ActivityIndicator size="large"/> : 
                <FlatList
                    data={avistamientos}
                    extraData={this.state}
                    style={{flex:1}}
                    renderItem={({item, index}) => 
                        <View style={{flex:1, flexDirection: 'column',  paddingTop:10}}>
                        <View>
                            <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', marginHorizontal:20, paddingBottom:10, marginTop:0}}>
                                <View style={{flexDirection:'row'}}>
                                    <Image source={{uri: uri_foto+item.email+"/"+item.email+".jpg"}} style={{width:viewportWidth*.14, height:viewportWidth*.14, borderRadius:viewportWidth*.07,  borderColor: '#DEDA3E' ,borderWidth:1.5}} />
                                        <View style={{ flexDirection:'column', marginLeft:10, marginTop:5}}>
                                            <Text style={{color: '#1E1E32', fontSize: 14.5}} numberOfLines={1}>{item.nombre}</Text>
                                            <Text style={{color: '#787878', fontSize: 14.5}} numberOfLines={1}>{item.localidad}</Text>
                                        </View>
                                </View>
                            <TouchableOpacity onPress={() => this.VerAvistMapa(item) } >    
                                <Image source={{uri: uri+"/customMarker2.png"}} style={{marginLeft:20, width:22, height:25.2, marginTop:7}}/>                                     
                            </TouchableOpacity>
                            </View>
                            <Image style={{width: viewportWidth, height: viewportHeight*0.46,justifyContent: 'center',alignItems: 'center'}} source={{uri: uri_foto+item.email+"/" +item.foto}}></Image> 
                        </View>
                        <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:15}}>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{color: '#FA511D', fontSize: 14.1, marginLeft:25}} numberOfLines={1}>{item.likes.mg}</Text>
                                <TouchableOpacity onPress={() => this.MeGusta(item.likes.email_like, email, index)} activeOpacity={1}>
                                    {item.likes.email_like == email ?
                                    <Image source={{uri: uri+"/liked.png"}} style={{height:22, width:22, marginLeft:3 }}></Image>:
                                    <Image source={{uri: uri+"/like.png"}} style={{marginLeft:3, width:22, height:22}}/> }
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.abrirComentario(index)  }>
                                    <Image source={{uri: uri+"/coment.png"}} style={{marginLeft:10, width:22, height:22}}/>  
                                </TouchableOpacity>
                            </View>
                            <Text style={{color: '#787878', fontSize: 14.1,  marginRight:20}} numberOfLines={1}>{item.fecha}</Text>

                        </View>
                        {item.abrirComentario &&
                            <View style={{flex:1, marginTop:3, flexDirection:"row", justifyContent: 'space-between', paddingHorizontal:20, borderBottomColor:'#DEDA3E', borderBottomWidth:1.6, borderTopColor:'#DEDA3E', borderTopWidth:1.6}}>
                            <TextInput underlineColorAndroid='#c4c4c4' style={{flex:1,fontSize:viewportWidth*.035,  marginVertical:0}}  enablesReturnKeyAutomatically={true}
                              placeholder={"Comenta aquí"} placeholderTextColor="#DEDA3E" underlineColorAndroid='rgba(0,0,0,0)'
                              value={item.comentario} onChangeText={text => this.onChangeComentario(text,index)}>
                            </TextInput>
                           {item.comentario.length>0 &&  <TouchableOpacity onPress={() => this.insertComentario(index)} disabled={this.state.loadingComent} >{this.state.loadingComent ? <ActivityIndicator/> :
                            <Image source={ {uri:uri+'/avioncito.png'}} style={{width:viewportWidth*.065, height:viewportWidth*.065, marginTop:30}}></Image>}</TouchableOpacity>
                      }</View>

                        }
                        {item.comentarios && <FlatList
                            contentContainerStyle={{flexGrow: 1, marginTop:10 }}
                            data={item.comentarios}
                            extraData={this.state}
                            renderItem={({item})=>
                            <View style={{  flexDirection:'row', marginHorizontal:20}}>
                                <Text style={{color: '#1E1E32',  fontSize: 14.1}}> {item.nombre}  </Text>
                                <Text style={{color: '#787878', fontSize: 14.1}}>{item.descripcion}</Text>
                                
                            </View>
                            }
                            keyExtractor={(coments) => coments.id}
                            ListFooterComponent={() => <View style={{marginVertical:10}}/>}
                        /> } 
                            {/*item.abrirComentario &&
                                <View style={{flex:1, marginTop:8, flexDirection:"row", justifyContent: 'space-between', paddingHorizontal:20, borderBottomColor:'#DEDA3E', borderBottomWidth:1.6, borderTopColor:'#DEDA3E', borderTopWidth:1.6}}>
                                    <TextInput underlineColorAndroid='#c4c4c4' style={{flex:1,fontSize:viewportWidth*.035,  marginVertical:10}}  enablesReturnKeyAutomatically={true}
                                        placeholder={"Comenta aquí"} placeholderTextColor="#DEDA3E" underlineColorAndroid='rgba(0,0,0,0)'
                                        value={this.state.ingresarComentario} onChangeText={ingresarComentario => this.setState({ingresarComentario})}>
                                    </TextInput>
                                    {this.state.ingresarComentario.length>0 &&  <TouchableOpacity onPress={() => this.insertComentario()} disabled={this.state.loadingComent} >{this.state.loadingComent ? <ActivityIndicator/> :
                                    <MaterialCommunityIcons name={'send'}style= {{color: '#ddd93d', marginTop:10}} size={23}/>}</TouchableOpacity>
                                }</View>*/}
                        </View> 
                    }
                    numColumns = {1}
                    ItemSeparatorComponent={() => <View style={{height:1, opacity:0.4,  width:viewportWidth, backgroundColor:'#BEBEBE'}}/> }
                    keyExtractor={(item) => item.idAvist}
                /> }
            </ScrollView>
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
  )(ShowAvist);
  ProyectoSwag.navigationOptions = {
    header: null
  };
  export default ProyectoSwag;