import React, {Component} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

class Avatar extends Component {
  constructor(props) {
    super(props);

    this.defaultUrl =
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F02%2F22%2F84%2F59b0310b6a7f4_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1617890737&t=e2471a8553fb87c411f10f204ceb768f';
    this.defaultDeco = require('../../assets/images/avatarDeco/sakura.png');
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.avatar}
          source={{
            uri: this.props.avatarUrl ? this.props.avatarUrl : this.defaultUrl,
          }}
        />
        <Image style={styles.avatarDeco} source={this.defaultDeco} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 130,
    height: 130,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    zIndex: 1,
  },
  avatarDeco: {
    width: 130,
    height: 130,
    zIndex: 10,
    position: 'absolute',
    top: -4,
  },
});

export default Avatar;
