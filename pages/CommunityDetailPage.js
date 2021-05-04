import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Dimensions,
    Animated,
    Easing
} from 'react-native';

export default class CommunityDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftOffset: new Animated.Value(0)
    }
  }

  in() {
    Animated.timing(
      this.state.leftOffset,
      {
        easing: Easing.linear,
        duration: 200,
        toValue: 1,
      }
    ).start()
  }

  out() {
    Animated.timing(
      this.state.leftOffset,
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

  componentDidMount() {
    // this.hide()
  }


  render() {
    return (
      <Animated.View
      style={[{
        width: '100%',
        height: '100%',
        backgroundColor: '#eee',
        position: 'absolute',
        marginLeft: this.state.leftOffset.interpolate({
          inputRange: [0, 1],
          outputRange: [Dimensions.get('window').width, 0]
        })
      }]}>
        <View style={{ width: '100%', height: '100%',  alignItems: 'center', justifyContent: 'center' }}>
          <Text>favorite</Text>
          {/* <Button title="Go back" onPress={() => navigation.goBack()} /> */}
        </View>
      </Animated.View>

    );
  }
}

CommunityDetailPage.defaultProps = {
  modalBoxHeight: 300, // 盒子高度
  modalBoxBg: '#fff', // 背景色
  hide: function () { }, // 关闭时的回调函数
  transparentIsClick: true  // 透明区域是否可以点击
}
