import React, {Component} from 'react';
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
  Button,
  Modal
} from 'react-native';
// import ModalView from '../base/Modal';

export default class ChooseContentInModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false
    }
  }

  show() {
    this.setState({
      modalVisible: visible
    });
    this.forceUpdate();
  }

  render() {
    const { state } = this;
    if (state.modalVisible) return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffaaff'}}>
        <Modal animationType={'none'}
          transparent={true}
          visible={this.state.modalVisible}
          onrequestclose={() => {alert("Modal has been closed.")}}
          onShow={() => {alert("Modal has been open.")}}
          supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
          onOrientationChange={() => {alert("Modal has been OrientationChange.")}}>
          <View style={{flex:1, marginTop: 22, backgroundColor: '#aaaaaa', justifyContent: 'center', alignItems: 'center'}}>
              <View>
                  <Text>Hello World!</Text>
                  <TouchableOpacity onPress={() => {
                      this.setModalVisible(false)
                  }}>
                      <Text>隐藏 Modal</Text>
                  </TouchableOpacity>
              </View>
          </View>
        </Modal>
      </View>
    )
    return null;
  }
}

const styles = {
  background_mask: {
    position: 'absolute',
    zIndex: 1000,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  }
}
