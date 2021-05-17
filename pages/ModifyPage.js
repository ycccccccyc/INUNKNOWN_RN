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
  findNodeHandle
} from 'react-native';
import { BlurView, VibrancyView } from "react-native-blur";

const { width, height } = Dimensions.get('window')

export default class ModifyPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      offset: new Animated.Value(0),
      show: false,
      image: null,
      viewRef: null,
      backgroundImgLoaded: false
    }
  }

  in() {
    Animated.timing(
      this.state.offset,
      {
        easing: Easing.linear,
        duration: 100,
        toValue: 1,
      }
    ).start()
  }

  out() {
    Animated.timing(
      this.state.offset,
      {
        easing: Easing.linear,
        duration: 100,
        toValue: 0,
      }
    ).start()

    setTimeout(
      () => this.setState({ show: false }),
      300
    )
  }

  show(image) {
    this.setState({
      image: image,
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


  _renderImage() {
    const screenRatio = gWidth / gHeight;
    let height = Math.ceil(gHeight - 200);
    let width = Math.ceil(this.state.image.width / this.state.image.height  * height);
    if (width > gWidth) {
      width = gWidth;
      height = Math.floor(this.state.image.height / this.state.image.width * width);
    }
    return (
      <Image
        source={{uri: this.state.image.url}}
        style={{height: height, width: width, marginBottom: 200}} />
    )
  }



  componentDidMount() {
    // this.show();
  }

  imageLoaded() {
    this.setState({
      viewRef: findNodeHandle(this.backgroundImg),
    }, this.forceUpdate())
    this.setState({
      backgroundImgLoaded: true
    })
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

            
            <Image
              ref={(img) => {this.backgroundImg = img}}
              source={{uri: this.state.image.url}}
              onLoadEnd={this.imageLoaded.bind(this)}
              style={{width: '100%', height: '100%', position: 'absolute'}} />
            <View style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, backgroundColor: 'rgba(255, 255, 255, 0.6)'}}></View>
            {/* {
              this.state.backgroundImgLoaded ? 
              <BlurView
                style={{position: 'absolute', top: 0, top: 0, bottom: 0, right: 0, width: '100%', height: '100%'}}
                blurType="light"
                viewRef={this.state.viewRef}
                blurAmount={10} /> : null
            } */}

            {
              this._renderImage()
            }



            {/* 控制栏 */}
            <View style={styles.controller}>

            </View>


            <TouchableOpacity
              style={{position: 'absolute', top: 10, left: 10}}
              onPress={() => this.hide()}>
              <Text>关闭</Text>
            </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  custom_flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%'
  },
  controller: {
    width: '100%',
    height: 210,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
  }
})

ModifyPage.defaultProps = {
  modalBoxHeight: 300, // 盒子高度
  modalBoxBg: '#fff', // 背景色
  hide: function () { }, // 关闭时的回调函数
  transparentIsClick: true  // 透明区域是否可以点击
}
