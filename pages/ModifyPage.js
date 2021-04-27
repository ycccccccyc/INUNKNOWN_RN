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

const { width, height } = Dimensions.get('window')

export default class ModifyPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      offset: new Animated.Value(0),
      show: false
    }
    // this.transferMode = this.props.transferMode;
    // this.savedImage = this.props.savedImage;
    // this.imageWidth = this.props.imageWidth;
    // this.imageHeight = this.props.imageHeight;
  }

  in() {
    Animated.timing(
      this.state.offset,
      {
        easing: Easing.linear,
        duration: 100,
        toValue: 1
      }
    ).start()
  }

  out() {
    Animated.timing(
      this.state.offset,
      {
        easing: Easing.linear,
        duration: 100,
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
          <Animated.View
            style={[styles.page_container, {
              left: this.state.offset.interpolate({
                inputRange: [0, 1],
                outputRange: [width, 0]
              }),
            }]}>
            <Text style={{textAlign: 'center'}}>微调</Text>
          </Animated.View>
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
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  custom_flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%'
  },

})

ModifyPage.defaultProps = {
  modalBoxHeight: 300, // 盒子高度
  modalBoxBg: '#fff', // 背景色
  hide: function () { }, // 关闭时的回调函数
  transparentIsClick: true  // 透明区域是否可以点击
}
