import React, { Component} from 'react';
import  {
  AppRegistry,
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';

export default class ModalView extends Component {
  constructor(props) {
    super(props),
    this.state = {
      open: false
    }
    this.margin = this.props.margin;
  }

  _switch() {
    this.setState({
      open: !this.state.open
    }, this.forceUpdate())
  }


  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this._switch()}>
        <View style={[styles.switch_bg, {backgroundColor: this.state.open ? 'rgb(124,220,254)' : '#ccc', left: this.margin}]}>
          <View style={this.state.open ? styles.switch_btn_open : styles.switch_btn_closed}></View>
        </View>
      </TouchableWithoutFeedback>

    )
  }
}

const styles = StyleSheet.create({
  switch_bg: {
    width: 45,
    height: 18,
    backgroundColor: 'rgb(124,220,254)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  switch_btn_open: {
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    position: 'absolute',
    right: -3,
    top: -3,
    borderWidth: 2,
    borderColor: 'rgb(104,200,234)',
  },
  switch_btn_closed: {
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    position: 'absolute',
    left: -3,
    top: -3,
    borderWidth: 2,
    borderColor: '#999',
  },
  switch_text: {
    color: '#fff',
    fontSize: 12,
    left: 22
  }
})
