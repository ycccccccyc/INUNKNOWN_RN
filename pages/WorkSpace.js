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
  Slider,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import EventBus from 'react-native-event-bus';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { Camera } from 'expo-camera';

import {imageToBase64, base64ImageToTensor, tensorToImageUrl, resizeContent, resizeStyle, toDataUri} from '../scripts/image_utils';
import RNFetchBlob from 'react-native-fetch-blob';

import ChooseContentInModel from '../components/Modal/ChooseContentInModel';
import SingleTransferController from '../components/WorkSpace/SingleTransferController';
import MultiTransferController from '../components/WorkSpace/MultiTransferController';
import EtcModal from '../components/WorkSpace/EtcModal';
import SaveSucceedModal from '../components/Modal/SaveSucceedModal';
import AddFramePage from './AddFramePage';
import ModifyPage from './ModifyPage';
import ResizeImagePage from './ResizeImagePage';

// import styleList from '../constant/styleList'
import CameraRoll from '@react-native-community/cameraroll';
import RNFS from 'react-native-fs'; //文件处理

import services from '../services/workspace';
import CustomAlert from '../components/base/Alert';

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
      displayImg: '',
      displayImgMulti: '',
      // 默认风格列表
      gotStyleList: false,
      styleList: [],
      imgFineness: 500,
      styleIndexSelected: 0,                    // 选择的风格图的下标
      styleIndexSelectedMuti: [],
      cameraType: Camera.Constants.Type.back,   // 相机类型(expo-camera需要用到)
      isLoading: false,                          // 逻辑处理的标志,最初表示模型等的加载
      imgTransferred: false,                     // 图像已经被成功转换
      imgTransferredMulti: false,
      transferMode: 0,                          // 风格化模式：一对一-多对一
      showChooseContentInModel: false
    };

    // 初始化工作
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
    this.etcModalRef = React.createRef();
    this.saveSucceedModal = React.createRef();
    this.addFramePageRef = React.createRef();
    this.modifyPageRef = React.createRef();
    this.resizeImagePageRef = React.createRef();
    this.alertRef = React.createRef();

  }


  // 切换模式时重置一些必要的数据
  _clearUserData() {
    let {
      styleList,
      styleIndexSelectedMuti,
      imgTransferred,
      imgTransferredMulti,
      contentImg,
      contentImgMulti,
      selectedContentImg,
      selectedContentImgMulti
    } = this.state;
    styleList.map((item) => {item.selected = false});
    styleIndexSelectedMuti = [];
    contentImg = '';
    contentImgMulti = '';
    imgTransferred = false;
    imgTransferredMulti = false;
    selectedContentImg = false;
    selectedContentImgMulti = false;

    this.setState({styleList, styleIndexSelectedMuti, contentImg, contentImgMulti, imgTransferredMulti, selectedContentImg, selectedContentImgMulti});

    this.mode2ControllerRef.current.clearUserData();
  }


  // 渲染原始的内容图
  _renderContentImage() {
    // 处理显示图片的大小
    let { width, height } = this.state.contentImg;
    const screenW = gWidth;
    const showW = width > screenW ? screenW : width;
    const showH = width > screenW ? screenW * height / width : height;

    return (
      <Image source={{ uri: this.state.contentImg.url }} style={{width: showW, height: showH}}></Image>
    )
  }
  _renderContentImageMulti() {
    let { width, height } = this.state.contentImgMulti;
    const screenW = gWidth;
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
      // if (this.state.styleIndexSelected > 0) this._updateStylize();
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
      // if (this.state.styleIndexSelected > 0) this._updateStylize();
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
    })
  }

  // 自动对图片进行压缩
  _autoResize(width, height) {
    let {state} = this;
    const level = parseInt(width * height / 90000);
    if ((gStyler.selection[0] = 1 && gStyler.selection[1] > 1) || level === 0) return false
    switch (level) {
      case 1:
        gContentResizeRatio = 0.75;
        break;
      case 2:
        gContentResizeRatio = 0.7;
        break;
      case 3:
        gContentResizeRatio = 0.6;
        break;
      case 4:
        gContentResizeRatio = 0.5;
        break;
    }
    return true;
  }


  // 更新图片
  async _updateStylize(ratio) {
    this.setState({
      imgTransferred: false,
      isLoading: true
    })
    let {state} = this;
    if (state.isLoading) return;
    // 风格化
    this._autoResize(state.contentImg.width, state.contentImg.height);
    let content = await resizeContent(state.contentImg.url, state.contentImg.width).catch(err => console.log(err));
    content = content.base64;
    let style = await resizeStyle(state.styleList[state.styleIndexSelected].url, 400);
    style = style.base64;

    let resultImage;
    try {
      resultImage = await this.stylize(content, style, ratio).catch(err => console.log(err))
    } catch(e) {
      console.log(e)
    }
    this.setState({
      displayImg: resultImage,
      imgTransferred: true
    })
    this.forceUpdate() // 强制结束一个生命周期，重新渲染生效后的displayImg
  }
  async _updateStylizeMulti(selectedIndexList, ratioList) {
    this.setState({
      imgTransferred: false,
      isLoading: true
    })
    let {state} = this;
    if (state.isLoading) return;
    // 多风格风格化
    this._autoResize(state.contentImg.width, state.contentImg.height);
    let content = await resizeContent(state.contentImgMulti.url, state.contentImgMulti.width).catch(err => console.log(err));
    content = content.base64;

    let styles = [];
    for (let i = 0; i < selectedIndexList.length; i++) {
      let temp = await resizeStyle(state.styleList[selectedIndexList[i]].url, state.imgFineness);
      temp = temp.base64
      styles.push(temp);
    }

    let resultImage = await this.stylizeMulti(content, styles, ratioList).catch(err => console.log(err))
    this.setState({
      displayImgMulti: resultImage,
      imgTransferredMulti: true
    })
    this.forceUpdate() // 强制结束一个生命周期，重新渲染生效后的displayImg
  }


  // 风格化处理
  async stylize(contentImage, styleImage, ratio = 1) {
    const contentTensor = await base64ImageToTensor(contentImage);
    const styleTensor = await base64ImageToTensor(styleImage);
    console.log('-------------------------------')
    const stylizedResult = await gStyler.stylize(
      styleTensor, contentTensor, ratio);
    const stylizedImage = await tensorToImageUrl(stylizedResult);
    tf.dispose([contentTensor, styleTensor, stylizedResult]);
    this.setState({isLoading: false},this.forceUpdate())
    return stylizedImage;
  }
  async stylizeMulti(content, styles, ratioList) {
    const contentTensor = await base64ImageToTensor(content);
    let styleTensorList = [];
    for (let i = 0; i < styles.length; i++) {
      let temp = await base64ImageToTensor(styles[i]);
      styleTensorList.push(temp);
    }
    const stylizedResult = await gStyler.combine(
      styleTensorList, contentTensor, ratioList);
    const stylizedImage = await tensorToImageUrl(stylizedResult);
    this.setState({isLoading: false},this.forceUpdate())
    return stylizedImage;
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

  // 切换模式一风格图
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
      // if (this.state.selectedContentImg) this._updateStylize();
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
  _renderResultMulti() {
    let { width, height } = this.state.contentImgMulti;
    const screenW = Dimensions.get('window').width;
    const showW = width > screenW ? screenW : width;
    const showH = width > screenW ? screenW * height / width : height;

    return (
      <Image source={{ uri: toDataUri(this.state.displayImgMulti) }} style={{width: showW, height: showH}}></Image>
    )
  }

  _renderDisplayImg() {
    const {selectedContentImg, imgTransferred} = this.state;
    console.log(selectedContentImg, imgTransferred)
    if (selectedContentImg && imgTransferred) return this._renderResult()
    else if (selectedContentImg) return this._renderContentImage()
    else return (
      <TouchableOpacity
        style={{backgroundColor: 'rgba(255, 255, 255, 0.04)', width: 260, borderRadius: 20, borderWidth: 2, borderColor:'rgba(255, 255, 255, 0.1)'}}
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
        style={{backgroundColor: 'rgba(255, 255, 255, 0.04)', width: 260, borderRadius: 20, borderWidth: 2, borderColor:'rgba(255, 255, 255, 0.1)'}}
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
    this._clearUserData()
  }

  // 弹出选择内容图输入方式的弹窗
  _showChooseContentInModel() {
    console.log('change content image')
    this.chooseContentInModelRef.current.show();
    this.setState({
      showChooseContentInModel: true
    })
  }

  // 微调页面
  _showModifyPage() {
    const img = this._getCurrenDisplayImg();
    if (!img) return;
    this.modifyPageRef.current.show(img);
  }
  // 裁剪页面
  _showResizeImagePage() {
    this.resizeImagePageRef.current.show();
  }
  // 添加画框页面
  _showAddFramePage() {
    this.addFramePageRef.current.show();
  }


  // 确认能否打开其余页面
  _getCurrenDisplayImg() {
    // 在进入其余页面时获得当前需要被处理的图片
    const {
      transferMode,
      contentImg,
      contentImgMulti,
      displayImg,
      displayImgMulti,
      imgTransferred,
      imgTransferredMulti
    } = this.state;

    // 没有图情况下的处理    
    if ((transferMode === 0 && !imgTransferred && !contentImg.url) || (transferMode === 1 && !imgTransferredMulti && !contentImgMulti.url)){
      this.alertRef.current.show('没有任何图片:(')
      return null;
    }

    switch (transferMode) {
      case 0: 
        if (imgTransferred) return toDataUri(displayImg)
        else return contentImg
      case 1: 
        if (imgTransferredMulti) return toDataUri(displayImgMulti)
        else return contentImgMulti
      default:
        return contentImg
    }
  }


  async componentDidMount() {
    // 准备数据
    // 风格图片
    await this._getStyleList();
  }

  async _getStyleList() {
    const res = await services.getStyleList();
    if (+res.code === 0 && res.data) {
      const { data } = res;
      this.setState({
        styleList: data,
        gotStyleList: true
      }, () => this.forceUpdate())
    }
  }


  // 保存图片
  _saveImage() {
    this.etcModalRef.current.hide();
    const {displayImg, displayImgMulti, transferMode} = this.state;
    let saveImage;
    if (transferMode === 0) {
      if (!displayImg) {
        Alert.alert('没有可保存的成品图片~去制作8！')
        return;
      }
      saveImage = displayImg;
    } else {
      if (!displayImgMulti) {
        console.log('没有可保存的成品图片~去制作8！');
        return;
      }
      saveImage = displayImgMulti;
    }
    const time = new Date();
    let pathName = "INUNKNOWN_stylized" + time.getFullYear() + time.getMonth() + time.getDate() + time.getHours() + time.getMinutes() + time.getSeconds() + Math.floor(Math.random() * 1000)
    const dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; // 外部文件，共享目录的绝对路径（仅限android）
    const downloadDest = `${dirs}/${pathName}.png`;
    const imageDatas = saveImage.split('data:image/png;base64,');
    const imageData = imageDatas[0];

    RNFetchBlob.fs.writeFile(downloadDest, imageData, 'base64').then((rst) => {
      console.log('writeFile',downloadDest)
      try {
        CameraRoll.save(downloadDest).then((e1) => {
          console.log('suc',e1)
          this.saveSucceedModal.current.show(transferMode === 0 ? toDataUri(displayImg) : toDataUri(displayImgMulti));
        }).catch((e2) => {
          console.log('发生错误', e2)
        })
      } catch (e3) {
        // fail && fail()
      }
    });
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
              this._clearUserData();
              this.modeNaviRef.current.animateToMode1();
              this.mode1ControllerRef.current.show()
              that.mode2ControllerRef.current.hide()
              this.modeContainerRef.current.scrollTo({x: 0, animated: true})
              this.setState({transferMode: 0})
            }}>滤镜</Text>
          <Text
            style={styles.modeNaviText}
            onPress={() => {
              this._clearUserData();
              this.modeNaviRef.current.animateToMode2();
              this.mode1ControllerRef.current.hide()
              that.mode2ControllerRef.current.show()
              this.modeContainerRef.current.scrollTo({x: Dimensions.get('window').width, animated: true})
              this.setState({transferMode: 1})
            }}>融合</Text>
          <ModeNaviHandler style={{width: 350, height: 50, backgroundColor: 'powderblue'}} ref={this.modeNaviRef}>
          </ModeNaviHandler>
        </View>

        {/* 保存等按钮 */}
        <View style={styles.icon_save}>
          <TouchableOpacity
            style={{width: '100%', height: '100%'}}
            onPress={() => {this.etcModalRef.current.showOrHide() }}>
            <Image source={require('../assets/icon/icon_etc.png')} style={{width: 30, height: 30}}></Image>
          </TouchableOpacity>
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

              {/* 模式一 */}
              <View style={[{width: Dimensions.get('window').width, height: '100%'}, styles.custom_flexCenter]}>
                {
                  this._renderDisplayImg()
                }
              </View>
              {/* 模式二 */}
              <View style={[{width: Dimensions.get('window').width, height: '100%'}, styles.custom_flexCenter]}>
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


        {/* 底部控制台 */}
        {/* 模式1：单一对单一模式 设置以及预置风格栏 */}
        {
          this.state.gotStyleList ?
          <SingleTransferController
            _updateStylize={this._updateStylize.bind(this)}
            _changeStyleSelected={this._changeStyleSelected.bind(this)}
            _selectStyleImg={this._selectStyleImg.bind(this)}
            _showChooseContentInModel={this._showChooseContentInModel.bind(this)}
            _showModifyPage={this._showModifyPage.bind(this)}
            _showResizeImagePage={this._showResizeImagePage.bind(this)}
            _showAddFramePage={this._showAddFramePage.bind(this)}
            styleList={this.state.styleList}
            isLoading={this.state.isLoading}
            style={{width: '100%', position: 'absolute'}}
            ref={this.mode1ControllerRef}
          /> : null
        }

        {
          this.state.gotStyleList ?
          // 模式二
          <MultiTransferController
            _showChooseContentInModel={this._showChooseContentInModel.bind(this)}
            _selectStyleImg={this._selectStyleImg.bind(this)}
            _updateStylizeMulti={this._updateStylizeMulti.bind(this)}
            _showModifyPage={this._showModifyPage.bind(this)}
            _showResizeImagePage={this._showResizeImagePage.bind(this)}
            _showAddFramePage={this._showAddFramePage.bind(this)}
            styleList={this.state.styleList}
            isLoading={this.state.isLoading}
            style={{width: '100%', position: 'absolute'}}
            ref={this.mode2ControllerRef}
          /> : null
        }


        {/* 选择原图方式弹窗 */}
        <ChooseContentInModel
          ref={this.chooseContentInModelRef}
          transferMode={this.state.transferMode}
          selectContentImgByCam={this._selectContentImgByCam.bind(this)}
          selectContentImgByAlbum={this._selectContentImgByAlbum.bind(this)}
          selectContentImgByCamMulti={this._selectContentImgByCamMulti.bind(this)}
          selectContentImgByAlbumMulti={this._selectContentImgByAlbumMulti.bind(this)}>
        </ChooseContentInModel>


        {/* 更多选项（分享、保存等按钮） */}
        <EtcModal
          ref={this.etcModalRef}
          resultImage={this.state.transferMode === 0 ? this.state.displayImg : this.state.displayImgMulti}
          saveImage={this._saveImage.bind(this)}>
        </EtcModal>

        {/* 保存到相册成功弹窗 */}
        <SaveSucceedModal
          ref={this.saveSucceedModal}
          savedImage={this.state.transferMode === 0 ? toDataUri(this.state.displayImg) : toDataUri(this.state.displayImgMulti)}
          imageWidth={this.state.transferMode === 0 ? this.state.contentImg.width : this.state.contentImgMulti.width}
          imageHeight={this.state.transferMode === 0 ? this.state.contentImg.height : this.state.contentImgMulti.height}>
        </SaveSucceedModal>

        {/* 裁剪页 */}
        <ResizeImagePage
          ref={this.resizeImagePageRef}>
        </ResizeImagePage>

        {/* 添加画框页面 */}
        <AddFramePage
          ref={this.addFramePageRef}>
        </AddFramePage>

        {/* 微调页面 */}
        <ModifyPage
          ref={this.modifyPageRef}>
        </ModifyPage>

        {/* 提示弹窗 */}
        <CustomAlert
          ref={this.alertRef}></CustomAlert>

        {/* 正在风格化loading */}
        {
          this.state.isLoading ? 
          <View style={{position: 'absolute', top: '40%', zIndex: 999, width: '80%', height: 30, borderRadius: 10,backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingTop: 4}}>
            <Text style={{color: '#fff', textAlign: 'center'}}>正在进行风格应用...</Text>
          </View> : null
        }


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
  icon_save: {
    position: 'absolute',
    top: 12,
    right: 15,
    zIndex: 999,
    width: 30,
    height: 30,
    borderRadius: 15,
    display: 'flex',
    justifyContent: 'center',
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
    top: '55%',
    left: 155,
    // flexDirection: 'row',
    // justifyContent: 'flex-end',
    zIndex: 200,
    // width: '100%'
  }
})
