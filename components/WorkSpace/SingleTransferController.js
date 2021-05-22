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

import SettingPanel from './SettingPanel';


export default class SingleTransferController extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      offset: new Animated.Value(0),
      show: false
    };
    this.updateStylize = this.props._updateStylize
    this.showChooseContentInModel = this.props._showChooseContentInModel
    this.showModifyPage = this.props._showModifyPage
    this.showResizeImagePage = this.props._showResizeImagePage
    this.showAddFramePage = this.props._showAddFramePage
    this.selectStyleImg = this.props._selectStyleImg
    this.changeStyleSelected = this.props._changeStyleSelected

    this.styleList = this.props.styleList

    this.settingPanelRef = React.createRef();
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


  // 渲染风格图预览
  _renderStylePreview(item, index) {
    // 首个：总是为添加
    if (index === 0) return (
      <TouchableOpacity key={index}
        style={{marginRight: 10, backgroundColor: '#eee', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
        onPress={() => this.selectStyleImg()}>
        <Image source={require('../../assets/images/stylesPreview/no_picture.png')} style={{width: 40, height: 40}}></Image>
      </TouchableOpacity>
    )
    else if (!item.preset) return (
      <View style={{marginRight: 10}} key={index}>
        <TouchableOpacity  onPress={() => this.changeStyleSelected(index)}>
          <Image source={{ uri: item.url }} style={{width: 80, height: 80}}></Image>
        </TouchableOpacity>
        
        <View style={{position: 'absolute', bottom: 10, width: '100%', height: 20, backgroundColor: 'rgba(255, 255, 255, 0.6)', display: 'flex', justifyContent: 'center', paddingLeft: 10}}>
          <Text style={{fontSize: 10}}>自定义风格</Text>
        </View>
        {
          item.selected ? this._renderStyleSelectedFlag() : null
        }
      </View>
    );
    else return (
      <View key={index} style={{marginRight: 10, position: 'relative'}}>
        <TouchableOpacity onPress={() => this.changeStyleSelected(index)}>
          <Image source={{uri: this.styleList[index].url}} style={{width: 80, height: 80}} />
        </TouchableOpacity>
        <View style={{position: 'absolute', bottom: 10, width: '100%', height: 20, backgroundColor: 'rgba(255, 255, 255, 0.7)', display: 'flex', justifyContent: 'center', paddingLeft: 10}}>
          <Text style={{fontSize: 10}}>{item.name}</Text>
        </View>
        {
          item.selected ? this._renderStyleSelectedFlag() : null
        }
      </View>
    )
  }
  _renderStyleSelectedFlag() {
    return (
      <View style={{position: 'absolute', top: 0, zIndex: 100}}>
        <Image source={require('../../assets/images/stylesPreview/selected_flag.png')} style={{width: 30, height: 30, top: 20, left: 25}}></Image>
      </View>
    )
  }


  componentDidMount() {
    this.show()
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

        {/* 风格化程度滑块 */}
        <View style={{position: 'absolute', bottom: 170, width: '100%'}}>
          <Text style={{color: '#fff', marginLeft: 45, fontSize: 10}}>风格化程度</Text>
          <Slider
            style={{ width: Dimensions.get('window').width - 30, marginLeft: 30 }}
            value={100}
            step={0}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor={'rgb(124,220,254)'}
            maximumTrackTintColor={'rgba(124,220,254, 0.7)'}
            thumbTintColor={'white'}
            onSlidingComplete={ (value) => this.updateStylize(value / 100)}
          />
        </View>

        {/* 设置按钮 */}
        <TouchableOpacity
          style={{width: 30, height: 30, position: 'absolute', bottom: 170, left: 10}}
          onPress={() => {this.settingPanelRef.current.showOrHide()}}>
          <Image source={require('../../assets/icon/icon_setting_48.png')} style={{width: 25, height: 25}}></Image>
        </TouchableOpacity>

        {/* 设定面板 */}
        <SettingPanel ref={this.settingPanelRef} mode={0}>
        </SettingPanel>


        {/* 分组 */}
        <View style={{position: 'absolute', bottom: 135, backgroundColor: 'rgba(255, 255, 255, 0.4)', width: '100%', height: 30, borderRadius: 10}}>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent:'center',alignItems: 'center', width: 96, height: 30, zIndex: 10, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
            <Image source={require('../../assets/icon/icon_fromCommunity.png')} style={{width: 33, height: 20}}></Image>
            <Text style={{fontSize: 12}}>来自社区</Text>
          </View>
          <View style={{position: 'absolute', display: 'flex', flexDirection: 'row', top: 3, width: 240, left: 106, height: 30, backgroundColor: 'rgba(255, 255, 255, 0)'}}>
            <Text style={{fontSize: 12, paddingTop: 3, width: 50, textAlign: 'center', height: 24, borderRadius: 5, marginRight: 6, backgroundColor: 'rgba(255, 255, 255, 1)'}}>古典</Text>
            <Text style={{fontSize: 12, paddingTop: 3, width: 50, textAlign: 'center', height: 24, borderRadius: 5, marginRight: 6, backgroundColor: 'rgba(255, 255, 255, 0.6)'}}>纹理</Text>
            <Text style={{fontSize: 12, paddingTop: 3, width: 60, textAlign: 'center', height: 24, borderRadius: 5, marginRight: 6, backgroundColor: 'rgba(255, 255, 255, 0.6)'}}>自然风光</Text>
          </View>
        </View>

        {/* 风格栏 */}
        <View style={styles.presetStylesMode1}>
          <ScrollView horizontal={true} style={{height: 90, marginLeft: 20, marginRight: 20}}>
            {
              this.styleList.map((item, index) => this._renderStylePreview(item, index))
            }
          </ScrollView>
          {/* 底部按钮 */}
          <View style={{height: 30, width: '100%', position: 'absolute', bottom: 0, display: 'flex', flexDirection: 'row', borderTopWidth: 1, borderColor: '#ccc'}}>
            
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {if (!this.props.isLoading) this.showChooseContentInModel()}}>
              <View style={[styles.custom_flexCenter, {flex: 1, textAlign: 'center', borderRightWidth: 1, borderColor: '#ddd'}]}>
                <Image source={require('../../assets/icon/icon_picture.png')} style={{width: 25, height: 25}}></Image>
                <Text>图片</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {if (!this.props.isLoading) this.showResizeImagePage()}}>
              <View style={[styles.custom_flexCenter, {flex: 1, textAlign: 'center', borderRightWidth: 1, borderColor: '#ddd'}]}>
                <Image source={require('../../assets/icon/icon_cut.png')} style={{width: 23, height: 23}}></Image>
                <Text>裁剪</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {if (!this.props.isLoading) this.showAddFramePage()}}>
              <View style={[styles.custom_flexCenter, {flex: 1, textAlign: 'center', borderRightWidth: 1, borderColor: '#ddd'}]}>
                <Image source={require('../../assets/icon/icon_board.png')} style={{width: 20, height: 20}}></Image>
                <Text>画框</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {if (!this.props.isLoading) this.showModifyPage()}}>
              <View style={[styles.custom_flexCenter, {flex: 1, textAlign: 'center'}]}>
                <Image source={require('../../assets/icon/icon_modify.png')} style={{width: 20, height: 20}}></Image>
                <Text>保存</Text>
              </View>
            </TouchableOpacity>

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
  setting_panel: {
    width: 200,
    height: 0,
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    position: 'absolute',
    bottom: 210,
    left: 10,
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

SingleTransferController.defaultProps = {
  modalBoxHeight: 300, // 盒子高度
  modalBoxBg: '#fff', // 背景色
  hide: function () { }, // 关闭时的回调函数
  transparentIsClick: true  // 透明区域是否可以点击
}
