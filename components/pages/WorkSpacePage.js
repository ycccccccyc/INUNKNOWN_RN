import React, {Component} from 'react';
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
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import {StyleTranfer} from './style_transfer';
import {imageToBase64, base64ImageToTensor, tensorToImageUrl, resizeImage, toDataUri} from '../../scripts/image_utils';

var ImagePicker = require('react-native-image-picker');

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
      // 预置的风格选项
      styleList: [
        {
          name: '引用本地',
          url: '',
          preset: false,
          selected: false
        },
        {
          name: '红圈',
          url: require('../../assets/images/stylesPreview/red_circles.jpg'),
          preset: true,
          selected: false
        },
        {
          name: '条纹',
          url: require('../../assets/images/stylesPreview/stripes.jpg'),
          preset: true,
          selected: false
        },
        {
          name: '砖块',
          url: require('../../assets/images/stylesPreview/bricks.jpg'),
          preset: true,
          selected: false
        },
        // {
        //   name: '莫奈',
        //   url: '../../assets/images/stylesPreview/clouds.jpg',
        //   preset: true
        // },
        // {
        //   name: '海港',
        //   url: '../../assets/images/stylesPreview/seaport.jpg',
        //   preset: true
        // }
      ],

      styleIndexSelected: 0,                    // 选择的风格图的下标
      cameraType: Camera.Constants.Type.back,   // 相机类型(expo-camera需要用到)
      isLoading: true,                          // 逻辑处理的标志,最初表示模型等的加载
      imgTransferred: false                     // 图像已经被成功转换
    };

    // 初始化工作
    // 加载模型
    // this._loadMobileNetStyleModel().then(model => {
    //   this.setState({styleNet: model})
    //   console.log('加载风格化模型成功')
    // }).catch((err => console.log('=====' + err + '=====')))
    // .finally(() => console.log(''));

    // this._loadSeparableTransformerModel().then(model => {
    //   this.setState({transformNet: model})
    // }).finally(() => {console.log('加载迁移模型成功')})

    this.styler = new StyleTranfer();

  }



  //加载风格化模型
  async _loadMobileNetStyleModel() {
    if (!this.mobileStyleNet) {
      this.mobileStyleNet = await tf.loadGraphModel(
        '../../assets/models/saved_model_style_js/model.json');
    }
    return this.mobileStyleNet;
  }

  _onHideUnderlay() {
    this.setState({ pressStatus: false });
  }

  _onShowUnderlay() {
    this.setState({ pressStatus: true });
  }

  // 执行
  _excute() {
    console.log('执行');
    console.log(this.state.isTfReady);
    // this._startStyling().finally(() => {
    //   console.log('完成');
    // })
  }
  _startStyling() {

  }

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
    console.log('添加图片列表为空')
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

    ImagePicker.launchCamera(options, async (res) => {
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
      this.state.selectedContentImg = true;
      if (this.state.styleIndexSelected > 0) this._updateStylize();
    })
  }

  // 更新图片
  async _updateStylize() {
    let {state} = this;
    if (state.isLoading) return;
    // 风格化
    let content = await resizeImage(state.contentImg.url, 240)
      .catch(err => console.log('err'))
    content = content.base64;
    let style = await resizeImage('../../assets/images/stylesPreview/red_circles.jpg', 240);
    style = style.base64;

    let resultImage = await this.stylize(content, style).catch(err => console.log(err))
  }


  // 风格化处理
  async stylize(contentImage, styleImage) {
    const contentTensor = await base64ImageToTensor(contentImage);
    const styleTensor = await base64ImageToTensor(styleImage);
    console.log('-------------------------------')
    console.log(!!contentImage, !!styleImage)
    const stylizedResult = this.styler.stylize(
      styleTensor, contentTensor);
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

    ImagePicker.launchImageLibrary(options, async (res) => {
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
        <Image source={require('../../assets/images/stylesPreview/no_picture.png')} style={{width: 40, height: 40}}></Image>
      </TouchableOpacity>
    )
    else if (!item.preset) return (
      <View style={{marginRight: 10}} key={index}>
        <TouchableOpacity  onPress={() => this._changeStyleSelected(index)}>
          <Image source={{uri: item.url}} style={{width: 80, height: 80}}></Image>
        </TouchableOpacity>
        
        <View style={{position: 'absolute', bottom: 0, width: '100%', height: 20, backgroundColor: 'rgba(255, 255, 255, 0.6)', display: 'flex', justifyContent: 'center', paddingLeft: 10}}>
          <Text style={{fontSize: 10}}>自定义风格</Text>
        </View>
        {
          item.selected ? this._renderStyleSelectedFlag() : null
        }
      </View>
    );
    else return (
      <View key={index} style={{marginRight: 10}}>
        <TouchableOpacity onPress={() => this._changeStyleSelected(index)}>
          <Image source={item.url} style={{width: 80, height: 80}} />
        </TouchableOpacity>
        <View style={{position: 'absolute', bottom: 0, width: '100%', height: 20, backgroundColor: 'rgba(255, 255, 255, 0.7)', display: 'flex', justifyContent: 'center', paddingLeft: 10}}>
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
        <Image source={require('../../assets/images/stylesPreview/selected_flag.png')} style={{width: 30, height: 30, top: 20, left: 25}}></Image>
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

    return (
      // <LinearGradient colors={['rgb(222,249,242)', 'rgb(168,227,233)', 'rgb(108,198,222)',]} style={{flex: 1}}>
      //   <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      //   </View>
      // </LinearGradient>
      <View style={[{flex: 1}, styles.page]}>

        {/* 添加原相片按钮 */}
        <View style={styles.addContentImg}>
          {/* <Image ></Image> */}
          <TouchableHighlight 
            style={{width: 30, height: 30, marginRight: 10, backgroundColor: '#f00', borderRadius: 15, left: 10, top: 10, zIndex: 1000}}
            onPress={() => this._selectContentImgByCam()}>
            <Text>+</Text>
          </TouchableHighlight>
        </View>

        {/* 暂时加的执行按钮 */}
        <TouchableOpacity
          style={{width: 40, height: 40, position: 'absolute', backgroundColor: '#ff0', bottom: 220, right: 10, zIndex: 100, borderRadius: 20}}
          onPress={() => this._excute()}
        >
          <Text>+</Text>
        </TouchableOpacity>

        <View style={styles.workspace_controller}>
          {/* {
            this.state.localPhoOption.length
            ? this.state.localPhoOption.map((item, index) => this._renderPicItem(item, index) )
            : this.renderCat()
          } */}
          {
            state.selectedContentImg && state.imgTransferred
            ? this._renderResult()
            : state.selectedContentImg ? this._renderContentImage()
            : this.renderCat()
          }
          {state.isLoading ? <View style={[styles.loadingIndicator]}>
            <ActivityIndicator size='large' color='#FF0266' />
          </View> : null}
        </View>

        {/* 预置风格栏 */}
        <View style={styles.presetStyles}>
          {
            this.state.styleList.map((item, index) => this._renderStylePreview(item, index))
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  page: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    height: '100%',
  },
  addContentImg: {
    position: 'absolute',
    left: 0,
  },
  controller: {
    height: 70,
    width: '100%',
    display: 'flex',
    // justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ddd',
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
    paddingBottom: 200,
  },
  presetStyles: {
    position: 'absolute',
    width: '100%',
    height: 140,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    bottom: 60,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
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
