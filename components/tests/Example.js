import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchaTouchableOpacity
} from 'react-native';

class SiteNameComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: props.name};
  }

  updateState = () => {
    const name = this.state.name === '红' ? '绿' : '红';
    this.setState({name: name});
  };

  render() {
    const {name} = this.state;
    return (
      <View>
        <Text>组件引入示例</Text>
        <Text onPress={this.updateState}>{name}</Text>
      </View>
    );
  }
}

export default SiteNameComponent;
