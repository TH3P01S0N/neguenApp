import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Left,
  Right,
  Body,
  View,
} from "native-base";
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import {Image, TouchableOpacity, ActivityIndicator,StyleSheet, FlatList, Dimensions,Platform, Alert, ScrollView} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from "./styles";
import {isGoBack} from "../../actions/goback_action";
import {url_API} from "../../config";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from "react-navigation";
import { ENTRIES1, ENTRIES2 } from './static/entries';
//import SliderEntry from './static/SliderEntry';
const uri = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/images/src";
const amenaza_agregar = uri+"/amenaza_agregar.png";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;// 0.36;
const sliderWidth = viewportWidth;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(1);
const itemWidth = slideWidth + itemHorizontalMargin * 2;

class Amenaza extends Component{
    constructor(props) {
        super(props);
        this.state = {
            amenazas:[], amenazasObject:[], flag: false, loading:false
          };
          this.handle = this.handle.bind(this);
      }
      componentDidMount(){
        var amenaza, amenazaObject = [];
        const {email, values} = this.props.navigation.state.params;
        if(this.props.navigation.state.params.amenaza!='/' ) {
          amenaza = this.props.navigation.state.params.amenaza;
          for (var i = 0, len = amenaza.length; i < len; i++){
            amenazaObject.push(ENTRIES1[amenaza[i]]);
          }
          this.setState({amenazasObject:amenazaObject, amenazas:amenaza});}
       /* if(values){
          console.log("values ", values);
          if(values.amenaza.length>0){
            for (var i = 0, len = values.amenaza.length; i < len; i++){
              amenazaObject.push(values.amenaza[i].index);
            }
            this.setState({amenazasObject:values.amenaza, amenazas:amenazaObject});
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
           {/*<View style={styles.textContainerSelect}>
              <Text style={styles.titleSlider} numberOfLines={1}>Amenaza {item.text}
              </Text>
              </View> */}
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
               
                {/*<View style={styles.textContainer}>                  
                    <Text style={styles.titleSlider}
                      numberOfLines={2}>
                       {item.title}
                    </Text>
                    <View style={styles.cruzContainer}>
                      <View style={styles.cruz}>
                      <MaterialCommunityIcons  name="plus" size={30}
                      style= {{color:'#FFFFFF', marginLeft:5, marginTop:3, zIndex: 10}}/>             
                      </View>
                    </View>
                </View>*/}
            </TouchableOpacity>
    );
    }
      guardar = () => {
        this.setState({loading:true});
        const {ImageSource, modulo, id, keyAvist, localidad } = this.props.navigation.state.params;
        const {email} = this.props.navigation.state.params;
        const {grupoEspecie} = this.props.navigation.state.params;
        const {latitude} = this.props.navigation.state.params;
        const {longitude} = this.props.navigation.state.params; 
        const {especie} = this.props.navigation.state.params;
        const {fecha_nac} = this.props.navigation.state.params;
        const {comentario} = this.props.navigation.state.params;
        var temp,suelo = null;
        if(this.props.navigation.state.params.temp) temp = this.props.navigation.state.params.temp;
         else temp="/";
        if(this.props.navigation.state.params.suelo) suelo = this.props.navigation.state.params.suelo;
         else suelo="/";
       /* if(modulo=="avistamiento"){
          var data = {amenaza: this.state.amenazas, suelo:'no', id:id }
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
          this.setState({loading:false});
          const navigateAction = NavigationActions.navigate({
            routeName: "Mapear",
            params: {fecha_nac:fecha_nac, grupoEspecie: grupoEspecie, ImageSource: ImageSource, id,localidad,
            modulo:modulo,  email: email, grupoEspecie:grupoEspecie, latitude:latitude, longitude:longitude, 
            keyAvist:keyAvist,  especie:especie, amenaza: this.state.amenazas, suelo:suelo, temp:temp, comentario:comentario },
            actions: [NavigationActions.navigate({ routeName: "Mapear" })],
            //actions: [NavigationActions.navigate({ routeName: "Mapa" })]
          })
          this.props.navigation.dispatch(navigateAction);//}
      }
    _handle(index, illustration){
      var amenazaCopy = this.state.amenazasObject;
      var amenazasArray = this.state.amenazas;
      var indice = amenazaCopy.findIndex(function(el){
        return el.index == index;
      });
      var amenazaCopyCopy = amenazaCopy.splice(indice,1);
      var amenazasArrayVopy = amenazasArray.splice(indice,1);
      this.setState({amenazasObject: amenazaCopy, amenazas:amenazasArray });

    }  
    handle(index, illustration, seleccion){
      var amenazaCopy = this.state.amenazasObject;
      var array = {
        index: index, illustration: illustration, seleccion:seleccion
      }
      var found = amenazaCopy.some(function(el){
         return el.index == index;
      });
      if(!found){
        amenazaCopy.push(array);
        var amenazasArray =this.state.amenazas;
        const {navegar} = this.props.navigation.state.params;
        amenazasArray.push(index);
        //console.log("amenazasArray: ", amenazasArray);
        this.setState({amenazas:amenazasArray, amenazasObject:amenazaCopy});
     }
    }
    static navigationOptions = {
        header: null
      };
    /*  _renderItem ({item, index}, parallaxProps) {
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
                Amenazas del entorno
                </Text>
            </Body>
        </Header>
        <View style={{flex:1}}>
            <View style={{flex:1,  alignItems: 'center', marginBottom:0}}>
            
                <Carousel
                  data={ENTRIES1}
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
                  data={this.state.amenazasObject}
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
               {/* <FlatList
                  data={this.state.amenazasObject}
                  extraData={this.state}
                  renderItem={({item}) => 
                    <View style={{flex:1, flexDirection: 'column',marginLeft: 30, marginRight: 30, marginTop: 10, marginBottom: 10}}>
                      <Image style={{width: 48, height: 48, borderRadius: 24,justifyContent: 'center',alignItems: 'center', marginLeft:7}} source={{uri: item.foto}}></Image> 
                      <Text style={styles.titleSlider} numberOfLines={1}>Amenaza {item.text}
                    </Text>
                    </View> 
                  }
                  numColumns = {4}
                  keyExtractor={(item) => item.text}
                />*/}
                </View>
             {/* <View style={{marginLeft: 20, marginRight: 20, marginTop: 0, marginBottom: 50,padding: 0}}>*/}
                  <TouchableOpacity  
                    onPress={this.guardar}             
                    style={{ padding: 10, paddingVertical:15, marginVertical: 15, marginHorizontal:30, alignItems: 'center', backgroundColor: '#ddd93d',
                    borderRadius:5}}>
                   {this.state.loading ? <ActivityIndicator/>:
                    <Text style={{color: '#4A4A4A', textAlign: 'center', fontSize:18}}>
                        Guardar</Text>   }                       
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

export default connect(mapStateToProps, bindActions)(Amenaza);
/*
const AmenazaSwag = reduxForm(
  {
    form: "test"
  },
  function bindActions(dispatch) {
    return {
      setUser: name => dispatch(setUser(name))
    };
  }
)(Amenaza);
AmenazaSwag.navigationOptions = {
  header: null
};
export default AmenazaSwag;*/
