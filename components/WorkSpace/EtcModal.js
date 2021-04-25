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
  Slider,
  Platform,
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

    this.saveImage = this.props.saveImage;
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


  _saveToTemp() {

  }

  _share() {

  }

  render() {
    const offsetLeft = this.state.mode === 0 ? 5 : Dimensions.get('window').width - 205;
    return (
      <Animated.View
        style={[styles.etc_modal, {
          height: this.state.panelHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 108]
          }),
        }]}>
        <TouchableHighlight
          style={[styles.etc_item, {marginTop: 8}]}
          activeOpacity={0.6}
          underlayColor="#eee"
          onPress={() => this.saveImage()}>
            <View style={{width: '100%'}}>
              <Image source={require('../../assets/icon/icon_save.png')} style={{width: 20, height: 20, position: 'absolute', left: 5, opacity: 0.6}}></Image>
              <Text style={[styles.etc_modal_text, {marginLeft: 30}]}>保存到相册</Text>
            </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.etc_item}
          activeOpacity={0.6}
          underlayColor="#eee"
          onPress={() => this._share()}>
            <View style={{width: '100%'}}>
              <Image source={require('../../assets/icon/icon_share.png')} style={{width: 20, height: 20, position: 'absolute', left: 6, opacity: 0.6}}></Image>
              <Text style={[styles.etc_modal_text, {marginLeft: 30}]}>分享</Text>
            </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.etc_item, {borderBottomWidth: 0, marginBottom: 8}]}
          activeOpacity={0.6}
          underlayColor="#eee"
          onPress={() => this._saveToTemp()}>
            <View style={{width: '100%'}}>
              <Image source={require('../../assets/icon/workspace_inactive.png')} style={{width: 20, height: 20, position: 'absolute', left: 6, opacity: 0.8}}></Image>
              <Text style={[styles.etc_modal_text, {marginLeft: 30}]}>暂存到工作台</Text>
            </View>
        </TouchableHighlight>
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  etc_modal: {
    width: 120,
    height: 0,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    position: 'absolute',
    top: 45,
    right: 2,
    borderRadius: 5,
    overflow: 'hidden',
  },
  etc_item: {
    height: 30,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    marginLeft: 5,
    marginRight: 5
  },
  etc_modal_text: {
    color: '#777',
    fontSize: 13,
    marginBottom: 5,
    textAlign: 'left'
  }
})
