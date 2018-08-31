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
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import {Image, ActivityIndicator,TouchableOpacity,StyleSheet,Aler, FlatList, Dimensions,Platform, Alert, ScrollView} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import stiles from "./static/SliderEntry.style";
import {isGoBack} from "../../actions/goback_action";
import {url_API} from "../../config";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from "react-navigation";
import { ENTRIES1, ENTRIES2 } from './static/entries';
//import SliderEntry from './static/SliderEntry';
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const amenaza_agregar = uri+"/suelo_agregar.png";
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
class Suelo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            suelos:[], suelosObject:[], flag: false, loading:false
          };
          this.handle = this.handle.bind(this);
      }
      componentDidMount(){
      var suelo, suelosObject = [];
      const {email, values} = this.props.navigation.state.params;
      if(this.props.navigation.state.params.suelo!='/'){// && !values) {
        suelo = this.props.navigation.state.params.suelo;
        for (var i = 0, len = suelo.length; i < len; i++){
          suelosObject.push(ENTRIES2[suelo[i]]);
        }
        this.setState({suelosObject:suelosObject, suelos:suelo});}
       /* if(values){
          //console.log("values ", values);
          if(values.suelo.length>0){
            for (var i = 0, len = values.suelo.length; i < len; i++){
              suelosObject.push(values.suelo[i].index);
            }
            this.setState({suelosObject:values.suelo, suelos:suelosObject});
          }
        }*/
      }
      static propTypes = {
        name: React.PropTypes.string,
        index: React.PropTypes.number,
        list: React.PropTypes.arrayOf(React.PropTypes.string),
        openDrawer: React.PropTypes.func,
        isGoBack: React.PropTypes.func
      };
    isGoBack() {
        this.props.isGoBack(true);
    }
      _renderItem = ({item, index}) => {
        return (
          <TouchableOpacity 
            onPress={() => this._handle(item.index, item.illustration) } >
            <Image style={{height: itemWidth*.35, width: itemWidth*.305, 
            resizeMode: 'cover'}} source={{uri: item.seleccion}}></Image>
          </TouchableOpacity>
        );
      }
      renderItem = ({item, index}) => {
        const eve = ((index + 1) % 2 === 0);
        var even = null;
        if(eve==0) even=false;
        else even=true;
      return (
       /* <Image style={{width:200, height:200}} source={{ uri: item.illustration }} />*/
       <TouchableOpacity
       activeOpacity={1}           
       style={styles.imageContenedor}
       onPress={() => this.handle(index, item.illustration, item.seleccion) }>
        
         {/*  <View style={styles.imageContainer}>*/}
           <View style={{elevation:5}}>
             <Image style={styles.image} 
             source={{ uri: item.illustration }} />
              <Image style={styles.imageAgregar} source={{uri:amenaza_agregar}}></Image>
           </View>
            </TouchableOpacity>
    );
    }
      guardar = () => {
        this.setState({loading:true});
        const {ImageSource, modulo, id,keyAvist, localidad} = this.props.navigation.state.params;
        const {email} = this.props.navigation.state.params;
        const {grupoEspecie} = this.props.navigation.state.params;
        const {latitude} = this.props.navigation.state.params;
        const {longitude} = this.props.navigation.state.params; 
        const {especie} = this.props.navigation.state.params;
        const {fecha_nac} = this.props.navigation.state.params;
        const {comentario} = this.props.navigation.state.params;
        var amenaza,temp = null;
       /* if(modulo=="avistamiento"){
          var data = {amenaza: this.state.suelos, suelo:'si', id:id }
          fetch( url_API + 'avistamiento/editamenaza', {
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
              if(modulo=="avistamiento"){
                this.props.isGoBack();
                this.props.navigation.goBack();
              }
            }
            else {}
          })
        } else{*/
          if(this.props.navigation.state.params.temp) temp = this.props.navigation.state.params.temp;
         /* else if(values){ temp=values.temp;}*/ else temp="/";
          if(this.props.navigation.state.params.amenaza) amenaza = this.props.navigation.state.params.amenaza;
         // else if(values){
         //   amenaza=values.amenaza;}
            else  amenaza="/";
          this.setState({loading:false});
          const navigateAction = NavigationActions.navigate({
            routeName: "Mapear",
            params: {fecha_nac:fecha_nac, grupoEspecie: grupoEspecie, ImageSource: ImageSource, localidad,
             modulo:modulo, email: email, grupoEspecie:grupoEspecie, latitude:latitude, longitude:longitude, 
            keyAvist:keyAvist, id, especie:especie, suelo: this.state.suelos, amenaza:amenaza, temp:temp, comentario:comentario },
            actions: [NavigationActions.navigate({ routeName: "Mapear" })],
            //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
          })
          this.props.navigation.dispatch(navigateAction);//}
      }
    _handle(index, illustration){
      var sueloCopy = this.state.suelosObject;
      var sueloArray = this.state.suelos;
      var indice = sueloCopy.findIndex(function(el){
        return el.index == index;
      });
      var sueloCopyCopy = sueloCopy.splice(indice,1);
      var sueloArraycopy = sueloArray.splice(indice,1);
      this.setState({suelosObject: sueloCopy, suelos:sueloArray });
    }  
    handle(index, illustration,seleccion){
      var sueloCopy = this.state.suelosObject;
      var array = {
        index: index, foto: illustration, seleccion:seleccion
      }
      var found = sueloCopy.some(function(el){
         return el.index == index;
      });
      if(!found){
        sueloCopy.push(array);
        var sueloArray =this.state.suelos;
        const {navegar} = this.props.navigation.state.params;
        sueloArray.push(index);
        //console.log("amenazasArray: ", amenazasArray);
        this.setState({suelos:sueloArray, suelosObject:sueloCopy});
        //Alert.alert(`You've clicked '${index}' y '${navegar}'`);      
      // console.log("amenazaObject: ", amenazaCopy);
     }
    }
    static navigationOptions = {
        header: null
      };
   /*   _renderItem ({item, index}, parallaxProps) {
        return (
          <Image
              source={{ uri: item.illustration }}
              style={styles.image}
            />          
      );
    }*/
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
                <Text style={{color: '#4D4D4D', fontSize: 18, marginRight: 70, fontWeight: 'bold',}}>
                Características del suelo
                </Text>
            </Body>
        </Header>
        <View style={{flex:1}}>
            <View style={{flex:1,  alignItems: 'center'}}>
            
                <Carousel
                  data={ENTRIES2}
                  renderItem={this.renderItem}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth*.7}
                  inactiveSlideScale={0.7}
                  inactiveSlideOpacity={0.7}
                  enableMomentum={true}
                  activeSlideAlignment={'center'}
                  containerCustomStyle={{flexGrow: 0,marginTop: 2, marginBottom:10}}
                  contentContainerCustomStyle={{paddingVertical: 10}}
                  activeAnimationType={'spring'}
                  activeAnimationOptions={{
                      friction: 4,
                      tension: 40
                  }}
                />
                <View style={{width:viewportWidth*.8, height:1.5, backgroundColor: '#c6c6c6', marginLeft: 10, marginRight: 10,borderRadius: 10}} />
                <Carousel
                  data={this.state.suelosObject}
                  renderItem={this._renderItem}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth*.34}
                  itemHeight= {50}
                  inactiveSlideScale={0.9}
                  inactiveSlideOpacity={0.7}
                  enableMomentum={true}
                  activeSlideAlignment={'center'}
                  containerCustomStyle={{flexGrow: 0,marginTop: 10}}
                  contentContainerCustomStyle={{paddingVertical: 0, marginBottom:0}}
                  activeAnimationType={'spring'}
                  activeAnimationOptions={{
                      friction: 4,
                      tension: 40
                  }}
                />
                </View>
             
                  <TouchableOpacity  
                    onPress={this.guardar}             
                    style={{padding: 10, paddingVertical:15, marginVertical: 15, marginHorizontal:30, alignItems: 'center', backgroundColor: '#ddd93d',
                    borderRadius:5 }}>
                    <Text style={{color: '#4A4A4A', textAlign: 'center', fontSize:18}}>
                        Guardar</Text>                          
                    </TouchableOpacity>
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

export default connect(mapStateToProps, bindActions)(Suelo);
/*const SueloSwag = reduxForm(
  {
    form: "test"
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Suelo);
SueloSwag.navigationOptions = {
  header: null
};
export default SueloSwag;*/
