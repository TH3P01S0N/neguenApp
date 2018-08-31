import React, { Component } from "react";


import styles from "./styles";

import Acerca from "../components/Acerca/";
import StartScreen from "../components/StartScreen/";
import Avistamiento from "../components/avistamiento/";
import Condiciones from "../components/register/condiciones";
import Mapear from "../components/avistamiento/mapear";
import Amenaza from "../components/avistamiento/amenaza";
import Suelo from "../components/avistamiento/suelo";
import Temperatura from "../components/avistamiento/temperatura";
import Terminar from "../components/avistamiento/terminar";
import ConsultarAvist from "../components/avistamiento/consultar/";
import Edittemp from "../components/avistamiento/consultar/editTemp";
import EditGrupos from "../components/avistamiento/consultar/editGrupos";
import Editubica from "../components/avistamiento/consultar/editUbica";
import DeleteAvist from "../components/avistamiento/consultar/deleteAvist";
import EditEspecie from "../components/avistamiento/consultar/editEspecie";
import Login from "../components/login/";
import Register from "../components/register/";
import Welcome from "../components/welcome/";
import Amapear from "../components/Amapear/";
import Mapa from "../components/home/";
import Registros from "../components/registros/";
import BlankPage from "../components/blankPage";
import HomeDrawerRouter from "./HomeDrawerRouter";
import Editprofile from "../components/editprofile/";
import Donde from "../components/avistamiento/donde/";
import Cuando from "../components/avistamiento/cuando/";
import Proyecto from "../components/proyecto/";
import Nombre from "../components/proyecto/nombre/";
import Objetivos from "../components/proyecto/nombre/objetivo";
import Especie from "../components/proyecto/nombre/especie";
import Equipo from "../components/proyecto/nombre/equipo";
import ShowAvistMapProy from "../components/proyecto/consultar/showAvistMap";
import Area from "../components/proyecto/donde/";
import Grupo from "../components/proyecto/grupo/";
import Crear from "../components/proyecto/crear";
import Grupo_e from "../components/especie/grupo/";
import Area_e from "../components/especie/donde/";
import ConsultarProyecto from "../components/proyecto/consultar";
import Imagen_e from "../components/especie/imagen_e/imagen_e";
import Descripcion_e from "../components/especie/grupo/descripcion";
import Procedencia from "../components/especie/grupo/procedencia";
import Terminar_e from "../components/especie/grupo/terminar_e";
import ConsultarEspecie from "../components/especie/consultar";
import ShowAvist from "../components/especie/consultar/showAvist";
import ShowAvistMap from "../components/especie/consultar/showAvistMap";
import verAvistMap from "../components/especie/consultar/verAvistMap";
import Explorar from "../components/explorar";
import ConsultarUser from "../components/explorar/consultar";


import { StackNavigator, SwitchNavigator, NavigationActions, TabNavigator } from "react-navigation";
HomeDrawerRouter.navigationOptions = ({ navigation }) => ({
  header: null
});
 export default AppStack =  StackNavigator({
  
  StartScreen: {screen: StartScreen},
  Login: {screen: Login},
  Mapa: { screen: Mapa },
  BlankPage: { screen: BlankPage },  
  Register: {screen: Register},
  Avistamiento: {screen: Avistamiento},
  Welcome: {screen: Welcome},
  Condiciones: {screen: Condiciones},
  Amapear: {screen: Amapear},
  'Mis registros': {screen: Registros},
  Donde: {screen: Donde},
  Cuando: {screen: Cuando},
  Proyecto: {screen: Proyecto},
  ConsultarProyecto: {screen: ConsultarProyecto},
  Nombre: {screen: Nombre},
  Objetivos: {screen: Objetivos},
  Area: {screen: Area},
  Grupo: {screen: Grupo},
  Especie: {screen: Especie},
  Equipo: {screen: Equipo},
  Crear: {screen: Crear},
  Grupo_e: {screen: Grupo_e},
  Imagen_e: {screen: Imagen_e},
  Descripcion_e: {screen: Descripcion_e},
  Area_e: {screen: Area_e},
  Terminar_e: {screen: Terminar_e},
  Procedencia: {screen: Procedencia},
  ConsultarEspecie: {screen: ConsultarEspecie},
  ShowAvist: {screen: ShowAvist},
  ShowAvistMap: {screen: ShowAvistMap},
  ShowAvistMapProy: {screen: ShowAvistMapProy},
  verAvistMap: {screen: verAvistMap},
  Mapear: {screen: Mapear},
  Amenaza: {screen: Amenaza},
  Temperatura: {screen: Temperatura},
  Suelo: {screen: Suelo},
  Terminar: {screen: Terminar},
  ConsultarAvist: {screen: ConsultarAvist},
  Edittemp: {screen: Edittemp},
  EditGrupos: {screen: EditGrupos},
  Editubica: {screen: Editubica},
  EditEspecie:{screen: EditEspecie},
  Explorar: {screen: Explorar},
  ConsultarUser: {screen: ConsultarUser},
  DeleteAvist: {screen: DeleteAvist},     
  "Acerca de Neguen": {screen: Acerca},
  'Editar perfil': {screen: Editprofile}
  
});
 /*export const AuthStack = StackNavigator({
   Login: {screen: Login},
   Register: {screen: Register}
    });

export default SwitchNav = SwitchNavigator({
    Auth: AuthStack,
    App: AppStack, 
  });
*/
 
