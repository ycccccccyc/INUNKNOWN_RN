import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    TouchableWithoutFeedback,
    Animated
} from 'react-native';
import services from '../services/community';
import MaterialPage from './MaterialPage';

import EventBus from 'react-native-event-bus';

const clientWidth = Dimensions.get('window').width;


class PageNaviHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      translate: new Animated.Value(0)
    };

    this._translateX = this.state.translate.interpolate({
      inputRange: [0, 1],
      outputRange: [-65, 10] // 两个位置下，线条距离左边框的长度
    });
  }

  animateToPage1() {
    Animated.timing(
      this.state.translate,
      {
        toValue: 0,
        duration: 200,
      }
    ).start();
  }

  animateToPage2() {
    Animated.timing(
      this.state.translate,
      {
        toValue: 1,
        duration: 200,
      }
    ).start();
  }

  render() {
    return (
      <Animated.View style={[
        styles.pageNaviHandler,
        {
          transform: [
            { translateX: 0 },
            { translateX: this._translateX },  
            { translateX: 0 }
          ]
        }
      ]} />
    );
  }
}



export default class Community extends Component {
  constructor(props) {
    super(props)
    this.state = {
      layoutWidth: (clientWidth -45) / 2,
      myBaseInfo: {},
      imageList: [],
      pageSelected: 0,
    }
    this.pageNaviRef = React.createRef();
    this.communityScrollRef = React.createRef();
  }

  async getBaseUserInfo() {
    const res = await services.getBaseUserInfo();
    if (+res.code === 0 && res.data) {
      const { data } = res;
      this.setState({
        myBaseInfo: data
      }, () => this.forceUpdate())
    }
  }

  async getCommunityImageList() {
    const res = await services.getCommunityImageList();
    if (+res.code === 0 && res.data) {
      const { data } = res;
      this.setState({
        imageList: data
      }, () => this.forceUpdate())
    }
  }


  _renderCommunityImage(item, index) {
    return (
      <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: clientWidth, marginTop: index === 0 ? 20 : 30}} key={index}>
        <View style={[styles.piece_container, {width: clientWidth - 40}]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this._showCommunityDetailPage(item)}>
            <Image
              source={{uri: item.imgUrl}}
              style={{width: '100%', height: 220, borderTopRightRadius: 10, borderTopLeftRadius: 10}} />
          </TouchableOpacity>
          
          <Text style={styles.font_imgName}>{item.imgName}</Text>
          <View style={styles.introduction_container}>
            <Text numberOfLines={2} style={{fontSize: 12, color: '#666'}}>{item.introduction}</Text>
          </View>

        </View>

      </View>
    )
  }


  _showMyDrawer() {
    // 点开头像
  }

  _showCommunityDetailPage(data) {
    EventBus.getInstance().fireEvent("showCommunityDetailPage", data)
  }



  componentDidMount() {
    this.getBaseUserInfo();
    this.getCommunityImageList();
  }

  render() {
    const {state} = this;
    return (
      
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={styles.top_bar}>
          <TouchableOpacity style={styles.avatar_Container} activeOpacity={0.6} onPress={() => this._showMyDrawer()}>
            <Image
              source={ state.myBaseInfo.avatarUrl ? { uri: state.myBaseInfo.avatarUrl } : require('../assets/images/avatar_default.jpg') }
              style={{width: 42, height: 42, borderRadius: 20}} />
            <Image
              source={require('../assets/images/avatarDeco/sakura.png')} style={styles.avatar_deco} />
          </TouchableOpacity>

          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({pageSelected: 0});
              this.pageNaviRef.current.animateToPage1();
            }}>
            <Text style={{fontSize: 18, color: this.state.pageSelected > 0 ? '#999' : '#1296db', marginRight: 30, marginLeft: 10}}>动态</Text>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({pageSelected: 1});
              this.pageNaviRef.current.animateToPage2();
            }}>
            <Text style={{fontSize: 18, color:  this.state.pageSelected > 0 ? '#1296db' : '#999'}}>素材库</Text>
          </TouchableWithoutFeedback>

          {/* handler */}
          <PageNaviHandler ref={this.pageNaviRef}></PageNaviHandler>

        </View>

        {/* 展示区 */}
        <ScrollView
          horizontal={true}
          alwaysBounceHorizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          // onMomentumScrollEnd={this._modePageScrollEnd.bind(this, that)}
          style={{width: '100%', display: 'flex', bottom: 0}}
          ref={this.communityScrollRef}>

          {/* 动态 */}
          <ScrollView
            style={[styles.community_main_container, {width: Dimensions.get('window').width}]}
            showsVerticleScrollIndicator={false}>
            {
              this.state.imageList.map((item, index) => this._renderCommunityImage(item, index))
            }
            <Text style={{ marginTop: 80, marginBottom: 40, opacity: 0.5, fontSize: 12, marginLeft: 150 }}>再也没有啦！</Text>
          </ScrollView>
          
          {/* 素材库 */}
          <View style={[{width: Dimensions.get('window').width, height: '100%'}, styles.custom_flexCenter]}>
            <MaterialPage></MaterialPage>
          </View>

          


        </ScrollView>


      </View>
    );
  }

}

const styles = StyleSheet.create({
  top_bar: {
    width: '100%',
    position: 'absolute',
    zIndex: 2,
    top: 0,
    left: 0,
    height: 53,
    backgroundColor: '#fff',
    marginBottom: 50,
    elevation: 10,
    shadowColor: '#eee',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar_Container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    top: 6,
    left: 10,
    position: 'absolute',
  },
  avatar_deco: {
    width: 55,
    height: 55,
    position: 'absolute',
    left: -8,
    top: -6,
  },
  community_main_container: {
    flexWrap:'wrap',
    flexDirection:'row',
    marginTop: 50,
    flex: 1,
    width: '100%',
    paddingBottom: 40,
  },
  piece_container: {
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 10,
    shadowColor: '#eee',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 10,
  },
  font_imgName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '900',
    margin: 5,
    marginLeft: 15,
  },
  introduction_container: {
    fontSize: 10,
    marginLeft: 15,
    marginRight: 15
  },
  pageNaviHandler: {
    width: 60,
    height: 3,
    backgroundColor: '#1296db',
    position: 'absolute',
    left: '50%',
    bottom: 2,
  }
})
