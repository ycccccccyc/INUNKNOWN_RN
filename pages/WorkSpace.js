import React, {Component, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  TouchableHighlight,
  Alert,
  ScrollView,
  ActivityIndicator,
  Animated,
  FlatList,
  Slider
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import {StyleTranfer} from '../scripts/style_transfer';
import {imageToBase64, base64ImageToTensor, tensorToImageUrl, resizeImage, toDataUri} from '../scripts/image_utils';


import ChooseContentInModel from '../components/Modal/ChooseContentInModel';

import SingleTransferController from '../components/WorkSpace/SingleTransferController';
import MultiTransferController from '../components/WorkSpace/MultiTransferController';

import styleList from '../constant/styleList'


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;


class ModeNaviHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0)
    };

    this._translateX = this.state.fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-27, 27] // 两个位置下，线条距离左边框的长度
    });
  }

  animateToMode1() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 0,
        duration: 200,
        useNativeDriver: false
      }
    ).start();
  }

  animateToMode2() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 200,
        useNativeDriver: false
      }
    ).start();
  }

  render() {
    return (
      <Animated.View style={[
        styles.modeNaviHandler,
        {
          transform: [
            { translateX: 0 },
            { translateX: this._translateX },  
            { translateX: 0 }
          ]
        }
      ]} />
    );
  }
}

export default class WorkSpacePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTfReady: false,
      selectedContentImg: false,
      selectedContentImgMulti: false,
      // 内容图
      contentImg: {
        url: '',
        width: 0,
        height: 0
      },
      contentImgMulti: {
        url: '',
        width: 0,
        height: 0
      },
      // 展示的图
      displayImg: {
        url: '',
        width: 0,
        height: 0
      },
      displayImgMutil: {
        url: '',
        width: 0,
        height: 0
      },
      // 默认风格列表
      styleList: styleList,

      styleIndexSelected: 0,                    // 选择的风格图的下标
      styleIndexSelectedMuti: [],
      cameraType: Camera.Constants.Type.back,   // 相机类型(expo-camera需要用到)
      isLoading: true,                          // 逻辑处理的标志,最初表示模型等的加载
      imgTransferred: false,                     // 图像已经被成功转换
      imgTransferredMulti: false,

      transferMode: 0,                          // 风格化模式：一对一-多对一

      showChooseContentInModel: false
    };

    // 初始化工作
    this.styler = new StyleTranfer();
    this.ImagePicker = require('react-native-image-picker');
    this.uploadOptions = {
      title: '选择图片',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '相册',
      cameraType: 'back',
      mediaType: 'photo',
      videoQuality: 'high',
      durationLimit: 10,
      maxWidth: 720,
      maxHeight: 1280,
      aspectX: 2,
      aspectY: 1,
      quality: 1,
      angle: 0,
      allowsEditing: false,
      noData: false,
      customButtons: [
        {name:  'hangge' , title:  'hangge.com图片' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images' // 存储本地地址
      }
    };

    this.modeNaviRef = React.createRef();
    this.modeContainerRef = React.createRef();
    this.chooseContentInModelRef = React.createRef();
    this.mode1ControllerRef = React.createRef();
    this.mode2ControllerRef = React.createRef();

  }

  // 渲染原始的内容图
  _renderContentImage() {
    // 处理显示图片的大小
    let { width, height } = this.state.contentImg;
    const screenW = Dimensions.get('window').width;
    const showW = width > screenW ? screenW : width;
    const showH = width > screenW ? screenW * height / width : height;

    return (
      <Image source={{ uri: this.state.contentImg.url }} style={{width: showW, height: showH}}></Image>
    )
  }
  _renderContentImageMulti() {
    let { width, height } = this.state.contentImgMulti;
    const screenW = Dimensions.get('window').width;
    const showW = width > screenW ? screenW : width;
    const showH = width > screenW ? screenW * height / width : height;

    return (
      <Image source={{ uri: this.state.contentImgMulti.url }} style={{width: showW, height: showH}}></Image>
    )
  }

  // 拍摄获得内容图
  _selectContentImgByCam() {
    this.ImagePicker.launchCamera(this.uploadOptions, async (res) => {
      if (res.didCancel) {
        console.log('取消拍照');
      }
      else if (res.error) {
        // 用户选择不授权时，提醒以下信息
        console.log('ImagePicker Error: ', res.error);
        if(res.error.indexOf('Camera permissions not granted') > -1){
          Alert.alert(('提示信息', 'APP需要使用相机，请打开相机权限允许APP使用'), [{
            text: '设置',
            onPress: () => {
              Linking.openURL('app-settings:')
                .catch(err => console.log('error', err))
            }
          },{
            text: '取消'
          }])
        }
        if(res.error.indexOf('Photo library permissions not granted') > -1){
          Alert.alert('提示信息', 'APP需要使用相册，请打开相册权限允许APP使用', [{
            text: '设置',
            onPress: () => {
              Linking.openURL('app-settings:')
                .catch(err => console.log('error', err))
            }
          },{
            text: '取消'
          }]);
        }
      }
      else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
      } else {
        // 用户授权并选择照片/拍照后，调用接口
        let source;  //保存选中的图片
        if (Platform.OS === 'android') {
          source = res.uri;
        } else {
          source = res.uri.replace('file://','');
        }
        let { contentImg } = this.state;
        contentImg = {
          url: source,
          width: res.width,
          height: res.height
        };
        this.setState({
          contentImg
        })
      }
      console.log('从“拍摄”获得内容图');
      this.setState({
        imgTransferred: false
      })
      this.setState({selectedContentImg: true})
      if (this.state.styleIndexSelected > 0) this._updateStylize();
    })
  }
  _selectContentImgByCamMulti() {
    this.ImagePicker.launchCamera(this.uploadOptions, async (res) => {
      if (res.didCancel) {
        console.log('取消拍照');
      }
      else if (res.error) {
        // 用户选择不授权时，提醒以下信息
        console.log('ImagePicker Error: ', res.error);
        if(res.error.indexOf('Camera permissions not granted') > -1){
          Alert.alert(('提示信息', 'APP需要使用相机，请打开相机权限允许APP使用'), [{
            text: '设置',
            onPress: () => {
              Linking.openURL('app-settings:')
                .catch(err => console.log('error', err))
            }
          },{
            text: '取消'
          }])
        }
        if(res.error.indexOf('Photo library permissions not granted') > -1){
          Alert.alert('提示信息', 'APP需要使用相册，请打开相册权限允许APP使用', [{
            text: '设置',
            onPress: () => {
              Linking.openURL('app-settings:')
                .catch(err => console.log('error', err))
            }
          },{
            text: '取消'
          }]);
        }
      }
      else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
      } else {
        let source;  //保存选中的图片
        if (Platform.OS === 'android') {
          source = res.uri;
        } else {
          source = res.uri.replace('file://','');
        }
        let { contentImgMulti } = this.state;
        contentImgMulti = {
          url: source,
          width: res.width,
          height: res.height
        };
        this.setState({
          contentImgMulti
        })
      }
      console.log('从“拍摄”获得内容图');
      this.setState({
        imgTransferredMulti: false
      })
      this.setState({selectedContentImgMulti: true})
      if (this.state.styleIndexSelectedMuti.length > 0) this._updateStylizeMulti();
    })
  }


  // 从相册上传内容图
  _selectContentImgByAlbum() {
    console.log('选择内容图');
    this.ImagePicker.launchImageLibrary(this.uploadOptions, async (res) => {
      if (res.didCancel) {
        console.log('取消拍照');
      }
      else if (res.error) {
        // 用户选择不授权时，提醒以下信息
        console.log('ImagePicker Error: ', res.error);
        Alert.alert('提示信息', 'APP需要使用相册，请打开相册权限允许APP使用', [{
          text: '设置',
          onPress: () => {
            Linking.openURL('app-settings:')
              .catch(err => console.log('error', err))
          }
        },{
          text: '取消'
        }]);
      }
      else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
      } else {
        // 用户授权并选择照片/拍照后，调用接口
        let source;  //保存选中的图片
        if (Platform.OS === 'android') {
          source = res.uri;
        } else {
          source = res.uri.replace('file://','');
        }
        let { contentImg } = this.state;
        contentImg = {
          url: source,
          width: res.width,
          height: res.height
        };
        this.setState({
          contentImg
        })
      }
      console.log('从“相册”获得内容图');
      this.setState({
        imgTransferred: false
      })
      this.setState({selectedContentImg: true})
      if (this.state.styleIndexSelected > 0) this._updateStylize();
    })
  }
  _selectContentImgByAlbumMulti() {
    console.log('选择内容图');
    this.ImagePicker.launchImageLibrary(this.uploadOptions, async (res) => {
      if (res.didCancel) {
        console.log('取消拍照');
      }
      else if (res.error) {
        // 用户选择不授权时，提醒以下信息
        console.log('ImagePicker Error: ', res.error);
        Alert.alert('提示信息', 'APP需要使用相册，请打开相册权限允许APP使用', [{
          text: '设置',
          onPress: () => {
            Linking.openURL('app-settings:')
              .catch(err => console.log('error', err))
          }
        },{
          text: '取消'
        }]);
      }
      else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
      } else {
        // 用户授权并选择照片/拍照后，调用接口
        let source;  //保存选中的图片
        if (Platform.OS === 'android') {
          source = res.uri;
        } else {
          source = res.uri.replace('file://','');
        }
        let { contentImgMulti } = this.state;
        contentImgMulti = {
          url: source,
          width: res.width,
          height: res.height
        };
        this.setState({
          contentImgMulti
        })
      }
      console.log('从“相册”获得内容图');
      this.setState({
        imgTransferredMulti: false
      })
      this.setState({selectedContentImgMulti: true})
      if (this.state.styleIndexSelected > 0) this._updateStylizeMulti();
    })
  }


  // 更新图片
  async _updateStylize(ratio) {
    let {state} = this;
    if (state.isLoading) return;
    // 风格化
    let content = await resizeImage(state.contentImg.url, 400)
      .catch(err => console.log('err'))
    content = content.base64;
    let style = await resizeImage(state.styleList[state.styleIndexSelected].url, 400);
    style = style.base64;

    let resultImage = await this.stylize(content, style, ratio).catch(err => console.log(err))
    this.setState({
      displayImg: resultImage,
      imgTransferred: true
    })
    this.forceUpdate() // 强制结束一个生命周期，重新渲染生效后的displayImg
  }
  async _updateStylizeMulti() {

  }


  // 风格化处理
  async stylize(contentImage, styleImage, ratio = 1) {
    const contentTensor = await base64ImageToTensor(contentImage);
    const styleTensor = await base64ImageToTensor(styleImage);
    console.log('-------------------------------')
    console.log(!!contentImage, !!styleImage)
    const stylizedResult = await this.styler.stylize(
      styleTensor, contentTensor, ratio);
    const stylizedImage = await tensorToImageUrl(stylizedResult);
    tf.dispose([contentTensor, styleTensor, stylizedResult]);
    return stylizedImage;
  }
  async stylizeMulti() {

  }

  // 从相册上传风格图
  _selectStyleImg() {
    console.log('选择风格图');
    this.ImagePicker.launchImageLibrary(this.uploadOptions, async (res) => {
      if (res.didCancel) {
        console.log('取消拍照');
      }
      else if (res.error) {
        // 用户选择不授权时，提醒以下信息
        console.log('ImagePicker Error: ', res.error);
        Alert.alert('提示信息', 'APP需要使用相册，请打开相册权限允许APP使用', [{
          text: '设置',
          onPress: () => {
            Linking.openURL('app-settings:')
              .catch(err => console.log('error', err))
          }
        },{
          text: '取消'
        }]);
      }
      else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
      } else {
        // 用户授权并选择照片/拍照后，调用接口
        let source;  //保存选中的图片
        if (Platform.OS === 'android') {
          source = res.uri;
        } else {
          source = res.uri.replace('file://','');
        }
        let { styleList } = this.state;
        styleList.splice(1, 0, {
          name: '自定义',
          url: source,
          preset: false
        })
        this.setState({
          styleList
        })
      }
      console.log('从“拍摄”获得内容图');
    })
  }


  // 渲染风格图预览
  // 两种模式不太一样
  _renderStylePreview(item, index) {
    // 首个：总是为添加
    if (index === 0 && item.url.length === 0) return (
      <TouchableOpacity key={index}
        style={{marginRight: 10, backgroundColor: '#eee', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
        onPress={() => this._selectStyleImg()}>
        <Image source={require('../assets/images/stylesPreview/no_picture.png')} style={{width: 40, height: 40}}></Image>
      </TouchableOpacity>
    )
    else if (!item.preset) return (
      <View style={{marginRight: 10}} key={index}>
        <TouchableOpacity  onPress={() => this._changeStyleSelected(index)}>
          <Image source={{ uri: item.url }} style={{width: 80, height: 80}}></Image>
        </TouchableOpacity>
        
        <View style={{position: 'absolute', bottom: 10, width: '100%', height: 20, backgroundColor: 'rgba(255, 255, 255, 0.6)', display: 'flex', justifyContent: 'center', paddingLeft: 10}}>
          <Text style={{fontSize: 10}}>自定义风格</Text>
        </View>
        {
          item.selected ? this._renderStyleSelectedFlag() : null
        }
      </View>
    );
    else return (
      <View key={index} style={{marginRight: 10, position: 'relative'}}>
        <TouchableOpacity onPress={() => this._changeStyleSelected(index)}>
          <Image source={{uri: this.state.styleList[index].url}} style={{width: 80, height: 80}} />
        </TouchableOpacity>
        <View style={{position: 'absolute', bottom: 10, width: '100%', height: 20, backgroundColor: 'rgba(255, 255, 255, 0.7)', display: 'flex', justifyContent: 'center', paddingLeft: 10}}>
          <Text style={{fontSize: 10}}>{item.name}</Text>
        </View>
        {
          item.selected ? this._renderStyleSelectedFlag() : null
        }
      </View>
    )
  }
  _renderStyleSelectedFlag() {
    return (
      <View style={{position: 'absolute', top: 0, zIndex: 100}}>
        {/* <Text>得我</Text> */}
        <Image source={require('../assets/images/stylesPreview/selected_flag.png')} style={{width: 30, height: 30, top: 20, left: 25}}></Image>
      </View>
    )
  }
  _changeStyleSelected(index) {
    let {styleList} = this.state;

    if(this.state.styleIndexSelected !== index) styleList[this.state.styleIndexSelected].selected = false;

    styleList[index].selected = !styleList[index].selected;
    this.setState({styleList});
    this.setState({
      styleList,
      styleIndexSelected: styleList[index].selected ? index : 0,
      imgTransferred: false
    }, () => {
      if (this.state.selectedContentImg) this._updateStylize();
    });
  }
  ///////////////////////////////////
  _renderStylePreviewMulti(item, index) {
    // 首个：总是为添加
    if (index === 0 && item.url.length === 0) return (
      <TouchableOpacity key={index}
        style={{marginRight: 10, backgroundColor: '#eee', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
        onPress={() => this._selectStyleImg()}>
        <Image source={require('../assets/images/stylesPreview/no_picture.png')} style={{width: 40, height: 40}}></Image>
      </TouchableOpacity>
    )
    else if (!item.preset) return (
      <View style={{marginRight: 10}} key={index}>
        <TouchableOpacity  onPress={() => this._changeStyleSelected(index)}>
          <Image source={{ uri: item.url }} style={{width: 80, height: 80}}></Image>
        </TouchableOpacity>
        
        <View style={{position: 'absolute', bottom: 10, width: '100%', height: 20, backgroundColor: 'rgba(255, 255, 255, 0.6)', display: 'flex', justifyContent: 'center', paddingLeft: 10}}>
          <Text style={{fontSize: 10}}>自定义风格</Text>
        </View>
        {
          item.selected ? this._renderStyleSelectedFlag() : null
        }
      </View>
    );
    else return (
      <View key={index} style={{marginRight: 10, position: 'relative'}}>
        <TouchableOpacity onPress={() => this._changeStyleSelected(index)}>
          <Image source={{uri: this.state.styleList[index].url}} style={{width: 80, height: 80}} />
        </TouchableOpacity>
        <View style={{position: 'absolute', bottom: 10, width: '100%', height: 20, backgroundColor: 'rgba(255, 255, 255, 0.7)', display: 'flex', justifyContent: 'center', paddingLeft: 10}}>
          <Text style={{fontSize: 10}}>{item.name}</Text>
        </View>
        {
          item.selected ? this._renderStyleSelectedFlag() : null
        }
      </View>
    )
  }



  // 渲染最后生成的结果图
  _renderResult() {
    let { width, height } = this.state.contentImg;
    const screenW = Dimensions.get('window').width;
    const showW = width > screenW ? screenW : width;
    const showH = width > screenW ? screenW * height / width : height;

    return (
      <Image source={{ uri: toDataUri(this.state.displayImg) }} style={{width: showW, height: showH}}></Image>
    )
  }
  _renderResultMulti() {
    let { width, height } = this.state.contentImgMulti;
    const screenW = Dimensions.get('window').width;
    const showW = width > screenW ? screenW : width;
    const showH = width > screenW ? screenW * height / width : height;

    return (
      <Image source={{ uri: toDataUri(this.state.displayImgMutil) }} style={{width: showW, height: showH}}></Image>
    )
  }



  _renderDisplayImg() {
    const {selectedContentImg, imgTransferred} = this.state;
    if (selectedContentImg && imgTransferred) return this._renderResult()
    else if (selectedContentImg) return this._renderContentImage()
    else return (
      <TouchableOpacity
        style={{backgroundColor: 'rgba(255, 255, 255, 0.04)', width: 260, left: Dimensions.get('window').width /2 - 130, borderRadius: 20, borderWidth: 2, borderColor:'rgba(255, 255, 255, 0.1)'}}
        onPress={() => {this.chooseContentInModelRef.current.show()}}>
        <View style={{height: 220, display: 'flex', alignItems: 'center', jusitfyContent: 'center'}}>
          <Image source={require('../assets/icon/icon_empty.png')} style={{width: 80, height: 80, opacity: 0.3, top: 50}}></Image>
          <Text style={{fontSize: 12, color: 'rgba(255, 255, 255, 0.4)', top: 80}}>还没有添加原相片！添加原相片→</Text>
        </View>
      </TouchableOpacity>
    )
  }
  _renderDisplayImgMulti() {
    const {selectedContentImgMulti, imgTransferredMulti} = this.state;
    if (selectedContentImgMulti && imgTransferredMulti) return this._renderResultMulti()
    else if (selectedContentImgMulti) return this._renderContentImageMulti()
    else return (
      <TouchableOpacity
        style={{backgroundColor: 'rgba(255, 255, 255, 0.04)', width: 260, left: Dimensions.get('window').width /2 - 130, borderRadius: 20, borderWidth: 2, borderColor:'rgba(255, 255, 255, 0.1)'}}
        onPress={() => {this.chooseContentInModelRef.current.show()}}>
        <View style={{height: 220, display: 'flex', alignItems: 'center', jusitfyContent: 'center'}}>
          <Image source={require('../assets/icon/icon_empty.png')} style={{width: 80, height: 80, opacity: 0.3, top: 50}}></Image>
          <Text style={{fontSize: 12, color: 'rgba(255, 255, 255, 0.4)', top: 80}}>还没有添加原相片！添加原相片→</Text>
        </View>
      </TouchableOpacity>
    )
  }


  //模式 翻页
  _modePageScrollEnd(that, e) {
    const {width, height} = Dimensions.get('window');
    // 求出水平方向上的偏移量
    var offSetX = e.nativeEvent.contentOffset.x;
    // 计算当前页码
    var currentPage = offSetX / width;
    if (currentPage === 1) {
      that.modeNaviRef.current.animateToMode2()
      that.mode1ControllerRef.current.hide()
      that.mode2ControllerRef.current.show()
    }
    else {
      that.modeNaviRef.current.animateToMode1()
      that.mode1ControllerRef.current.show()
      that.mode2ControllerRef.current.hide()
    }
    that.setState({
      transferMode: currentPage
    })
  }


  // 弹出选择内容图输入方式的弹窗
  _showChooseContentInModel() {
    console.log('change content image')
    this.chooseContentInModelRef.current.show();
    this.setState({
      showChooseContentInModel: true
    })
  }


  async componentDidMount() {
    // Wait for tf to be ready.
    await tf.ready();
    // Signal to the app that tensorflow.js can now be used.
    this.setState({
      isTfReady: true,
    });

    await this.styler.init();
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
      isLoading: false
    })
  }

  render() {
    let { state } = this;
    let that = this;

    return (
      <View style={[{flex: 1}, styles.page]}>

        {/* 返回主页按钮 */}
        <View style={{position: 'absolute', left: 10, top: 10}}>
          <TouchableHighlight
            style={styles.backBtn}
            onPress={() => this.props.navigation.goBack()}>
            <Image source={require('../assets/icon/back_btn.png')} style={{width: 30, height: 30}}></Image>
          </TouchableHighlight>
        </View>

        {/* 模式选择：假导航 */}
        <View style={styles.modeNavi}>
          <Text
            style={styles.modeNaviText}
            onPress={() => {
              this.modeNaviRef.current.animateToMode1();
              this.mode1ControllerRef.current.show()
              that.mode2ControllerRef.current.hide()
              this.modeContainerRef.current.scrollTo({x: 0, animated: true})
              this.setState({transferMode: 0})
            }}>滤镜</Text>
          <Text
            style={styles.modeNaviText}
            onPress={() => {
              this.modeNaviRef.current.animateToMode2();
              this.mode1ControllerRef.current.hide()
              that.mode2ControllerRef.current.show()
              this.modeContainerRef.current.scrollTo({x: Dimensions.get('window').width, animated: true})
              this.setState({transferMode: 1})
            }}>融合</Text>
          <ModeNaviHandler style={{width: 350, height: 50, backgroundColor: 'powderblue'}} ref={this.modeNaviRef}>
          </ModeNaviHandler>
        </View>

        {/* 主工作台 */}
        <View style={styles.workspace_controller}>
          <View style={{width: '100%'}}>
            <ScrollView
              horizontal={true}
              alwaysBounceHorizontal={true}
              showsHorizontalScrollIndicator={false}
              pagingEnabled={true}
              onMomentumScrollEnd={this._modePageScrollEnd.bind(this, that)}
              style={{width: '100%', display: 'flex', bottom: 0}}
              ref={this.modeContainerRef}>

              <View style={{width: Dimensions.get('window').width, height: '100%', bottom: 0}}>
                {
                  this._renderDisplayImg()
                }
              </View>

              <View style={{width: Dimensions.get('window').width, position: 'relative'}}>
                {
                  this._renderDisplayImgMulti()
                }
              </View>


            </ScrollView>
          </View>


          {/* loading动画 */}
          {state.isLoading ? <View style={[styles.loadingIndicator]}>
            <ActivityIndicator size='large' color='#FF0266' />
          </View> : null}
        </View>


        {/* 模式1：单一对单一模式 设置以及预置风格栏 */}
        <SingleTransferController
          _updateStylize={this._updateStylize.bind(this)}
          _renderStylePreview={this._renderStylePreview.bind(this)}
          _showChooseContentInModel={this._showChooseContentInModel.bind(this)}
          styleList={this.state.styleList}
          isLoading={this.state.isLoading}
          style={{width: '100%', position: 'absolute'}}
          ref={this.mode1ControllerRef}
        />
        {/* 模式2 */}
        <MultiTransferController
          _updateStylize={this._updateStylizeMulti.bind(this)}
          _renderStylePreview={this._renderStylePreviewMulti.bind(this)}
          _showChooseContentInModel={this._showChooseContentInModel.bind(this)}
          styleList={this.state.styleList}
          isLoading={this.state.isLoading}
          style={{width: '100%', position: 'absolute'}}
          ref={this.mode2ControllerRef}
        />


        {/* 选择原图方式弹窗 */}
        <ChooseContentInModel
          ref={this.chooseContentInModelRef}
          transferMode={this.state.transferMode}
          selectContentImgByCam={this._selectContentImgByCam.bind(this)}
          selectContentImgByAlbum={this._selectContentImgByAlbum.bind(this)}
          selectContentImgByCamMulti={this._selectContentImgByCamMulti.bind(this)}
          selectContentImgByAlbumMulti={this._selectContentImgByAlbumMulti.bind(this)}>
        </ChooseContentInModel>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  custom_flexCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  page: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    height: '100%',
  },
  icon_contentFromCamera: {
    width: 40,
    height: 40,
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    zIndex: 100,
    display: 'flex',
    justifyContent:'center',
    alignItems: 'center',
  },
  icon_contentFromAlbum: {
    width: 40,
    height: 40,
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    zIndex: 100,
    display: 'flex',
    justifyContent:'center',
    alignItems: 'center',
  },
  modeNavi: {
    position: 'absolute',
    zIndex: 100,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingBottom: 7,
  },
  modeNaviText: {
    color: '#fff',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 13,
    fontSize: 17,
  },
  modeNaviHandler: {
    width: 40,
    height: 3,
    position: 'absolute',
    backgroundColor: '#fff',
    bottom: 0,
    // left: 134,
    borderRadius: 2,
  },
  controller: {
    height: 70,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ddd',
  },
  backBtn: {
    width: 50,
    height: 50,
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    zIndex: 999,
    display: 'flex',
    justifyContent:'center',
    alignItems: 'center',
    paddingRight: 5,
  },
  selectBtn: {
    padding: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5,
    margin: 10,
    backgroundColor: '#fff'
  },
  selectBtn_active: {
    padding: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5,
    margin: 10,
    backgroundColor: '#f00',
  },
  workspace_controller: {
    display: 'flex',
    backgroundColor: '#eee',
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 140,
  },
  presetStylesMode1: {
    position: 'absolute',
    width: '100%',
    height: 130,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    bottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 10,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: 155,
    // flexDirection: 'row',
    // justifyContent: 'flex-end',
    zIndex: 200,
    // width: '100%'
  }
})
