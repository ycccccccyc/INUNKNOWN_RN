import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
} from 'react-native';

export default function MyPage({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>我的</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}
