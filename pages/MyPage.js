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
    console.log(this.state.myWorksList)
  }



  _renderWorkItem(item, index) {
    return (
      <View style={{width: '100%', height: 220, borderBottomColor: '#eee', borderBottomWidth: 1}} key={index}>
        <Image source={{uri: item.imgUrl}} style={{width: 200, height: 200, borderRadius: 10, position: 'absolute', right: 10, top: 10}}></Image>
        <View style={{position: 'absolute', left: 10}}>
          <Text>{item.timeStamp}</Text>
          {/* 装饰 */}
          <View style={{width: 30, height: 30, borderRadius: 15, backgroundColor: '#fff', borderWidth: 5 ,borderColor: 'rgb(120,181,212)'}}>
            <View style={{width: 10, height: 10, borderRadius: 15, backgroundColor: '#fff', borderWidth: 5 ,borderColor: 'rgb(120,181,212)'}}></View>
          </View>
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
          <Text style={{textAlign: 'center'}}>创作列表</Text>
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
