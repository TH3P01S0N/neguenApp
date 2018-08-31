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
const goBackIcon = uri+"/goBack.png";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const entryBorderRadius = 8;
const slideHeight = viewportHeight * 0.36;// 0.36;
const sliderWidth = viewportWidth;

class DeleteAvist extends Component{
    constructor(props) {
        super(props);
        this.state = {
             id:0, loading:false, fromDrawBar:false, email:""
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
      //this.props.navigation.popToTop()
      this.setState({loading:true});
      var data ={
         id: this.state.id
      }
      fetch(url_API+'avistamiento/delete_avist', {
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
                //this.props.isGoBack();
                //this.props.navigation.goBack(); 
                var navegar= "";
                if(this.state.fromDrawBar==false) navegar="Mapa";
                else navegar="RegistrosTab";
               const actionToDispatch = NavigationActions.reset({
                index: 0,
                key: null,
                actions: [NavigationActions.navigate({ routeName: navegar, params: {email: this.state.email} })],
              //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
                })
                this.props.navigation.dispatch(actionToDispatch)       
              }
              else {
                console.log("response: ", response);
              }
            })
    }
    componentDidMount(){
      const {fromDrawBar} = this.props.navigation.state.params;
      const {id} = this.props.navigation.state.params; 
      const {email} = this.props.navigation.state.params;
      this.setState({ id: id, fromDrawBar:fromDrawBar, email:email});
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
                  <Image style={{width:30, height:30}} source={{uri:goBackIcon}}></Image>
                </Button>
            </Left>
            <Body style={{flex:4,  justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#4D4D4D', fontSize:viewportWidth*.04, marginRight: 70, fontWeight: 'bold',}}>
                Editar avistamiento
                </Text>
            </Body>
        </Header>
        <View style={{}}>
            
            {(!this.state.loading) &&
              <View style={{ marginTop: 20, marginBottom: 50,padding: 0}}>
                  <TouchableOpacity  
                    onPress={this.guardar}             
                    style={{ paddingLeft: 20,  paddingTop: 15, paddingBottom:15, backgroundColor: 'transparent', borderTopWidth:1, borderBottomWidth:1, borderTopColor: '#D8D8D8',
                    borderBottomColor:'#D8D8D8' }}>
                    <Text style={{color: '#4A4A4A', textAlign: 'left', fontSize:18}}>
                        Eliminar</Text>                          
                  </TouchableOpacity>
              </View>} 
          </View> 
            
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

export default connect(mapStateToProps, bindActions)(DeleteAvist);

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