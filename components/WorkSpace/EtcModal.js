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
  Easing,
  Slider
} from 'react-native';


export default class EtcModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      panelHeight: new Animated.Value(0),
      panelWidth: new Animated.Value(0),
      mode: this.props.mode,
    }
  }

  in() {
    Animated.timing(
      this.state.panelHeight,
      {
        easing: Easing.linear,
        duration: 100,
        toValue: 1
      }
    ).start()
  }

  out() {
    Animated.timing(
      this.state.panelHeight,
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

  show() {
    this.setState({
      show: true
    }, this.in())
  }

  hide() {
    this.out()
  }

  showOrHide() {
    if (this.state.show) this.hide();
    else this.show()
  }

  componentDidMount() {
    this.hide();
  }

  defaultHide() {
    this.props.hide()
    this.out()
  }

  render() {
    const offsetLeft = this.state.mode === 0 ? 5 : Dimensions.get('window').width - 205;
    return (
      <Animated.View
        style={[styles.etc_modal, {
          height: this.state.panelHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 100]
          }),
        }]}>
          {
            this.state.show ?         <View style={styles.etc_item}>
              <Text style={{color: '#fff'}}>保存到相册</Text>
            </View> : null
          }

        <View style={styles.etc_item}>
          <Text>分享</Text>
        </View>
        <View style={styles.etc_item}>
          <Text>暂存到工作台</Text>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  etc_modal: {
    width: 120,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    position: 'absolute',
    top: 45,
    right: 5,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  // tri_decoration: {
  //   position: 'absolute',
  //   width: 0,
  //   height: 0,
  //   right: 10,
  //   top: -5,
  //   zIndex: 9999,
  //   borderBottomWidth: 10,
  //   borderLeftWidth: 10,
  //   borderRightWidth: 10,
  //   borderBottomColor: '#fff',
  //   borderLeftColor: 'rgba(255, 0, 0, 1)',
  //   borderRightColor: 'rgba(255, 0, 0, 1)',
  // },
  etc_item: {
    width: '100%',
    height: 30,
    borderBottomColor: '#999',
    borderBottomWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff'
  },
  etc_modal_text: {
    color: '#fff',
    fontSize: 11,
    marginBottom: 5
  }
})
