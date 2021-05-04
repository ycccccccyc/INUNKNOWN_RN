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
  TouchableHighlight,
  Alert
} from 'react-native'

const { width, height } = Dimensions.get('window')
const modalWidth = 300, modalHeight = 400;

export default class AddFramePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      offset: new Animated.Value(0),
      show: false
    }
    this.originalImg = null;
  }

  in() {
    Animated.timing(
      this.state.offset,
      {
        easing: Easing.linear,
        duration: 200,
        toValue: 1,
      }
    ).start()
  }

  out() {
    Animated.timing(
      this.state.offset,
      {
        easing: Easing.linear,
        duration: 200,
        toValue: 0,
      }
    ).start()

    setTimeout(
      () => this.setState({ show: false }),
      100
    )
  }

  show(image) {
    if (!image) {
      Alert.alert('至少选择一个风格！')
      return;
    }
    this.originalImg = image;
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
          <Animated.View
            style={[styles.page_container, {
              top: this.state.offset.interpolate({
                inputRange: [0, 1],
                outputRange: [height, 80]
              }),
            }]}>

            <Text style={styles.title}>为画作添加一个相框！</Text>
            
            <View style={styles.image_container}>

            </View>

            <View style={styles.controller}></View>

          </Animated.View>

          <TouchableOpacity
            style={styles.icon_cancel}
            onPress={() => {this.hide()}}>
            <Image source={require('../assets/icon/icon_close.png')} style={{width: 30, height: 30}}></Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.icon_ok}
            onPress={() => {this.hide()}}>
            <Image source={require('../assets/icon/icon_ok.png')} style={{width: 30, height: 30}}></Image>
          </TouchableOpacity>
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
    left: 0,
    zIndex: 9999,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  page_container: {
    left: width/2 - modalWidth/2,
    width: 300,
    height: 500,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    alignItems: 'center',
  },
  custom_flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%'
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
    marginTop: 20,
    marginBottom: 20,
  },
  image_container: {
    width: '85%',
    height: 300,
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
    display: 'flex',
    alignItems:'center',
    justifyContent: 'center'
  },
  controller: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: '100%',
    height: 110,
    bottom: 0,
    position: 'absolute',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  icon_cancel: {
    width: 50,
    height: 50,
    backgroundColor: '#fff', 
    position: 'absolute',
    bottom: 70,
    left: 70,
    borderRadius: 25,
    opacity: 0.8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon_ok: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 70,
    right: 70,
    borderRadius: 25,
    opacity: 0.8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

})

AddFramePage.defaultProps = {
  modalBoxHeight: 300, // 盒子高度
  modalBoxBg: '#fff', // 背景色
  hide: function () { }, // 关闭时的回调函数
  transparentIsClick: true  // 透明区域是否可以点击
}
