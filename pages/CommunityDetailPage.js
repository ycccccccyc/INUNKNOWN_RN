import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Dimensions,
    Animated,
    Easing,
    Image,
    ScrollView,
    TouchableOpacity
} from 'react-native';

import EventBus from 'react-native-event-bus';

export default class CommunityDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftOffset: new Animated.Value(0),
      imgWidth: 0,
      imgHeight: 0
    };
    this.detailData = {};
  }

  in() {
    Animated.timing(
      this.state.leftOffset,
      {
        easing: Easing.linear,
        duration: 150,
        toValue: 1,
      }
    ).start()
  }

  out() {
    Animated.timing(
      this.state.leftOffset,
      {
        easing: Easing.linear,
        duration: 150,
        toValue: 0,
      }
    ).start()

    setTimeout(
      () => this.setState({ show: false }),
      100
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
    EventBus.getInstance().addListener("showCommunityDetailPage", this.listener = data => {
      this.detailData = data;
      console.log(data);
      Image.getSize(data.imgUrl, (width, height) => {
        const displayWidth = Dimensions.get('window').width - 20;
        this.setState({
          imgWidth: displayWidth,
          imgHeight: Math.floor(height / width * displayWidth)
        }, () => this.forceUpdate())
      })
      this.show()
    })
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
  }


  render() {
    return (
      <Animated.View
      style={[{
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        position: 'absolute',
        marginLeft: this.state.leftOffset.interpolate({
          inputRange: [0, 1],
          outputRange: [Dimensions.get('window').width, 0]
        })
      }]}>
        <View style={{ width: '100%', height: '100%', }}>

          <View style={styles.top_bar}>
            <TouchableOpacity
              style={styles.icon_back}
              onPress={() => this.hide()}>
              <Image source={require('../assets/icon/icon_back_black.png')} style={{width: 30, height: 30, opacity: 0.7}}></Image>
            </TouchableOpacity>
            <Text style={{fontSize: 18}}>详 情</Text>
          </View>


          <ScrollView style={{width: '100%', height: '100%', paddingLeft: 10, paddingRight: 10, marginBottom: 45}}>
            <Image source={{uri: this.detailData.imgUrl}} style={{width: this.state.imgWidth, height: this.state.imgHeight, marginTop: 10}}></Image>
            <Text style={styles.font_title}>{this.detailData.imgName}</Text>
            <Text style={styles.font_intro}>{this.detailData.introduction}</Text>
            <Text style={styles.font_time}>来自：{this.detailData.timeStamp}</Text>
          
            <Image source={{uri: this.detailData.contentSrcUrl}} style={{width: 60, height: 60}}></Image>

            <Text>配方</Text>
            <ScrollView horizontal={true} style={{width: '100%', height: 60}}>
              {
                this.detailData.styleSrcUrl ? this.detailData.styleSrcUrl.map((item, index) => {
                  return (
                    <Image source={{uri: item}} style={{width: 50, height: 50}}></Image>
                  )
                }) : null
              }
            </ScrollView>

            <Text>其他配置</Text>


          </ScrollView>

          <View style={styles.bottom_bar}>
            <View>
              <Text>like</Text>
            </View>
            <View>
              <Text>shou</Text>
            </View>
          </View>
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

const styles = StyleSheet.create({
  top_bar: {
    width: '100%',
    height: 55,
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#eee',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon_back: {
    position: 'absolute',
    left: 10, 
    top: 15
  },
  font_title: {
    fontSize: 18,
    color: '#333',
    fontWeight: '900',
    margin: 10,
    // borderBottomColor: 'rgb(104,205,254)',
    // borderBottomWidth: 0.5
  },
  font_intro: {
    fontSize: 14,
    color: '#666',
    fontWeight: '900',
    margin: 10,
    marginTop: 0
  },
  font_time: {
    fontSize: 10,
    color: 'rgb(78,148,206)',
    marginLeft: 10
  },
  bottom_bar: {
    width: '100%',
    height: 45,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    borderTopColor: '#eee',
    borderTopWidth: 1
  }
})
