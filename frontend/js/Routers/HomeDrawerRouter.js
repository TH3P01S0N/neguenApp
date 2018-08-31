import React, { Component } from "react";
import Mapa from "../components/home/";
import BlankPage2 from "../components/blankPage2";
import { DrawerNavigator } from "react-navigation";
import DrawBar from "../components/DrawBar";
export default (DrawNav = DrawerNavigator(
  {
    Mapa: { screen: Mapa },
    BlankPage2: { screen: BlankPage2 }
  },
  {
    //contentComponent: props => <DrawBar {...props} />,
    drawerBackgroundColor: "transparent"
  }
));
