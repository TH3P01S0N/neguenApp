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

class Mapareg extends React.Component {
    constructor() {
        super();
      }
    render() {    
        return (
            <MapView
                style={ styles.map }
                initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
             />
        );
      }

  }

  const MapaSwag = reduxForm(
    {
      form: "test",
    },
    function bindActions(dispatch) {
      return {
        setUser: name => dispatch(setUser(name)),
        openDrawer: () => dispatch(openDrawer())
      };
    }
  )(Mapareg);
  MapaSwag.navigationOptions = {
    header: null
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
      Mapareg: { screen: Mapareg },
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