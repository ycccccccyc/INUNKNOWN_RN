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


export default class MultiStyleRatioPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      panelHeight: new Animated.Value(0),
    }
  }

  in() {
    Animated.timing(
      this.state.panelHeight,
      {
        easing: Easing.linear,
        duration: 200,
        toValue: 1
      }
    ).start()
  }

  out() {
    Animated.timing(
      this.state.panelHeight,
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
    return (
      <Animated.View
        style={[styles.setting_panel, {
          height: this.state.panelHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 100]
          })
        }]}>
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  setting_panel: {
    width: 200,
    height: 0,
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    position: 'absolute',
    bottom: 215,
    left: 5,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    overflow: 'hidden'
  },
  setting_panel_text: {
    color: '#fff',
    fontSize: 11,
    marginBottom: 5
  }
})
