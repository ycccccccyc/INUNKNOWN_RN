import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native'

/**
 * 弹出层
 */
const { width, height } = Dimensions.get('window')
let defaultModalWidth = 260, defaultModalHeight = 310;

export default class SaveSucceedModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scale: new Animated.Value(0),
      show: false
    }
    this.transferMode = this.props.transferMode;
    this.savedImage = this.props.savedImage;
    this.imageWidth = this.props.imageWidth;
    this.imageHeight = this.props.imageHeight;
  }

  in() {
    Animated.timing(
      this.state.scale,
      {
        easing: Easing.linear,
        duration: 200,
        toValue: 1
      }
    ).start()
  }

  out() {
    Animated.timing(
      this.state.scale,
      {
        easing: Easing.linear,
        duration: 200,
        toValue: 0
      }
    ).start()

    setTimeout(
      () => this.setState({ show: false }),
      300
    )
  }

  show(savedImage) {
    this.savedImage = savedImage;
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

  componentDidMount() {
    // this.show();
  }

  render() {
    let { transparentIsClick, modalBoxBg, modalBoxHeight } = this.props
    if (this.state.show) {
      return (
        <View style={styles.background_mask}>
          <View style={styles.center_box}>
            <Animated.View
              style={[styles.modal_box, {
                transform: [{
                  scale: this.state.scale.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.1, 1]
                  }),
                }]
              }]}>

              {/* 关闭按钮 */}
              <TouchableOpacity
                style={{position: 'absolute', top: 10, right: 10}}
                onPress={() => this.hide()}>
                <Image
                  source={require('../../assets/icon/icon_close.png')}
                  style={{width: 20, height: 20, opacity: 0.6}}/>
              </TouchableOpacity>
              
              <Text style={{fontSize: 13, marginBottom: 10}}>图片已保存到相册！</Text>

              {/* 图片展示 */}
              <View style={styles.image_container}>
                <Image source={{uri: this.savedImage}} style={{width: '100%', height: '100%'}}></Image>
              </View>

              <Text style={{fontSize: 13, marginTop: 10}}>分享至：</Text>

              <View style={styles.custom_flexCenter}>
                <Image source={require('../../assets/icon/icon_wx.png')} style={{width: 40, height: 40, marginRight: 10}}></Image>
                <Image source={require('../../assets/icon/icon_qq.png')} style={{width: 46, height: 46, marginRight: 10}}></Image>
                <Image source={require('../../assets/icon/icon_weibo.png')} style={{width: 40, height: 40}}></Image>
              </View>
            </Animated.View>
          </View>
        </View>
      )
    }
    return <View />
  }
}

const styles = StyleSheet.create({
  background_mask: {
    position: 'absolute',
    top: 0,
    left: '50%',
    zIndex: 9999,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    transform: [{translateX: -width / 2}]
  },
  center_box: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{translateX: -defaultModalWidth/2}, {translateY: -defaultModalHeight/2 - 20}]
  },
  modal_box: {
    width: defaultModalWidth,
    height: defaultModalHeight,
    backgroundColor: '#fff',
    borderRadius: 10,
    transform: [{scale: 1}],
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  custom_flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%'
  },
  image_container: {
    width: 160, height: 170,
    borderStyle: 'solid',
    borderColor: '#fff',
    borderWidth: 3,
    elevation: 8,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    padding: 10,
    paddingBottom: 0,
    // paddingRight: 8,
    // paddingTop: 10,
    // paddingBottom: 0,
    display: 'flex',
    alignItems:'center',
    justifyContent: 'center'
  }
})

SaveSucceedModal.defaultProps = {
  modalBoxHeight: 300, // 盒子高度
  modalBoxBg: '#fff', // 背景色
  hide: function () { }, // 关闭时的回调函数
  transparentIsClick: true  // 透明区域是否可以点击
}
