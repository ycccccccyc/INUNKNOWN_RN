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
      show: false,
      styleList: this.props.styleList,
      styleIndexSelectedMulti: [],
      imgTransferred: false,
      currentRatioConcernedIndex: 0
    };
    this.updateStylize = this.props._updateStylize
    // this.renderStylePreview = this.props._renderStylePreview
    this.showChooseContentInModel = this.props._showChooseContentInModel

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

  _renderCurrentRatioConcerned() {
    if (this.state.styleIndexSelectedMulti.length === 0) return (
      <View style={{width: 40, height: 40, display: 'flex', justifyContent: 'center', alignItems:'center', position: 'absolute', left: 5, top: -20, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 5}}>
        <Image source={require('../../assets/icon/icon_question.png')} style={{width: 30, height: 30, opacity: 0.5}}></Image>
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
    const bgc = this.state.styleIndexSelectedMulti.indexOf(index) > 0 ? 'rgb(23,173,118)' : '#bbb'
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
        <View style={{position: 'absolute', bottom: 175, width: '100%'}}>
          <Text style={{color: '#fff', marginLeft: 20, fontSize: 10, position: 'absolute', top: -12, left: 40}}>风格化程度</Text>
          {
            this._renderCurrentRatioConcerned()
          }
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
        </View>
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
  }
})

MultiTransferController.defaultProps = {
  modalBoxHeight: 300, // 盒子高度
  modalBoxBg: '#fff', // 背景色
  hide: function () { }, // 关闭时的回调函数
  transparentIsClick: true  // 透明区域是否可以点击
}
