import React, { Component } from "react";
import { connect } from "react-redux";
import MapView from 'react-native-maps';
import { TabNavigator } from 'react-navigation';
import { DrawerNavigator, NavigationActions, withNavigation } from "react-navigation";
import {
    Button,
    Text,
    Header,
    Body,
    Container,
    Content,
    List,
    ListItem,
    StyleProvider, 
    Title,
    getTheme,
    Icon,
    View,
    Left,
    Right
  } from "native-base";
  import { Field, reduxForm } from "redux-form";
import BlankPage2 from "../blankPage2";
import DrawBar from "../DrawBar";
import ConsultarAvist from "../avistamiento/consultar";
import {StyleSheet, FlatList, AsyncStorage, Image, TouchableOpacity} from 'react-native';
import styles from "./styles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const uri_foto = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/uploads/";

class Listareg extends React.Component {
    constructor(props){
      super(props);
      this.state={
        email:"", amenazasObject:[]
      };
    }
    static navigationOptions = {
        title: 'Home',
      };
    componentDidMount(){
      AsyncStorage.getItem('email').then((email)=>{
        var datas = {email: email}
      fetch('http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/api/avistamiento/misamenazas', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
              body:  JSON.stringify(datas)
          })
          .then(function(response) {
              if (response.status >= 400) {
                throw new Error("Bad response from server");
              }
              return response.json();
          }).then(response=> {
            console.log(response);
            this.setState({email:email, amenazasObject:response});
          })
      });
      //const {email} = this.props.navigation.state.params;
    }
    consultarAvist(idAvist) {
      console.log("consultarAvist");
      const navigateAction = NavigationActions.navigate({
        routeName: "ConsultarAvist",
        params: {idAvist:idAvist, email: this.state.email },
        actions: [NavigationActions.navigate({ routeName: "ConsultarAvist" })],
        //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
      })
      this.props.navigation.dispatch(navigateAction);
    }
    render(){
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <FlatList
                 data={this.state.amenazasObject}
                  extraData={this.state}
                  renderItem={({item}) => 
                    <View style={{flex:1, flexDirection: 'column',marginLeft: 30, marginRight: 30, marginTop: 10, marginBottom: 10}}>
                      <TouchableOpacity onPress={()=> this.consultarAvist(item.id)}>
                        <Image style={{width: 300, height: 200, borderRadius: 14,justifyContent: 'center',alignItems: 'center', marginLeft:7}} source={{uri: uri_foto+this.state.email+"/" +item.foto}}></Image> 
                        <Text style={styles.titleSlider} numberOfLines={1}>Grupo especie {item.nombre}
                      </Text>
                      </TouchableOpacity>
                    </View> 
                  }
                  numColumns = {1}
                  keyExtractor={(item) => item.id}
                /> 
      </View>
      );
    }
  }

  const ListaSwag = reduxForm(
    {
      form: "test",
    },
    function bindActions(dispatch) {
      return {
        setUser: name => dispatch(setUser(name)),
        openDrawer: () => dispatch(openDrawer())
      };
    }
  )(Listareg);
  ListaSwag.navigationOptions = {
    title: <Text>dd</Text>,
    header: <Text>dd</Text>
  };
  function bindAction(dispatch) {
    return {
      setIndex: index => dispatch(setIndex(index)),
      openDrawer: () => dispatch(openDrawer())
    };
  }
  const mapStateToProps = state => ({
    name: state.user.name,
    list: state.list.list
  });
  
  //const editSwagger = connect(mapStateToProps, bindAction)(Editprofile);
  
  const DrawNav = DrawerNavigator(
    {
      Listareg: { screen: Listareg },
      BlankPage2: { screen: BlankPage2 }
    },
    {
      contentComponent: props => <DrawBar {...props} />
    }
  );
  const DrawerNav = null;
  DrawNav.navigationOptions = ({ navigation }) => {
    DrawerNav = navigation;
    return {
      header: null
    };
  };
  export default DrawNav;