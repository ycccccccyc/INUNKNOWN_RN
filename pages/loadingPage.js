import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Dimensions,
    Animated,
    Easing,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    PermissionsAndroid
} from 'react-native';
import {StyleTranfer} from '../scripts/style_transfer';
import * as Permissions from 'expo-permissions';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';


export default class LoadingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftOffset: new Animated.Value(0),
      imgWidth: 0,
      imgHeight: 0,

      isTfReady: false,
      isLoading: true,
      hasCameraPermission: false
    };
    this.loadingPrepared = this.props.loaded;


    this.detailData = {};

    this.styler = new StyleTranfer();
  }

  in() {
    Animated.timing(
      this.state.leftOffset,
      {
        easing: Easing.linear,
        duration: 150,
        toValue: 1,
      }
    ).start()
  }

  out() {
    Animated.timing(
      this.state.leftOffset,
      {
        easing: Easing.linear,
        duration: 150,
        toValue: 0,
      }
    ).start()

    setTimeout(
      () => this.setState({ show: false }),
      100
    )
  }

  show() {
    this.setState({
      show: true
    }, this.in())
  }

  hide() {
    this.out()
  }

  defaultHide() {
    this.props.hide()
    this.out()
  }


  _getStoragePermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: "INUNKNOWN Storage Permission",
                message: "INUNKNOWN needs access to your storage " +
                    "so you can save your photos",
            },
        );
        return granted;
    } catch (err) {
        console.error("Failed to request permission ", err);
        return null;
    }
  };

  async componentDidMount() {
    // Wait for tf to be ready.
    await tf.ready();
    // Signal to the app that tensorflow.js can now be used.
    this.setState({
      isTfReady: true,
    });

    this.prepareTf();
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    await this._getStoragePermission();
    this.setState({
      hasCameraPermission: status === 'granted',
    }, () => this.forceUpdate())
  }

  async prepareTf() {
    this.styler.init().then((res) => {
      this.setState({
        isLoading: false
      })
      this.loadingPrepared(this.styler);
    });
  }


  render() {
    return (
      <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
        {
          this.state.isLoading
          ? (
            <View style={{width: '100%', height: '100%'}}>
              <Image source={ require('../assets/images/screen_with_title.png')} style={{width: '100%', height: '100%', position: 'absolute'}}></Image>
              <View style={[styles.loadingIndicator]}>
                <ActivityIndicator size={70} color='#666' />
                <Text style={{textAlign: 'center', fontSize: 13, color: '#333', marginTop: 10}}>正在加载模型资源...</Text>
              </View>
            </View>
          )
          : <Text>加载完成</Text>
        }
      </View>

    );
  }
}

LoadingPage.defaultProps = {
  modalBoxHeight: 300, // 盒子高度
  modalBoxBg: '#fff', // 背景色
  hide: function () { }, // 关闭时的回调函数
  transparentIsClick: true  // 透明区域是否可以点击
}

const styles = StyleSheet.create({
  loadingIndicator: {
    // position: 'absolute',
    top: '50%',
    // left: 155,
    // flexDirection: 'row',
    // justifyContent: 'flex-end',
    zIndex: 200,
    // width: '100%'
  }
})
