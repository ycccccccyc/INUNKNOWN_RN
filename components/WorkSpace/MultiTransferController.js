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
import MultiStyleRatioPanel from './MultiStyleRatioPanel';

const { width, height } = Dimensions.get('window')

export default class MultiTransferController extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      offset: new Animated.Value(0),
      show: false,
      styleList: this.props.styleList,
      styleIndexSelectedMulti: [],
      imgTransferred: false,
      currentRatioConcernedIndex: 0
    };
    this.updateStylize = this.props._updateStylize
    // this.renderStylePreview = this.props._renderStylePreview
    this.showChooseContentInModel = this.props._showChooseContentInModel

    this.settingPanelRef = React.createRef();
    this.multiStyleRatioPanelRef = React.createRef();

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

  // 渲染当前选定、正在操控程度设置的预览图
  _renderCurrentRatioConcerned() {
    const { styleIndexSelectedMulti, styleList } = this.state;
    if (styleIndexSelectedMulti.length === 0) return (
      <Image source={require('../../assets/icon/icon_question.png')} style={{width: 30, height: 30, opacity: 0.5}}></Image>
    )
    return (
      <View style={{width: 30, height: 30, borderWidth: 1, borderColor: '#fff', backgroundColor: 'rgba(0, 0, 0, 0)', top: -1, left: -1}}>
        <Image source={{uri: styleList[styleIndexSelectedMulti[0]].url}} style={{width: 30, height: 30, left: 2, top: 2}}></Image>
        <View style={styles.current_ratio_concerned_flag}>
          <Text style={{fontSize: 10, color: '#fff', textAlign: 'center'}}>{styleIndexSelectedMulti.length}</Text>
        </View>
      </View>
    )
  }

  _selectStyleImg() {

  }

  _addStyleSelected(index) {
    let {styleList, styleIndexSelectedMulti} = this.state;

    const thisSelected = styleList[index].selected;
    styleList[index].selected = !thisSelected;

    if (thisSelected) {
      styleIndexSelectedMulti.splice(styleIndexSelectedMulti.indexOf(index), 1)
    }
    else {
      styleIndexSelectedMulti.push(index);
    }
    
    this.setState({
      styleList,
      styleIndexSelectedMulti,
      imgTransferred: false
    }, () => {
      if (this.state.selectedContentImg) this.updateStylize();
    });

    console.log('目前的风格列表为：' + this.state.styleIndexSelectedMulti)
  }

  _renderStylePreview(item, index) {
    // 首个：总是为添加
    if (index === 0 && item.url.length === 0) return (
      <TouchableOpacity key={index}
        style={{marginRight: 10, backgroundColor: '#eee', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 18}}
        onPress={() => this._selectStyleImg()}>
        <Image source={require('../../assets/images/stylesPreview/no_picture.png')} style={{width: 40, height: 40}}></Image>
      </TouchableOpacity>
    )
    else if (!item.preset) return (
      <View style={{marginRight: 10, marginTop: 18}} key={index}>
        <TouchableOpacity  onPress={() => this._addStyleSelected(index)}>
          <Image source={{ uri: item.url }} style={{width: 80, height: 80}}></Image>
        </TouchableOpacity>
        
        <View style={{position: 'absolute', bottom: 0, width: '100%', height: 20, backgroundColor: 'rgba(255, 255, 255, 0.6)', display: 'flex', justifyContent: 'center', paddingLeft: 10}}>
          <Text style={{fontSize: 10}}>自定义风格</Text>
        </View>
        {
          this._renderStyleSelectedFlag()
        }
      </View>
    );
    else return (
      <View key={index} style={{marginRight: 10, marginTop: 18}}>
        <TouchableOpacity onPress={() => this._addStyleSelected(index)}>
          <Image source={{uri: this.state.styleList[index].url}} style={{width: 80, height: 80}} />
        </TouchableOpacity>
        <View style={{position: 'absolute', bottom: 0, width: '100%', height: 20, backgroundColor: 'rgba(255, 255, 255, 0.7)', display: 'flex', justifyContent: 'center', paddingLeft: 10}}>
          <Text style={{fontSize: 10}}>{item.name}</Text>
        </View>
        {
          this._renderStyleSelectedFlag(index)
        }
      </View>
    )
  }
  _renderStyleSelectedFlag(index) {
    const bgc = this.state.styleIndexSelectedMulti.indexOf(index) !== -1 ? 'rgb(23,173,118)' : '#bbb'
    return (
      <TouchableHighlight
        style={[styles.flag_selected, {backgroundColor: bgc}]}
        activeOpacity={0.6}
        underlayColor="#999"
        onPress={() => this._addStyleSelected(index)}>
        <Image source={require('../../assets/icon/icon_selected.png')} style={{width: 22, height: 22}}></Image>
      </TouchableHighlight>
    )
  }


  _renderStyleRatioContoller(item, index) {
    const { styleIndexSelectedMulti, styleList } = this.state;
    return (
      <View ref={index}  style={{width: '100%', height: 36, marginBottom: 5, borderBottomWidth: 1, borderColor: '#eee'}}>
        <Image source={{uri: styleList[styleIndexSelectedMulti[index]].url}} style={{width: 32, height: 32, borderRadius: 4, position: 'absolute'}}></Image>
        <View style={{marginLeft: 40}}>
          <Text style={{fontSize: 11}}>{ styleList[styleIndexSelectedMulti[index]].name }</Text>
          <Slider
            style={{ width: 220, left: -14}}
            value={50}
            step={0}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor={'rgb(79,193,241)'}
            maximumTrackTintColor={'rgba(79,193,241, 0.8)'}
            thumbTintColor={'rgb(124,220,254)'}
            onSlidingComplete={ (value) => {}}
          />
        </View>
        <View style={{position: 'absolute', right: 0, top: 14}}>
          <Text style={{fontSize: 11}}>99%</Text>
        </View>
      </View>
    )
  }


  render() {
    return (
      <Animated.View
        style={[styles.modalBox, {
          width: '100%',
          bottom: this.state.offset.interpolate({
            inputRange: [0, 1],
            outputRange: [-220, 0]
          })
        }]}>

        {/* 程度控制条 */}
        <View style={{position: 'absolute', bottom: 175, width: '100%'}}>
          <Text style={{color: '#fff', marginLeft: 20, fontSize: 10, position: 'absolute', top: -12, left: 40}}>风格化程度</Text>
          
          {/* 可点击的风格比例详情列表预览图 */}
          <TouchableOpacity style={styles.current_ratio_concerned} onPress={() => this.multiStyleRatioPanelRef.current.show()}>
            {
              this._renderCurrentRatioConcerned()
            }
          </TouchableOpacity>

          {/* 滑块 */}
          <Slider
            style={{ width: Dimensions.get('window').width - 60, marginLeft: 35 }}
            value={50}
            step={0}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor={'rgb(124,220,254)'}
            maximumTrackTintColor={'rgba(124,220,254, 0.7)'}
            thumbTintColor={'white'}
            onSlidingComplete={ (value) => this.updateStylize(value / 100)}
          />

          {/* 设置面板按钮 */}
          <TouchableOpacity
            style={{width: 30, height: 30, position: 'absolute', bottom: -5, right: 5}}
            onPress={() => {this.settingPanelRef.current.showOrHide()}}>
            <Image source={require('../../assets/icon/icon_setting_48.png')} style={{width: 25, height: 25, opacity: 0.5}}></Image>
          </TouchableOpacity>
        </View>

        {/* 分类 */}
        <View style={{position: 'absolute', bottom: 140, backgroundColor: 'rgba(255, 255, 255, 0.4)', width: '100%', height: 30, borderRadius: 10}}>
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

        {/* 风格图列表 */}
        <View style={styles.presetStylesMode1}>
          <ScrollView horizontal={true} style={{height: 90, marginLeft: 20, marginRight: 20}}>
            {
              this.state.styleList.map((item, index) => this._renderStylePreview(item, index))
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

        {/* 设置面板 */}
        <SettingPanel ref={this.settingPanelRef} mode={1}>
          <TouchableOpacity
            onPress={() => {this.settingPanelRef.current.showOrHide()}}
            style={{width: 100, height: 25, position: 'absolute', left: 50, display: 'flex', alignItems: 'center', top: 8}}>
            <Image source={require('../../assets/icon/icon_hide_down.png')} style={{width: 17, height: 5}}></Image>
          </TouchableOpacity>
          <Text style={[{marginTop: 15}, styles.setting_panel_text]}>内容图粒度：</Text>
          <Text style={styles.setting_panel_text}>风格图粒度：</Text>
          <Text style={styles.setting_panel_text}>特征提取算法：</Text>
          <Text style={styles.setting_panel_text}>迁移算法：</Text>
        </SettingPanel>

        {/* 风格比例列表面板 */}
        <MultiStyleRatioPanel ref={this.multiStyleRatioPanelRef}>
          {/* 关闭按钮 */}
          <TouchableOpacity
            onPress={() => {this.multiStyleRatioPanelRef.current.showOrHide()}}
            style={{position: 'absolute', right: 0, display: 'flex', alignItems: 'center', justifyContent:'center', top: 10, right: 10, zIndex: 100}}>
            <Image source={require('../../assets/icon/icon_close.png')} style={{width: 15, height: 15}}></Image>
          </TouchableOpacity>
          <Text style={[styles.multi_style_ratio_panel_text, {marginTop: 8, textAlign: 'center', fontSize: 12}]}>风格比例面板（{this.state.styleIndexSelectedMulti.length}）</Text>

          <ScrollView
            style={{ margin: 10}}>
            {
              this.state.styleIndexSelectedMulti.map((item, index) => this._renderStyleRatioContoller(item, index))
            }
          </ScrollView>
        </MultiStyleRatioPanel>
      </Animated.View>

    )
  }
}

const styles = StyleSheet.create({
  presetStylesMode1: {
    position: 'absolute',
    width: '100%',
    height: 135,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    bottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  custom_flexCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flag_selected: {
    position: 'absolute',
    top: -12, right: -5,
    zIndex: 100,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  current_ratio_concerned: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    position: 'absolute',
    left: 5,
    top: -20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5
  },
  current_ratio_concerned_flag: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute', right: -3, bottom: -3,
    borderWidth: 1,
    borderColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  setting_panel_text: {
    color: '#fff',
    fontSize: 11,
    marginBottom: 5
  },
  multi_style_ratio_panel_text: {
    color: '#000',
    fontSize: 11,
  }
})

MultiTransferController.defaultProps = {
  modalBoxHeight: 300, // 盒子高度
  modalBoxBg: '#fff', // 背景色
  hide: function () { }, // 关闭时的回调函数
  transparentIsClick: true  // 透明区域是否可以点击
}
