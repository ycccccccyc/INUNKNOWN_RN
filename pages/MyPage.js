import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native';
import serviceCommon from '../services/community';
import service from '../services/mypage';

export default class MyPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      myBaseInfo: {},
      myWorksList: []
    }
  }

  async getBaseUserInfo() {
    const res = await serviceCommon.getBaseUserInfo();
    if (+res.code === 0 && res.data) {
      const { data } = res;
      this.setState({
        myBaseInfo: data
      }, () => this.forceUpdate())
    }
  }

  async getMyWorksList() {
    const res = await service.getMyWorksList();
    if (+res.code === 0 && res.data) {
      const { data } = res;
      this.setState({
        myWorksList: data
      }, () => this.forceUpdate())
    }
  }



  _renderWorkItem(item, index) {
    return (
      <View style={{width: '100%', height: 220, borderBottomColor: '#eee', borderBottomWidth: index === this.state.myWorksList.length - 1 ? 0 : 1, marginBottom: index === this.state.myWorksList.length - 1 ? 40 : 0}} key={index}>
        {/* 装饰 */}
        <View style={{position: 'absolute', top: 40}}>
          <View style={{width: 24, height: 24, borderRadius: 15, backgroundColor: '#fff', borderWidth: 3, borderColor: 'rgb(120,181,212)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, top: 20}}>
            <View style={{width: 16, height: 16, borderRadius: 15, backgroundColor: '#fff', borderWidth: 3, borderColor: 'rgb(120,181,212)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{width: 8, height: 8, borderRadius: 15, backgroundColor: '#fff', borderWidth: 3, borderColor: 'rgb(120,181,212)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}></View>
            </View>
          </View>
          <View style={{zIndex: -1, width: 200, height: 2, backgroundColor: 'rgb(120,181,212)', position: 'absolute', top: 30}}></View>
        </View>

        <Image source={{uri: item.imgUrl}} style={{width: 200, height: 200, borderRadius: 10, position: 'absolute', right: 10, top: 10}}></Image>
        {/* 原图 */}
        <Image source={{uri: item.contentSrcUrl}} style={{width: 80, height: 80, position: 'absolute', borderWidth: 5, borderColor: '#fff', right: 0, bottom: 0}}></Image>


        {/* 发布时间 */}
        <View style={{position: 'absolute', left: 25, top: 53, backgroundColor: 'rgb(151,208,237)', paddingLeft: 10, paddingRight: 10, borderRadius: 8}}>
          <Text style={{color: '#fff', fontSize: 11}}>{item.timeStamp}</Text>
        </View>

        {/* 名字 */}
        <View style={{width: 120, height: 30, left: 10, top: 12}}>
          <Text numberOfLines={1} style={{fontSize: 14, fontWeight: '900'}}>{item.imgName}</Text>
        </View>

        <View style={{width: 126, left: 0, top: 55}}>
          <Text numberOfLines={5} style={{fontSize: 10, color: '#999'}}>{item.introduction}</Text>
        </View>

        {/* 风格图 */}
        <View style={{width: 126, height: 60, backgroundColor:'#fff', position: 'absolute', bottom: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 5}}>
          {
            item.styleSrcUrl.map((style, indexx) => {
              return (
                <View style={{}} key={indexx}>
                  <Image source={{uri: style}} style={{width: 36, height: 35}}></Image>
                  <Text style={{width: 35, position: 'absolute', textAlign: 'center', top: 35, fontSize: 10, left: 0}}>{this.state.myWorksList[index].styleRatio[indexx]}</Text>
                </View>
              )
            })
          }
        </View>
        
      </View>
    )
  }

  componentDidMount() {
    this.getBaseUserInfo();
    this.getMyWorksList();
  }

  render() {
    const {state} = this;
    return (
      <View style={{ height: '100%' }}>

        <View style={styles.card_container}>
          <Image source={require('../assets/images/water_01.jpg')} style={{width: '100%', height: '100%', opacity: 1, position: 'absolute'}}></Image>
          <View style={{width: '100%', height: '100%', position: 'absolute', backgroundColor:'rgba(255, 255, 255, 0.4)'}}></View>
          {/* 头像 */}
          <View style={styles.avatar_Container}>
            <Image
              source={ state.myBaseInfo.avatarUrl ? { uri: state.myBaseInfo.avatarUrl } : require('../assets/images/avatar_default.jpg') }
              style={{width: 80, height: 80, borderRadius: 40}} />
            <Image
              source={require('../assets/images/avatarDeco/sakura.png')} style={styles.avatar_deco} />
          </View>
          {/* 名字 */}
          <View style={styles.nickname_container}>
            <Text style={styles.nickname}>{state.myBaseInfo.name}</Text>
          </View>
          {/* 生日 */}
          <View style={styles.birthday}>
            <Text style={{fontSize: 12}}>诞生日：{state.myBaseInfo.birthday}</Text>
          </View>
          {/* 更换背景 */}

          {/* 相关数据 */}
          <View style={styles.data_container}>
            <View style={styles.data_item_container}>
              <Text style={[styles.data_text, {fontSize: 14}]}>1112</Text>
              <Text style={[styles.data_text, {fontSize: 10}]}>创作</Text>
            </View>
            <View style={styles.data_item_container}>
              <Text style={[styles.data_text, {fontSize: 14}]}>322</Text>
              <Text style={[styles.data_text, {fontSize: 10}]}>收到的赞</Text>
            </View>
            <View style={styles.data_item_container}>
              <Text style={[styles.data_text, {fontSize: 14}]}>1354</Text>
              <Text style={[styles.data_text, {fontSize: 10}]}>被收藏</Text>
            </View>
          </View>
          
        </View>


        <View style={[styles.myWorksList, {height: Dimensions.get('window').height - 40 - 200}]}>
          {/* <Text style={{textAlign: 'center'}}>创作列表</Text> */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {
              this.state.myWorksList.map((item, index) => this._renderWorkItem(item, index))
            }
            <Text style={{textAlign: 'center', fontSize: 10, marginBottom: 20, opacity: 0.5}}>再没有更多了~</Text>
          </ScrollView>
        </View>



      </View>
    );
  }

}

const styles = StyleSheet.create({
  card_container: {
    width: '100%',
    height: 200,
    backgroundColor: '#ccc',
  },
  avatar_Container: {
    width: 80,
    height: 80,
    borderRadius: 50,
    position: 'absolute',
    top: 30,
    left: 30,
    borderColor: 'rgb(137,203,227)',
    borderWidth: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar_deco: {
    width: 120,
    height: 120,
    position: 'absolute',
    left: -28,
    top: -28,
  },
  nickname: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: ''
  },
  nickname_container: {
    position: 'absolute',
    top: 40,
    left: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10
  },
  birthday: {
    position: 'absolute',
    top: 70,
    left: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10
  },
  data_container: {
    width: 200,
    height: 60,
    borderRadius: 10,
    position: 'absolute',
    top: 118,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  data_item_container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  myWorksList: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#fff',
    zIndex: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },
  data_text: {
    textAlign: 'center'
  }
})
