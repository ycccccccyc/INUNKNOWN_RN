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
import styleList from '../constant/styleList'



class FadeView extends React.Component {
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
      }
    ).start();
  }

  animateToMode2() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 200,
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
      pressStatus: false,
      selectedContentImg: false,
      // 内容图
      contentImg: {
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
      // 默认风格列表
      styleList: styleList,

      styleIndexSelected: 0,                    // 选择的风格图的下标
      cameraType: Camera.Constants.Type.back,   // 相机类型(expo-camera需要用到)
      isLoading: true,                          // 逻辑处理的标志,最初表示模型等的加载
      imgTransferred: false,                     // 图像已经被成功转换

      transferMode: 0,                          // 风格化模式：一对一-多对一

      showChooseContentInModel: false
    };

    // 初始化工作
    this.styler = new StyleTranfer();
    this.ImagePicker = require('react-native-image-picker');

    this.modeNaviRef = React.createRef();
    this.modeContainerRef = React.createRef();
    this.chooseContentInModelRef = React.createRef();

  }



  //加载风格化模型
  // async _loadMobileNetStyleModel() {
  //   if (!this.mobileStyleNet) {
  //     this.mobileStyleNet = await tf.loadGraphModel(
  //       '../assets/models/saved_model_style_js/model.json');
  //   }
  //   return this.mobileStyleNet;
  // }

  _onHideUnderlay() {
    this.setState({ pressStatus: false });
  }

  _onShowUnderlay() {
    this.setState({ pressStatus: true });
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

  renderCat() {
    return;
  }

  // 拍摄获得内容图
  _selectContentImgByCam() {
    console.log('选择原相片');

    const options = {
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

    this.ImagePicker.launchCamera(options, async (res) => {
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
  // 从相册上传内容图
  _selectContentImgByAlbum() {
    console.log('选择内容图');
    let { props } = this;
    let that = this;
    const options = {
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

    this.ImagePicker.launchImageLibrary(options, async (res) => {
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


  // 更新图片
  async _updateStylize(ratio) {
    let {state} = this;
    if (state.isLoading) return;
    // 风格化
    let content = await resizeImage(state.contentImg.url, 240)
      .catch(err => console.log('err'))
    content = content.base64;
    let style = await resizeImage(state.styleList[state.styleIndexSelected].url, 240);
    style = style.base64;

    let resultImage = await this.stylize(content, style, ratio).catch(err => console.log(err))
    this.setState({
      displayImg: resultImage,
      imgTransferred: true
    })
    this.forceUpdate() // 强制结束一个生命周期，重新渲染生效后的displayImg
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

  // 上传风格图
  _selectStyleImg() {
    console.log('选择风格图');
    let { props } = this;
    let that = this;
    const options = {
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

    this.ImagePicker.launchImageLibrary(options, async (res) => {
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
          <Image source={item.url} style={{width: 80, height: 80}}></Image>
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

  _renderDisplayImg() {
    const {selectedContentImg, imgTransferred} = this.state;
    if (selectedContentImg && imgTransferred) return this._renderResult()
    else if (selectedContentImg) return this._renderContentImage()
    else return this.renderCat()
  }

  //模式 翻页
  _modePageScrollEnd(that, e) {
    const {width, height} = Dimensions.get('window');
    // 求出水平方向上的偏移量
    var offSetX = e.nativeEvent.contentOffset.x;
    // 计算当前页码
    var currentPage = offSetX / width;
    if (currentPage === 1) that.modeNaviRef.current.animateToMode2()
    else that.modeNaviRef.current.animateToMode1()
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
    this.forceUpdate()
  }

  _renderChooseContentInModel() {
    if (this.state.showChooseContentInModel)
    return (
      <ChooseContentInModel ref={this.chooseContentInModelRef}></ChooseContentInModel>
    )
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
              this.modeContainerRef.current.scrollTo({x: 0, animated: true})
              this.setState({transferMode: 0})
            }}>滤镜</Text>
          <Text
            style={styles.modeNaviText}
            onPress={() => {
              this.modeNaviRef.current.animateToMode2();
              this.modeContainerRef.current.scrollTo({x: Dimensions.get('window').width, animated: true})
              this.setState({transferMode: 1})
            }}>融合</Text>
          <FadeView style={{width: 250, height: 50, backgroundColor: 'powderblue'}} ref={this.modeNaviRef}>
            <Text style={{fontSize: 28, textAlign: 'center', margin: 10}}>Fading in</Text>
          </FadeView>
        </View>

        {/* 从相机添加原相片按钮 */}
        <View style={styles.addContentImgFromCamera}>
          <TouchableHighlight 
            style={styles.icon_contentFromCamera}
            onPress={() => this._selectContentImgByCam()}>
            <Image source={require('../assets/icon/icon_camera.png')} style={{width: 25, height: 25}}></Image>
          </TouchableHighlight>
        </View>
        {/* 从相册导入原相片按钮 */}
        <View style={styles.addContentImgFromAlbum}>
          <TouchableHighlight
            style={styles.icon_contentFromAlbum}>
            <Image source={require('../assets/icon/icon_album.png')} style={{width: 25, height: 25}}></Image>
          </TouchableHighlight>
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
              style={{width: '100%', display: 'flex'}}
              ref={this.modeContainerRef}>
              <View style={{width: Dimensions.get('window').width, position: 'relative'}}>
                {
                  this._renderDisplayImg()
                }
              </View>
              <View style={{width: Dimensions.get('window').width}}></View>
            </ScrollView>
          </View>


          {/* loading动画 */}
          {state.isLoading ? <View style={[styles.loadingIndicator]}>
            <ActivityIndicator size='large' color='#FF0266' />
          </View> : null}
        </View>


        {/* 模式1：单一对单一模式 设置以及预置风格栏 */}
        {/* 风格化程度滑块 */}
        <View style={{position: 'absolute', bottom: 170, width: '100%'}}>
          <Text style={{color: '#fff', marginLeft: 20, fontSize: 10}}>风格化程度</Text>
          <Slider
            style={{ width: 360, }}
            value={50}
            step={0}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor={'rgb(124,220,254)'}
            maximumTrackTintColor={'rgba(124,220,254, 0.7)'}
            thumbTintColor={'white'}
            onSlidingComplete={ (value) => this._updateStylize(value / 100)}
          />
        </View>
        <View style={{position: 'absolute', bottom: 135, backgroundColor: 'rgba(255, 255, 255, 0.4)', width: '100%', height: 30, borderRadius: 10}}>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent:'center',alignItems: 'center', width: 96, height: 30, zIndex: 10, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
            <Image source={require('../assets/icon/icon_fromCommunity.png')} style={{width: 33, height: 20}}></Image>
            <Text style={{fontSize: 12}}>来自社区</Text>
          </View>
          <View style={{position: 'absolute', display: 'flex', flexDirection: 'row', top: 3, width: 240, left: 106, height: 30, backgroundColor: 'rgba(255, 255, 255, 0)'}}>
            <Text style={{fontSize: 12, paddingTop: 3, width: 50, textAlign: 'center', height: 24, borderRadius: 5, marginRight: 6, backgroundColor: 'rgba(255, 255, 255, 0.6)'}}>分组1</Text>
            <Text style={{fontSize: 12, paddingTop: 3, width: 50, textAlign: 'center', height: 24, borderRadius: 5, marginRight: 6, backgroundColor: 'rgba(255, 255, 255, 0.6)'}}>分组2</Text>
            <Text style={{fontSize: 12, paddingTop: 3, width: 50, textAlign: 'center', height: 24, borderRadius: 5, marginRight: 6, backgroundColor: 'rgba(255, 255, 255, 0.6)'}}>分组3</Text>
          </View>
        </View>
        <View style={styles.presetStylesMode1}>
          <ScrollView horizontal={true} style={{height: 90, marginLeft: 20, marginRight: 20}}>
            {
              this.state.styleList.map((item, index) => this._renderStylePreview(item, index))
            }
          </ScrollView>
          <View style={{height: 30, width: '100%', position: 'absolute', bottom: 0, display: 'flex', flexDirection: 'row', borderTopWidth: 1, borderColor: '#ccc'}}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {this.chooseContentInModelRef.current.show()}}>
              <View style={[styles.custom_flexCenter, {flex: 1, textAlign: 'center', borderRightWidth: 1, borderColor: '#ddd'}]}>
                <Image source={require('../assets/icon/icon_picture.png')} style={{width: 25, height: 25}}></Image>
                <Text>图片</Text>
              </View>
            </TouchableOpacity>
            <View style={[styles.custom_flexCenter, {flex: 1, textAlign: 'center', borderRightWidth: 1, borderColor: '#ddd'}]}>
            <Image source={require('../assets/icon/icon_cut.png')} style={{width: 23, height: 23}}></Image>
              <Text>裁剪</Text>
            </View>
            <View style={[styles.custom_flexCenter, {flex: 1, textAlign: 'center', borderRightWidth: 1, borderColor: '#ddd'}]}>
            <Image source={require('../assets/icon/icon_board.png')} style={{width: 20, height: 20}}></Image>
              <Text>画框</Text>
            </View>
            <View style={[styles.custom_flexCenter, {flex: 1, textAlign: 'center'}]}>
            <Image source={require('../assets/icon/icon_modify.png')} style={{width: 20, height: 20}}></Image>
              <Text>微调</Text>
            </View>
          </View>
        </View>


        {/* 选择原图方式弹窗 */}
        <ChooseContentInModel
          ref={this.chooseContentInModelRef}
          selectContentImgByCam={this._selectContentImgByCam.bind(this)}
          selectContentImgByAlbum={this._selectContentImgByAlbum.bind(this)}>
          {/* <TouchableOpacity onPress={() => { this.popUp.hide() }} style={{ alignItems: 'center', backgroundColor: '#316DE6', height: 45, width: 80, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', marginTop: 50 }}>
            <Text style={{ color: '#fff' }}>关闭弹框</Text>
          </TouchableOpacity> */}
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
  addContentImgFromCamera: {
    position: 'absolute',
    right: 80,
    top: 10,
  },
  addContentImgFromAlbum: {
    position: 'absolute',
    right: 30,
    top: 10,
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
