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

import Switch from '../base/Switch';

export default class SettingPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      panelHeight: new Animated.Value(0),
      mode: this.props.mode,
      autoCompress: false,
    }

    this.resizeSliderRef = React.createRef();
    this.compressSliderRef = React.createRef();
  }

  in() {
    Animated.timing(
      this.state.panelHeight,
      {
        easing: Easing.linear,
        duration: 100,
        toValue: 1,
      }
    ).start()
  }

  out() {
    Animated.timing(
      this.state.panelHeight,
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



  _changeResizeRatio(value) {
    this.setState({
      tempResizeRatio: value.toFixed(2).toString()
    })
    gContentResizeRatio = value.toFixed(2);
  }
  _changeCompressRatio(value) {
    this.setState({
      tempResizeRatio: value.toFixed(2).toString()
    })
    gCompressRatio = value.toFixed(2);
  }

  _openHighStyleNet() {
    gStyler.useModels({styleNet: 2})
  }
  _closeHighStyleNet() {
    gStyler.useModels({styleNet: 1})
  }
  _openHighTransformNet() {
    gStyler.useModels({transformNet: 2})
  }
  _closeHighTransformNet() {
    gStyler.useModels({transformNet: 1})
  }
  _openResizeImage() {
    this.setState({
      autoCompress: true
    })
  }
  _closeResizeImage() {
    this.setState({
      autoCompress: false
    })
    // gContentResizeRatio = 1.00;
    // gCompressRatio = 0.75;
  }




  render() {
    const offsetLeft = this.state.mode === 0 ? 5 : Dimensions.get('window').width - 225;
    return (
      <Animated.View
        style={[styles.setting_panel, {
          left: offsetLeft,
          height: this.state.panelHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 200]
          })
        }]}>
          <TouchableOpacity
            onPress={() => {this.showOrHide()}}
            style={{width: 100, height: 25, position: 'absolute', left: 60, display: 'flex', alignItems: 'center', top: 8}}>
            <Image source={require('../../assets/icon/icon_hide_down.png')} style={{width: 17, height: 5}}></Image>
          </TouchableOpacity>

          <View style={{display: 'flex', flexDirection: 'row', marginTop: 35}}>
            <Text style={styles.setting_panel_text}>是否缩小图像尺寸</Text>
            <Switch
              margin={20}
              open={this._openResizeImage.bind(this)}
              close={this._closeResizeImage.bind(this)}
            />
          </View>

          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={styles.setting_panel_text}>缩放率：</Text>
            <Slider
              style={{ width: 144, marginLeft: -15 }}
              value={1.00}
              step={0}
              minimumValue={0.2}
              maximumValue={1}
              disabled={this.state.autoCompress ? false : true}
              minimumTrackTintColor={'rgb(124,220,254)'}
              maximumTrackTintColor={'rgba(124,220,254, 0.7)'}
              thumbTintColor={'white'}
              onValueChange={(value) => this._changeResizeRatio(value)}
              ref={this.resizeSliderRef}
            />
            <Text style={[styles.setting_panel_text, {marginLeft: -7}]}>{parseFloat(gContentResizeRatio).toFixed(2).toString()}</Text>
          </View>

          <Text style={{fontSize: 9, color: '#999'}}>（影响到图片的质量）</Text>

          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={styles.setting_panel_text}>自动压缩率：</Text>
            <Slider
              style={{ width: 118, marginLeft: -15 }}
              value={0.75}
              step={0}
              minimumValue={0.2}
              maximumValue={1}
              disabled={this.state.autoCompress ? false : true}
              minimumTrackTintColor={'rgb(124,220,254)'}
              maximumTrackTintColor={'rgba(124,220,254, 0.7)'}
              thumbTintColor={'white'}
              onValueChange={ (value) => this._changeCompressRatio(value)}
              ref = {this.compressSliderRef}
            />
            <Text style={[styles.setting_panel_text, {marginLeft: -7}]}>{parseFloat(gCompressRatio).toFixed(2).toString()}</Text>
          </View>
          
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={styles.setting_panel_text}>特征提取模式：</Text>
            <Text style={{color: '#aaa', fontSize: 11, top: 2, marginLeft: 10}}>快速</Text>
            <Switch
              margin={5}
              open={this._openHighStyleNet.bind(this)}
              close={this._closeHighStyleNet.bind(this)}
            />
            <Text style={{color: '#aaa', fontSize: 11, top: 2, marginLeft: 10}}>高质</Text>
          </View>

          <Text style={{fontSize: 9, color: '#999'}}>（抽取特征使用的模型精度）</Text>

          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={styles.setting_panel_text}>特征迁移模式：</Text>
            <Text style={{color: '#aaa', fontSize: 11, top: 2, marginLeft: 10}}>快速</Text>
            <Switch
              margin={5}
              open={this._openHighTransformNet.bind(this)}
              close={this._closeHighTransformNet.bind(this)}
            />
            <Text style={{color: '#aaa', fontSize: 11, top: 2, marginLeft: 10}}>高质</Text>
          </View>

          <Text style={{fontSize: 9, color: '#999'}}>（生成迁移图像使用的模型精度）</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  setting_panel: {
    width: 220,
    height: 0,
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    position: 'absolute',
    bottom: 215,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    overflow: 'hidden'
  },
  setting_panel_text: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 5
  }
})
