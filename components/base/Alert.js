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
let defaultModalWidth = 260, defaultModalHeight = 80;

export default class Alert extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scale: new Animated.Value(0),
      show: false,
      alertText: '提示文字'
    }
  }

  in() {
    Animated.timing(
      this.state.scale,
      {
        easing: Easing.linear,
        duration: 200,
        toValue: 1,
      }
    ).start()
  }

  out() {
    Animated.timing(
      this.state.scale,
      {
        easing: Easing.linear,
        duration: 200,
        toValue: 0,
      }
    ).start()

    setTimeout(
      () => this.setState({ show: false }),
      200
    )
  }

  show(text) {
    this.setState({
      alertText: text,
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
              
              <Text style={{fontSize: 14, marginBottom: 10}}>{this.state.alertText}</Text>

              {/* <TouchableOpacity
                style={styles.btn_ok}>
                <Text>OK!</Text>
              </TouchableOpacity> */}

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
  btn_ok: {
    width: '100%',
    height: 50,
    bottom: 0,
    marginBottom: 0,
    // position: 'absolute',
    backgroundColor: '#f00',
    borderTopWidth: 1,
    borderColor: '#eee'
  }
})

Alert.defaultProps = {
  modalBoxHeight: 300, // 盒子高度
  modalBoxBg: '#fff', // 背景色
  hide: function () { }, // 关闭时的回调函数
  transparentIsClick: true  // 透明区域是否可以点击
}
