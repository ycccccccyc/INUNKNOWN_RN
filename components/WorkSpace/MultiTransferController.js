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

const { width, height } = Dimensions.get('window')

export default class MultiTransferController extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      offset: new Animated.Value(0),
      show: false
    };
    this.updateStylize = this.props._updateStylize
    this.renderStylePreview = this.props._renderStylePreview
    this.showChooseContentInModel = this.props._showChooseContentInModel
    this.styleList = this.props.styleList
  }



  in() {
    Animated.timing(
      this.state.offset,
      {
        easing: Easing.linear,
        duration: 200,
        toValue: 1,
        useNativeDriver: false
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
        useNativeDriver: false
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
    this.hide()
  }



  render() {
    return (
      <Animated.View
        style={[styles.modalBox, {
          width: '100%',
          bottom: this.state.offset.interpolate({
            inputRange: [0, 1],
            outputRange: [-200, 0]
          })
        }]}>
        <View style={{position: 'absolute', bottom: 170, width: '100%'}}>
          <Text style={{color: '#fff', marginLeft: 20, fontSize: 10}}>风格化程度</Text>
          <Slider
            style={{ width: 360, }}
            value={50}
            step={0}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor={'rgb(124,220,254)'}
            maximumTrackTintColor={'rgba(124,220,254, 0.7)'}
            thumbTintColor={'white'}
            onSlidingComplete={ (value) => this.updateStylize(value / 100)}
          />
        </View>
        <View style={{position: 'absolute', bottom: 135, backgroundColor: 'rgba(255, 255, 255, 0.4)', width: '100%', height: 30, borderRadius: 10}}>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent:'center',alignItems: 'center', width: 96, height: 30, zIndex: 10, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
            <Image source={require('../../assets/icon/icon_fromCommunity.png')} style={{width: 33, height: 20}}></Image>
            <Text style={{fontSize: 12}}>来自社区</Text>
          </View>
          <View style={{position: 'absolute', display: 'flex', flexDirection: 'row', top: 3, width: 240, left: 106, height: 30, backgroundColor: 'rgba(255, 255, 255, 0)'}}>
            <Text style={{fontSize: 12, paddingTop: 3, width: 50, textAlign: 'center', height: 24, borderRadius: 5, marginRight: 6, backgroundColor: 'rgba(255, 255, 255, 0.6)'}}>分组1</Text>
            <Text style={{fontSize: 12, paddingTop: 3, width: 50, textAlign: 'center', height: 24, borderRadius: 5, marginRight: 6, backgroundColor: 'rgba(255, 255, 255, 0.6)'}}>分组2</Text>
            <Text style={{fontSize: 12, paddingTop: 3, width: 50, textAlign: 'center', height: 24, borderRadius: 5, marginRight: 6, backgroundColor: 'rgba(255, 255, 255, 0.6)'}}>分组3</Text>
          </View>
        </View>
        <View style={styles.presetStylesMode1}>
          <ScrollView horizontal={true} style={{height: 90, marginLeft: 20, marginRight: 20}}>
            {
              this.styleList.map((item, index) => this.renderStylePreview(item, index))
            }
          </ScrollView>
          <View style={{height: 30, width: '100%', position: 'absolute', bottom: 0, display: 'flex', flexDirection: 'row', borderTopWidth: 1, borderColor: '#ccc'}}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {if (!this.props.isLoading) this.showChooseContentInModel()}}>
              <View style={[styles.custom_flexCenter, {flex: 1, textAlign: 'center', borderRightWidth: 1, borderColor: '#ddd'}]}>
                <Image source={require('../../assets/icon/icon_picture.png')} style={{width: 25, height: 25}}></Image>
                <Text>图片</Text>
              </View>
            </TouchableOpacity>
            <View style={[styles.custom_flexCenter, {flex: 1, textAlign: 'center', borderRightWidth: 1, borderColor: '#ddd'}]}>
            <Image source={require('../../assets/icon/icon_cut.png')} style={{width: 23, height: 23}}></Image>
              <Text>裁剪</Text>
            </View>
            <View style={[styles.custom_flexCenter, {flex: 1, textAlign: 'center', borderRightWidth: 1, borderColor: '#ddd'}]}>
            <Image source={require('../../assets/icon/icon_board.png')} style={{width: 20, height: 20}}></Image>
              <Text>画框</Text>
            </View>
            <View style={[styles.custom_flexCenter, {flex: 1, textAlign: 'center'}]}>
            <Image source={require('../../assets/icon/icon_modify.png')} style={{width: 20, height: 20}}></Image>
              <Text>微调</Text>
            </View>
          </View>
        </View>
      </Animated.View>

    )
  }
}

const styles = StyleSheet.create({
  presetStylesMode1: {
    position: 'absolute',
    width: '100%',
    height: 130,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    bottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 10,
  },
  custom_flexCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

MultiTransferController.defaultProps = {
  modalBoxHeight: 300, // 盒子高度
  modalBoxBg: '#fff', // 背景色
  hide: function () { }, // 关闭时的回调函数
  transparentIsClick: true  // 透明区域是否可以点击
}
