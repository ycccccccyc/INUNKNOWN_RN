/* eslint-disable no-alert */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';

class Input extends Component {
  constructor(props) {
    super(props);
    this.state.num = props.num;
  }

  state = {
    email: '',
    password: '',
    intro: '123',
  };

  handleEmail = (text) => {
    this.setState({email: text});
  };

  handlePassword = (text) => {
    this.setState({password: text});
  };

  handleIntro = (text) => {
    this.setState({intro: text});
  };

  register = (email, password, intro) => {
    alert('email:' + email + '\npassword:' + password + '\nintro:' + intro);
  };

  render() {
    const {num} = this.state;
    return (
      <View>
        <Text>输入组件示例</Text>
        <Text>获取到{+num}个输入选项</Text>
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="请输入邮箱"
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          onChangeText={this.handleEmail}
        />
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="请输入密码"
          placeholderTextColor="#000"
          autoCapitalize="none"
          returnKeyType="next"
          secureTextEntry={true}
          onChangeText={this.handlePassword}
        />
        <TextInput
          style={[styles.input, {height: 100}]}
          underlineColorAndroid="transparent"
          placeholder="请输入描述"
          autoCapitalize="none"
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          returnKeyType="done"
          secureTextEntry={true}
          onChangeText={this.handleIntro}
        />
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={
            () => this.register(
            this.state.email,
            this.state.password,
            this.state.intro
          )}
        >
          <Text>submit</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  input: {
    borderRadius: 15,
    borderColor: 'red',
  },
  submitBtn: {
    backgroundColor: '#ccc',
  },
};

export default Input;
