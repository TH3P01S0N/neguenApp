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
import {Image, TouchableOpacity,StyleSheet,  Dimensions,Platform, Alert, ActivityIndicator} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from "react-navigation";
import {url_API} from '../../../config';
import {isGoBack} from "../../../actions/goback_action";

const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const temp_left = uri+"/temp_left.png";
const temp_right = uri+"/temp_right.png";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
const entryBorderRadius = 8;
const slideHeight = viewportHeight * 0.36;// 0.36;
const sliderWidth = viewportWidth;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(1);
const itemWidth = slideWidth + itemHorizontalMargin * 2;
class Edittemp extends Component{
    constructor(props) {
        super(props);
        this.state = {
            temp: 20, id:0, loading:false, fromDrawBar: false
          };
         // this.handle = this.handle.bind(this);
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
    guardar = () => {
      this.setState({loading:true});
      var navegar= "";
            
      var data ={
        temp: this.state.temp, id: this.state.id
      }
      fetch(url_API+'avistamiento/edittemp', {
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
              this.setState({loading: false});
              if(response.success){
                if(this.state.fromDrawBar==false){
                  this.props.isGoBack();
                  this.props.navigation.goBack(); 
                 }      
                 else this.props.navigation.popToTop();
              }
              else {
                console.log("response: ", response);
              }
            })
      
     /* const navigateAction = NavigationActions.navigate({
        routeName: "Mapear",
        params: {fecha_nac:fecha_nac, grupoEspecie: grupoEspecie, ImageSource: ImageSource,
           email: email, grupoEspecie:grupoEspecie, latitude:latitude, longitude:longitude, comentario:comentario,
           especie:especie, amenaza: amenaza, temp:this.state.temp, suelo:suelo },
        actions: [NavigationActions.navigate({ routeName: "Mapear" })],
        //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
      })
      this.props.navigation.dispatch(navigateAction);*/
    }
    componentDidMount(){
      const {values} = this.props.navigation.state.params;
      const {id} = this.props.navigation.state.params; 
      const {fromDrawBar} = this.props.navigation.state.params; 
      this.setState({temp: values, id: id, fromDrawBar:fromDrawBar});
    }
    handleTemp = (value) =>{
      var tempCopy = this.state.temp;
      this.setState({temp: tempCopy+value});
    }
    static navigationOptions = {
        header: null
      };
    render() {
        const { region } = this.props;
        const { navigate } = this.props.navigation;
        //const example2 = this.momentumExample(2, 'Momentum | Left-aligned | Active animation');
        return (
          <Container style={styles.container}>
            <Header  style={styles.header}>
            <Left style={{flex:1}}>
                <Button transparent onPress={this.submitReady}onPress={() => this.props.navigation.goBack()}>
                    <Icon style={{color: '#4A4A4A'}} name="ios-close" size={50} />
                </Button>
            </Left>
            <Body style={{flex:4,  justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#4D4D4D', fontSize:viewportWidth*.04, marginRight: 70, fontWeight: 'bold',}}>
                Temperatura del aire
                </Text>
            </Body>
        </Header>
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            
              
              <View style={{alignItems: 'center',flexDirection: 'row'}}>
                <TouchableOpacity transparent  onPress={ ()=> this.handleTemp(-1) }>
                  <Image source={{uri:temp_left}} style={{height:76, width:viewportWidth*.14} }></Image>
                </TouchableOpacity>
                {(this.state.loading) ?
                <ActivityIndicator/> :
                  <Text style={{color: '#4A4A4A', textAlign: 'center', fontSize:60, fontWeight:"bold", marginLeft:30, marginRight:30}}>{this.state.temp}°</Text>
                 }
                <TouchableOpacity transparent  onPress={ ()=> this.handleTemp(1) }>
                  <Image source={{uri:temp_right}} style={{height:76, width:viewportWidth*.14}}></Image>
                </TouchableOpacity>
              </View>
              <Text style={{color: '#4D4D4D', fontSize:viewportWidth*.04, marginRight: 30,
              textAlign: 'center', marginLeft:30, marginTop:30}}>
                Si tienes información más exacta, usa las flechas
                </Text>
            
            </View>
            {(!this.state.loading) &&
              <View style={{marginLeft: 20, marginRight: 20, marginTop: 0, marginBottom: 50,padding: 20}}>
                  <TouchableOpacity  
                    onPress={this.guardar}             
                    style={{ padding: 10, marginTop: 1, alignItems: 'center', backgroundColor: '#D8D8D8',}}>
                    <Text style={{color: '#4A4A4A', textAlign: 'center', fontSize:18}}>
                        Guardar</Text>                          
                  </TouchableOpacity>
              </View>} 
            
            
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
 // flag: state.goback_reducer.flag
});

export default connect(mapStateToProps, bindActions)(Edittemp);

/*
const EdittempSwag = reduxForm(
  {
    form: "test"
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Edittemp);
EdittempSwag.navigationOptions = {
  header: null
};
export default EdittempSwag;
*/