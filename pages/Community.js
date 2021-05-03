import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    TouchableOpacity,
    Image
} from 'react-native';
import services from '../services/common';

export default class Community extends Component  {
  constructor(props) {
    super(props)
    this.state = {
      avatarUrl: null
    }
  }

  async getBaseUserInfo() {
    const res = await services.getBaseUserInfo();
    if (+res.code === 0 && res.data) {
      const { data } = res;
      this.setState({
        avatarUrl: data.avatarUrl
      })
    }
  }

  componentWillMount() {
    this.getBaseUserInfo();
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={styles.top_bar}>
          <View style={styles.avatar_Container}>
            <Image />
          </View>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  top_bar: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    height: 50,
    backgroundColor: '#fff',
    marginBottom: 50,
    elevation: 10,
    shadowColor: '#eee',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 10,
  },
  avatar_Container: {
    width: 40,
    height: 40,
    borderRadius: 20,
  }
})
