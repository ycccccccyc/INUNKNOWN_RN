import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, TouchableOpacity, TouchableHighlight, Animated, Easing, Dimensions } from 'react-native'

/**
 * 弹出层
 */
const { width, height } = Dimensions.get('window')
export default class ChooseContentInModel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      offset: new Animated.Value(0),
      show: false
    }
    this.transferMode = this.props.transferMode;
  }

  in() {
    Animated.timing(
      this.state.offset,
      {
        easing: Easing.linear,
        duration: 200,
        toValue: 1
      }
    ).start()
  }

  out() {
    Animated.timing(
      this.state.offset,
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

  _chooseWay(method) {
    const {
      selectContentImgByCam,
      selectContentImgByAlbum,
      selectContentImgByCamMulti,
      selectContentImgByAlbumMulti,
      transferMode
    } = this.props;
    this.hide();
    if (method === 'camera') {
      if (transferMode === 0) selectContentImgByCam();
      else selectContentImgByCamMulti();
    } else if(method === 'album') {
      if (transferMode === 0) selectContentImgByAlbum();
      else selectContentImgByAlbumMulti();
    }
    else;
  }

  render() {
    let { transparentIsClick, modalBoxBg, modalBoxHeight } = this.props
    if (this.state.show) {
      return (
        <View style={[styles.container, { height: height }]}>
          <TouchableOpacity style={{ height: 560 }} onPress={transparentIsClick && this.defaultHide.bind(this)}>
            {/* <View style={{ height: screen.height - screen.height * 0.076 }}></View> */}
          </TouchableOpacity>
          <Animated.View
            style={[styles.modalBox, {
              height: height, top: 0, backgroundColor: modalBoxBg,
              transform: [{
                translateY: this.state.offset.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height, 560]
                }),
              }]
            }]}>
            <View style={styles.bottomContainer}>
              <Text style={{fontSize: 12}}>你想从哪里获取原相片？</Text>
              <TouchableHighlight
                style={styles.selectBotton}
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
                onPress={() => this._chooseWay('camera')}>
                <View style={styles.custom_flexCenter}>
                  <Image source={require('../../assets/icon/icon_fromCamera.png')} style={{width: 31, height: 24, marginRight: 20}}></Image>
                  <Text>相机</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.selectBotton}
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
                onPress={() => this._chooseWay('album')}>
                <View style={styles.custom_flexCenter}>
                  <Image source={require('../../assets/icon/icon_picture.png')} style={{width: 30, height: 23, marginRight: 20}}></Image>
                  <Text>相册</Text>
                </View>
              </TouchableHighlight>
            </View>
          </Animated.View>
        </View>
      )
    }
    return <View />
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'absolute',
    top: 0,
    zIndex: 999
  },
  modalBox: {
    position: 'absolute',
    width: width
  },

  background_mask: {
    position: 'absolute',
    zIndex: 1000,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  bottomContainer: {
    // position: 'absolute',
    // bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20
  },
  custom_flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%'
  },
  selectBotton: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#f6f6f6',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  }
})

ChooseContentInModel.defaultProps = {
  modalBoxHeight: 300, // 盒子高度
  modalBoxBg: '#fff', // 背景色
  hide: function () { }, // 关闭时的回调函数
  transparentIsClick: true  // 透明区域是否可以点击
}
